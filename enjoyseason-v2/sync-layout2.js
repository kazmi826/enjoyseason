const fs = require('fs');
const path = require('path');

const homePage = fs.readFileSync('index.html', 'utf8');

const cssMatch = homePage.match(/<style[\s\S]*?<\/style>/gi);
const homeCSS = cssMatch ? cssMatch[0] : '';

const headerMatch = homePage.match(/<header[\s\S]*?<\/header>/i);
const headerHTML = headerMatch ? headerMatch[0] : '';

const footerMatch = homePage.match(/<footer[\s\S]*?<\/footer>/i);
const footerHTML = footerMatch ? footerMatch[0] : '';

const scriptMatches = homePage.match(/<script[\s\S]*?<\/script>/gi);
const headerScripts = scriptMatches ? scriptMatches.filter(function(s) {
    return s.includes('nav') || s.includes('dropdown') || s.includes('menu') || s.includes('header');
}).join('\n') : '';

console.log('CSS: ' + (homeCSS ? 'OK' : 'NOT FOUND'));
console.log('Header: ' + (headerHTML ? 'OK' : 'NOT FOUND'));
console.log('Footer: ' + (footerHTML ? 'OK' : 'NOT FOUND'));
console.log('Scripts: ' + (headerScripts ? 'OK' : 'NOT FOUND'));

const countryFolder = path.join(__dirname, 'country');
const countries = fs.readdirSync(countryFolder).filter(function(f) {
    return fs.statSync(path.join(countryFolder, f)).isDirectory();
});

console.log('Total countries: ' + countries.length);
console.log('---');

countries.forEach(function(country) {
    const filePath = path.join(countryFolder, country, 'index.html');
    if (!fs.existsSync(filePath)) {
        console.log('SKIP: ' + country);
        return;
    }

    let html = fs.readFileSync(filePath, 'utf8');

    html = html.replace(/<header[\s\S]*?<\/header>/i, '');
    html = html.replace(/<footer[\s\S]*?<\/footer>/i, '');

    if (homeCSS) {
        html = html.replace('</head>', homeCSS + '\n</head>');
    }

    if (headerHTML) {
        html = html.replace('<body>', '<body>\n' + headerHTML);
    }

    if (footerHTML) {
        html = html.replace('</body>', '\n' + footerHTML + '\n</body>');
    }

    if (headerScripts) {
        html = html.replace('</body>', headerScripts + '\n</body>');
    }

    fs.writeFileSync(filePath, html, 'utf8');
    console.log('DONE: ' + country);
});

console.log('---');
console.log('All ' + countries.length + ' pages updated successfully!');
