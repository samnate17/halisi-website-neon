// Pause the hero video for users who prefer reduced motion
const heroVideo = document.querySelector('.hero-video');
if (heroVideo && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  heroVideo.pause();
  heroVideo.removeAttribute('autoplay');
}

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Header shadow on scroll
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
});

// Mix "play" demo state (visual only — wire up real audio/embeds later)
function wireMixCards() {
  const mixCards = document.querySelectorAll('[data-mix]');
  mixCards.forEach((card) => {
    const btn = card.querySelector('.play-btn');
    btn.addEventListener('click', () => {
      const wasPlaying = card.classList.contains('playing');
      mixCards.forEach((c) => c.classList.remove('playing'));
      if (!wasPlaying) card.classList.add('playing');
    });
  });
}

// Render site content from content.json (edited via /admin)
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}

const PLAY_ICON = '<svg class="icon-play" viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M8 5v14l11-7z"/></svg><svg class="icon-pause" viewBox="0 0 24 24" width="22" height="22" hidden><path fill="currentColor" d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg><span class="eq"><i></i><i></i><i></i><i></i></span>';

function renderContent(data) {
  const heroVideoSource = document.getElementById('heroVideoSource');
  const heroVideo = document.getElementById('heroVideo');
  if (heroVideoSource && data.media?.heroVideoUrl && heroVideoSource.src !== data.media.heroVideoUrl) {
    heroVideoSource.src = data.media.heroVideoUrl;
    if (heroVideo) heroVideo.load();
  }
  if (heroVideo && data.media?.heroPosterUrl) heroVideo.poster = data.media.heroPosterUrl;

  const pressPhoto = document.getElementById('pressPhoto');
  if (pressPhoto && data.media?.pressPhotoUrl) pressPhoto.src = data.media.pressPhotoUrl;

  const heroTagline = document.getElementById('heroTagline');
  if (heroTagline && data.bio?.tagline) heroTagline.textContent = data.bio.tagline;

  const bioText = document.getElementById('bioText');
  if (bioText && data.bio?.text) bioText.textContent = data.bio.text;

  const yearsActive = document.getElementById('yearsActive');
  if (yearsActive && data.bio?.yearsActive != null) yearsActive.textContent = data.bio.yearsActive;

  const mixesGrid = document.getElementById('mixesGrid');
  if (mixesGrid && Array.isArray(data.mixes)) {
    mixesGrid.innerHTML = data.mixes.map((mix) => `
      <article class="mix-card" data-mix>
        <button class="play-btn" aria-label="Play mix">${PLAY_ICON}</button>
        <div class="mix-info">
          <h3>${escapeHtml(mix.title)}</h3>
          <p class="mix-meta">${escapeHtml(mix.genre)} · ${escapeHtml(mix.duration)}</p>
        </div>
      </article>
    `).join('');
  }

  const eventsList = document.getElementById('eventsList');
  if (eventsList && Array.isArray(data.events)) {
    eventsList.innerHTML = data.events.map((ev) => `
      <div class="event-row">
        <div class="event-date"><span class="day">${escapeHtml(ev.day)}</span><span class="month">${escapeHtml(ev.month)}</span></div>
        <div class="event-details">
          <h3>${escapeHtml(ev.title)}</h3>
          <p>${escapeHtml(ev.venue)}</p>
        </div>
        <a href="${escapeHtml(ev.ticketUrl || '#')}" class="btn btn-small">Tickets</a>
      </div>
    `).join('');
  }

  const merchGrid = document.getElementById('merchGrid');
  if (merchGrid && Array.isArray(data.merch)) {
    merchGrid.innerHTML = data.merch.map((item) => `
      <article class="merch-card">
        <div class="merch-photo"><img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.name)}" loading="lazy"></div>
        <h3>${escapeHtml(item.name)}</h3>
        <p class="merch-price">${escapeHtml(item.price)}</p>
        <a href="${escapeHtml(item.buyUrl || '#')}" class="btn btn-small">Buy</a>
      </article>
    `).join('');
  }

  const bookingBlurb = document.getElementById('bookingBlurb');
  if (bookingBlurb && data.booking?.blurb) bookingBlurb.textContent = data.booking.blurb;

  const bookingEmail = document.getElementById('bookingEmail');
  if (bookingEmail && data.booking?.email) {
    bookingEmail.textContent = data.booking.email;
    bookingEmail.href = `mailto:${data.booking.email}`;
  }

  const bookingInstagram = document.getElementById('bookingInstagram');
  if (bookingInstagram && data.socials?.instagramHandle) {
    bookingInstagram.textContent = data.socials.instagramHandle;
    if (data.socials.instagramUrl) bookingInstagram.href = data.socials.instagramUrl;
  }

  if (data.socials) {
    document.querySelectorAll('[data-social="youtube"]').forEach((a) => { if (data.socials.youtubeUrl) a.href = data.socials.youtubeUrl; });
    document.querySelectorAll('[data-social="instagram"]').forEach((a) => { if (data.socials.instagramUrl) a.href = data.socials.instagramUrl; });
    document.querySelectorAll('[data-social="facebook"]').forEach((a) => { if (data.socials.facebookUrl) a.href = data.socials.facebookUrl; });
    document.querySelectorAll('[data-social="mixcloud"]').forEach((a) => { if (data.socials.mixcloudUrl) a.href = data.socials.mixcloudUrl; });
  }

  wireMixCards();
}

fetch('content.json')
  .then((res) => res.json())
  .then(renderContent)
  .catch((err) => console.error('Could not load content.json', err));

// Booking form (front-end only demo — replace with real submit handler)
const bookingForm = document.getElementById('bookingForm');
const formStatus = document.getElementById('formStatus');

bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!bookingForm.checkValidity()) {
    bookingForm.reportValidity();
    return;
  }
  formStatus.textContent = "Thanks! Your inquiry has been noted — connect a real form backend (e.g. Formspree, Netlify Forms) to receive these by email.";
  bookingForm.reset();
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Dark / light theme toggle
const THEME_KEY = 'halisi-theme';
const themeToggle = document.getElementById('themeToggle');

function currentTheme() {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

function updateThemeLabel() {
  if (themeToggle) themeToggle.textContent = currentTheme() === 'dark' ? 'Light' : 'Dark';
}

updateThemeLabel();

themeToggle?.addEventListener('click', () => {
  const next = currentTheme() === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
  updateThemeLabel();
});

// Scroll-reveal for sections
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('in-view'));
}
