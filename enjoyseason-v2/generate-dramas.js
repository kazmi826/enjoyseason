const fs = require('fs');
const path = require('path');

// Data Load
const dramas = JSON.parse(fs.readFileSync('data/dramas.json', 'utf8'));

const generateDramas = () => {
    const dir = path.join(__dirname, 'dramas');
    
    dramas.forEach(drama => {
        const filePath = path.join(dir, `${drama.slug}.html`);
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${drama.title} - EnjoysSeason</title>
    <style>
        body { background: #08091a; color: white; font-family: Arial; padding: 40px; text-align: center; }
        .card { background: #121430; padding: 20px; border-radius: 15px; border: 1px solid #f5a623; max-width: 600px; margin: auto; }
        h1 { color: #f5a623; }
    </style>
</head>
<body>
    <div class="card">
        <h1>${drama.title}</h1>
        <p><strong>Country:</strong> ${drama.country}</p>
        <p>${drama.description}</p>
        <a href="/" style="color: #f5a623; text-decoration: none;">Back to Home</a>
    </div>
</body>
</html>`;
        
        fs.writeFileSync(filePath, html);
        console.log(`✅ Success: Generated ${drama.slug}.html`);
    });
};

generateDramas();