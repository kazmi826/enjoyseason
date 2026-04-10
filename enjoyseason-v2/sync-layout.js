const fs = require('fs');
const path = require('path');

// Home page se header aur footer extract karo
const homePage = fs.readFileSync('index.html', 'utf8');

// Header extract karo
const headerMatch = homePage.match(/<header[\s\S]*?<\/header>/i);
if (!headerMatch) {
    console.log('ERROR: Header not found in index.html');
    process.exit(1);
}
const headerHTML = headerMatch[0];
console.log('Header extracted successfully');

// Footer extract karo
const footerMatch = homePage.match(/<footer[\s\S]*?<\/footer>/i);
if (!footerMatch) {
    console.log('ERROR: Footer not found in index.html');
    process.exit(1);
}
const footerHTML = footerMatch[0];
console.log('Footer extracted successfully');

// Sari country folders
const countryFolder = path.join(__dirname, 'country');
const countries = fs.readdirSync(countryFolder).filter(function(f) {
    return fs.statSync(path.join(countryFolder, f)).isDirectory();
});

console.log('Total countries found: ' + countries.length);
console.log('---');

countries.forEach(function(country) {
    const filePath = path.join(countryFolder, country, 'index.html');
    if (!fs.existsSync(filePath)) {
        console.log('SKIP (no file): ' + country);
        return;
    }

    let html = fs.readFileSync(filePath, 'utf8');

    // Purana header hata do
    html = html.replace(/<header[\s\S]*?<\/header>/i, '');

    // Purana footer hata do
    html = html.replace(/<footer[\s\S]*?<\/footer>/i, '');

    // Naya header add karo body ke baad
    html = html.replace('<body>', '<body>\n' + headerHTML);

    // Naya footer add karo body close se pehle
    html = html.replace('</body>', footerHTML + '\n</body>');

    // Save karo
    fs.writeFileSync(filePath, html, 'utf8');
    console.log('DONE: ' + country);
});

console.log('---');
console.log('All ' + countries.length + ' country pages updated!');
