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
  header.style.borderBottomColor = window.scrollY > 10
    ? 'rgba(255,255,255,0.12)'
    : 'rgba(255,255,255,0.06)';
});

// Mix "play" demo state (visual only — wire up real audio/embeds later)
const mixCards = document.querySelectorAll('[data-mix]');
mixCards.forEach((card) => {
  const btn = card.querySelector('.play-btn');
  btn.addEventListener('click', () => {
    const wasPlaying = card.classList.contains('playing');
    mixCards.forEach((c) => c.classList.remove('playing'));
    if (!wasPlaying) card.classList.add('playing');
  });
});

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
