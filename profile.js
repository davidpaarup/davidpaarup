// Global variable to store the loaded data
let profileData = null;
let currentLanguage = sessionStorage.getItem('selectedLanguage') || 'english';

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

// Hide elements while loading
function setLoadingState(isLoading) {
    const hrs = document.querySelectorAll('hr');
    const contactInfo = document.getElementById('contactInfo');
    const socialMedia = document.getElementById('socialMedia');
    const navLinks = document.querySelector('.nav-links');

    hrs.forEach(hr => {
        if (isLoading) {
            hr.classList.add('hidden');
        } else {
            hr.classList.remove('hidden');
        }
    });

    if (contactInfo) {
        if (isLoading) {
            contactInfo.classList.add('hidden');
        } else {
            contactInfo.classList.remove('hidden');
        }
    }

    if (socialMedia) {
        if (isLoading) {
            socialMedia.classList.add('hidden');
        } else {
            socialMedia.classList.remove('hidden');
        }
    }

    if (navLinks) {
        if (isLoading) {
            navLinks.classList.add('nav-hidden');
        } else {
            navLinks.classList.remove('nav-hidden');
        }
    }

    // Language switchers should remain visible during loading
    // so users can change language while content is loading
}

// Load data from Sanity
async function loadProfileData() {
    setLoadingState(true);
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
        populateContent(currentLanguage);
        setupLanguageSwitchers();
        setLoadingState(false);
    } catch (error) {
        console.error('Error loading profile data:', error);
        setLoadingState(false);
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

// Populate HTML content with data
function populateContent(language) {
    if (!profileData) return;
    
    const data = profileData.find(item => item.language === language)?.data;
    if (!data) return;
    
    // Update menu translations
    updateMenuTranslations(language);
    
    // Update basic info
    document.getElementById('name').textContent = data.name.text;
    document.getElementById('description').textContent = data.description.text;
    
    // Update experience

    const experienceTitle = document.getElementById('experienceTitle');
    experienceTitle.textContent = data.experience.sectionTitle;

    const experienceContainer = document.getElementById('experience');
    experienceContainer.innerHTML = data.experience.data.map(exp => {

        let yearRange;

        if (exp.current) {
            yearRange = `${exp.startYear} - now`;
        } else if (exp.startYear === exp.endYear) {
            yearRange = exp.startYear;
        } else {
            yearRange = `${exp.startYear} - ${exp.endYear}`;
        }

        let type = '';

        if (exp.type != null) {
            type = `(${exp.type})`;
        }

        return `<p>- <span>${exp.position} - <a href="${exp.url}">${exp.company}</a> ${type} - ${exp.location}; ${yearRange}: ${exp.description}</span></p>`;
    }).join('');
    
    // Update education
    const educationTitle = document.getElementById('educationTitle');
    educationTitle.textContent = data.education.sectionTitle;

    const educationContainer = document.getElementById('education');
    educationContainer.innerHTML = data.education.data.map(edu => {
        const yearRange = `${edu.startYear} - ${edu.endYear}`;
        return `<p>- <span>${edu.degree} - <a href="https://www.uam.es">${edu.school}</a> (${edu.type}) - ${edu.location}; ${yearRange}: ${edu.description}</span></p>`;
    }).join('');
    
    // Update projects
    const projectsTitle = document.getElementById('projectsTitle');
    projectsTitle.textContent = data.projects.sectionTitle;

    const projectsContainer = document.getElementById('projects');
    projectsContainer.innerHTML = data.projects.data.map(project => {
        let yearInfo = ''
        
        if (project.startYear != null) {
            if (project.location != null) {
                yearInfo = ` (${project.location}; ${project.startYear})`;
            } else {
                yearInfo = ` (${project.startYear})`;
            }
        }
        return `<p>- <span><a href="${project.url}">${project.name}</a>${yearInfo} - ${project.description}</span></p>`;
    }).join('');

    // Update skills
    const skillsTitle = document.getElementById('skillsTitle');
    skillsTitle.textContent = data.skills.sectionTitle;
    
    document.getElementById('skills').textContent = getJoined(data.skills.data); 
    
    // Update languages
    const languagesTitle = document.getElementById('languagesTitle');
    languagesTitle.textContent = data.languages.sectionTitle;

    let joinedLanguages = getJoined(data.languages.data);

    if (!data.languages.capitalize) {
        joinedLanguages = joinedLanguages.charAt(0).toUpperCase() + joinedLanguages.slice(1).toLowerCase();
    }

    document.getElementById('languages').textContent = joinedLanguages;
    
    // Update contact info
    const contactTitle = document.getElementById('contactTitle');
    contactTitle.textContent = data.email.sectionTitle;

    const emailLink = document.getElementById('email');
    emailLink.href = `mailto:${data.email.text}`;
    emailLink.textContent = data.email.text;

    const locationTitle = document.getElementById('locationTitle');
    locationTitle.textContent = data.location.sectionTitle;

    document.getElementById('location').textContent = data.location.text;
    
    const birthDateTitle = document.getElementById('birthDateTitle');
    birthDateTitle.textContent = data.birthDate.sectionTitle;

    document.getElementById('birthDate').textContent = data.birthDate.text;
}

function getJoined(elements) {
    const joined = elements.join(', ');
    const lastIndex = joined.lastIndexOf(',');

    let lastDelimiter = ' , ';

    if (currentLanguage === 'english') {
        lastDelimiter = ' and ';
    } else if (currentLanguage === 'spanish') {
        lastDelimiter = ' y ';
    } else if (currentLanguage === 'danish' || currentLanguage === 'norwegian') {
        lastDelimiter = ' og ';
    }

    const joinedText = joined.substring(0, lastIndex) + lastDelimiter + joined.substring(lastIndex + 1);
    return `${joinedText}.`;
}

// Function to switch language
function switchLanguage(language) {
    currentLanguage = language;
    sessionStorage.setItem('selectedLanguage', language);
    populateContent(language);
    
    // Remove active class from all language icons
    const allLanguageIcons = document.querySelectorAll('.language-icon');
    allLanguageIcons.forEach(icon => icon.classList.remove('active'));
    
    // Add active class to the clicked language icon
    const activeIcon = document.querySelector(`img[src="icons/${language}.png"]`);
    if (activeIcon) {
        activeIcon.classList.add('active');
    }
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadProfileData();
    setupMobileMenu();
}); 