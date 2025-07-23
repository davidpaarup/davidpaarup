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

    // Add GitHub, Instagram, and LinkedIn links below date of birth
    const githubUsername = 'davidpaarup';
    const githubUrl = `https://github.com/${githubUsername}`;
    const instagramUrl = 'https://www.instagram.com/davidpaarup/';
    const linkedinUrl = 'https://www.linkedin.com/in/davidpaarup/';
    const contactInfoDiv = document.getElementById('contactInfo');

    // Create a container for social links
    const socialLinksDiv = document.createElement('span');
    socialLinksDiv.style.display = 'inline-flex';
    socialLinksDiv.style.gap = '8px';
    socialLinksDiv.style.alignItems = 'center';

    // GitHub link
    const githubLink = document.createElement('a');
    githubLink.id = 'github-link';
    githubLink.href = githubUrl;
    githubLink.target = '_blank';
    githubLink.rel = 'noopener noreferrer';
    githubLink.innerHTML = `<svg height="20" width="20" viewBox="0 0 16 16" fill="black" aria-hidden="true" style="vertical-align:middle;"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>`;

    // Instagram link
    const instagramLink = document.createElement('a');
    instagramLink.id = 'instagram-link';
    instagramLink.href = instagramUrl;
    instagramLink.target = '_blank';
    instagramLink.rel = 'noopener noreferrer';
    instagramLink.innerHTML = `<svg height="20" width="20" viewBox="0 0 448 512" fill="black" aria-hidden="true" style="vertical-align:middle;"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9 114.9-51.3 114.9-114.9S287.7 141 224.1 141zm0 186c-39.5 0-71.5-32-71.5-71.5s32-71.5 71.5-71.5 71.5 32 71.5 71.5-32 71.5-71.5 71.5zm146.4-194.3c0 14.9-12 26.9-26.9 26.9s-26.9-12-26.9-26.9 12-26.9 26.9-26.9 26.9 12 26.9 26.9zm76.1 27.2c-1.7-35.3-9.9-66.7-36.2-92.1S388.6 7.7 353.3 6C317.7 4.3 284.4 0 224 0S130.3 4.3 94.7 6C59.4 7.7 28 15.9 2.7 41.2S7.7 123.4 6 158.7C4.3 194.3 0 227.6 0 288s4.3 93.7 6 129.3c1.7 35.3 9.9 66.7 36.2 92.1s56.8 34.5 92.1 36.2C130.3 507.7 163.6 512 224 512s93.7-4.3 129.3-6c35.3-1.7 66.7-9.9 92.1-36.2s34.5-56.8 36.2-92.1c1.7-35.6 6-68.9 6-129.3s-4.3-93.7-6-129.3zM398.8 388c-7.8 19.6-22.9 34.7-42.5 42.5-29.4 11.7-99.2 9-132.3 9s-102.9 2.6-132.3-9c-19.6-7.8-34.7-22.9-42.5-42.5-11.7-29.4-9-99.2-9-132.3s-2.6-102.9 9-132.3c7.8-19.6 22.9-34.7 42.5-42.5C121.1 9 190.9 11.6 224 11.6s102.9-2.6 132.3 9c19.6 7.8 34.7 22.9 42.5 42.5 11.7 29.4 9 99.2 9 132.3s2.6 102.9-9 132.3z"/></svg>`;

    // LinkedIn link
    const linkedinLink = document.createElement('a');
    linkedinLink.id = 'linkedin-link';
    linkedinLink.href = linkedinUrl;
    linkedinLink.target = '_blank';
    linkedinLink.rel = 'noopener noreferrer';
    linkedinLink.innerHTML = `<svg height="20" width="20" viewBox="0 0 448 512" fill="black" aria-hidden="true" style="vertical-align:middle;"><path d="M100.28 448H7.4V148.9h92.88zm-46.44-340.7C24.09 107.3 0 83.2 0 53.6A53.6 53.6 0 0 1 53.6 0c29.6 0 53.6 24.09 53.6 53.6 0 29.6-24.09 53.7-53.6 53.7zM447.8 448h-92.4V302.4c0-34.7-12.4-58.4-43.3-58.4-23.6 0-37.6 15.9-43.7 31.3-2.3 5.6-2.8 13.4-2.8 21.2V448h-92.4s1.2-242.1 0-267.1h92.4v37.9c12.3-19 34.3-46.1 83.5-46.1 60.9 0 106.6 39.8 106.6 125.4V448z"/></svg>`;

    // Add all links to the container
    socialLinksDiv.appendChild(githubLink);
    socialLinksDiv.appendChild(instagramLink);
    socialLinksDiv.appendChild(linkedinLink);

    const githubPara = document.createElement('p');
    githubPara.appendChild(socialLinksDiv);
    // Insert after the birth date paragraph
    const birthDatePara = contactInfoDiv.querySelector('p:nth-child(3)');
    if (birthDatePara && birthDatePara.nextSibling) {
        contactInfoDiv.insertBefore(githubPara, birthDatePara.nextSibling);
    } else {
        contactInfoDiv.appendChild(githubPara);
    }

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