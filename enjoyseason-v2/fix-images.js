const fs = require('fs');
const path = require('path');

const TMDB_KEY = '8265bd1679663a7ea12ac168da84d2e8';

const tmdbScript = `
<script>
(function() {
    var TMDB_KEY = '8265bd1679663a7ea12ac168da84d2e8';
    var imgs = document.querySelectorAll('img[alt]');
    if (!imgs.length) return;
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (!entry.isIntersecting) return;
            var img = entry.target;
            if (img.dataset.loaded) return;
            img.dataset.loaded = 'true';
            observer.unobserve(img);
            var name = img.getAttribute('alt');
            if (!name || name.length < 2) return;
            fetch('https://api.themoviedb.org/3/search/person?api_key=' + TMDB_KEY + '&query=' + encodeURIComponent(name))
                .then(function(r) { return r.json(); })
                .then(function(data) {
                    if (data.results && data.results[0] && data.results[0].profile_path) {
                        img.src = 'https://image.tmdb.org/t/p/w500' + data.results[0].profile_path;
                    }
                })
                .catch(function() {});
        });
    }, { threshold: 0.1 });
    imgs.forEach(function(img) { observer.observe(img); });
})();
</script>`;

const countryFolder = path.join(__dirname, 'country');
const countries = fs.readdirSync(countryFolder).filter(function(f) {
    return fs.statSync(path.join(countryFolder, f)).isDirectory();
});

console.log('Total countries: ' + countries.length);

countries.forEach(function(country) {
    const filePath = path.join(countryFolder, country, 'index.html');
    if (!fs.existsSync(filePath)) {
        console.log('SKIP: ' + country);
        return;
    }

    let html = fs.readFileSync(filePath, 'utf8');

    if (html.includes('themoviedb.org')) {
        console.log('Already has TMDB: ' + country);
        return;
    }

    html = html.replace('</body>', tmdbScript + '\n</body>');
    fs.writeFileSync(filePath, html, 'utf8');
    console.log('FIXED: ' + country);
});

console.log('---');
console.log('All done!');
