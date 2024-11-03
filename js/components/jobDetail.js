import { handleImageError } from '../utils/helpers.js';

export class JobDetail {
    constructor(job) {
        this.job = job;
    }

    createDetail() {
        const template = document.getElementById('jobDetailTemplate');
        const detail = template.content.cloneNode(true);

        this.setCompanyInfo(detail);
        this.setBadges(detail);
        this.setJobInfo(detail);
        this.setDetailSections(detail);
        this.setupEventListeners(detail);

        return detail;
    }

    setCompanyInfo(detail) {
        const logoImg = detail.querySelector('.company-logo img');
        logoImg.src = this.job.company.logo;
        logoImg.alt = this.job.company.name;
        logoImg.onerror = () => handleImageError(logoImg, this.job.company.name);
        
        detail.querySelector('.company-name-text').textContent = this.job.company.name;
        
        if (!this.job.company.verified) {
            detail.querySelector('.verified-icon').style.display = 'none';
        }

        detail.querySelector('.rating').textContent = this.job.company.rating;
        detail.querySelector('.employees').textContent = this.job.company.employees;
        detail.querySelector('.location').textContent = this.job.company.location;
    }

    setBadges(detail) {
        const badgesContainer = detail.querySelector('.badges-container');
        if (!this.job.featured) {
            badgesContainer.querySelector('.badge-primary').style.display = 'none';
        }
        if (!this.job.urgent) {
            badgesContainer.querySelector('.badge-urgent').style.display = 'none';
        }
    }

    setJobInfo(detail) {
        detail.querySelector('.job-title').textContent = this.job.title;
        detail.querySelector('.salary').textContent = this.job.salary;
        detail.querySelector('.contract-type').textContent = this.job.contractType;
        detail.querySelector('.schedule').textContent = this.job.schedule;
        detail.querySelector('.duration').textContent = this.job.duration;
    }

    setDetailSections(detail) {
        // Descripción
        detail.querySelector('.job-description').textContent = this.job.description;

        // Requisitos
        const requirementsList = detail.querySelector('.requirements-list');
        this.job.requirements.forEach(req => {
            const li = document.createElement('li');
            li.className = 'requirement-item';
            li.innerHTML = `<i class="fas fa-check"></i><span>${req}</span>`;
            requirementsList.appendChild(li);
        });

        // Beneficios
        const benefitsList = detail.querySelector('.benefits-list');
        this.job.benefits.forEach(benefit => {
            const li = document.createElement('li');
            li.className = 'benefit-item';
            li.innerHTML = `<i class="fas fa-check"></i><span>${benefit}</span>`;
            benefitsList.appendChild(li);
        });
    }

    setupEventListeners(detail) {
        const applyButton = detail.querySelector('.btn-primary');
        const saveButton = detail.querySelector('.btn-outline');

        applyButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleApply();
        });

        saveButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleSave();
        });
    }

    handleApply() {
        console.log('Postulando al trabajo:', this.job.title);
        // Implementar lógica de postulación
    }

    handleSave() {
        console.log('Guardando trabajo:', this.job.title);
        // Implementar lógica de guardado
    }
}