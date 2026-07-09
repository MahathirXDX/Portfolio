/* ==========================================================================
   app.js
   Loads profile.json and renders every section of the site.
   Edit the JSON file — never this file — to change your content.
   ========================================================================== */

(function () {
  'use strict';

  const DATA_URL = 'profile.json';

  /* ---------------------------------------------------------------------
     Small inline icon sets (no external icon library / no network needed)
     --------------------------------------------------------------------- */
  const SOCIAL_ICONS = {
    github: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 11v5M8 8v.01M12 16v-3a2 2 0 1 1 4 0v3M12 13v3"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 9h3V6h-3a3 3 0 0 0-3 3v2H9v3h2v6h3v-6h3l1-3h-4V9a1 1 0 0 1 1-1Z"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4l16 16M20 4 4 20"/></svg>',
    email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  };

  const SERVICE_ICONS = {
    code: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M8 6 2 12l6 6M16 6l6 6-6 6"/></svg>',
    layers: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/></svg>',
    cpu: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/></svg>',
    zap: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M12 2 4 5v6c0 5 3.4 8.7 8 11 4.6-2.3 8-6 8-11V5l-8-3Z"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.6M8.2 13.2l7.6 4.6"/></svg>',
    figma: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M9 2h4a3 3 0 0 1 0 6H9V2Z"/><path d="M9 8h4a3 3 0 1 1 0 6H9V8Z"/><path d="M9 14h3a3 3 0 1 1-3 3v-3Z"/><circle cx="9" cy="19" r="0" /><path d="M6 5a3 3 0 0 0 0 6h0"/><path d="M6 11a3 3 0 0 0 0 6h0"/></svg>',
  };

  function iconStroke(svg) { return svg.replace('<svg', '<svg stroke="currentColor"'); }

  /* ---------------------------------------------------------------------
     Fetch + boot
     --------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    fetch(DATA_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Could not load profile.json');
        return res.json();
      })
      .then((data) => {
        renderSite(data);
        initHeaderScroll();
        initNavToggle();
        initRevealObserver();
        initTimelineTabs();
        initContactForm();
      })
      .catch((err) => {
        console.error(err);
        document.body.insertAdjacentHTML(
          'afterbegin',
          '<p style="padding:16px;text-align:center;background:#111;color:#fff;font-size:14px;">Could not load profile.json — open this site through a local server (not file://) so the browser can fetch it.</p>'
        );
      });
  });

  /* ---------------------------------------------------------------------
     Master render
     --------------------------------------------------------------------- */
  function renderSite(data) {
    document.title = data.name ? `${data.name} — Portfolio` : 'Portfolio';

    renderLogoAndSocial(data);
    renderHero(data);
    renderAbout(data);
    renderStats(data.stats || []);
    renderSkills(data.skills || []);
    renderServices(data.services || []);
    renderProjects(data.projects || []);
    renderTimeline(data.timeline || {});
    renderContactMeta(data);
    renderFooter(data);
  }

  /* ---------------------------------------------------------------------
     Header: logo + social links
     --------------------------------------------------------------------- */
  function renderLogoAndSocial(data) {
    const logoEl = document.getElementById('logo');
    logoEl.textContent = data.logo || (data.name ? data.name[0] + '.' : 'M.');

    const socialWrap = document.getElementById('header-social');
    socialWrap.innerHTML = buildSocialLinks(data.social || {});
  }

  function buildSocialLinks(social) {
    const order = ['github', 'linkedin', 'facebook', 'x', 'email'];
    const labels = { github: 'GitHub', linkedin: 'LinkedIn', facebook: 'Facebook', x: 'X', email: 'Email' };
    return order
      .filter((key) => social[key])
      .map((key) => `<a href="${social[key]}" target="${key === 'email' ? '_self' : '_blank'}" rel="noopener">${labels[key]}</a>`)
      .join('');
  }

  /* ---------------------------------------------------------------------
     Hero
     --------------------------------------------------------------------- */
  function renderHero(data) {
    document.getElementById('hero-name').textContent = data.name || 'Your Name';
    if (data.profileImage) {
      document.getElementById('profile-img').src = data.profileImage;
      document.getElementById('profile-img').alt = data.name || 'Profile photo';
    }

    const typingEl = document.getElementById('typing-text');
    const typer = new TypingEffect(typingEl, data.titles || []);
    typer.start();
  }

  /* ---------------------------------------------------------------------
     About
     --------------------------------------------------------------------- */
  function renderAbout(data) {
    document.getElementById('about-bio').textContent = data.bio || '';

    const metaItems = [
      ['Location', data.location],
      ['Email', data.email],
      ['Phone', data.phone],
      ['Website', data.website],
    ].filter(([, value]) => value);

    document.getElementById('about-meta').innerHTML = metaItems
      .map(([label, value]) => `<li><span class="label">${label}</span><span>${value}</span></li>`)
      .join('');
  }

  function renderContactMeta(data) {
    const metaItems = [
      ['Location', data.location],
      ['Email', data.email],
      ['Phone', data.phone],
    ].filter(([, value]) => value);

    document.getElementById('contact-meta').innerHTML = metaItems
      .map(([label, value]) => `<li><span class="label">${label}</span><span>${value}</span></li>`)
      .join('');

    const mapLabel = document.querySelector('.map-placeholder span');
    if (mapLabel && data.location) mapLabel.textContent = `Map — ${data.location}`;
  }

  /* ---------------------------------------------------------------------
     Stats (animated counters)
     --------------------------------------------------------------------- */
  function renderStats(stats) {
    const grid = document.getElementById('stats-grid');
    grid.innerHTML = stats
      .map(
        (s) => `
        <div class="stat-card reveal">
          <div class="stat-number" data-target="${s.value}" data-suffix="${s.suffix || ''}">0${s.suffix || ''}</div>
          <div class="stat-label">${s.label}</div>
        </div>`
      )
      .join('');

    observeCounters(grid.querySelectorAll('.stat-number'));
  }

  /* ---------------------------------------------------------------------
     Skills (circular progress rings, animated on scroll into view)
     --------------------------------------------------------------------- */
  function renderSkills(skills) {
    const grid = document.getElementById('skills-grid');
    const R = 40; // matches r in the SVG below
    const circumference = 2 * Math.PI * R;

    grid.innerHTML = skills
      .map(
        (skill) => `
        <div class="skill-item reveal">
          <div class="skill-ring" data-percent="${skill.percent}">
            <svg viewBox="0 0 96 96">
              <circle class="track" cx="48" cy="48" r="${R}"></circle>
              <circle class="progress" cx="48" cy="48" r="${R}"
                style="stroke-dasharray:${circumference};stroke-dashoffset:${circumference}"></circle>
            </svg>
            <span class="percent">${skill.percent}%</span>
          </div>
          <span class="skill-name">${skill.name}</span>
        </div>`
      )
      .join('');

    const rings = grid.querySelectorAll('.skill-ring');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const ring = entry.target;
            const percent = parseFloat(ring.dataset.percent) || 0;
            const progressCircle = ring.querySelector('.progress');
            const offset = circumference - (percent / 100) * circumference;
            progressCircle.style.strokeDashoffset = offset;
            observer.unobserve(ring);
          }
        });
      },
      { threshold: 0.4 }
    );
    rings.forEach((r) => observer.observe(r));
  }

  /* ---------------------------------------------------------------------
     Services
     --------------------------------------------------------------------- */
  function renderServices(services) {
    const grid = document.getElementById('services-grid');
    grid.innerHTML = services
      .map(
        (s) => `
        <div class="service-card reveal">
          <div class="service-icon">${iconStroke(SERVICE_ICONS[s.icon] || SERVICE_ICONS.code)}</div>
          <h3 class="service-title">${s.title}</h3>
          <p class="service-desc">${s.description || ''}</p>
        </div>`
      )
      .join('');
  }

  /* ---------------------------------------------------------------------
     Projects
     --------------------------------------------------------------------- */
  function renderProjects(projects) {
    const grid = document.getElementById('projects-grid');
    grid.innerHTML = projects
      .map(
        (p) => `
        <div class="project-card reveal">
          <div class="project-media">
            <img src="${p.image}" alt="${p.title}" loading="lazy" />
          </div>
          <div class="project-body">
            <h3 class="project-title">${p.title}</h3>
            <p class="project-desc">${p.description || ''}</p>
            <div class="project-tech">
              ${(p.tech || []).map((t) => `<span>${t}</span>`).join('')}
            </div>
            <div class="project-links">
              ${p.github ? `<a href="${p.github}" target="_blank" rel="noopener">GitHub</a>` : ''}
              ${p.live ? `<a href="${p.live}" target="_blank" rel="noopener">Live Demo</a>` : ''}
            </div>
          </div>
        </div>`
      )
      .join('');
  }

  /* ---------------------------------------------------------------------
     Timeline
     --------------------------------------------------------------------- */
  function renderTimeline(timeline) {
    const panelsWrap = document.getElementById('timeline-panels');
    const categories = ['experience', 'education', 'certificates'];

    panelsWrap.innerHTML = categories
      .map((cat, i) => {
        const entries = timeline[cat] || [];
        return `
        <div class="timeline-panel ${i === 0 ? 'active' : ''}" data-panel="${cat}">
          <div class="timeline-list">
            ${entries
              .map(
                (e) => `
              <div class="timeline-entry reveal in-view">
                <div class="timeline-date">${e.date || ''}</div>
                <div class="timeline-title">${e.title || ''}</div>
                <div class="timeline-place">${e.place || ''}</div>
                <p class="timeline-desc">${e.description || ''}</p>
              </div>`
              )
              .join('')}
          </div>
        </div>`;
      })
      .join('');
  }

  function initTimelineTabs() {
    const tabs = document.querySelectorAll('.timeline-tab');
    const panels = document.querySelectorAll('.timeline-panel');

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const target = tab.dataset.tab;
        panels.forEach((p) => p.classList.toggle('active', p.dataset.panel === target));
      });
    });
  }

  /* ---------------------------------------------------------------------
     Footer
     --------------------------------------------------------------------- */
  function renderFooter(data) {
    document.getElementById('footer-logo').textContent = data.logo || 'M.';
    document.getElementById('footer-copy').textContent = `© ${new Date().getFullYear()} ${data.name || ''} — All rights reserved.`;
    document.getElementById('footer-social').innerHTML = buildSocialLinks(data.social || {});
  }

  /* ---------------------------------------------------------------------
     Header scroll state (adds border once page is scrolled)
     --------------------------------------------------------------------- */
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------------------------------------------------------------------
     Mobile nav toggle
     --------------------------------------------------------------------- */
  function initNavToggle() {
    const toggle = document.getElementById('nav-toggle');
    const social = document.getElementById('header-social');
    toggle.addEventListener('click', () => {
      const isOpen = toggle.classList.toggle('open');
      social.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    social.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        social.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  /* ---------------------------------------------------------------------
     Scroll reveal (fade-up) for any .reveal element
     --------------------------------------------------------------------- */
  function initRevealObserver() {
    const elements = document.querySelectorAll('.reveal:not(.in-view)');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    elements.forEach((el) => observer.observe(el));
  }

  /* ---------------------------------------------------------------------
     Contact form (front-end only — wire up your own backend/Formspree
     endpoint in the fetch call below if you want real submissions)
     --------------------------------------------------------------------- */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    const note = document.getElementById('form-note');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !message) {
        note.textContent = 'Please fill in every field before sending.';
        return;
      }

      // No backend is wired up yet — this just confirms locally.
      // Swap this block for a fetch() to your form endpoint (e.g. Formspree)
      // when you're ready to receive real messages.
      note.textContent = `Thanks, ${name}! Your message is ready — connect a form endpoint in app.js to send it.`;
      form.reset();
    });
  }
})();
