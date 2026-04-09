// ============================================================
// EnjoysSeason V2 — Complete Generator
// Mega Header + Expanded Content + All Categories
// ============================================================

const fs = require('fs');

const actors = JSON.parse(fs.readFileSync('./data/actors.json', 'utf8'));
const movies = JSON.parse(fs.readFileSync('./data/movies.json', 'utf8'));
const dramas = JSON.parse(fs.readFileSync('./data/dramas.json', 'utf8'));

let totalPages = 0;
const allUrls = [];

const makeDir = (d) => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); };
const getActorById = (id) => actors.find(a => a.id === id);
const getMovieById = (id) => movies.find(m => m.id === id);
const getDramaById = (id) => dramas.find(d => d.id === id);
const getAge = (born) => new Date().getFullYear() - new Date(born).getFullYear();
const getYear = () => new Date().getFullYear();
const getActorsByCountry = (country, excludeId) =>
  actors.filter(a => a.country === country && a.id !== excludeId).slice(0, 6);
const getImageUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=400&background=0f172a&color=f59e0b&bold=true&format=svg`;

// ============================================================
// MEGA HEADER — With Dropdowns
// ============================================================
const megaHeader = `
<header class="site-header">
  <div class="header-inner">

    <a href="/" class="logo">
      <span class="logo-icon">🎬</span>
      <span class="logo-text">EnjoysSeason</span>
    </a>

    <nav class="main-nav">

      <!-- Countries Dropdown -->
      <div class="nav-item dropdown">
        <button class="nav-btn">🌍 Countries <span class="arrow">▾</span></button>
        <div class="dropdown-menu mega-menu">
          <div class="mega-col">
            <h4>🌏 Asia</h4>
            <a href="/country/pakistan">🇵🇰 Pakistan</a>
            <a href="/country/india">🇮🇳 India</a>
            <a href="/country/turkey">🇹🇷 Turkey</a>
            <a href="/country/south-korea">🇰🇷 South Korea</a>
            <a href="/country/japan">🇯🇵 Japan</a>
            <a href="/country/china">🇨🇳 China</a>
            <a href="/country/bangladesh">🇧🇩 Bangladesh</a>
            <a href="/country/iran">🇮🇷 Iran</a>
          </div>
          <div class="mega-col">
            <h4>🌎 West</h4>
            <a href="/country/usa">🇺🇸 USA</a>
            <a href="/country/uk">🇬🇧 UK</a>
            <a href="/country/canada">🇨🇦 Canada</a>
            <a href="/country/australia">🇦🇺 Australia</a>
            <a href="/country/france">🇫🇷 France</a>
            <a href="/country/germany">🇩🇪 Germany</a>
            <a href="/country/spain">🇪🇸 Spain</a>
            <a href="/country/italy">🇮🇹 Italy</a>
          </div>
          <div class="mega-col">
            <h4>🌍 Middle East & Africa</h4>
            <a href="/country/saudi-arabia">🇸🇦 Saudi Arabia</a>
            <a href="/country/egypt">🇪🇬 Egypt</a>
            <a href="/country/uae">🇦🇪 UAE</a>
            <a href="/country/nigeria">🇳🇬 Nigeria</a>
            <a href="/country/south-africa">🇿🇦 South Africa</a>
          </div>
          <div class="mega-col">
            <h4>🌎 Latin America</h4>
            <a href="/country/brazil">🇧🇷 Brazil</a>
            <a href="/country/mexico">🇲🇽 Mexico</a>
            <a href="/country/argentina">🇦🇷 Argentina</a>
            <a href="/country/colombia">🇨🇴 Colombia</a>
            <a href="/country/all">🌐 All 200 Countries →</a>
          </div>
        </div>
      </div>

      <!-- Categories Dropdown -->
      <div class="nav-item dropdown">
        <button class="nav-btn">🎭 Categories <span class="arrow">▾</span></button>
        <div class="dropdown-menu">
          <div class="drop-col">
            <h4>👤 People</h4>
            <a href="/category/actors">🎭 Actors</a>
            <a href="/category/actresses">👩 Actresses</a>
            <a href="/category/directors">🎬 Directors</a>
            <a href="/category/singers">🎵 Singers</a>
          </div>
          <div class="drop-col">
            <h4>🎬 Content</h4>
            <a href="/category/movies">🎬 Movies</a>
            <a href="/category/dramas">📺 Dramas</a>
            <a href="/category/web-series">💻 Web Series</a>
            <a href="/category/anime">🎌 Anime</a>
            <a href="/category/documentaries">📽️ Documentaries</a>
          </div>
        </div>
      </div>

      <!-- By Industry Dropdown -->
      <div class="nav-item dropdown">
        <button class="nav-btn">🏭 Industry <span class="arrow">▾</span></button>
        <div class="dropdown-menu">
          <div class="drop-col">
            <h4>🎬 Film Industry</h4>
            <a href="/industry/bollywood">🇮🇳 Bollywood</a>
            <a href="/industry/hollywood">🇺🇸 Hollywood</a>
            <a href="/industry/lollywood">🇵🇰 Lollywood</a>
            <a href="/industry/tollywood">🎬 Tollywood</a>
            <a href="/industry/korean">🇰🇷 K-Drama</a>
            <a href="/industry/turkish">🇹🇷 Turkish</a>
            <a href="/industry/anime">🎌 Anime</a>
          </div>
          <div class="drop-col">
            <h4>📺 Platforms</h4>
            <a href="/platform/netflix">🔴 Netflix</a>
            <a href="/platform/amazon-prime">📦 Amazon Prime</a>
            <a href="/platform/disney-plus">✨ Disney+</a>
            <a href="/platform/hum-tv">📺 Hum TV</a>
            <a href="/platform/ary-digital">📺 ARY Digital</a>
            <a href="/platform/geo-tv">📺 Geo TV</a>
            <a href="/platform/youtube">▶️ YouTube</a>
          </div>
        </div>
      </div>

      <!-- Search -->
      <div class="nav-search">
        <input type="text" placeholder="🔍 Search actors, movies, dramas..." class="search-input" id="searchInput">
        <button class="search-btn">Search</button>
      </div>

    </nav>

    <!-- Mobile Menu Button -->
    <button class="mobile-menu-btn" onclick="toggleMobile()">☰</button>

  </div>

  <!-- Mobile Nav -->
  <div class="mobile-nav" id="mobileNav">
    <a href="/country/pakistan">🇵🇰 Pakistan</a>
    <a href="/country/india">🇮🇳 India</a>
    <a href="/country/usa">🇺🇸 USA</a>
    <a href="/category/actors">🎭 Actors</a>
    <a href="/category/movies">🎬 Movies</a>
    <a href="/category/dramas">📺 Dramas</a>
    <a href="/category/web-series">💻 Web Series</a>
    <a href="/category/anime">🎌 Anime</a>
    <a href="/industry/bollywood">🇮🇳 Bollywood</a>
    <a href="/industry/hollywood">🇺🇸 Hollywood</a>
  </div>
</header>`;

// ============================================================
// FOOTER
// ============================================================
const siteFooter = `
<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-grid">

      <div class="footer-col">
        <h3>🎬 EnjoysSeason</h3>
        <p>World's complete entertainment database. Actors, movies, dramas, web series and anime from 200+ countries.</p>
      </div>

      <div class="footer-col">
        <h4>🌍 Popular Countries</h4>
        <a href="/country/pakistan">Pakistan</a>
        <a href="/country/india">India</a>
        <a href="/country/usa">USA</a>
        <a href="/country/turkey">Turkey</a>
        <a href="/country/south-korea">South Korea</a>
        <a href="/country/japan">Japan</a>
      </div>

      <div class="footer-col">
        <h4>🎭 Categories</h4>
        <a href="/category/actors">Actors</a>
        <a href="/category/movies">Movies</a>
        <a href="/category/dramas">Dramas</a>
        <a href="/category/web-series">Web Series</a>
        <a href="/category/anime">Anime</a>
        <a href="/industry/bollywood">Bollywood</a>
      </div>

      <div class="footer-col">
        <h4>📋 Pages</h4>
        <a href="/about">About Us</a>
        <a href="/contact">Contact</a>
        <a href="/privacy-policy">Privacy Policy</a>
        <a href="/disclaimer">Disclaimer</a>
        <a href="/sitemap.xml">Sitemap</a>
      </div>

    </div>
    <div class="footer-bottom">
      <p>© ${getYear()} EnjoysSeason — World Actors, Movies, Dramas & Web Series Database</p>
    </div>
  </div>
</footer>`;

// ============================================================
// COMPLETE CSS
// ============================================================
const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Sans+3:wght@300;400;600&display=swap');

*{margin:0;padding:0;box-sizing:border-box}
:root{
  --bg:#0a0f1e;
  --bg2:#0f172a;
  --card:#1e293b;
  --card2:#162032;
  --gold:#f59e0b;
  --gold2:#d97706;
  --red:#ef4444;
  --green:#22c55e;
  --blue:#3b82f6;
  --text:#f1f5f9;
  --muted:#94a3b8;
  --border:#1e3a5f;
  --header:#080d1a;
}

body{
  background:var(--bg);
  color:var(--text);
  font-family:'Source Sans 3',sans-serif;
  line-height:1.8;
  font-size:16px;
}

a{color:var(--gold);text-decoration:none}
a:hover{text-decoration:underline}

/* ============================
   HEADER
============================ */
.site-header{
  background:var(--header);
  border-bottom:2px solid var(--gold);
  position:sticky;
  top:0;
  z-index:1000;
  box-shadow:0 4px 20px rgba(0,0,0,.5);
}

.header-inner{
  max-width:1400px;
  margin:0 auto;
  padding:.8rem 1.5rem;
  display:flex;
  align-items:center;
  gap:1.5rem;
}

.logo{
  display:flex;
  align-items:center;
  gap:.5rem;
  text-decoration:none;
  flex-shrink:0;
}
.logo-icon{font-size:1.6rem}
.logo-text{
  font-family:'Playfair Display',serif;
  font-size:1.4rem;
  color:var(--gold);
  font-weight:900;
  letter-spacing:-.5px;
}

.main-nav{
  display:flex;
  align-items:center;
  gap:.3rem;
  flex:1;
}

/* Dropdown */
.nav-item{position:relative}
.nav-btn{
  background:transparent;
  border:1px solid transparent;
  color:var(--text);
  padding:.45rem .9rem;
  border-radius:8px;
  cursor:pointer;
  font-size:.88rem;
  font-family:'Source Sans 3',sans-serif;
  transition:all .2s;
  white-space:nowrap;
}
.nav-btn:hover{
  border-color:var(--gold);
  color:var(--gold);
  background:rgba(245,158,11,.08);
}
.arrow{font-size:.65rem;margin-left:.2rem}

.dropdown-menu{
  display:none;
  position:absolute;
  top:calc(100% + 8px);
  left:0;
  background:var(--card);
  border:1px solid var(--border);
  border-radius:12px;
  padding:1.2rem;
  min-width:220px;
  box-shadow:0 20px 60px rgba(0,0,0,.6);
  z-index:999;
  animation:fadeDown .2s ease;
}

.mega-menu{
  display:none;
  left:-100px;
  min-width:700px;
  flex-direction:row;
  gap:1.5rem;
}

.nav-item:hover .dropdown-menu{display:flex;flex-direction:column}
.nav-item:hover .mega-menu{display:flex;flex-direction:row}

.mega-col,.drop-col{flex:1;min-width:140px}
.dropdown-menu h4{
  color:var(--gold);
  font-size:.78rem;
  text-transform:uppercase;
  letter-spacing:1px;
  margin-bottom:.6rem;
  padding-bottom:.4rem;
  border-bottom:1px solid var(--border);
}
.dropdown-menu a{
  display:block;
  color:var(--muted);
  padding:.25rem 0;
  font-size:.85rem;
  transition:color .15s;
}
.dropdown-menu a:hover{color:var(--gold);text-decoration:none}

@keyframes fadeDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}

/* Search */
.nav-search{display:flex;gap:.4rem;margin-left:auto}
.search-input{
  background:var(--card);
  border:1px solid var(--border);
  color:var(--text);
  padding:.4rem .9rem;
  border-radius:8px;
  font-size:.85rem;
  width:260px;
  font-family:'Source Sans 3',sans-serif;
  transition:border-color .2s;
}
.search-input:focus{outline:none;border-color:var(--gold)}
.search-input::placeholder{color:var(--muted)}
.search-btn{
  background:var(--gold);
  color:#000;
  border:none;
  padding:.4rem .9rem;
  border-radius:8px;
  cursor:pointer;
  font-weight:600;
  font-size:.85rem;
  transition:background .2s;
}
.search-btn:hover{background:var(--gold2)}

/* Mobile */
.mobile-menu-btn{
  display:none;
  background:transparent;
  border:1px solid var(--border);
  color:var(--text);
  padding:.4rem .7rem;
  border-radius:6px;
  cursor:pointer;
  font-size:1.1rem;
  margin-left:auto;
}
.mobile-nav{
  display:none;
  flex-direction:column;
  padding:1rem 1.5rem;
  border-top:1px solid var(--border);
  gap:.3rem;
}
.mobile-nav a{
  color:var(--muted);
  padding:.4rem 0;
  font-size:.9rem;
  border-bottom:1px solid rgba(255,255,255,.05);
}

/* ============================
   BREADCRUMB
============================ */
.breadcrumb{
  background:var(--bg2);
  padding:.65rem 1.5rem;
  font-size:.82rem;
  border-bottom:1px solid var(--border);
  max-width:100%;
}
.breadcrumb-inner{max-width:1200px;margin:0 auto}
.breadcrumb a{color:var(--gold)}
.breadcrumb .sep{color:var(--muted);margin:0 .4rem}

/* ============================
   CONTAINER
============================ */
.container{max-width:1200px;margin:0 auto;padding:2rem 1.5rem}

/* ============================
   ACTOR HERO
============================ */
.actor-hero{
  display:grid;
  grid-template-columns:300px 1fr;
  gap:2.5rem;
  margin-bottom:3rem;
  align-items:start;
}

.actor-image-wrap{position:relative}
.actor-image{
  width:100%;
  border-radius:16px;
  border:3px solid var(--gold);
  aspect-ratio:3/4;
  object-fit:cover;
  background:var(--card);
  display:block;
}
.image-badge{
  position:absolute;
  top:12px;
  right:12px;
  background:var(--gold);
  color:#000;
  padding:.2rem .6rem;
  border-radius:20px;
  font-size:.75rem;
  font-weight:700;
}

.actor-name{
  font-family:'Playfair Display',serif;
  font-size:2.5rem;
  color:var(--gold);
  line-height:1.2;
  margin-bottom:.3rem;
}
.actor-subtitle{color:var(--muted);font-size:1rem;margin-bottom:1rem}

.badges{display:flex;flex-wrap:wrap;gap:.5rem;margin:1rem 0}
.badge{
  background:var(--card2);
  border:1px solid var(--border);
  padding:.3rem .8rem;
  border-radius:20px;
  font-size:.8rem;
  color:var(--muted);
}
.badge strong{color:var(--text)}
.badge-gold{border-color:var(--gold);color:var(--gold)}
.badge-green{border-color:var(--green);color:var(--green)}
.badge-rating{background:var(--gold);color:#000;font-weight:700}

.bio-box{
  background:var(--card2);
  border-left:4px solid var(--gold);
  border-radius:0 12px 12px 0;
  padding:1.2rem 1.4rem;
  margin:1.2rem 0;
  font-size:.97rem;
  line-height:1.95;
}
.bio-box strong{color:var(--gold);display:block;margin-bottom:.4rem}

.ext-links{display:flex;gap:.7rem;flex-wrap:wrap;margin-top:1rem}
.ext-link{
  border:1px solid var(--gold);
  color:var(--gold);
  padding:.3rem .9rem;
  border-radius:8px;
  font-size:.82rem;
  transition:all .2s;
}
.ext-link:hover{background:var(--gold);color:#000;text-decoration:none}

/* ============================
   SECTIONS
============================ */
.section{margin:3rem 0}
.section-header{
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin-bottom:1.3rem;
  padding-bottom:.7rem;
  border-bottom:2px solid var(--border);
}
.section-title{
  font-family:'Playfair Display',serif;
  font-size:1.4rem;
  color:var(--gold);
}
.section-count{
  background:var(--card);
  border:1px solid var(--border);
  color:var(--muted);
  padding:.2rem .7rem;
  border-radius:20px;
  font-size:.8rem;
}

/* ============================
   CARDS GRID
============================ */
.cards-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:1rem}
.card{
  background:var(--card);
  border:1px solid var(--border);
  border-radius:12px;
  padding:1rem;
  text-decoration:none;
  color:var(--text);
  transition:all .25s;
  display:block;
}
.card:hover{
  border-color:var(--gold);
  transform:translateY(-4px);
  box-shadow:0 8px 25px rgba(245,158,11,.15);
  text-decoration:none;
}
.card-title{font-size:.9rem;color:var(--gold);margin-bottom:.3rem;line-height:1.4;font-weight:600}
.card-meta{font-size:.77rem;color:var(--muted);line-height:1.5}

/* ============================
   TABLES
============================ */
.info-table{width:100%;border-collapse:collapse;font-size:.9rem}
.info-table td{padding:.65rem .9rem;border:1px solid var(--border)}
.info-table td:first-child{
  color:var(--muted);
  width:32%;
  background:var(--card2);
  font-weight:600;
}
.info-table td:last-child{background:var(--card);color:var(--text)}

.content-table{width:100%;border-collapse:collapse;font-size:.87rem}
.content-table th{
  background:var(--gold);
  color:#000;
  padding:.65rem .9rem;
  text-align:left;
  font-weight:700;
}
.content-table td{padding:.65rem .9rem;border:1px solid var(--border)}
.content-table tr:nth-child(even) td{background:var(--card2)}
.content-table tr:nth-child(odd) td{background:var(--card)}
.content-table a{color:var(--gold)}

/* ============================
   CAREER TIMELINE
============================ */
.timeline{position:relative;padding-left:2rem}
.timeline::before{
  content:'';
  position:absolute;
  left:.5rem;
  top:0;
  bottom:0;
  width:2px;
  background:var(--border);
}
.timeline-item{
  position:relative;
  margin-bottom:1.5rem;
  background:var(--card);
  border:1px solid var(--border);
  border-radius:10px;
  padding:1rem;
}
.timeline-item::before{
  content:'';
  position:absolute;
  left:-1.7rem;
  top:1.2rem;
  width:12px;
  height:12px;
  border-radius:50%;
  background:var(--gold);
  border:2px solid var(--bg);
}
.timeline-year{color:var(--gold);font-weight:700;font-size:.85rem;margin-bottom:.3rem}
.timeline-title{font-weight:600;margin-bottom:.2rem}
.timeline-desc{color:var(--muted);font-size:.87rem}

/* ============================
   FAQ
============================ */
.faq-list{display:flex;flex-direction:column;gap:.8rem}
.faq-item{
  background:var(--card);
  border:1px solid var(--border);
  border-radius:10px;
  overflow:hidden;
}
.faq-q{
  padding:.9rem 1.2rem;
  color:var(--gold);
  font-weight:600;
  font-size:.93rem;
  cursor:pointer;
  display:flex;
  justify-content:space-between;
}
.faq-q::after{content:'▼';font-size:.65rem;color:var(--muted);margin-top:.2rem}
.faq-a{
  padding:.8rem 1.2rem 1rem;
  color:var(--text);
  font-size:.9rem;
  line-height:1.85;
  border-top:1px solid var(--border);
}

/* ============================
   AWARDS
============================ */
.awards-grid{display:flex;flex-wrap:wrap;gap:.7rem}
.award-badge{
  background:var(--card);
  border:1px solid var(--gold);
  border-radius:8px;
  padding:.45rem 1rem;
  font-size:.83rem;
  color:var(--gold);
}

/* ============================
   STATS BAR
============================ */
.stats-bar{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:1rem;
  margin:2rem 0;
  padding:1.5rem;
  background:var(--card);
  border:1px solid var(--border);
  border-radius:14px;
}
.stat-item{text-align:center}
.stat-num{
  font-family:'Playfair Display',serif;
  font-size:1.8rem;
  color:var(--gold);
  font-weight:700;
}
.stat-label{color:var(--muted);font-size:.8rem;margin-top:.2rem}

/* ============================
   FOOTER
============================ */
.site-footer{
  background:var(--header);
  border-top:2px solid var(--border);
  margin-top:5rem;
  padding:3rem 1.5rem 1.5rem;
}
.footer-inner{max-width:1200px;margin:0 auto}
.footer-grid{
  display:grid;
  grid-template-columns:2fr 1fr 1fr 1fr;
  gap:2rem;
  margin-bottom:2rem;
}
.footer-col h3{
  font-family:'Playfair Display',serif;
  color:var(--gold);
  font-size:1.2rem;
  margin-bottom:.8rem;
}
.footer-col h4{
  color:var(--gold);
  font-size:.85rem;
  text-transform:uppercase;
  letter-spacing:1px;
  margin-bottom:.8rem;
}
.footer-col p{color:var(--muted);font-size:.88rem;line-height:1.7}
.footer-col a{
  display:block;
  color:var(--muted);
  font-size:.87rem;
  padding:.2rem 0;
  transition:color .15s;
}
.footer-col a:hover{color:var(--gold);text-decoration:none}
.footer-bottom{
  border-top:1px solid var(--border);
  padding-top:1.2rem;
  text-align:center;
  color:var(--muted);
  font-size:.83rem;
}

/* ============================
   RESPONSIVE
============================ */
@media(max-width:900px){
  .main-nav .nav-item:not(.nav-search){display:none}
  .mobile-menu-btn{display:block}
  .actor-hero{grid-template-columns:1fr}
  .actor-image{max-width:220px;margin:0 auto}
  .stats-bar{grid-template-columns:repeat(2,1fr)}
  .footer-grid{grid-template-columns:1fr 1fr}
  .cards-grid{grid-template-columns:repeat(auto-fill,minmax(140px,1fr))}
  .mega-menu{min-width:320px!important;flex-wrap:wrap}
  .nav-search{display:none}
}
@media(max-width:600px){
  .actor-name{font-size:1.8rem}
  .stats-bar{grid-template-columns:1fr 1fr}
  .footer-grid{grid-template-columns:1fr}
  .container{padding:1rem}
}
`;

// ============================================================
// JAVASCRIPT
// ============================================================
const siteJS = `
function toggleMobile(){
  const nav = document.getElementById('mobileNav');
  nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
}

// Search
document.getElementById('searchInput')?.addEventListener('keypress', function(e){
  if(e.key === 'Enter'){
    const q = this.value.trim();
    if(q) window.location.href = '/search?q=' + encodeURIComponent(q);
  }
});
`;

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
  const knownFor = [...(actor.dramas||[]).slice(0,2), ...(actor.movies||[]).slice(0,1)]
    .map(id => getDramaById(id)?.title || getMovieById(id)?.title).filter(Boolean).join(', ');

  // All Schemas
  const personSchema = {
    "@context": "https://schema.org", "@type": "Person",
    "name": actor.name, "alternateName": actor.fullName,
    "url": `https://enjoyseason.com/actors/${actor.countrySlug}/${actor.slug}`,
    "image": imageUrl, "birthDate": actor.born,
    "birthPlace": { "@type": "Place", "name": actor.birthPlace },
    "nationality": actor.nationality,
    "jobTitle": (actor.profession||["Actor"]).join(", "),
    "description": actor.bio,
    "sameAs": [actor.wikipedia, actor.imdb].filter(Boolean),
    "award": actor.awards || []
  };

  const faqSchema = {
    "@context": "https://schema.org", "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": `Who is ${actor.name}?`, "acceptedAnswer": { "@type": "Answer", "text": `${actor.name} is a ${actor.nationality} ${(actor.profession||['actor']).join(' and ')} born on ${actor.born} in ${actor.birthPlace}. Known for ${knownFor}.` }},
      { "@type": "Question", "name": `How old is ${actor.name}?`, "acceptedAnswer": { "@type": "Answer", "text": `${actor.name} was born on ${actor.born}. As of ${year}, ${actor.name} is ${age} years old.` }},
      { "@type": "Question", "name": `What is ${actor.name} famous for?`, "acceptedAnswer": { "@type": "Answer", "text": `${actor.name} is famous for ${knownFor} and has won ${(actor.awards||[]).slice(0,2).join(' and ')}.` }},
      { "@type": "Question", "name": `Which country is ${actor.name} from?`, "acceptedAnswer": { "@type": "Answer", "text": `${actor.name} is from ${actor.country}, a ${actor.nationality} ${(actor.profession||['actor'])[0]} active since ${actor.active}.` }},
      { "@type": "Question", "name": `What dramas has ${actor.name} acted in?`, "acceptedAnswer": { "@type": "Answer", "text": `${actor.name} has acted in: ${actorDramas.map(d=>`${d.title} (${d.year||d.startDate?.slice(0,4)})`).join(', ')}.` }}
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://enjoyseason.com" },
      { "@type": "ListItem", "position": 2, "name": `${actor.country} Actors`, "item": `https://enjoyseason.com/country/${actor.countrySlug}` },
      { "@type": "ListItem", "position": 3, "name": actor.name, "item": `https://enjoyseason.com/actors/${actor.countrySlug}/${actor.slug}` }
    ]
  };

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${actor.name} - ${actor.nationality} Actor | Age ${age}, Movies, Dramas & Biography | EnjoysSeason</title>
  <meta name="description" content="${actor.name} is a ${actor.nationality} actor born ${actor.born} in ${actor.birthPlace}. Age ${age}. Known for ${knownFor}. Complete biography, movies list, dramas list and awards on EnjoysSeason.">
  <meta name="keywords" content="${actor.name}, ${actor.fullName||actor.name}, ${actor.nationality} actor, ${actor.country} actor, ${knownFor}, age ${age}, biography">
  <meta property="og:title" content="${actor.name} - ${actor.nationality} Actor | EnjoysSeason">
  <meta property="og:description" content="${actor.name} born ${actor.born}. Known for ${knownFor}. Age ${age}.">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:url" content="https://enjoyseason.com/actors/${actor.countrySlug}/${actor.slug}">
  <meta property="og:type" content="profile">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="canonical" href="https://enjoyseason.com/actors/${actor.countrySlug}/${actor.slug}">
  <script type="application/ld+json">${JSON.stringify(personSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
  <style>${css}</style>
</head>
<body>

${megaHeader}

<div class="breadcrumb">
  <div class="breadcrumb-inner">
    <a href="/">Home</a><span class="sep">›</span>
    <a href="/category/actors">Actors</a><span class="sep">›</span>
    <a href="/country/${actor.countrySlug}">${actor.country}</a><span class="sep">›</span>
    <span>${actor.name}</span>
  </div>
</div>

<div class="container">

  <!-- HERO -->
  <div class="actor-hero">
    <div class="actor-image-wrap">
      <img src="${imageUrl}" alt="${actor.name} - ${actor.nationality} Actor" class="actor-image" loading="lazy">
      <span class="image-badge">${actor.nationality}</span>
    </div>
    <div class="actor-info">
      <h1 class="actor-name">${actor.name}</h1>
      <p class="actor-subtitle">${actor.nationality} ${(actor.profession||['Actor']).join(' · ')}</p>

      <div class="badges">
        <span class="badge">🌍 <strong>${actor.country}</strong></span>
        <span class="badge">🎂 <strong>${actor.born}</strong></span>
        <span class="badge">📍 <strong>${actor.birthPlace}</strong></span>
        <span class="badge badge-gold">Age: <strong>${age}</strong></span>
        <span class="badge">⏳ Since <strong>${actor.active}</strong></span>
        <span class="badge">🎭 <strong>${(actor.genre||[]).join(', ')}</strong></span>
      </div>

      <div class="bio-box">
        <strong>Who is ${actor.name}?</strong>
        ${actor.name} is a ${actor.nationality} ${(actor.profession||['actor']).join(' and ')} born on ${actor.born} in ${actor.birthPlace}. ${actor.bio}
      </div>

      <div class="ext-links">
        ${actor.imdb?`<a href="${actor.imdb}" class="ext-link" target="_blank" rel="nofollow noopener">IMDb ↗</a>`:''}
        ${actor.wikipedia?`<a href="${actor.wikipedia}" class="ext-link" target="_blank" rel="nofollow noopener">Wikipedia ↗</a>`:''}
        <a href="/country/${actor.countrySlug}" class="ext-link">More ${actor.country} Actors</a>
      </div>
    </div>
  </div>

  <!-- STATS BAR -->
  <div class="stats-bar">
    <div class="stat-item">
      <div class="stat-num">${actorMovies.length}</div>
      <div class="stat-label">Movies</div>
    </div>
    <div class="stat-item">
      <div class="stat-num">${actorDramas.length}</div>
      <div class="stat-label">Dramas</div>
    </div>
    <div class="stat-item">
      <div class="stat-num">${(actor.awards||[]).length}</div>
      <div class="stat-label">Awards</div>
    </div>
    <div class="stat-item">
      <div class="stat-num">${age}</div>
      <div class="stat-label">Age</div>
    </div>
  </div>

  <!-- QUICK FACTS -->
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">📋 ${actor.name} — Quick Facts</h2>
    </div>
    <table class="info-table">
      <tr><td>Full Name</td><td>${actor.fullName||actor.name}</td></tr>
      <tr><td>Date of Birth</td><td>${actor.born}</td></tr>
      <tr><td>Age in ${year}</td><td>${age} years old</td></tr>
      <tr><td>Birthplace</td><td>${actor.birthPlace}</td></tr>
      <tr><td>Nationality</td><td>${actor.nationality}</td></tr>
      <tr><td>Profession</td><td>${(actor.profession||['Actor']).join(', ')}</td></tr>
      <tr><td>Active Since</td><td>${actor.active}</td></tr>
      <tr><td>Genre</td><td>${(actor.genre||[]).join(', ')}</td></tr>
      ${actor.spouse?`<tr><td>Spouse</td><td>${actor.spouse}</td></tr>`:''}
      ${actor.children?`<tr><td>Children</td><td>${actor.children}</td></tr>`:''}
      ${actor.netWorth?`<tr><td>Net Worth</td><td>${actor.netWorth}</td></tr>`:''}
      <tr><td>Known For</td><td>${knownFor}</td></tr>
    </table>
  </div>

  <!-- DRAMAS TABLE -->
  ${actorDramas.length ? `
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">📺 ${actor.name} — Complete Dramas List</h2>
      <span class="section-count">${actorDramas.length} Dramas</span>
    </div>
    <table class="content-table">
      <tr><th>#</th><th>Drama Title</th><th>Year</th><th>Network</th><th>Episodes</th><th>Genre</th><th>Language</th></tr>
      ${actorDramas.map((d,i)=>`
      <tr>
        <td>${i+1}</td>
        <td><a href="/dramas/${d.countrySlug}/${d.slug}">${d.title}</a></td>
        <td>${d.year||d.startDate?.slice(0,4)||'-'}</td>
        <td>${d.network||'-'}</td>
        <td>${d.episodes||'-'}</td>
        <td>${(d.genre||[]).join(', ')}</td>
        <td>${d.language||'-'}</td>
      </tr>`).join('')}
    </table>
  </div>` : ''}

  <!-- MOVIES TABLE -->
  ${actorMovies.length ? `
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">🎬 ${actor.name} — Complete Movies List</h2>
      <span class="section-count">${actorMovies.length} Movies</span>
    </div>
    <table class="content-table">
      <tr><th>#</th><th>Movie Title</th><th>Year</th><th>Language</th><th>Genre</th><th>Rating</th><th>Box Office</th></tr>
      ${actorMovies.map((m,i)=>`
      <tr>
        <td>${i+1}</td>
        <td><a href="/movies/${m.countrySlug}/${m.slug}">${m.title}</a></td>
        <td>${m.year}</td>
        <td>${m.language}</td>
        <td>${(m.genre||[]).join(', ')}</td>
        <td>${m.rating?`⭐ ${m.rating}`:'-'}</td>
        <td>${m.boxOffice||'-'}</td>
      </tr>`).join('')}
    </table>
  </div>` : ''}

  <!-- CAREER TIMELINE -->
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">📅 ${actor.name} — Career Timeline</h2>
    </div>
    <div class="timeline">
      <div class="timeline-item">
        <div class="timeline-year">${actor.active}</div>
        <div class="timeline-title">Career Began</div>
        <div class="timeline-desc">${actor.name} started career in the entertainment industry in ${actor.active}.</div>
      </div>
      ${actorDramas.slice(0,3).map(d=>`
      <div class="timeline-item">
        <div class="timeline-year">${d.year||d.startDate?.slice(0,4)}</div>
        <div class="timeline-title">${d.title}</div>
        <div class="timeline-desc">${d.description?.slice(0,120)||'TV Drama'}...</div>
      </div>`).join('')}
      ${actorMovies.slice(0,2).map(m=>`
      <div class="timeline-item">
        <div class="timeline-year">${m.year}</div>
        <div class="timeline-title">${m.title}</div>
        <div class="timeline-desc">${m.description?.slice(0,120)||'Feature Film'}...</div>
      </div>`).join('')}
    </div>
  </div>

  <!-- AWARDS -->
  ${(actor.awards||[]).length ? `
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">🏆 ${actor.name} — Awards & Achievements</h2>
      <span class="section-count">${actor.awards.length} Awards</span>
    </div>
    <div class="awards-grid">
      ${actor.awards.map(a=>`<div class="award-badge">🥇 ${a}</div>`).join('')}
    </div>
  </div>` : ''}

  <!-- CO-STARS -->
  ${costars.length ? `
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">🤝 ${actor.name} — Co-Stars</h2>
    </div>
    <div class="cards-grid">
      ${costars.map(a=>`
      <a href="/actors/${a.countrySlug}/${a.slug}" class="card">
        <div class="card-title">${a.name}</div>
        <div class="card-meta">${a.nationality} Actor<br>${(a.genre||[]).slice(0,2).join(', ')}</div>
      </a>`).join('')}
    </div>
  </div>` : ''}

  <!-- RELATED ACTORS -->
  ${relatedActors.length ? `
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">🎭 More ${actor.country} Actors</h2>
      <a href="/country/${actor.countrySlug}" style="font-size:.85rem;color:var(--gold)">View All →</a>
    </div>
    <div class="cards-grid">
      ${relatedActors.map(a=>`
      <a href="/actors/${a.countrySlug}/${a.slug}" class="card">
        <div class="card-title">${a.name}</div>
        <div class="card-meta">${a.nationality} Actor<br>${(a.genre||[]).slice(0,2).join(', ')}</div>
      </a>`).join('')}
    </div>
  </div>` : ''}

  <!-- FAQ -->
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">❓ Frequently Asked Questions about ${actor.name}</h2>
    </div>
    <div class="faq-list">
      <div class="faq-item">
        <div class="faq-q">Who is ${actor.name}?</div>
        <div class="faq-a">${actor.name} is a ${actor.nationality} ${(actor.profession||['actor']).join(' and ')} born on ${actor.born} in ${actor.birthPlace}. ${actor.name} is known for ${knownFor} and has been active in the ${actor.country} entertainment industry since ${actor.active}.</div>
      </div>
      <div class="faq-item">
        <div class="faq-q">How old is ${actor.name} in ${year}?</div>
        <div class="faq-a">${actor.name} was born on ${actor.born}. As of ${year}, ${actor.name} is ${age} years old.</div>
      </div>
      <div class="faq-item">
        <div class="faq-q">What is ${actor.name} most famous for?</div>
        <div class="faq-a">${actor.name} is most famous for ${knownFor}. These are considered among the greatest productions in ${actor.country}'s entertainment history.</div>
      </div>
      <div class="faq-item">
        <div class="faq-q">Which country is ${actor.name} from?</div>
        <div class="faq-a">${actor.name} is from ${actor.country}. ${actor.name} is a ${actor.nationality} ${(actor.profession||['actor'])[0]} who started career in ${actor.active}.</div>
      </div>
      <div class="faq-item">
        <div class="faq-q">What awards has ${actor.name} won?</div>
        <div class="faq-a">${actor.name} has won: ${(actor.awards||['multiple industry awards']).join(', ')}.</div>
      </div>
      ${actorDramas.length?`
      <div class="faq-item">
        <div class="faq-q">What dramas has ${actor.name} acted in?</div>
        <div class="faq-a">${actor.name} has acted in ${actorDramas.length} dramas including ${actorDramas.map(d=>`${d.title} (${d.year||d.startDate?.slice(0,4)}) on ${d.network||'TV'}`).join(', ')}.</div>
      </div>`:''}
      ${actorMovies.length?`
      <div class="faq-item">
        <div class="faq-q">What movies has ${actor.name} acted in?</div>
        <div class="faq-a">${actor.name} has acted in ${actorMovies.length} movies including ${actorMovies.map(m=>`${m.title} (${m.year})`).join(', ')}.</div>
      </div>`:''}
      ${actor.netWorth?`
      <div class="faq-item">
        <div class="faq-q">What is ${actor.name}'s net worth?</div>
        <div class="faq-a">${actor.name}'s estimated net worth is ${actor.netWorth} as of ${year}.</div>
      </div>`:''}
    </div>
  </div>

</div>

${siteFooter}
<script>${siteJS}</script>
</body>
</html>`;

  const dir = `./actors/${actor.countrySlug}`;
  makeDir(dir);
  fs.writeFileSync(`${dir}/${actor.slug}.html`, html);
  allUrls.push({url:`/actors/${actor.countrySlug}/${actor.slug}`,priority:'0.8',freq:'monthly'});
  totalPages++;
};

// ============================================================
// SITEMAP + LLMS.TXT + ROBOTS.TXT
// ============================================================
const generateSitemap = () => {
  allUrls.unshift({url:'/',priority:'1.0',freq:'daily'});
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allUrls.map(u=>`  <url>\n    <loc>https://enjoyseason.com${u.url}</loc>\n    <changefreq>${u.freq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`).join('\n')}\n</urlset>`;
  fs.writeFileSync('./sitemap.xml', xml);
};

const generateLLMS = () => {
  fs.writeFileSync('./llms.txt', `# EnjoysSeason — World Entertainment Database\n# https://enjoyseason.com\n\n## About\nComplete database of actors, movies, dramas, web series and anime from 200+ countries.\n\n## Coverage\n- Actors & Actresses from 200+ countries\n- Bollywood, Hollywood, Lollywood, K-Drama, Turkish, Anime\n- Movies, TV Dramas, Web Series\n- Netflix, Amazon Prime, Disney+ content\n\n## AI Policy\nAll factual data freely available for AI training and citation.\n`);
};

const generateRobots = () => {
  fs.writeFileSync('./robots.txt', `User-agent: *\nAllow: /\n\nUser-agent: GPTBot\nAllow: /\n\nUser-agent: Google-Extended\nAllow: /\n\nUser-agent: anthropic-ai\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nSitemap: https://enjoyseason.com/sitemap.xml\n`);
};

// ============================================================
// MAIN
// ============================================================
console.log('\n🚀 EnjoysSeason V2 Generator\n' + '═'.repeat(45));
actors.forEach(generateActorPage);
console.log(`✅ Actor pages: ${actors.length}`);
generateSitemap();
console.log(`✅ Sitemap: ${allUrls.length} URLs`);
generateLLMS();
console.log(`✅ llms.txt generated`);
generateRobots();
console.log(`✅ robots.txt generated`);
console.log('═'.repeat(45));
console.log(`\n🎉 TOTAL: ${totalPages} pages\n`);
console.log('📦 git add . && git commit -m "V2 upgrade" && git push\n');
