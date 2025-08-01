// Menu translations
const menuTranslations = {
    'english': {
        'resume': 'Resumé',
        'drawings': 'Drawings'
    },
    'spanish': {
        'resume': 'Currículum',
        'drawings': 'Dibujos'
    },
    'danish': {
        'resume': 'CV',
        'drawings': 'Tegninger'
    },
    'norwegian': {
        'resume': 'CV',
        'drawings': 'Tegninger'
    }
};

let currentLanguage = sessionStorage.getItem('selectedLanguage') || 'english';
let profileData = null;
let showModalTextInfo = false;

// Load profile data from Sanity
async function loadProfileData() {
    try {
        const query = `*[_type == "portfolio"]{
            language,
            "data": {
                "name": name,
                "description": description,
                "experience": {
                    "sectionTitle": experience.sectionTitle,
                    "data": experience.data[]->{
                        company,
                        position,
                        description,
                        url,
                        startYear,
                        endYear,
                        current,
                        location,
                        type
                    }
                },
                "education": {
                    "sectionTitle": education.sectionTitle,
                    "data": education.data[]->{
                        school,
                        degree,
                        startYear,
                        endYear,
                        location,
                        type,
                        description
                    }
                },
                "projects": {
                    "sectionTitle": projects.sectionTitle,
                    "data": projects.data[]->{
                        name,
                        description,
                        url,
                        startYear,
                        endYear,
                        location,
                        technologies,
                        status
                    }
                },
                "skills": skills,
                "languages": languages,
                "email": email,
                "location": location,
                "birthDate": birthDate
            }
        }`;
        
        const encodedQuery = encodeURIComponent(query);
        const url = `https://ghrdvna9.apicdn.sanity.io/v2023-05-03/data/query/production?query=${encodedQuery}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        profileData = data.result;
        updateContent(currentLanguage);
    } catch (error) {
        console.error('Error loading profile data:', error);
    }
}

// Update content based on language
function updateContent(language) {
    if (!profileData) return;
    
    const data = profileData.find(item => item.language === language)?.data;
    if (!data) return;
    
    // Update name
    const nameElement = document.getElementById('name');
    if (nameElement) {
        nameElement.textContent = data.name.text;
    }
    
    // Update menu translations
    updateMenuTranslations(language);
    
    // Show menu items now that language is resolved
    showMenuItems();
}

// Show menu items after language resolution
function showMenuItems() {
    const navLinks = document.querySelector('.nav-links');
    
    if (navLinks) {
        navLinks.classList.remove('nav-hidden');
    }
    
    // Language switchers are always visible, no need to show/hide them
}

// Update menu translations
function updateMenuTranslations(language) {
    const translations = menuTranslations[language];
    if (!translations) return;
    
    // Update menu links
    const resumeLink = document.querySelector('a[href="index.html"]');
    const drawingsLink = document.querySelector('a[href="drawings.html"]');
    
    if (resumeLink) {
        resumeLink.textContent = translations.resume;
    }
    
    if (drawingsLink) {
        drawingsLink.textContent = translations.drawings;
    }
}

// Function to switch language
function switchLanguage(language) {
    currentLanguage = language;
    sessionStorage.setItem('selectedLanguage', language);
    updateContent(language);
    
    // Remove active class from all language icons
    const allLanguageIcons = document.querySelectorAll('.language-icon');
    allLanguageIcons.forEach(icon => icon.classList.remove('active'));
    
    // Add active class to the clicked language icon
    const activeIcon = document.querySelector(`img[src="icons/${language}.png"]`);
    if (activeIcon) {
        activeIcon.classList.add('active');
    }
}

// Setup language switcher event listeners
function setupLanguageSwitchers() {
    const englishIcon = document.querySelector('img[src="icons/english.png"]');
    const spanishIcon = document.querySelector('img[src="icons/spanish.png"]');
    const danishIcon = document.querySelector('img[src="icons/danish.png"]');
    const norwegianIcon = document.querySelector('img[src="icons/norwegian.png"]');
    
    // Set correct active icon based on current language
    const allLanguageIcons = document.querySelectorAll('.language-icon');
    allLanguageIcons.forEach(icon => icon.classList.remove('active'));
    
    const activeIcon = document.querySelector(`img[src="icons/${currentLanguage}.png"]`);
    if (activeIcon) {
        activeIcon.classList.add('active');
    }
    
    if (englishIcon) {
        englishIcon.addEventListener('click', () => switchLanguage('english'));
    }
    
    if (spanishIcon) {
        spanishIcon.addEventListener('click', () => switchLanguage('spanish'));
    }

    if (danishIcon) {
        danishIcon.addEventListener('click', () => switchLanguage('danish'));
    }

    if (norwegianIcon) {
        norwegianIcon.addEventListener('click', () => switchLanguage('norwegian'));
    }
}

async function getData() {
    const query = `*[_type == "drawing"]{
        _id,
        title,
        description,
        format,
        available,
        "imageUrl": image.asset->url
    }`;
    
    const encodedQuery = encodeURIComponent(query);
    const url = `https://ghrdvna9.apicdn.sanity.io/v2023-05-03/data/query/production?query=${encodedQuery}`;
    
    try {
        const result = await fetch(url);
        if (!result.ok) {
            throw new Error(`HTTP error! status: ${result.status}`);
        }
        const data = await result.json();
        return data.result.filter(drawing => drawing.imageUrl);
    } catch (error) {
        console.error('Error fetching drawings from Sanity:', error);
        return [];
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

let imageObserver;
let containers;

async function displayDrawings() {
    const drawings = await getData();
    const shuffledDrawings = shuffleArray([...drawings]);
    containers = document.getElementsByClassName('drawingContainer');
    
    imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {

            if (!entry.isIntersecting) {
                return;
            }

            const img = entry.target;
            img.src = img.dataset.src;
            observer.unobserve(img);
        });
    });
    

    const firstImages = shuffledDrawings.slice(0, 10);
    observe(firstImages);

    setTimeout(() => {
        const restImages = shuffledDrawings.slice(10);
        observe(restImages);
    }, 1000);
}

function observe(drawings) {
   drawings.forEach((drawing, i) => {
        const a = document.createElement('a');
        a.className = 'drawingLink';
        a.style.cursor = 'pointer';
        a.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(drawing);
        });

        const img = document.createElement('img');
        img.dataset.src = drawing.imageUrl;
        img.className = 'drawing';
        
        a.appendChild(img);
        containers[i % containers.length].appendChild(a);
        imageObserver.observe(img);
    });
}

function openModal(drawing) {
    const modal = document.getElementById('imageModal');
    const modalContent = modal.querySelector('.modal-content');
    const modalImage = document.getElementById('modalImage');
    const modalInfo = modal.querySelector('.modal-info');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalFormat = document.getElementById('modalFormat');
    const modalAvailable = document.getElementById('modalAvailable');
    
    modalImage.src = drawing.imageUrl;
    modalTitle.textContent = drawing.title || '';
    modalDescription.textContent = drawing.description || '';
    modalFormat.textContent = drawing.format || '';
    modalAvailable.textContent = drawing.available ? 'Available' : 'Not available';
    
    // Show or hide text information based on flag
    if (showModalTextInfo) {
        modalInfo.style.display = 'block';
    } else {
        modalInfo.style.display = 'none';
    }
    
    modalImage.onload = function() {
        const aspectRatio = this.naturalWidth / this.naturalHeight;
        if (aspectRatio > 1.5) {
            modalContent.classList.add('wide-image');
        } else {
            modalContent.classList.remove('wide-image');
        }
    };
    
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
}

// Mobile menu toggle functionality
function setupMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const menuRight = document.getElementById('menuRight');
    
    if (mobileMenuToggle && menuRight) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            menuRight.classList.toggle('expanded');
        });
        
        // Close menu when clicking on a navigation link
        const navLinks = menuRight.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                menuRight.classList.remove('expanded');
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Load profile data and apply translations
    loadProfileData();
    
    // Setup language switcher functionality
    setupLanguageSwitchers();
    
    // Setup mobile menu functionality
    setupMobileMenu();
    
    displayDrawings();
    
    const modal = document.getElementById('imageModal');
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('modal-content')) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});