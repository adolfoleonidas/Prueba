import { FILTER_MAPS } from '../config/constants.js';
import { $, $$, addClass, removeClass, toggleClass } from '../utils/dom.js';

export class Filters {
    constructor(onFilterChange) {
        this.selectedFilters = {};
        this.onFilterChange = onFilterChange;
        this.setupFilters();
    }

    setupFilters() {
        this.setupFilterListeners();
        this.setupOutsideClickListener();
        this.setupKeyboardNavigation();
    }

    setupFilterListeners() {
        $$('.filter-button').forEach(button => {
            button.addEventListener('click', (e) => this.handleFilterClick(e));
        });

        $$('.dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => this.handleFilterSelection(e));
        });
    }

    setupOutsideClickListener() {
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.filter-pill')) {
                this.closeAllDropdowns();
            }
        });
    }

    setupKeyboardNavigation() {
        $$('.filter-pill').forEach(pill => {
            const button = pill.querySelector('.filter-button');
            const items = pill.querySelectorAll('.dropdown-item');
            
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleDropdown(pill);
                }
            });
            
            items.forEach(item => {
                item.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.handleFilterSelection({ target: item });
                    }
                });
            });
        });
    }

    handleFilterClick(e) {
        e.stopPropagation();
        const pill = e.target.closest('.filter-pill');
        
        $$('.filter-pill.active').forEach(activePill => {
            if (activePill !== pill) {
                removeClass(activePill, 'active');
            }
        });
        
        this.toggleDropdown(pill);
    }

    handleFilterSelection(e) {
        const item = e.target;
        const pill = item.closest('.filter-pill');
        const filterType = pill.querySelector('.filter-button').textContent.trim();
        const filterValue = item.textContent.trim();

        this.updateFilter(filterType, filterValue);
        this.updateFilterUI(pill, item);
        this.onFilterChange(this.selectedFilters);
    }

    updateFilter(type, value) {
        if (this.selectedFilters[type] === value) {
            delete this.selectedFilters[type];
        } else {
            this.selectedFilters[type] = value;
        }
    }

    updateFilterUI(pill, selectedItem) {
        const button = pill.querySelector('.filter-button');
        const originalText = button.getAttribute('data-original-text') || button.childNodes[0].textContent;
        
        if (!button.getAttribute('data-original-text')) {
            button.setAttribute('data-original-text', originalText);
        }

        button.childNodes[0].textContent = this.selectedFilters[originalText] || originalText;
        
        pill.querySelectorAll('.dropdown-item').forEach(item => {
            removeClass(item, 'selected');
        });

        if (this.selectedFilters[originalText]) {
            addClass(selectedItem, 'selected');
        }
        
        removeClass(pill, 'active');
    }

    toggleDropdown(pill) {
        const wasActive = pill.classList.contains('active');
        this.closeAllDropdowns();
        
        if (!wasActive) {
            addClass(pill, 'active');
            const button = pill.querySelector('.filter-button');
            button.setAttribute('aria-expanded', 'true');
        }
    }

    closeAllDropdowns() {
        $$('.filter-pill.active').forEach(pill => {
            removeClass(pill, 'active');
            pill.querySelector('.filter-button').setAttribute('aria-expanded', 'false');
        });
    }

    matchesFilters(job) {
        return Object.entries(this.selectedFilters).every(([type, value]) => {
            if (!value) return true;
            
            switch (type.toLowerCase()) {
                case 'ordenar':
                    return true; // Manejado por sortJobs()
                case 'distancia':
                    return this.matchesDistance(job, value);
                case 'fecha':
                    return this.matchesDate(job, value);
                case 'categoría':
                    return job.company.category === value;
                case 'lugar de trabajo':
                    return job.workLocation === value;
                case 'experiencia':
                    return job.experience === value;
                case 'salario':
                    return this.matchesSalary(job, value);
                case 'jornada':
                    return job.schedule.includes(value);
                case 'contrato':
                    return job.contractType.includes(value);
                default:
                    return true;
            }
        });
    }

    matchesDistance(job, filterValue) {
        const maxDistance = FILTER_MAPS.distance[filterValue];
        return job.distance <= maxDistance;
    }

    matchesDate(job, filterValue) {
        const now = new Date();
        const jobDate = new Date(job.date);
        const diffDays = Math.floor((now - jobDate) / (1000 * 60 * 60 * 24));
        
        switch (filterValue) {
            case 'Hoy':
                return diffDays === 0;
            case 'Últimos 3 días':
                return diffDays <= 3;
            case 'Última semana':
                return diffDays <= 7;
            case 'Último mes':
                return diffDays <= 30;
            default:
                return true;
        }
    }

    matchesSalary(job, filterValue) {
        const [min, max] = FILTER_MAPS.salary[filterValue];
        return job.salaryNum >= min && job.salaryNum <= max;
    }
}