
let html = '';

document.addEventListener('DOMContentLoaded', (event) => {
    const textarea = document.getElementById('add');
    textarea.addEventListener('change', (event) => {
        let value = "<p>" + event.target.value + "</p>";
        value = value.replaceAll("<p>**", "<h1>");
        value = value.replaceAll("**\n", "</h1>");
        value = value.replaceAll("\n", "</p><p>");
        value = value.replaceAll("<p></p>", "</br>");
        html = value;
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const fileInput = document.querySelector('input[type="text"]').value;

        const data = {
            file: fileInput,
            content: html
        };

        fetch('https://localhost:7133/file', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
    });
});

