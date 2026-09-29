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
      if (window.innerWidth > 1024 && mainNav.classList.contains('is-open')) {
        navToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('is-open');
      }
    });
  }

  /* --- 3. COUNTDOWN TIMER --- */
  const countdownEls = document.querySelectorAll('[data-countdown]');
  const inlineCountdown = document.querySelector('[data-countdown-inline]');
  // Registration deadline: 10 October 2026, 23:59:59 IST
  const targetDate = new Date('2026-10-10T23:59:59+05:30').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      if (inlineCountdown) inlineCountdown.textContent = 'Closed';
      document.querySelectorAll('.cd-num').forEach(el => el.textContent = '00');
      
      // Registration closed: disable the Register buttons and show the deadline notice
      document.querySelectorAll('[data-open-form]').forEach(btn => {
        btn.disabled = true;
        btn.textContent = 'Registrations closed';
      });
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
  const startupPopup = document.querySelector('[data-startup-popup]');
  const popupCloseBtn = document.querySelector('[data-popup-close]');
  const modal = document.querySelector('[data-poster-modal]');
  const openBtns = document.querySelectorAll('[data-poster-open]');
  const closeBtn = document.querySelector('[data-modal-close]');

  if (startupPopup) {
    startupPopup.showModal();

    if (popupCloseBtn) {
      popupCloseBtn.addEventListener('click', () => startupPopup.close());
    }

    startupPopup.addEventListener('click', (e) => {
      if (e.target === startupPopup) startupPopup.close();
    });
  }

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

  /* --- 7. GOOGLE FORMS --- */
  const GOOGLE_FORM_URLS = {
    exhibit: 'https://forms.gle/kXRQCAjZHzUGkchX9',
    pitch: 'https://forms.gle/kXRQCAjZHzUGkchX9',
    attendee: 'https://forms.gle/r8fknkwcExMPJ8BDA'
  };

  function showToast(msg) {
    const toastEl = document.querySelector('[data-toast]');
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    setTimeout(() => toastEl.classList.remove('show'), 4000);
  }

  document.querySelectorAll('[data-open-form]').forEach(button => {
    button.addEventListener('click', () => {
      const formUrl = GOOGLE_FORM_URLS[button.getAttribute('data-open-form')];
      if (formUrl) {
        window.open(formUrl, '_blank', 'noopener,noreferrer');
      } else {
        showToast('This Google Form link is not available yet.');
      }
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

  /* --- FAQ / GUIDELINES TABS --- */
  const faqTabs = [...document.querySelectorAll('[role="tab"][aria-controls]')]
    .filter(tab => ['faq-panel', 'guidelines-panel'].includes(tab.getAttribute('aria-controls')));
  const faqTitle = document.getElementById('faq-title');
  const faqDescription = document.getElementById('faq-description');

  function activateFaqTab(tab, moveFocus = false) {
    const guidelinesActive = tab.id === 'guidelines-tab';
    faqTabs.forEach(faqTab => {
      const isActive = faqTab === tab;
      const panel = document.getElementById(faqTab.getAttribute('aria-controls'));
      faqTab.setAttribute('aria-selected', String(isActive));
      faqTab.tabIndex = isActive ? 0 : -1;
      if (panel) {
        panel.hidden = !isActive;
        panel.setAttribute('aria-hidden', String(!isActive));
        panel.inert = !isActive;
      }
    });
    if (faqTitle) faqTitle.textContent = guidelinesActive ? 'Guidelines' : 'Frequently Asked Questions';
    if (faqDescription) faqDescription.hidden = guidelinesActive;
    if (moveFocus) tab.focus();
  }

  faqTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateFaqTab(tab));
    tab.addEventListener('keydown', event => {
      let nextIndex = index;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % faqTabs.length;
      else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + faqTabs.length) % faqTabs.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = faqTabs.length - 1;
      else return;
      event.preventDefault();
      activateFaqTab(faqTabs[nextIndex], true);
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
 

   /* --- BACK TO TOP BUTTON --- */
const backToTopBtn = document.querySelector('.back-top');
if (backToTopBtn) {
  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

});
