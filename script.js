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

// Load profile data from API
async function loadProfileData() {
    try {
        const response = await fetch('https://davidpaarup-api.vercel.app/api/data');
        profileData = await response.json();
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
    var result = await fetch('https://davidpaarup-api.vercel.app/api/list');
    const data = await result.json();
    return data.blobs.map(b => b.url);
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
    const urls = await getData();
    const shuffledUrls = shuffleArray([...urls]);
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
    

    const firstImages = shuffledUrls.slice(0, 10);
    observe(firstImages);

    setTimeout(() => {
        const restImages = shuffledUrls.slice(10);
        observe(restImages);
    }, 1000);
}

function observe(urls) {
   urls.forEach((url, i) => {
        const a = document.createElement('a');
        a.className = 'drawingLink';
        a.style.cursor = 'pointer';
        a.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(url);
        });

        const img = document.createElement('img');
        img.dataset.src = url;
        img.className = 'drawing';
        
        a.appendChild(img);
        containers[i % containers.length].appendChild(a);
        imageObserver.observe(img);
    });
}

function openModal(imageUrl) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    modalImage.src = imageUrl;
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    // Load profile data and apply translations
    loadProfileData();
    
    // Setup language switcher functionality
    setupLanguageSwitchers();
    
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