async function getData() {
    var result = await fetch('https://image-api-david-paarup.vercel.app/api/list');
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

async function displayDrawings() {
    const urls = await getData();
    const shuffledUrls = shuffleArray([...urls]);
    const containers = document.getElementsByClassName('drawingContainer');
    
    shuffledUrls.forEach((url, i) => {
        const a = document.createElement('a');
        a.href = url;
        a.className = 'drawingLink';

        const img = document.createElement('img');
        img.src = url;
        img.className = 'drawing';
        
        a.appendChild(img);
        containers[i % containers.length].appendChild(a);
    });
}

document.addEventListener('DOMContentLoaded', displayDrawings);