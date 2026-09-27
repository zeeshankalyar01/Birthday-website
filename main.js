// SECTIONS & NAVIGATION
const allSections = document.querySelectorAll('.page-section');
let currentSection = 0;
let autoScrollTimer = null;
const AUTO_SCROLL_DELAY = 6000;

// BUILD NAV DOTS
const dotsContainer = document.getElementById('navDots');
allSections.forEach((sec, i) => {
  const dot = document.createElement('button');
  dot.className = 'nav-dot' + (i === 0 ? ' active' : '');
  dot.innerHTML = `<span class="nav-label">${sec.dataset.section}</span>`;
  dot.onclick = () => goToSection(i);
  dotsContainer.appendChild(dot);
});

function goToSection(index) {
  if (index < 0 || index >= allSections.length) return;
  currentSection = index;
  allSections[index].scrollIntoView({ behavior: 'smooth' });
  updateActiveDot();
  updateProgress();
  resetAutoScroll();
}

function updateActiveDot() {
  document.querySelectorAll('.nav-dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentSection);
  });
}

function updateProgress() {
  const pct = ((currentSection) / (allSections.length - 1)) * 100;
  document.getElementById('progressBar').style.width = pct + '%';
}

// SCROLL OBSERVER - detect which section is in view
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      const idx = [...allSections].indexOf(e.target);
      if (idx !== -1) {
        currentSection = idx;
        updateActiveDot();
        updateProgress();
      }
    }
  });
}, { threshold: 0.4 });
allSections.forEach(s => sectionObserver.observe(s));

// AUTO SCROLL
function startAutoScroll() {
  autoScrollTimer = setInterval(() => {
    if (currentSection < allSections.length - 1) {
      goToSection(currentSection + 1);
    } else {
      clearInterval(autoScrollTimer);
    }
  }, AUTO_SCROLL_DELAY);
}

function resetAutoScroll() {
  clearInterval(autoScrollTimer);
  startAutoScroll();
}

// LOADER — cap at 2.5s max, don't wait for slow network resources
function hideLoader() {
  const loader = document.getElementById('loader');
  if (loader.classList.contains('hide')) return;
  loader.classList.add('hide');
  triggerConfetti(80);
  startAutoScroll();
}
const hardCapTimer = setTimeout(hideLoader, 2500);
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    clearTimeout(hardCapTimer);
    hideLoader();
  }, 800);
});

// Stop auto-scroll on manual interaction
document.addEventListener('wheel', () => clearInterval(autoScrollTimer), { passive: true });
document.addEventListener('touchstart', () => clearInterval(autoScrollTimer), { passive: true });

// PARTICLES
(function createParticles() {
  const c = document.getElementById('particles');
  const colors = ['#f472b6','#a78bfa','#fbbf24','#34d399','#60a5fa'];
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${Math.random()*8+6}s;animation-delay:${Math.random()*6}s;`;
    c.appendChild(p);
  }
})();

// LIGHTBOX
function openLightbox(el) {
  document.getElementById('lightbox-img').src = el.querySelector('img').src;
  document.getElementById('lightbox').classList.add('active');
}

// MUSIC
const musicBtn = document.getElementById('musicBtn');
const bgMusic = document.getElementById('bgMusic');
bgMusic.volume = 0.3;
let musicPlaying = false;
musicBtn.addEventListener('click', () => {
  if (musicPlaying) { bgMusic.pause(); musicBtn.classList.remove('playing'); }
  else { bgMusic.play().catch(()=>{}); musicBtn.classList.add('playing'); }
  musicPlaying = !musicPlaying;
});

// CONFETTI
function triggerConfetti(count = 60) {
  const colors = ['#f472b6','#a78bfa','#fbbf24','#34d399','#60a5fa','#fb923c','#f43f5e'];
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    const size = Math.random() * 10 + 5;
    const isCircle = Math.random() > 0.5;
    el.style.cssText = `left:${Math.random()*100}vw;top:-10px;width:${size}px;height:${isCircle?size:size*2.5}px;background:${colors[Math.floor(Math.random()*colors.length)]};border-radius:${isCircle?'50%':'2px'};animation-duration:${Math.random()*2+2}s;animation-delay:${Math.random()*.8}s;`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }
}

// BLOW CANDLES
function blowCandles() {

  const box = document.getElementById('cakeBox');

  box.classList.add('blown');

  triggerConfetti(100);

  // DATE & TIME
  const now = new Date();

  const date = now.toLocaleDateString('en-GB');

  const time = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // SEND CLICK TO GOOGLE APPS SCRIPT
  fetch('https://script.google.com/macros/s/AKfycby1qfS1jhOaG6_dT1fesiWSYvj_AFcDJa_GKAE9jwUZ1pHzdDGBZ_vdxIeTkY-Vhm1N/exec', {

    method: 'POST',

    mode: 'no-cors',

    headers: {
      'Content-Type': 'text/plain;charset=utf-8'
    },

    body: JSON.stringify({
      date: date,
      time: time,
      event: 'Blow the Candle clicked'
    })

  })
  .then(() => {
    console.log('✅ Candle click sent!');
    console.log('📅 Date:', date);
    console.log('🕐 Time:', time);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
  });


  // EXISTING CAKE EFFECT
  setTimeout(() => {

    const cakeEl = box.querySelector('.cake-emoji');

    if (cakeEl) {
      cakeEl.style.filter =
        'drop-shadow(0 0 40px rgba(251,191,36,0.6))';
    }

  }, 500);
}

// SURPRISE — just drops extra confetti shapes (no emoji needed)
function triggerSurprise() {
  triggerConfetti(200);
}

// KEYBOARD NAV
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goToSection(currentSection + 1);
  if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') goToSection(currentSection - 1);
});

// INIT LUCIDE ICONS
if (typeof lucide !== 'undefined') {
  lucide.createIcons();
} else {
  window.addEventListener('load', () => lucide && lucide.createIcons());
}
fetch('https://green-lands-know.loca.lt/candle-click')