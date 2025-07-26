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
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
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