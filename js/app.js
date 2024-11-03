import { CONFIG, SELECTORS } from './config/constants.js';
import { jobsData } from './data/jobs.js';
import { JobCard } from './components/jobCard.js';
import { JobDetail } from './components/jobDetail.js';
import { Filters } from './components/filters.js';
import { $, showModal, closeModal } from './utils/dom.js';
import { debounce, isMobile } from './utils/helpers.js';

export class JobsApp {
    constructor() {
        this.jobs = [...jobsData];
        this.filteredJobs = [...this.jobs];
        this.currentActiveCard = null;
        this.filters = null;
        this.currentPage = 1;

        // Elementos DOM
        this.jobsList = $(SELECTORS.jobsList);
        this.jobDetailContainer = $(SELECTORS.jobDetailContainer);
        this.searchForm = $(SELECTORS.searchForm);
        this.searchInput = $(SELECTORS.searchInput);
        this.locationSelect = $(SELECTORS.locationSelect);
        this.modal = $(SELECTORS.modal);
        this.modalClose = $(SELECTORS.modalClose);
    }

    init() {
        this.setupEventListeners();
        this.setupFilters();
        this.loadInitialJobs();
    }

    setupEventListeners() {
        // Búsqueda
        this.searchForm.addEventListener('submit', (e) => this.handleSearch(e));
        this.searchInput.addEventListener('input', debounce(() => this.handleSearch(), 300));
        this.locationSelect.addEventListener('change', () => this.handleSearch());

        // Modal
        this.modalClose.addEventListener('click', () => closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) closeModal();
        });

        // Eventos globales
        window.addEventListener('resize', () => this.handleResize());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
                this.filters?.closeAllDropdowns();
            }
        });
    }

    setupFilters() {
        this.filters = new Filters((filters) => {
            this.handleFilterChange(filters);
        });
    }

    loadInitialJobs() {
        this.updateJobsList();
        
        // Mostrar el primer trabajo por defecto en desktop
        if (!isMobile() && this.filteredJobs.length > 0) {
            this.showJobDetail(this.filteredJobs[0]);
        }
    }

    handleSearch(e) {
        if (e) e.preventDefault();
        
        const query = this.searchInput.value.toLowerCase().trim();
        const location = this.locationSelect.value.toLowerCase();

        this.filteredJobs = this.jobs.filter(job => {
            const matchQuery = !query || 
                job.title.toLowerCase().includes(query) ||
                job.company.name.toLowerCase().includes(query);
            
            const matchLocation = !location || 
                job.company.location.toLowerCase().includes(location);
            
            return matchQuery && matchLocation && this.filters.matchesFilters(job);
        });

        this.currentPage = 1;
        this.updateJobsList();
    }

    handleFilterChange(filters) {
        this.handleSearch();
    }

    handleJobClick(job, card) {
        if (this.currentActiveCard) {
            this.currentActiveCard.classList.remove('active');
        }
        this.currentActiveCard = card;
        card.classList.add('active');

        this.showJobDetail(job);
    }

    showJobDetail(job) {
        const jobDetail = new JobDetail(job).createDetail();

        if (isMobile()) {
            showModal(jobDetail);
        } else {
            this.jobDetailContainer.innerHTML = '';
            this.jobDetailContainer.appendChild(jobDetail);
        }
    }

    handleResize() {
        if (!isMobile()) {
            closeModal();
            if (this.currentActiveCard && this.filteredJobs.length > 0) {
                const jobId = this.currentActiveCard.getAttribute('data-job-id');
                const job = this.filteredJobs.find(j => j.id.toString() === jobId);
                if (job) {
                    this.showJobDetail(job);
                }
            }
        }
    }

    updateJobsList() {
        this.jobsList.innerHTML = '';
        
        if (this.filteredJobs.length === 0) {
            this.showNoResults();
            return;
        }

        const startIndex = (this.currentPage - 1) * CONFIG.itemsPerPage;
        const endIndex = startIndex + CONFIG.itemsPerPage;
        const paginatedJobs = this.filteredJobs.slice(startIndex, endIndex);

        paginatedJobs.forEach(job => {
            const jobCard = new JobCard(job, (selectedJob, card) => {
                this.handleJobClick(selectedJob, card);
            }).createCard();
            this.jobsList.appendChild(jobCard);
        });

        this.updatePagination();
    }

    showNoResults() {
        this.jobsList.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No se encontraron resultados</h3>
                <p>Intenta ajustar los filtros o usar otros términos de búsqueda</p>
            </div>
        `;
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredJobs.length / CONFIG.itemsPerPage);
        if (totalPages <= 1) return;

        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'pagination';

        // Botón anterior
        if (this.currentPage > 1) {
            this.addPaginationButton('Anterior', this.currentPage - 1, paginationContainer);
        }

        // Números de página
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= this.currentPage - 2 && i <= this.currentPage + 2)
            ) {
                this.addPaginationButton(i.toString(), i, paginationContainer, i === this.currentPage);
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                const dots = document.createElement('span');
                dots.className = 'pagination-dots';
                dots.textContent = '...';
                paginationContainer.appendChild(dots);
            }
        }

        // Botón siguiente
        if (this.currentPage < totalPages) {
            this.addPaginationButton('Siguiente', this.currentPage + 1, paginationContainer);
        }

        const existingPagination = this.jobsList.querySelector('.pagination');
        if (existingPagination) {
            existingPagination.replaceWith(paginationContainer);
        } else {
            this.jobsList.appendChild(paginationContainer);
        }
    }

    addPaginationButton(text, page, container, isActive = false) {
        const button = document.createElement('button');
        button.className = `pagination-button${isActive ? ' active' : ''}`;
        button.textContent = text;
        button.addEventListener('click', () => {
            this.currentPage = page;
            this.updateJobsList();
            this.jobsList.scrollTop = 0;
        });
        container.appendChild(button);
    }
}