// ============================================================
// EnjoysSeason — Complete Page Generator
// LLM + AEO + Featured Snippet Optimized
// ============================================================

const fs = require('fs');
const path = require('path');

// ============================================================
// LOAD DATA
// ============================================================
const actors = JSON.parse(fs.readFileSync('./data/actors.json', 'utf8'));
const movies = JSON.parse(fs.readFileSync('./data/movies.json', 'utf8'));
const dramas = JSON.parse(fs.readFileSync('./data/dramas.json', 'utf8'));

let totalPages = 0;
const allUrls = [];

// ============================================================
// HELPERS
// ============================================================
const makeDir = (d) => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); };
const getActorById = (id) => actors.find(a => a.id === id);
const getMovieById = (id) => movies.find(m => m.id === id);
const getDramaById = (id) => dramas.find(d => d.id === id);
const getAge = (born) => new Date().getFullYear() - new Date(born).getFullYear();
const getYear = () => new Date().getFullYear();
const getActorsByCountry = (country, excludeId) =>
  actors.filter(a => a.country === country && a.id !== excludeId).slice(0, 6);
const getImageUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=400&background=1a1a2e&color=f0c040&bold=true&format=svg`;

// ============================================================
// CSS — SHARED STYLES
// ============================================================
const sharedCSS = `
  *{margin:0;padding:0;box-sizing:border-box}
  :root{
    --bg:#0d0d1a;--card:#1a1a2e;--card2:#16213e;
    --gold:#f0c040;--gold2:#d4a017;--text:#e8e8f0;
    --muted:#8888aa;--border:#2a2a4a;--green:#4ade80;
  }
  body{background:var(--bg);color:var(--text);font-family:'Georgia',serif;line-height:1.8;font-size:16px}
  a{color:var(--gold);text-decoration:none}
  a:hover{text-decoration:underline}

  /* HEADER */
  header{background:var(--card);border-bottom:2px solid var(--gold);padding:1rem 2rem;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:100}
  .logo{color:var(--gold);font-weight:bold;font-size:1.5rem;text-decoration:none}
  nav{display:flex;gap:1.5rem}
  nav a{color:var(--muted);font-size:.9rem;transition:color .2s}
  nav a:hover{color:var(--gold);text-decoration:none}

  /* BREADCRUMB */
  .breadcrumb{padding:.7rem 2rem;background:var(--card2);font-size:.82rem;border-bottom:1px solid var(--border)}
  .breadcrumb a{color:var(--gold)}
  .breadcrumb .sep{color:var(--muted);margin:0 .4rem}

  /* CONTAINER */
  .container{max-width:1100px;margin:0 auto;padding:2rem}

  /* HERO */
  .hero{display:grid;grid-template-columns:280px 1fr;gap:2.5rem;margin-bottom:3rem;align-items:start}
  .hero-image{width:100%;border-radius:14px;border:3px solid var(--gold);aspect-ratio:3/4;object-fit:cover;background:var(--card)}
  .hero-image-wide{aspect-ratio:2/3}
  .hero-info h1{font-size:2.1rem;color:var(--gold);margin-bottom:.3rem;line-height:1.3}
  .hero-info .subtitle{color:var(--muted);font-size:1rem;margin-bottom:1rem}

  /* BADGES */
  .badges{display:flex;flex-wrap:wrap;gap:.6rem;margin:1rem 0}
  .badge{background:var(--card2);border:1px solid var(--border);padding:.3rem .8rem;border-radius:20px;font-size:.82rem;color:var(--muted)}
  .badge strong{color:var(--text)}
  .badge-gold{border-color:var(--gold);color:var(--gold)}
  .rating-badge{background:var(--gold);color:var(--bg);padding:.35rem 1rem;border-radius:20px;font-weight:bold}

  /* BIO / DESCRIPTION */
  .bio-text{color:var(--text);font-size:1rem;line-height:1.95;margin:1.2rem 0;padding:1rem 1rem 1rem 1.2rem;border-left:4px solid var(--gold);background:var(--card2);border-radius:0 8px 8px 0}

  /* QUICK FACTS TABLE — Featured Snippet */
  .facts-table{width:100%;border-collapse:collapse;margin:1rem 0;font-size:.92rem}
  .facts-table td{padding:.6rem .9rem;border:1px solid var(--border)}
  .facts-table td:first-child{color:var(--muted);width:35%;background:var(--card2);font-weight:bold}
  .facts-table td:last-child{color:var(--text);background:var(--card)}

  /* SECTION */
  .section{margin:2.8rem 0}
  .section-title{font-size:1.35rem;color:var(--gold);margin-bottom:1.2rem;padding-bottom:.6rem;border-bottom:2px solid var(--border);display:flex;align-items:center;gap:.5rem}

  /* GRID CARDS */
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(175px,1fr));gap:1.1rem}
  .card{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:1rem;text-decoration:none;color:var(--text);transition:all .2s;display:block}
  .card:hover{border-color:var(--gold);transform:translateY(-3px);text-decoration:none;box-shadow:0 6px 20px rgba(240,192,64,.15)}
  .card h3{font-size:.9rem;color:var(--gold);margin-bottom:.4rem;line-height:1.4}
  .card p{font-size:.78rem;color:var(--muted);line-height:1.5}

  /* DRAMAS/MOVIES TABLE — Featured Snippet */
  .content-table{width:100%;border-collapse:collapse;font-size:.88rem}
  .content-table th{background:var(--gold);color:var(--bg);padding:.6rem .8rem;text-align:left}
  .content-table td{padding:.6rem .8rem;border:1px solid var(--border)}
  .content-table tr:nth-child(even) td{background:var(--card2)}
  .content-table tr:nth-child(odd) td{background:var(--card)}
  .content-table a{color:var(--gold)}

  /* AWARDS */
  .awards-list{list-style:none;display:flex;flex-wrap:wrap;gap:.7rem;padding:0}
  .awards-list li{background:var(--card);border:1px solid var(--gold);border-radius:6px;padding:.4rem .9rem;font-size:.85rem;color:var(--gold)}

  /* FAQ — AEO */
  .faq-list{display:flex;flex-direction:column;gap:1rem}
  .faq-item{background:var(--card);border:1px solid var(--border);border-radius:10px;overflow:hidden}
  .faq-q{padding:1rem 1.2rem;font-weight:bold;color:var(--gold);font-size:.95rem;cursor:pointer;display:flex;justify-content:space-between;align-items:center}
  .faq-q::after{content:'▼';font-size:.7rem;color:var(--muted)}
  .faq-a{padding:0 1.2rem 1rem;color:var(--text);font-size:.92rem;line-height:1.8;border-top:1px solid var(--border)}

  /* EXT LINKS */
  .ext-links{display:flex;gap:.8rem;flex-wrap:wrap;margin-top:1rem}
  .ext-link{color:var(--gold);border:1px solid var(--gold);padding:.3rem .8rem;border-radius:6px;font-size:.82rem;transition:all .2s}
  .ext-link:hover{background:var(--gold);color:var(--bg);text-decoration:none}

  /* FOOTER */
  footer{background:var(--card);border-top:2px solid var(--border);padding:2rem;text-align:center;color:var(--muted);font-size:.85rem;margin-top:4rem}
  footer a{color:var(--gold)}
  .footer-links{display:flex;justify-content:center;gap:1.5rem;flex-wrap:wrap;margin-bottom:1rem}

  /* RESPONSIVE */
  @media(max-width:750px){
    .hero{grid-template-columns:1fr}
    .hero-image{max-width:220px;margin:0 auto}
    nav{display:none}
    .container{padding:1rem}
  }
`;

// ============================================================
// SHARED HEADER + FOOTER
// ============================================================
const makeHeader = (country, countrySlug) => `
<header>
  <a href="/" class="logo">🎬 EnjoysSeason</a>
  <nav>
    <a href="/">Home</a>
    <a href="/country/${countrySlug}">${country}</a>
    <a href="/category/actors">Actors</a>
    <a href="/category/movies">Movies</a>
    <a href="/category/dramas">Dramas</a>
  </nav>
</header>`;

const makeFooter = () => `
<footer>
  <div class="footer-links">
    <a href="/">Home</a>
    <a href="/category/actors">Actors</a>
    <a href="/category/movies">Movies</a>
    <a href="/category/dramas">Dramas</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
    <a href="/privacy-policy">Privacy Policy</a>
    <a href="/disclaimer">Disclaimer</a>
  </div>
  <p>© ${getYear()} EnjoysSeason — World Actors, Movies & Dramas Database</p>
</footer>`;

// ============================================================
// ACTOR PAGE GENERATOR
// ============================================================
const generateActorPage = (actor) => {
  const actorMovies = (actor.movies || []).map(id => getMovieById(id)).filter(Boolean);
  const actorDramas = (actor.dramas || []).map(id => getDramaById(id)).filter(Boolean);
  const relatedActors = getActorsByCountry(actor.country, actor.id);
  const costars = (actor.costars || []).map(id => getActorById(id)).filter(Boolean);
  const imageUrl = actor.image || getImageUrl(actor.name);
  const age = getAge(actor.born);
  const year = getYear();
  const knownFor = [...(actor.dramas || []).slice(0,2), ...(actor.movies || []).slice(0,1)]
    .map(id => getDramaById(id)?.title || getMovieById(id)?.title).filter(Boolean).join(', ');

  // ---- ALL SCHEMAS ----

  // 1. Person Schema
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": actor.name,
    "alternateName": actor.fullName,
    "url": `https://enjoyseason.com/actors/${actor.countrySlug}/${actor.slug}`,
    "image": imageUrl,
    "birthDate": actor.born,
    "birthPlace": { "@type": "Place", "name": actor.birthPlace },
    "nationality": actor.nationality,
    "jobTitle": (actor.profession || ["Actor"]).join(", "),
    "description": actor.bio,
    "sameAs": [actor.wikipedia, actor.imdb].filter(Boolean),
    "performerIn": [
      ...actorMovies.map(m => ({ "@type": "Movie", "name": m.title, "url": `https://enjoyseason.com/movies/${m.countrySlug}/${m.slug}` })),
      ...actorDramas.map(d => ({ "@type": "TVSeries", "name": d.title, "url": `https://enjoyseason.com/dramas/${d.countrySlug}/${d.slug}` }))
    ],
    "award": actor.awards || []
  };

  // 2. FAQ Schema — AEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Who is ${actor.name}?`,
        "acceptedAnswer": { "@type": "Answer", "text": `${actor.name} is a ${actor.nationality} ${(actor.profession||['actor']).join(' and ')} born on ${actor.born} in ${actor.birthPlace}. ${actor.name} is known for ${knownFor}.` }
      },
      {
        "@type": "Question",
        "name": `How old is ${actor.name}?`,
        "acceptedAnswer": { "@type": "Answer", "text": `${actor.name} was born on ${actor.born}. As of ${year}, ${actor.name} is ${age} years old.` }
      },
      {
        "@type": "Question",
        "name": `What is ${actor.name} famous for?`,
        "acceptedAnswer": { "@type": "Answer", "text": `${actor.name} is famous for ${knownFor}. ${actor.name} has won awards including ${(actor.awards||[]).slice(0,2).join(' and ')}.` }
      },
      {
        "@type": "Question",
        "name": `Which country is ${actor.name} from?`,
        "acceptedAnswer": { "@type": "Answer", "text": `${actor.name} is from ${actor.country}. ${actor.name} is a ${actor.nationality} ${(actor.profession||['actor'])[0]} who has been active in the entertainment industry since ${actor.active}.` }
      },
      {
        "@type": "Question",
        "name": `What awards has ${actor.name} won?`,
        "acceptedAnswer": { "@type": "Answer", "text": `${actor.name} has won the following awards: ${(actor.awards||['multiple industry awards']).join(', ')}.` }
      },
      {
        "@type": "Question",
        "name": `What dramas has ${actor.name} acted in?`,
        "acceptedAnswer": { "@type": "Answer", "text": `${actor.name} has acted in the following dramas: ${actorDramas.map(d => `${d.title} (${d.year})`).join(', ')}.` }
      }
    ]
  };

  // 3. Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://enjoyseason.com" },
      { "@type": "ListItem", "position": 2, "name": `${actor.country} Actors`, "item": `https://enjoyseason.com/country/${actor.countrySlug}` },
      { "@type": "ListItem", "position": 3, "name": actor.name, "item": `https://enjoyseason.com/actors/${actor.countrySlug}/${actor.slug}` }
    ]
  };

  // ---- HTML PAGE ----
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${actor.name} - ${actor.nationality} Actor | Age, Movies, Dramas & Biography</title>
  <meta name="description" content="${actor.name} is a ${actor.nationality} actor born on ${actor.born} in ${actor.birthPlace}. Known for ${knownFor}. Complete biography, movies list, dramas list and awards.">
  <meta name="keywords" content="${actor.name}, ${actor.nationality} actor, ${actor.country} actor, ${actor.fullName}, ${actorDramas.map(d=>d.title).join(', ')}, ${actorMovies.map(m=>m.title).join(', ')}">
  <meta property="og:title" content="${actor.name} - ${actor.nationality} Actor | EnjoysSeason">
  <meta property="og:description" content="${actor.name} is a ${actor.nationality} actor known for ${knownFor}. Born ${actor.born} in ${actor.birthPlace}.">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:url" content="https://enjoyseason.com/actors/${actor.countrySlug}/${actor.slug}">
  <meta property="og:type" content="profile">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="canonical" href="https://enjoyseason.com/actors/${actor.countrySlug}/${actor.slug}">
  <script type="application/ld+json">${JSON.stringify(personSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
  <style>${sharedCSS}</style>
</head>
<body>

${makeHeader(actor.country, actor.countrySlug)}

<!-- BREADCRUMB -->
<div class="breadcrumb">
  <a href="/">Home</a><span class="sep">›</span>
  <a href="/country/${actor.countrySlug}">${actor.country} Actors</a><span class="sep">›</span>
  <span>${actor.name}</span>
</div>

<div class="container">

  <!-- ===================== -->
  <!-- HERO — FEATURED SNIPPET READY -->
  <!-- ===================== -->
  <div class="hero">
    <img src="${imageUrl}" alt="${actor.name} - ${actor.nationality} Actor" class="hero-image" loading="lazy" width="280" height="373">
    <div class="hero-info">
      <h1>${actor.name}</h1>
      <p class="subtitle">${actor.nationality} ${(actor.profession||['Actor']).join(' · ')}</p>

      <div class="badges">
        <span class="badge">🌍 <strong>${actor.country}</strong></span>
        <span class="badge">🎂 Born: <strong>${actor.born}</strong></span>
        <span class="badge">📍 <strong>${actor.birthPlace}</strong></span>
        <span class="badge">🎭 <strong>${(actor.genre||[]).join(', ')}</strong></span>
        <span class="badge">⏳ Since: <strong>${actor.active}</strong></span>
        <span class="badge badge-gold">Age: <strong>${age}</strong></span>
      </div>

      <!-- BIO — PARAGRAPH FEATURED SNIPPET -->
      <div class="bio-text">
        <strong>Who is ${actor.name}?</strong><br>
        ${actor.name} is a ${actor.nationality} ${(actor.profession||['actor']).join(' and ')} born on ${actor.born} in ${actor.birthPlace}. ${actor.bio}
      </div>

      <div class="ext-links">
        ${actor.imdb ? `<a href="${actor.imdb}" class="ext-link" target="_blank" rel="nofollow noopener">IMDb ↗</a>` : ''}
        ${actor.wikipedia ? `<a href="${actor.wikipedia}" class="ext-link" target="_blank" rel="nofollow noopener">Wikipedia ↗</a>` : ''}
        <a href="/country/${actor.countrySlug}" class="ext-link">More ${actor.country} Actors</a>
      </div>
    </div>
  </div>

  <!-- ===================== -->
  <!-- QUICK FACTS — TABLE FEATURED SNIPPET -->
  <!-- ===================== -->
  <div class="section">
    <h2 class="section-title">📋 ${actor.name} Quick Facts</h2>
    <table class="facts-table">
      <tr><td>Full Name</td><td>${actor.fullName || actor.name}</td></tr>
      <tr><td>Date of Birth</td><td>${actor.born}</td></tr>
      <tr><td>Age (${year})</td><td>${age} years old</td></tr>
      <tr><td>Birthplace</td><td>${actor.birthPlace}</td></tr>
      <tr><td>Nationality</td><td>${actor.nationality}</td></tr>
      <tr><td>Profession</td><td>${(actor.profession||['Actor']).join(', ')}</td></tr>
      <tr><td>Active Since</td><td>${actor.active}</td></tr>
      ${actor.spouse ? `<tr><td>Spouse</td><td>${actor.spouse}</td></tr>` : ''}
      ${actor.children ? `<tr><td>Children</td><td>${actor.children}</td></tr>` : ''}
      ${actor.netWorth ? `<tr><td>Net Worth (est.)</td><td>${actor.netWorth}</td></tr>` : ''}
      <tr><td>Known For</td><td>${knownFor}</td></tr>
    </table>
  </div>

  <!-- ===================== -->
  <!-- DRAMAS TABLE — TABLE FEATURED SNIPPET -->
  <!-- ===================== -->
  ${actorDramas.length ? `
  <div class="section">
    <h2 class="section-title">📺 ${actor.name} Dramas List (${actorDramas.length} Dramas)</h2>
    <table class="content-table">
      <tr>
        <th>#</th>
        <th>Drama Title</th>
        <th>Year</th>
        <th>Network</th>
        <th>Episodes</th>
        <th>Genre</th>
      </tr>
      ${actorDramas.map((d, i) => `
      <tr>
        <td>${i+1}</td>
        <td><a href="/dramas/${d.countrySlug}/${d.slug}">${d.title}</a></td>
        <td>${d.year || d.startDate?.slice(0,4)}</td>
        <td>${d.network || '-'}</td>
        <td>${d.episodes || '-'}</td>
        <td>${(d.genre||[]).join(', ')}</td>
      </tr>`).join('')}
    </table>
  </div>` : ''}

  <!-- ===================== -->
  <!-- MOVIES TABLE — TABLE FEATURED SNIPPET -->
  <!-- ===================== -->
  ${actorMovies.length ? `
  <div class="section">
    <h2 class="section-title">🎬 ${actor.name} Movies List (${actorMovies.length} Movies)</h2>
    <table class="content-table">
      <tr>
        <th>#</th>
        <th>Movie Title</th>
        <th>Year</th>
        <th>Language</th>
        <th>Genre</th>
        <th>Rating</th>
      </tr>
      ${actorMovies.map((m, i) => `
      <tr>
        <td>${i+1}</td>
        <td><a href="/movies/${m.countrySlug}/${m.slug}">${m.title}</a></td>
        <td>${m.year}</td>
        <td>${m.language}</td>
        <td>${(m.genre||[]).join(', ')}</td>
        <td>${m.rating ? `⭐ ${m.rating}` : '-'}</td>
      </tr>`).join('')}
    </table>
  </div>` : ''}

  <!-- ===================== -->
  <!-- AWARDS — LIST FEATURED SNIPPET -->
  <!-- ===================== -->
  ${(actor.awards||[]).length ? `
  <div class="section">
    <h2 class="section-title">🏆 ${actor.name} Awards & Achievements</h2>
    <ul class="awards-list">
      ${actor.awards.map(a => `<li>🥇 ${a}</li>`).join('')}
    </ul>
  </div>` : ''}

  <!-- ===================== -->
  <!-- CO-STARS — INTERNAL LINKS -->
  <!-- ===================== -->
  ${costars.length ? `
  <div class="section">
    <h2 class="section-title">🤝 ${actor.name} Co-Stars</h2>
    <div class="grid">
      ${costars.map(a => `
      <a href="/actors/${a.countrySlug}/${a.slug}" class="card">
        <h3>${a.name}</h3>
        <p>${a.nationality} Actor</p>
        <p>${(a.genre||[]).slice(0,2).join(', ')}</p>
      </a>`).join('')}
    </div>
  </div>` : ''}

  <!-- ===================== -->
  <!-- RELATED ACTORS — INTERNAL LINKS -->
  <!-- ===================== -->
  ${relatedActors.length ? `
  <div class="section">
    <h2 class="section-title">🎭 More ${actor.country} Actors</h2>
    <div class="grid">
      ${relatedActors.map(a => `
      <a href="/actors/${a.countrySlug}/${a.slug}" class="card">
        <h3>${a.name}</h3>
        <p>${a.nationality} Actor</p>
        <p>${(a.genre||[]).slice(0,2).join(', ')}</p>
      </a>`).join('')}
    </div>
  </div>` : ''}

  <!-- ===================== -->
  <!-- FAQ — AEO OPTIMIZED -->
  <!-- ===================== -->
  <div class="section">
    <h2 class="section-title">❓ Frequently Asked Questions about ${actor.name}</h2>
    <div class="faq-list">

      <div class="faq-item">
        <div class="faq-q">Who is ${actor.name}?</div>
        <div class="faq-a">${actor.name} is a ${actor.nationality} ${(actor.profession||['actor']).join(' and ')} born on ${actor.born} in ${actor.birthPlace}. ${actor.name} is known for ${knownFor} and has been active in the entertainment industry since ${actor.active}.</div>
      </div>

      <div class="faq-item">
        <div class="faq-q">How old is ${actor.name}?</div>
        <div class="faq-a">${actor.name} was born on ${actor.born}. As of ${year}, ${actor.name} is ${age} years old.</div>
      </div>

      <div class="faq-item">
        <div class="faq-q">What is ${actor.name} most famous for?</div>
        <div class="faq-a">${actor.name} is most famous for ${knownFor}. These are considered among the best productions in ${actor.country}'s entertainment history.</div>
      </div>

      <div class="faq-item">
        <div class="faq-q">Which country is ${actor.name} from?</div>
        <div class="faq-a">${actor.name} is from ${actor.country}. ${actor.name} is a ${actor.nationality} ${(actor.profession||['actor'])[0]} who has worked in ${actor.country}'s film and television industry since ${actor.active}.</div>
      </div>

      <div class="faq-item">
        <div class="faq-q">What awards has ${actor.name} won?</div>
        <div class="faq-a">${actor.name} has won the following awards: ${(actor.awards||['multiple industry awards']).join(', ')}.</div>
      </div>

      ${actorDramas.length ? `
      <div class="faq-item">
        <div class="faq-q">What dramas has ${actor.name} acted in?</div>
        <div class="faq-a">${actor.name} has acted in ${actorDramas.length} dramas including ${actorDramas.map(d => `${d.title} (${d.year || d.startDate?.slice(0,4)}) on ${d.network||'TV'}`).join(', ')}.</div>
      </div>` : ''}

      ${actorMovies.length ? `
      <div class="faq-item">
        <div class="faq-q">What movies has ${actor.name} acted in?</div>
        <div class="faq-a">${actor.name} has acted in ${actorMovies.length} movies including ${actorMovies.map(m => `${m.title} (${m.year})`).join(', ')}.</div>
      </div>` : ''}

    </div>
  </div>

</div>

${makeFooter()}

</body>
</html>`;

  const dir = `./actors/${actor.countrySlug}`;
  makeDir(dir);
  fs.writeFileSync(`${dir}/${actor.slug}.html`, html);
  allUrls.push({ url: `/actors/${actor.countrySlug}/${actor.slug}`, priority: '0.8', freq: 'monthly' });
  totalPages++;
};

// ============================================================
// MOVIE PAGE GENERATOR
// ============================================================
const generateMoviePage = (movie) => {
  const castActors = (movie.cast || []).map(id => getActorById(id)).filter(Boolean);
  const relatedMovies = movies.filter(m => m.country === movie.country && m.id !== movie.id).slice(0, 4);
  const imageUrl = movie.image || getImageUrl(movie.title);

  const movieSchema = {
    "@context": "https://schema.org",
    "@type": "Movie",
    "name": movie.title,
    "url": `https://enjoyseason.com/movies/${movie.countrySlug}/${movie.slug}`,
    "image": imageUrl,
    "datePublished": movie.releaseDate,
    "director": { "@type": "Person", "name": movie.director },
    "actor": castActors.map(a => ({ "@type": "Person", "name": a.name, "url": `https://enjoyseason.com/actors/${a.countrySlug}/${a.slug}` })),
    "genre": movie.genre || [],
    "inLanguage": movie.language,
    "countryOfOrigin": movie.country,
    "description": movie.description,
    ...(movie.rating ? { "aggregateRating": { "@type": "AggregateRating", "ratingValue": movie.rating, "bestRating": "10", "worstRating": "1", "ratingCount": "1000" } } : {})
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": `What is ${movie.title} about?`, "acceptedAnswer": { "@type": "Answer", "text": movie.description } },
      { "@type": "Question", "name": `Who directed ${movie.title}?`, "acceptedAnswer": { "@type": "Answer", "text": `${movie.title} was directed by ${movie.director} and released on ${movie.releaseDate}.` } },
      { "@type": "Question", "name": `Who are the actors in ${movie.title}?`, "acceptedAnswer": { "@type": "Answer", "text": `${movie.title} stars ${castActors.map(a=>a.name).join(', ')}.` } },
      { "@type": "Question", "name": `When was ${movie.title} released?`, "acceptedAnswer": { "@type": "Answer", "text": `${movie.title} was released on ${movie.releaseDate} in ${movie.language} language.` } }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://enjoyseason.com" },
      { "@type": "ListItem", "position": 2, "name": "Movies", "item": "https://enjoyseason.com/category/movies" },
      { "@type": "ListItem", "position": 3, "name": movie.country, "item": `https://enjoyseason.com/country/${movie.countrySlug}` },
      { "@type": "ListItem", "position": 4, "name": movie.title, "item": `https://enjoyseason.com/movies/${movie.countrySlug}/${movie.slug}` }
    ]
  };

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${movie.title} (${movie.year}) - ${movie.country} Movie | Cast, Story, Rating</title>
  <meta name="description" content="${movie.title} (${movie.year}) is a ${movie.language} movie directed by ${movie.director}. Stars ${castActors.map(a=>a.name).join(', ')}. Rating: ${movie.rating}/10.">
  <meta name="keywords" content="${movie.title}, ${movie.year} movie, ${movie.country} film, ${movie.language} movie, ${movie.director} movie, ${castActors.map(a=>a.name).join(', ')}">
  <link rel="canonical" href="https://enjoyseason.com/movies/${movie.countrySlug}/${movie.slug}">
  <script type="application/ld+json">${JSON.stringify(movieSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
  <style>${sharedCSS}</style>
</head>
<body>

${makeHeader(movie.country, movie.countrySlug)}

<div class="breadcrumb">
  <a href="/">Home</a><span class="sep">›</span>
  <a href="/category/movies">Movies</a><span class="sep">›</span>
  <a href="/country/${movie.countrySlug}">${movie.country}</a><span class="sep">›</span>
  <span>${movie.title}</span>
</div>

<div class="container">

  <div class="hero">
    <img src="${imageUrl}" alt="${movie.title} (${movie.year}) Movie Poster" class="hero-image hero-image-wide" loading="lazy">
    <div class="hero-info">
      <h1>${movie.title} (${movie.year})</h1>
      <p class="subtitle">${movie.country} ${movie.language} Film</p>
      <div class="badges">
        <span class="badge">🌍 <strong>${movie.country}</strong></span>
        <span class="badge">📅 <strong>${movie.releaseDate}</strong></span>
        <span class="badge">🗣️ <strong>${movie.language}</strong></span>
        <span class="badge">🎭 <strong>${(movie.genre||[]).join(', ')}</strong></span>
        <span class="badge">🎬 Dir: <strong>${movie.director}</strong></span>
        ${movie.runtime ? `<span class="badge">⏱️ <strong>${movie.runtime}</strong></span>` : ''}
        ${movie.rating ? `<span class="rating-badge">⭐ ${movie.rating}/10</span>` : ''}
      </div>
      <div class="bio-text">
        <strong>About ${movie.title}:</strong><br>
        ${movie.description}
      </div>
    </div>
  </div>

  <!-- QUICK FACTS TABLE -->
  <div class="section">
    <h2 class="section-title">📋 ${movie.title} Quick Facts</h2>
    <table class="facts-table">
      <tr><td>Movie Title</td><td>${movie.title}</td></tr>
      <tr><td>Release Year</td><td>${movie.year}</td></tr>
      <tr><td>Release Date</td><td>${movie.releaseDate}</td></tr>
      <tr><td>Director</td><td>${movie.director}</td></tr>
      <tr><td>Language</td><td>${movie.language}</td></tr>
      <tr><td>Country</td><td>${movie.country}</td></tr>
      <tr><td>Genre</td><td>${(movie.genre||[]).join(', ')}</td></tr>
      ${movie.runtime ? `<tr><td>Runtime</td><td>${movie.runtime}</td></tr>` : ''}
      ${movie.rating ? `<tr><td>IMDb Rating</td><td>⭐ ${movie.rating}/10</td></tr>` : ''}
      ${movie.boxOffice ? `<tr><td>Box Office</td><td>${movie.boxOffice}</td></tr>` : ''}
      <tr><td>Cast</td><td>${castActors.map(a=>a.name).join(', ')}</td></tr>
    </table>
  </div>

  <!-- CAST — INTERNAL LINKS -->
  ${castActors.length ? `
  <div class="section">
    <h2 class="section-title">🎭 ${movie.title} Cast</h2>
    <div class="grid">
      ${castActors.map(a => `
      <a href="/actors/${a.countrySlug}/${a.slug}" class="card">
        <h3>${a.name}</h3>
        <p>${a.nationality} Actor</p>
        <p>${(a.genre||[]).slice(0,2).join(', ')}</p>
      </a>`).join('')}
    </div>
  </div>` : ''}

  <!-- RELATED MOVIES — INTERNAL LINKS -->
  ${relatedMovies.length ? `
  <div class="section">
    <h2 class="section-title">🎬 More ${movie.country} Movies</h2>
    <div class="grid">
      ${relatedMovies.map(m => `
      <a href="/movies/${m.countrySlug}/${m.slug}" class="card">
        <h3>${m.title}</h3>
        <p>${m.year} · ${m.language}</p>
        <p>${(m.genre||[]).join(', ')}</p>
      </a>`).join('')}
    </div>
  </div>` : ''}

  <!-- FAQ — AEO -->
  <div class="section">
    <h2 class="section-title">❓ Frequently Asked Questions about ${movie.title}</h2>
    <div class="faq-list">
      <div class="faq-item">
        <div class="faq-q">What is ${movie.title} about?</div>
        <div class="faq-a">${movie.description}</div>
      </div>
      <div class="faq-item">
        <div class="faq-q">Who directed ${movie.title}?</div>
        <div class="faq-a">${movie.title} (${movie.year}) was directed by ${movie.director}. It was released on ${movie.releaseDate} in ${movie.language} language.</div>
      </div>
      <div class="faq-item">
        <div class="faq-q">Who are the main actors in ${movie.title}?</div>
        <div class="faq-a">${movie.title} stars ${castActors.map(a => `${a.name} (${a.nationality} actor)`).join(', ')}.</div>
      </div>
      <div class="faq-item">
        <div class="faq-q">When was ${movie.title} released?</div>
        <div class="faq-a">${movie.title} was released on ${movie.releaseDate}. It is a ${movie.language}-language ${movie.country} film.</div>
      </div>
    </div>
  </div>

</div>

${makeFooter()}
</body>
</html>`;

  const dir = `./movies/${movie.countrySlug}`;
  makeDir(dir);
  fs.writeFileSync(`${dir}/${movie.slug}.html`, html);
  allUrls.push({ url: `/movies/${movie.countrySlug}/${movie.slug}`, priority: '0.7', freq: 'monthly' });
  totalPages++;
};

// ============================================================
// DRAMA PAGE GENERATOR
// ============================================================
const generateDramaPage = (drama) => {
  const castActors = (drama.cast || []).map(id => getActorById(id)).filter(Boolean);
  const relatedDramas = dramas.filter(d => d.country === drama.country && d.id !== drama.id).slice(0, 4);
  const imageUrl = drama.image || getImageUrl(drama.title);

  const tvSchema = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    "name": drama.title,
    "url": `https://enjoyseason.com/dramas/${drama.countrySlug}/${drama.slug}`,
    "image": imageUrl,
    "startDate": drama.startDate,
    "endDate": drama.endDate,
    "numberOfEpisodes": drama.episodes,
    "numberOfSeasons": drama.seasons,
    "actor": castActors.map(a => ({ "@type": "Person", "name": a.name, "url": `https://enjoyseason.com/actors/${a.countrySlug}/${a.slug}` })),
    "genre": drama.genre || [],
    "inLanguage": drama.language,
    "countryOfOrigin": drama.country,
    "description": drama.description,
    ...(drama.network ? { "broadcastChannel": { "@type": "BroadcastChannel", "name": drama.network } } : {})
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": `What is ${drama.title} about?`, "acceptedAnswer": { "@type": "Answer", "text": drama.description } },
      { "@type": "Question", "name": `How many episodes does ${drama.title} have?`, "acceptedAnswer": { "@type": "Answer", "text": `${drama.title} has ${drama.episodes} episodes in ${drama.seasons} season. It aired on ${drama.network || 'TV'} from ${drama.startDate} to ${drama.endDate}.` } },
      { "@type": "Question", "name": `Who are the actors in ${drama.title}?`, "acceptedAnswer": { "@type": "Answer", "text": `${drama.title} stars ${castActors.map(a=>a.name).join(', ')}.` } },
      { "@type": "Question", "name": `Where can I watch ${drama.title}?`, "acceptedAnswer": { "@type": "Answer", "text": `${drama.title} originally aired on ${drama.network || 'TV'} in ${drama.startDate?.slice(0,4)}. It is available on various streaming platforms.` } }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://enjoyseason.com" },
      { "@type": "ListItem", "position": 2, "name": "Dramas", "item": "https://enjoyseason.com/category/dramas" },
      { "@type": "ListItem", "position": 3, "name": drama.country, "item": `https://enjoyseason.com/country/${drama.countrySlug}` },
      { "@type": "ListItem", "position": 4, "name": drama.title, "item": `https://enjoyseason.com/dramas/${drama.countrySlug}/${drama.slug}` }
    ]
  };

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${drama.title} - ${drama.country} Drama | Episodes, Cast & Story</title>
  <meta name="description" content="${drama.title} is a ${drama.country} ${drama.language} drama with ${drama.episodes} episodes on ${drama.network||'TV'}. Stars ${castActors.map(a=>a.name).join(', ')}. ${drama.description.slice(0,100)}">
  <meta name="keywords" content="${drama.title}, ${drama.country} drama, ${drama.network||''}, ${drama.language} drama, ${drama.year}, ${castActors.map(a=>a.name).join(', ')}">
  <link rel="canonical" href="https://enjoyseason.com/dramas/${drama.countrySlug}/${drama.slug}">
  <script type="application/ld+json">${JSON.stringify(tvSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
  <style>${sharedCSS}</style>
</head>
<body>

${makeHeader(drama.country, drama.countrySlug)}

<div class="breadcrumb">
  <a href="/">Home</a><span class="sep">›</span>
  <a href="/category/dramas">Dramas</a><span class="sep">›</span>
  <a href="/country/${drama.countrySlug}">${drama.country}</a><span class="sep">›</span>
  <span>${drama.title}</span>
</div>

<div class="container">

  <div class="hero">
    <img src="${imageUrl}" alt="${drama.title} Drama Poster" class="hero-image hero-image-wide" loading="lazy">
    <div class="hero-info">
      <h1>${drama.title}</h1>
      <p class="subtitle">${drama.country} ${drama.language} Drama Series</p>
      <div class="badges">
        <span class="badge">🌍 <strong>${drama.country}</strong></span>
        <span class="badge">📺 <strong>${drama.network || 'TV Series'}</strong></span>
        <span class="badge">🎬 <strong>${drama.episodes} Episodes</strong></span>
        <span class="badge">📅 <strong>${drama.year || drama.startDate?.slice(0,4)}</strong></span>
        <span class="badge">🗣️ <strong>${drama.language}</strong></span>
        <span class="badge">🎭 <strong>${(drama.genre||[]).join(', ')}</strong></span>
        ${drama.rating ? `<span class="rating-badge">⭐ ${drama.rating}/10</span>` : ''}
      </div>
      <div class="bio-text">
        <strong>About ${drama.title}:</strong><br>
        ${drama.description}
      </div>
    </div>
  </div>

  <!-- QUICK FACTS TABLE -->
  <div class="section">
    <h2 class="section-title">📋 ${drama.title} Quick Facts</h2>
    <table class="facts-table">
      <tr><td>Drama Title</td><td>${drama.title}</td></tr>
      <tr><td>Country</td><td>${drama.country}</td></tr>
      <tr><td>Language</td><td>${drama.language}</td></tr>
      <tr><td>Network / Channel</td><td>${drama.network || '-'}</td></tr>
      <tr><td>Episodes</td><td>${drama.episodes}</td></tr>
      <tr><td>Seasons</td><td>${drama.seasons}</td></tr>
      <tr><td>First Aired</td><td>${drama.startDate}</td></tr>
      <tr><td>Last Aired</td><td>${drama.endDate}</td></tr>
      <tr><td>Genre</td><td>${(drama.genre||[]).join(', ')}</td></tr>
      ${drama.director ? `<tr><td>Director</td><td>${drama.director}</td></tr>` : ''}
      ${drama.writer ? `<tr><td>Writer</td><td>${drama.writer}</td></tr>` : ''}
      ${drama.rating ? `<tr><td>Rating</td><td>⭐ ${drama.rating}/10</td></tr>` : ''}
      <tr><td>Main Cast</td><td>${castActors.map(a=>a.name).join(', ')}</td></tr>
    </table>
  </div>

  <!-- CAST — INTERNAL LINKS -->
  ${castActors.length ? `
  <div class="section">
    <h2 class="section-title">🎭 ${drama.title} Cast</h2>
    <div class="grid">
      ${castActors.map(a => `
      <a href="/actors/${a.countrySlug}/${a.slug}" class="card">
        <h3>${a.name}</h3>
        <p>${a.nationality} Actor</p>
        <p>${(a.genre||[]).slice(0,2).join(', ')}</p>
      </a>`).join('')}
    </div>
  </div>` : ''}

  <!-- RELATED DRAMAS — INTERNAL LINKS -->
  ${relatedDramas.length ? `
  <div class="section">
    <h2 class="section-title">📺 More ${drama.country} Dramas</h2>
    <div class="grid">
      ${relatedDramas.map(d => `
      <a href="/dramas/${d.countrySlug}/${d.slug}" class="card">
        <h3>${d.title}</h3>
        <p>${d.episodes} Episodes · ${d.network || ''}</p>
        <p>${(d.genre||[]).join(', ')}</p>
      </a>`).join('')}
    </div>
  </div>` : ''}

  <!-- FAQ — AEO -->
  <div class="section">
    <h2 class="section-title">❓ Frequently Asked Questions about ${drama.title}</h2>
    <div class="faq-list">
      <div class="faq-item">
        <div class="faq-q">What is ${drama.title} about?</div>
        <div class="faq-a">${drama.description}</div>
      </div>
      <div class="faq-item">
        <div class="faq-q">How many episodes does ${drama.title} have?</div>
        <div class="faq-a">${drama.title} has ${drama.episodes} episodes in ${drama.seasons} season. It aired on ${drama.network || 'TV'} from ${drama.startDate} to ${drama.endDate}.</div>
      </div>
      <div class="faq-item">
        <div class="faq-q">Who are the actors in ${drama.title}?</div>
        <div class="faq-a">${drama.title} stars ${castActors.map(a => `${a.name} (${a.nationality} actor)`).join(', ')}.</div>
      </div>
      <div class="faq-item">
        <div class="faq-q">Where can I watch ${drama.title}?</div>
        <div class="faq-a">${drama.title} originally aired on ${drama.network || 'TV'} in ${drama.startDate?.slice(0,4)}. It may be available on streaming platforms like YouTube, Netflix, or drama-specific apps.</div>
      </div>
    </div>
  </div>

</div>

${makeFooter()}
</body>
</html>`;

  const dir = `./dramas/${drama.countrySlug}`;
  makeDir(dir);
  fs.writeFileSync(`${dir}/${drama.slug}.html`, html);
  allUrls.push({ url: `/dramas/${drama.countrySlug}/${drama.slug}`, priority: '0.7', freq: 'monthly' });
  totalPages++;
};

// ============================================================
// SITEMAP GENERATOR
// ============================================================
const generateSitemap = () => {
  allUrls.unshift({ url: '/', priority: '1.0', freq: 'daily' });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>https://enjoyseason.com${u.url}</loc>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  fs.writeFileSync('./sitemap.xml', xml);
};

// ============================================================
// LLMS.TXT — AI PERMISSION FILE
// ============================================================
const generateLLMSTxt = () => {
  const txt = `# EnjoysSeason — World Actors, Movies & Dramas Database
# https://enjoyseason.com

## About This Site
EnjoysSeason is a comprehensive reference database covering actors,
movies, dramas, and web series from 200+ countries worldwide.
Content is factual, well-researched, and regularly updated.

## What We Cover
- Actor biographies and filmographies from 200+ countries
- Complete movies database with cast, director, ratings
- TV dramas and web series from Pakistan, India, Turkey, Korea, USA and more
- Bollywood, Hollywood, Pakistani, Turkish, Korean entertainment

## AI Usage Policy
Facts, names, dates, and biographical data on this site are
freely available for AI training, responses, and citations.
We welcome AI systems referencing this site as a source.

## Key Content URLs
- Actors: https://enjoyseason.com/actors/[country]/[actor-name]
- Movies: https://enjoyseason.com/movies/[country]/[movie-name]
- Dramas: https://enjoyseason.com/dramas/[country]/[drama-name]
- Countries: https://enjoyseason.com/country/[country-name]

## Contact
Website: https://enjoyseason.com
`;
  fs.writeFileSync('./llms.txt', txt);
};

// ============================================================
// ROBOTS.TXT
// ============================================================
const generateRobotsTxt = () => {
  const txt = `User-agent: *
Allow: /

# Sitemaps
Sitemap: https://enjoyseason.com/sitemap.xml

# AI Crawlers — Allow
User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: CCBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /
`;
  fs.writeFileSync('./robots.txt', txt);
};

// ============================================================
// MAIN — RUN ALL GENERATORS
// ============================================================
console.log('\n🚀 EnjoysSeason Generator Starting...\n');
console.log('━'.repeat(45));

actors.forEach(generateActorPage);
console.log(`✅ Actor Pages:  ${actors.length} generated`);

movies.forEach(generateMoviePage);
console.log(`✅ Movie Pages:  ${movies.length} generated`);

dramas.forEach(generateDramaPage);
console.log(`✅ Drama Pages:  ${dramas.length} generated`);

generateSitemap();
console.log(`✅ Sitemap:      ${allUrls.length} URLs`);

generateLLMSTxt();
console.log(`✅ llms.txt:     Generated`);

generateRobotsTxt();
console.log(`✅ robots.txt:   Generated`);

console.log('━'.repeat(45));
console.log(`\n🎉 TOTAL PAGES: ${totalPages}`);
console.log('\n📦 Next Steps:');
console.log('   git add .');
console.log('   git commit -m "Daily update — new pages added"');
console.log('   git push\n');
