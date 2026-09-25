/* =========================================================================
   SCRIPT.JS — INTERACTIVITY & LOGIC
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* --- 1. THEME TOGGLE --- */
  const themeToggles = document.querySelectorAll('[data-theme-toggle]');
  const html = document.documentElement;
  
  // The inline script in head already set the initial theme from localStorage
  // If no theme is set, fallback to dark since it's the default in HTML
  if (!html.getAttribute('data-theme')) {
    html.setAttribute('data-theme', 'dark');
  }

  themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('sc26-theme', newTheme);
    });
  });

  /* --- 2. MOBILE NAVIGATION --- */
  const navToggle = document.querySelector('[data-nav-toggle]');
  const mainNav = document.getElementById('main-nav');
  
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      mainNav.classList.toggle('is-open');
    });

    // Close nav on link click
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('is-open');
      });
    });

    // Close nav on outside click
    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('is-open') && !mainNav.contains(e.target) && !navToggle.contains(e.target)) {
        navToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('is-open');
      }
    });

    // Close nav on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && mainNav.classList.contains('is-open')) {
        navToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('is-open');
      }
    });
  }

  /* --- 3. COUNTDOWN TIMER --- */
  const countdownEls = document.querySelectorAll('[data-countdown]');
  const inlineCountdown = document.querySelector('[data-countdown-inline]');
  // Target date: 7 October 2026, 23:59:59 IST
  const targetDate = new Date('2026-10-07T23:59:59+05:30').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      if (inlineCountdown) inlineCountdown.textContent = 'Closed';
      document.querySelectorAll('.cd-num').forEach(el => el.textContent = '00');
      
      // Registration closed: disable the Register buttons and hide the forms
      document.querySelectorAll('[data-open-form]').forEach(btn => {
        btn.disabled = true;
        btn.textContent = 'Registrations closed';
      });
      document.querySelectorAll('[data-form-panel]').forEach(p => { p.hidden = true; });
      const closedNote = document.querySelector('[data-reg-closed-note]');
      if (closedNote) closedNote.hidden = false;
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdownEls.forEach(el => {
      const dEl = el.querySelector('[data-cd="days"]');
      const hEl = el.querySelector('[data-cd="hours"]');
      const mEl = el.querySelector('[data-cd="minutes"]');
      const sEl = el.querySelector('[data-cd="seconds"]');
      
      if (dEl) dEl.textContent = days.toString().padStart(2, '0');
      if (hEl) hEl.textContent = hours.toString().padStart(2, '0');
      if (mEl) mEl.textContent = minutes.toString().padStart(2, '0');
      if (sEl) sEl.textContent = seconds.toString().padStart(2, '0');
    });

    if (inlineCountdown) {
      const dEl = inlineCountdown.querySelector('[data-cd="days"]');
      const hEl = inlineCountdown.querySelector('[data-cd="hours"]');
      const mEl = inlineCountdown.querySelector('[data-cd="minutes"]');
      const sEl = inlineCountdown.querySelector('[data-cd="seconds"]');
      const dStr = days.toString().padStart(2, '0');
      const hStr = hours.toString().padStart(2, '0');
      const mStr = minutes.toString().padStart(2, '0');
      const sStr = seconds.toString().padStart(2, '0');
      if (dEl && hEl && mEl && sEl) {
        dEl.textContent = dStr;
        hEl.textContent = hStr;
        mEl.textContent = mStr;
        sEl.textContent = sStr;
      } else {
        inlineCountdown.textContent = `${days}d ${hStr}h ${mStr}m ${sStr}s`;
      }
    }
  }
  
  if (countdownEls.length > 0 || inlineCountdown) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  /* --- 4. POSTER MODAL --- */
  const modal = document.querySelector('[data-poster-modal]');
  const openBtns = document.querySelectorAll('[data-poster-open]');
  const closeBtn = document.querySelector('[data-modal-close]');

  if (modal) {
    openBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.showModal();
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => modal.close());
    }

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.close();
    });

    // Close modal when a link inside it is clicked (e.g. #register)
    modal.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', () => {
        modal.close();
      });
    });
  }

  /* --- 5. SCHEDULE TABS --- */
  const dayTabs = document.querySelectorAll('[data-day-tab]');
  const dayPanels = document.querySelectorAll('.day-panel');

  dayTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Deactivate all
      dayTabs.forEach(t => {
        t.setAttribute('aria-selected', 'false');
        t.setAttribute('tabindex', '-1');
      });
      dayPanels.forEach(p => p.hidden = true);

      // Activate clicked
      tab.setAttribute('aria-selected', 'true');
      tab.removeAttribute('tabindex');
      const panelId = tab.getAttribute('aria-controls');
      document.getElementById(panelId).hidden = false;
    });
  });

  /* --- 6. SCHEDULE FILTERING --- */
  const filterChips = document.querySelectorAll('[data-session-filter]');
  
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      // Update active chip UI
      filterChips.forEach(c => {
        c.classList.remove('is-active');
        c.setAttribute('aria-pressed', 'false');
      });
      chip.classList.add('is-active');
      chip.setAttribute('aria-pressed', 'true');

      const filterValue = chip.getAttribute('data-session-filter');

      // Filter sessions inside the currently active panel, or all panels
      dayPanels.forEach(panel => {
        const sessions = panel.querySelectorAll('.session');
        let visibleCount = 0;

        sessions.forEach(session => {
          const type = session.getAttribute('data-type');
          if (filterValue === 'all' || filterValue === type) {
            session.style.display = 'block';
            visibleCount++;
          } else {
            session.style.display = 'none';
          }
        });

        const emptyState = panel.querySelector('.empty-state');
        if (emptyState) {
          emptyState.hidden = visibleCount > 0;
        }
      });
    });
  });

  /* --- 7. REGISTRATION FORMS (Exhibition + Pitching) --- */
  // Where submissions are sent. Paste a Google Apps Script web-app URL or a Formspree URL here.
  // Left empty, submissions are only saved in the visitor's own browser (preview mode).
  const FORM_ENDPOINTS = {
    exhibit: '',
    pitch: ''
  };

  function showToast(msg) {
    const toastEl = document.querySelector('[data-toast]');
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    setTimeout(() => toastEl.classList.remove('show'), 4000);
  }

  const formOpenBtns = document.querySelectorAll('[data-open-form]');
  const formPanels = document.querySelectorAll('[data-form-panel]');

  function closeAllPanels() {
    formPanels.forEach(p => { p.hidden = true; p.classList.remove('is-open'); });
    formOpenBtns.forEach(b => { b.setAttribute('aria-expanded', 'false'); b.classList.remove('is-active'); });
  }

  function openPanel(key) {
    const panel = document.querySelector(`[data-form-panel="${key}"]`);
    const btn = document.querySelector(`[data-open-form="${key}"]`);
    if (!panel) return;
    const wasOpen = !panel.hidden;
    closeAllPanels();
    if (wasOpen) return; // clicking the same button again closes the form
    panel.hidden = false;
    requestAnimationFrame(() => panel.classList.add('is-open'));
    if (btn) { btn.setAttribute('aria-expanded', 'true'); btn.classList.add('is-active'); }
    const canvas = panel.querySelector('[data-captcha-canvas]');
    if (canvas && canvas._refresh) canvas._refresh();
    setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  }

  formOpenBtns.forEach(btn => btn.addEventListener('click', () => openPanel(btn.getAttribute('data-open-form'))));
  document.querySelectorAll('[data-form-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      closeAllPanels();
      const ways = document.getElementById('ways-to-join');
      if (ways) ways.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Captcha (one per form)
  function drawCaptcha(canvas) {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    canvas._code = code;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = isDark ? '#141d2e' : '#f0f4f8';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(28, 109, 208, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(Math.random() * w, Math.random() * h);
      ctx.bezierCurveTo(Math.random() * w, Math.random() * h, Math.random() * w, Math.random() * h, Math.random() * w, Math.random() * h);
      ctx.stroke();
    }
    for (let i = 0; i < 25; i++) {
      ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)';
      ctx.beginPath();
      ctx.arc(Math.random() * w, Math.random() * h, 1, 0, Math.PI * 2);
      ctx.fill();
    }
    const colors = isDark ? ['#60a5fa', '#38bdf8', '#7dd3fc', '#93c5fd'] : ['#1d4ed8', '#0284c7', '#1C6DD0', '#0369a1'];
    ctx.font = 'bold 22px "Archivo", "Segoe UI", sans-serif';
    ctx.textBaseline = 'middle';
    const spacing = (w - 24) / 5;
    for (let i = 0; i < code.length; i++) {
      ctx.save();
      ctx.translate(14 + i * spacing, h / 2 + (Math.random() * 4 - 2));
      ctx.rotate((Math.random() - 0.5) * 0.35);
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.fillText(code[i], 0, 0);
      ctx.restore();
    }
  }

  document.querySelectorAll('[data-captcha-canvas]').forEach(canvas => {
    canvas._refresh = () => drawCaptcha(canvas);
    drawCaptcha(canvas);
    canvas.addEventListener('click', () => drawCaptcha(canvas));
    const refresh = canvas.parentElement.querySelector('[data-captcha-refresh]');
    if (refresh) refresh.addEventListener('click', () => drawCaptcha(canvas));
  });
  themeToggles.forEach(btn => btn.addEventListener('click', () => {
    setTimeout(() => document.querySelectorAll('[data-captcha-canvas]').forEach(drawCaptcha), 50);
  }));

  // Team members: exactly as many boxes as the selected team size
  function memberCard(prefix, i) {
    const f = (name, label, type, ph, extra) => `
      <div class="field rf-field">
        <label for="${prefix}-m${i}-${name}">${label} <span class="rf-req" aria-hidden="true">*</span></label>
        <input id="${prefix}-m${i}-${name}" name="member${i}_${name}" type="${type}" placeholder="${ph}" ${extra || ''} required>
        <p class="field-error" id="${prefix}-m${i}-${name}-err"></p>
      </div>`;
    return `
      <div class="rf-member">
        <div class="rf-member-head"><b>${i}</b>Team member ${i}</div>
        <div class="rf-grid rf-grid-tight">
          ${f('name', 'Full name', 'text', 'Member name', 'autocomplete="off"')}
          ${f('phone', 'Phone number', 'tel', '10-digit mobile number', 'inputmode="numeric" maxlength="14"')}
          ${f('email', 'Email ID', 'email', 'member@email.com', 'inputmode="email"')}
          ${f('college', 'College name', 'text', 'Institution name', '')}
        </div>
      </div>`;
  }

  document.querySelectorAll('[data-team-size]').forEach(sel => {
    const box = sel.closest('.rf-team').querySelector('[data-team-members]');
    const prefix = sel.id.split('-')[0];
    sel.addEventListener('change', () => {
      const n = parseInt(sel.value, 10) || 0;
      // keep what was already typed for members that stay
      const saved = {};
      box.querySelectorAll('input').forEach(inp => { saved[inp.name] = inp.value; });
      let out = '';
      for (let i = 1; i <= n; i++) out += memberCard(prefix, i);
      box.innerHTML = out;
      box.querySelectorAll('input').forEach(inp => { if (saved[inp.name]) inp.value = saved[inp.name]; });
    });
  });

  // Startup registered? -> show registration number box only on "Yes"
  document.querySelectorAll('[data-regno-toggle]').forEach(radio => {
    radio.addEventListener('change', () => {
      const wrap = radio.closest('.rf-field');
      const num = wrap.querySelector('[data-regno]');
      const yes = wrap.querySelector('[data-regno-toggle][value="Yes"]').checked;
      num.hidden = !yes;
      num.required = yes;
      if (!yes) num.value = '';
    });
  });

  // Validation helpers
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const DRIVE_RE = /^https?:\/\/(drive|docs)\.google\.com\//i;
  const YT_RE = /^https?:\/\/(www\.|m\.)?(youtube\.com|youtu\.be)\//i;

  function setError(input, msg) {
    const field = input.closest('.rf-field, .field') || input.parentElement;
    field.classList.add('has-error');
    const errEl = field.querySelector('.field-error');
    if (errEl) { errEl.textContent = msg; errEl.style.display = 'block'; }
  }

  function validateForm(formEl) {
    formEl.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));
    formEl.querySelectorAll('.field-error').forEach(el => { el.textContent = ''; el.style.display = 'none'; });
    let firstBad = null;
    const bad = (el, msg) => { setError(el, msg); if (!firstBad) firstBad = el; };

    formEl.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]):not([type="hidden"]), select, textarea').forEach(el => {
      if (el.hidden || el.classList.contains('rf-hp') || el.hasAttribute('data-captcha-input')) return;
      const v = el.value.trim();
      if (el.required && !v) return bad(el, 'This field is required');
      if (!v) return;
      if (el.type === 'email' && !EMAIL_RE.test(v)) return bad(el, 'Please enter a valid email address');
      if (el.type === 'tel' && v.replace(/\D/g, '').length < 10) return bad(el, 'Please enter a valid 10-digit mobile number');
      const kind = el.getAttribute('data-link-kind');
      if (kind === 'drive' && !DRIVE_RE.test(v)) return bad(el, 'Please paste a Google Drive link (drive.google.com)');
      if (kind === 'youtube' && !YT_RE.test(v)) return bad(el, 'Please paste a YouTube link (youtube.com or youtu.be)');
      if (el.type === 'url' && !kind && !/^https?:\/\/\S+\.\S+/i.test(v)) return bad(el, 'Please enter a full link starting with https://');
    });

    // Yes / No groups
    const groups = new Set();
    formEl.querySelectorAll('input[type="radio"][required]').forEach(r => groups.add(r.name));
    groups.forEach(name => {
      if (!formEl.querySelector(`input[name="${name}"]:checked`)) {
        const first = formEl.querySelector(`input[name="${name}"]`);
        const wrap = first.closest('.rf-field');
        wrap.classList.add('has-error');
        const errEl = wrap.querySelector('.field-error');
        if (errEl) { errEl.textContent = 'Please choose Yes or No'; errEl.style.display = 'block'; }
        if (!firstBad) firstBad = first;
      }
    });

    // Declarations
    const unchecked = [...formEl.querySelectorAll('.rf-check input[required]')].filter(c => !c.checked);
    if (unchecked.length) {
      unchecked.forEach(c => c.closest('.rf-check').classList.add('has-error'));
      const errEl = formEl.querySelector('.rf-decl-err');
      if (errEl) { errEl.textContent = 'Please accept both declarations to continue'; errEl.style.display = 'block'; }
      if (!firstBad) firstBad = unchecked[0];
    }

    // Captcha
    const cInput = formEl.querySelector('[data-captcha-input]');
    const canvas = formEl.querySelector('[data-captcha-canvas]');
    if (cInput && canvas) {
      const entered = cInput.value.trim().toUpperCase();
      if (!entered || entered !== canvas._code) {
        bad(cInput, entered ? 'Incorrect code. Please try again.' : 'Please enter the verification code');
        if (entered) { cInput.value = ''; drawCaptcha(canvas); }
      }
    }

    if (firstBad) {
      firstBad.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => firstBad.focus({ preventScroll: true }), 300);
    }
    return !firstBad;
  }

  document.querySelectorAll('[data-conclave-form]').forEach(formEl => {
    const key = formEl.getAttribute('data-conclave-form');
    const panel = formEl.closest('[data-form-panel]');
    const success = panel.querySelector('[data-form-success]');
    const formError = formEl.querySelector('[data-form-error]');

    // clear an error as soon as the visitor fixes it
    formEl.addEventListener('input', ev => {
      const field = ev.target.closest('.has-error');
      if (field) field.classList.remove('has-error');
    });
    formEl.addEventListener('change', ev => {
      const field = ev.target.closest('.has-error');
      if (field) field.classList.remove('has-error');
    });

    formEl.addEventListener('submit', async ev => {
      ev.preventDefault();
      if (formError) formError.textContent = '';
      if (formEl.querySelector('.rf-hp').value) return; // bot
      if (!validateForm(formEl)) return;

      const submitBtn = formEl.querySelector('[data-submit]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;

      const appId = (key === 'pitch' ? 'SCP' : 'SCE') + Math.floor(100000 + Math.random() * 900000);
      const data = new FormData(formEl);
      data.delete('bot_check');
      data.append('application_id', appId);
      data.append('submitted_at', new Date().toISOString());

      try {
        const endpoint = FORM_ENDPOINTS[key];
        if (endpoint) {
          const isAppsScript = endpoint.includes('script.google.com');
          const res = await fetch(endpoint, {
            method: 'POST',
            body: new URLSearchParams(data),
            mode: isAppsScript ? 'no-cors' : 'cors',
            headers: { 'Accept': 'application/json' }
          });
          if (!isAppsScript && !res.ok) throw new Error('Request failed');
        } else {
          console.warn('[Startup Conclave] No FORM_ENDPOINTS.' + key + ' set - saved in this browser only.');
        }
        try {
          const all = JSON.parse(localStorage.getItem('sc26-applications') || '[]');
          all.push(Object.fromEntries(data.entries()));
          localStorage.setItem('sc26-applications', JSON.stringify(all));
        } catch (e) { }

        success.querySelector('[data-success-name]').textContent = (data.get('founder_name') || '').toString();
        success.querySelector('[data-success-id]').textContent = appId;
        formEl.hidden = true;
        panel.querySelector('.rf-steps').hidden = true;
        success.hidden = false;
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        success.focus({ preventScroll: true });
        showToast('Application submitted! ID: ' + appId);
      } catch (err) {
        if (formError) formError.textContent = 'Could not submit right now. Please check your internet connection and try again.';
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });

    const again = panel.querySelector('[data-form-again]');
    if (again) again.addEventListener('click', () => {
      formEl.reset();
      formEl.querySelectorAll('[data-team-members]').forEach(b => { b.innerHTML = ''; });
      formEl.querySelectorAll('[data-regno]').forEach(n => { n.hidden = true; n.required = false; });
      const canvas = formEl.querySelector('[data-captcha-canvas]');
      if (canvas) drawCaptcha(canvas);
      success.hidden = true;
      formEl.hidden = false;
      panel.querySelector('.rf-steps').hidden = false;
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* --- SCHEDULE: ADD TO CALENDAR (.ics) --- */
  const ICS_EVENTS = {
    day1: {
      start: '20261015T033000Z',
      end: '20261015T123000Z',
      title: "Startup Conclave '26 - Day 1",
      desc: 'Ideation, exposure, product showcase, keynotes and founder sessions.'
    },
    day2: {
      start: '20261016T043000Z',
      end: '20261016T120000Z',
      title: "Startup Conclave '26 - Day 2",
      desc: 'IPR masterclass, investor roundtables, pitch finals and awards ceremony.'
    }
  };

  document.querySelectorAll('[data-ics]').forEach(btn => {
    btn.addEventListener('click', () => {
      const dayKey = btn.getAttribute('data-ics');
      const ev = ICS_EVENTS[dayKey];
      if (!ev) return;
      const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//AKGEC IDEA Lab//Startup Conclave 26//EN',
        'CALSCALE:GREGORIAN',
        'BEGIN:VEVENT',
        'UID:' + dayKey + '-sc26@akgec.ac.in',
        'DTSTAMP:' + stamp,
        'DTSTART:' + ev.start,
        'DTEND:' + ev.end,
        'SUMMARY:' + ev.title,
        'DESCRIPTION:' + ev.desc,
        'LOCATION:Ajay Kumar Garg Engineering College, 27th KM Milestone, Delhi-Meerut Expressway, Ghaziabad',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'startup-conclave-26-' + dayKey + '.ics';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast('Calendar file downloaded. Open it to add the event.');
    });
  });



  /* --- 8. EVENT JOURNEY ACCORDION (opens on click only) --- */
  const journey = document.querySelector('[data-journey]');
  if (journey) {
    const stages = Array.from(journey.querySelectorAll('.jr-item'));

    function setStage(item, open) {
      item.classList.toggle('is-open', open);
      const toggle = item.querySelector('.jr-toggle');
      if (toggle) toggle.setAttribute('aria-expanded', String(open));
    }
    function openOnly(target) {
      stages.forEach(item => { setStage(item, item === target); });
    }

    stages.forEach(item => {
      const toggle = item.querySelector('.jr-toggle');
      if (!toggle) return;
      toggle.style.cursor = 'pointer';

      // Click an open stage to close it, click a closed one to open it (others close)
      toggle.addEventListener('click', () => {
        if (item.classList.contains('is-open')) setStage(item, false);
        else openOnly(item);
      });
    });
  }
         

  // Scroll-spy: highlight the centered Journey step while scrolling
 

  /* --- 9. HOW IT WORKS: ITINERARY SCROLL ANIMATION (LEFT-TO-RIGHT FADE IN / FADE OUT) --- */
  const howItWorksSection = document.getElementById('how-it-works');
  if (howItWorksSection) {
    howItWorksSection.classList.add('anim-ready');
    if ('IntersectionObserver' in window) {
      const hiwObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            howItWorksSection.classList.add('is-visible');
          } else {
            howItWorksSection.classList.remove('is-visible');
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      });
      hiwObserver.observe(howItWorksSection);
    } else {
      howItWorksSection.classList.add('is-visible');
    }
  }
   /* --- BACK TO TOP BUTTON --- */
const backToTopBtn = document.querySelector('.back-top');
if (backToTopBtn) {
  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

});
