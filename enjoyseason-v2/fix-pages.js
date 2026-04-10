const fs = require('fs');
const path = require('path');

const TMDB_KEY = '8265bd1679663a7ea12ac168da84d2e8';

const countryFolder = path.join(__dirname, 'country');
const countries = fs.readdirSync(countryFolder).filter(function(f) {
    return fs.statSync(path.join(countryFolder, f)).isDirectory();
});

console.log('Found countries: ' + countries.length);

countries.forEach(function(country) {
    const filePath = path.join(countryFolder, country, 'index.html');
    if (!fs.existsSync(filePath)) {
        console.log('SKIP (no file): ' + country);
        return;
    }

    let html = fs.readFileSync(filePath, 'utf8');

    const headerHTML = '<header style="background:#0d0e2b;padding:0 40px;height:70px;display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid #f5a623;position:sticky;top:0;z-index:1000;"><a href="/" style="font-size:24px;font-weight:800;color:#f5a623;text-decoration:none;">EnjoysSeason</a><nav><a href="/" style="color:#fff;text-decoration:none;margin-left:24px;font-size:15px;">Home</a><a href="/countries/" style="color:#fff;text-decoration:none;margin-left:24px;font-size:15px;">Countries</a><a href="/actors/" style="color:#fff;text-decoration:none;margin-left:24px;font-size:15px;">Actors</a><a href="/movies/" style="color:#fff;text-decoration:none;margin-left:24px;font-size:15px;">Movies</a></nav></header>';

    if (!html.includes('position:sticky') && !html.includes('position: sticky')) {
        html = html.replace('<body>', '<body>' + headerHTML);
        console.log('Header added: ' + country);
    } else {
        console.log('Header already exists: ' + country);
    }

    html = html.replace(
        /src="[^"]*placeholder[^"]*"\s+alt="([^"]+)"/g,
        'src="https://via.placeholder.com/300x400/1c1f45/f5a623?text=Loading" alt="$1" data-tmdb="$1"'
    );

    const tmdbScript = '<script>(function(){var TMDB_KEY="8265bd1679663a7ea12ac168da84d2e8";var imgs=document.querySelectorAll("img[data-tmdb]");if(!imgs.length)return;var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(!entry.isIntersecting)return;var img=entry.target;var name=img.getAttribute("data-tmdb");observer.unobserve(img);fetch("https://api.themoviedb.org/3/search/person?api_key=8265bd1679663a7ea12ac168da84d2e8&query="+encodeURIComponent(name)).then(function(r){return r.json();}).then(function(data){if(data.results&&data.results[0]&&data.results[0].profile_path){img.src="https://image.tmdb.org/t/p/w500"+data.results[0].profile_path;}else{img.src="https://via.placeholder.com/300x400/1c1f45/f5a623?text=No+Image";}}).catch(function(){img.src="https://via.placeholder.com/300x400/1c1f45/f5a623?text=Error";});});},{threshold:0.1});imgs.forEach(function(img){observer.observe(img);});})()<\/script>';

    if (!html.includes('themoviedb.org')) {
        html = html.replace('</body>', tmdbScript + '\n</body>');
        console.log('TMDB script added: ' + country);
    } else {
        console.log('TMDB already exists: ' + country);
    }

    fs.writeFileSync(filePath, html, 'utf8');
    console.log('FIXED: country/' + country + '/index.html');
    console.log('---');
});

console.log('\nAll pages fixed successfully!');
