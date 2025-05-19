async function getData() {
    var result = await fetch('https://updload-image.vercel.app/api/list');
    const data = await result.json();
    return data.blobs.map(b => b.url);
}

async function displayDrawings() {
    const urls = await getData();
    const containers = document.getElementsByClassName('drawingContainer');
    console.log(containers);
    
    urls.forEach((url, i) => {
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