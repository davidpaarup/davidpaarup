// Global variable to store the loaded data
let profileData = null;
let currentLanguage = 'english';

// Hide <hr> and contactInfo while loading
function setLoadingState(isLoading) {
    const hrs = document.querySelectorAll('hr');
    const contactInfo = document.getElementById('contactInfo');
    const languageSwitchers = document.getElementById('languageSwitchers');
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
    if (languageSwitchers) {
        if (isLoading) {
            languageSwitchers.classList.add('hidden');
        } else {
            languageSwitchers.classList.remove('hidden');
        }
    }
}

// Load data from data.json
async function loadProfileData() {
    setLoadingState(true);
    try {
        const response = await fetch('https://davidpaarup-api.vercel.app/api/data');
        profileData = await response.json();
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

// Populate HTML content with data
function populateContent(language) {
    if (!profileData) return;
    
    const data = profileData.find(item => item.language === language)?.data;
    if (!data) return;
    
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
        
        if (project.startYear != null && project.location != null) {
            yearInfo = ` ${project.location}; ${project.startYear}:`;
        }
        return `<p>- <span>${yearInfo} <a href="${project.url}">${project.name}</a> - ${project.description}</span></p>`;
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
    populateContent(language);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', loadProfileData); 