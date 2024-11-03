import { handleImageError } from '../utils/helpers.js';

export class JobCard {
    constructor(job, onClick) {
        this.job = job;
        this.onClick = onClick;
    }

    createCard() {
        const template = document.getElementById('jobCardTemplate');
        const card = template.content.cloneNode(true);

        this.setCompanyInfo(card);
        this.setBadges(card);
        this.setJobDetails(card);
        this.setupEventListeners(card);

        return card;
    }

    setCompanyInfo(card) {
        const logoImg = card.querySelector('.company-logo img');
        logoImg.src = this.job.company.logo;
        logoImg.alt = this.job.company.name;
        logoImg.onerror = () => handleImageError(logoImg, this.job.company.name);
        
        card.querySelector('.company-name-text').textContent = this.job.company.name;
        
        if (!this.job.company.verified) {
            card.querySelector('.verified-icon').style.display = 'none';
        }

        card.querySelector('.rating').textContent = this.job.company.rating;
        card.querySelector('.location').textContent = this.job.company.location;
    }

    setBadges(card) {
        const badgesContainer = card.querySelector('.badges-container');
        if (!this.job.featured) {
            badgesContainer.querySelector('.badge-primary').style.display = 'none';
        }
        if (!this.job.urgent) {
            badgesContainer.querySelector('.badge-urgent').style.display = 'none';
        }
    }

    setJobDetails(card) {
        card.querySelector('.job-title').textContent = this.job.title;
        card.querySelector('.salary').textContent = this.job.salary;
        card.querySelector('.contract-type').textContent = this.job.contractType;
        card.querySelector('.schedule').textContent = this.job.schedule;
        card.querySelector('.duration').textContent = this.job.duration;
    }

    setupEventListeners(card) {
        const jobCard = card.querySelector('.job-card');
        jobCard.setAttribute('data-job-id', this.job.id);
        jobCard.addEventListener('click', () => this.onClick(this.job));
    }
}