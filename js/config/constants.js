export const CONFIG = {
    itemsPerPage: 10,
    breakpoints: {
        mobile: 1024
    }
};

export const SELECTORS = {
    jobsList: '#jobsList',
    jobDetailContainer: '#jobDetailContainer',
    modal: '#jobModal',
    modalClose: '#modalClose',
    modalContent: '#modalContent',
    searchForm: '#searchForm',
    searchInput: '#searchInput',
    locationSelect: '#locationSelect',
    activeFilters: '#activeFilters'
};

export const CLASSES = {
    active: 'active',
    selected: 'selected',
    filterPill: 'filter-pill',
    filterButton: 'filter-button',
    dropdownItem: 'dropdown-item',
    badge: 'badge',
    jobCard: 'job-card'
};

export const FILTER_MAPS = {
    distance: {
        'Menos de 5 km': 5,
        '5 - 10 km': 10,
        '10 - 20 km': 20,
        'Más de 20 km': Infinity
    },
    salary: {
        'Hasta S/1,500': [0, 1500],
        'S/1,500 - S/3,000': [1500, 3000],
        'S/3,000 - S/5,000': [3000, 5000],
        'Más de S/5,000': [5000, Infinity]
    }
};