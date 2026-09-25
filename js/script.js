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
    navToggle.addEventListener('click', () => {
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
  }

  /* --- 3. COUNTDOWN TIMER --- */
  const countdownEls = document.querySelectorAll('[data-countdown]');
  const inlineCountdown = document.querySelector('[data-countdown-inline]');
  // Target date: 10 October 2026, 23:59:59
  const targetDate = new Date('2026-10-10T23:59:59+05:30').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      if (inlineCountdown) inlineCountdown.textContent = 'Closed';
      document.querySelectorAll('.cd-num').forEach(el => el.textContent = '00');
      
      // Show closed state in form
      const regForm = document.getElementById('reg-form');
      const regClosed = document.querySelector('[data-reg-closed]');
      if (regForm && regClosed) {
        regForm.hidden = true;
        regClosed.hidden = false;
      }
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

  /* --- 7. REGISTRATION FORM LOGIC --- */
  const form = document.querySelector('[data-reg-form]');
  const pitchToggle = document.querySelector('[data-pitch-toggle]');
  const pitchFields = document.querySelector('[data-pitch-fields]');
  const passHint = document.querySelector('[data-pass-hint]');
  const typeSelect = document.getElementById('reg-type');
  const studentOnlyDiv = document.querySelector('[data-student-only]');
  const emailHint = document.querySelector('[data-email-hint]');
  const orgLabel = document.querySelector('[data-org-label]');
  
  const successState = document.querySelector('[data-reg-success]');
  const preselectPitchBtns = document.querySelectorAll('[data-preselect-pitch]');

  // Pre-select pitch from buttons outside form
  preselectPitchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (pitchToggle && !pitchToggle.checked) {
        pitchToggle.checked = true;
        pitchToggle.dispatchEvent(new Event('change'));
      }
    });
  });

  // Toggle pitch fields
  if (pitchToggle && pitchFields) {
    pitchToggle.addEventListener('change', () => {
      if (pitchToggle.checked) {
        pitchFields.hidden = false;
        if (passHint) passHint.hidden = false;
        
        // Auto-select full pass
        const fullPass = document.querySelector('input[name="pass"][value="Full event pass"]');
        if (fullPass) fullPass.checked = true;
      } else {
        pitchFields.hidden = true;
        if (passHint) passHint.hidden = true;
      }
    });
  }

  // Toggle student-specific fields
  if (typeSelect) {
    typeSelect.addEventListener('change', () => {
      if (typeSelect.value === 'student') {
        if (studentOnlyDiv) studentOnlyDiv.style.display = 'block';
        if (emailHint) emailHint.textContent = 'Students register with their college email (ending in .ac.in or .edu).';
        if (orgLabel) orgLabel.textContent = 'College / Institution';
      } else {
        if (studentOnlyDiv) studentOnlyDiv.style.display = 'none';
        if (emailHint) emailHint.textContent = 'Use your primary professional email.';
        if (orgLabel) orgLabel.textContent = 'Company / Organization';
      }
    });
  }

  // Character count for one-liner
  const oneliner = document.getElementById('reg-oneliner');
  const countSpan = document.querySelector('[data-char-count]');
  if (oneliner && countSpan) {
    oneliner.addEventListener('input', () => {
      countSpan.textContent = oneliner.value.length;
    });
  }

  /* --- CAPTCHA GENERATION & VALIDATION --- */
  let currentCaptchaCode = '';
  const captchaCanvas = document.getElementById('captcha-canvas');
  const captchaRefreshBtn = document.getElementById('captcha-refresh');
  const regCaptchaInput = document.getElementById('reg-captcha');
  const regCaptchaErr = document.getElementById('reg-captcha-err');
  const captchaField = document.getElementById('captcha-field');

  function generateCaptcha() {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    currentCaptchaCode = code;

    if (!captchaCanvas) return;
    const ctx = captchaCanvas.getContext('2d');
    const width = captchaCanvas.width;
    const height = captchaCanvas.height;

    // Detect theme
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

    // Canvas background
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = isDark ? '#141d2e' : '#f0f4f8';
    ctx.fillRect(0, 0, width, height);

    // Decorative noise lines
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = isDark
        ? `rgba(${Math.floor(Math.random()*150+100)}, ${Math.floor(Math.random()*150+100)}, 255, 0.25)`
        : `rgba(${Math.floor(Math.random()*100)}, ${Math.floor(Math.random()*100)}, 180, 0.25)`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.bezierCurveTo(
        Math.random() * width, Math.random() * height,
        Math.random() * width, Math.random() * height,
        Math.random() * width, Math.random() * height
      );
      ctx.stroke();
    }

    // Noise dots
    for (let i = 0; i < 25; i++) {
      ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)';
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw characters with distinct vibrant colors & slight angles
    const colors = isDark
      ? ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#38bdf8']
      : ['#2563eb', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0284c7'];

    ctx.font = 'bold 22px "Archivo", "Segoe UI", sans-serif';
    ctx.textBaseline = 'middle';

    const charSpacing = (width - 24) / 5;
    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      const charX = 14 + i * charSpacing;
      const charY = height / 2 + (Math.random() * 4 - 2);
      const angle = (Math.random() - 0.5) * 0.35;

      ctx.save();
      ctx.translate(charX, charY);
      ctx.rotate(angle);
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }
  }

  if (captchaCanvas) {
    generateCaptcha();
    captchaCanvas.addEventListener('click', () => {
      generateCaptcha();
      if (regCaptchaInput) regCaptchaInput.focus();
    });
  }

  if (captchaRefreshBtn) {
    captchaRefreshBtn.addEventListener('click', (e) => {
      e.preventDefault();
      generateCaptcha();
      if (regCaptchaInput) regCaptchaInput.focus();
    });
  }

  // Redraw captcha on theme toggle change
  themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      setTimeout(generateCaptcha, 50);
    });
  });

  // Clear captcha error on typing
  if (regCaptchaInput) {
    regCaptchaInput.addEventListener('input', () => {
      if (regCaptchaErr) {
        regCaptchaErr.style.display = 'none';
        regCaptchaErr.textContent = '';
      }
      if (captchaField) captchaField.classList.remove('has-error');
    });
  }

  function showToast(msg) {
    const toastEl = document.querySelector('[data-toast]');
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    setTimeout(() => toastEl.classList.remove('show'), 4000);
  }

  // Registration Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Reset errors
      form.querySelectorAll('.field-error').forEach(el => el.style.display = 'none');
      form.querySelectorAll('.field, .check').forEach(el => el.classList.remove('has-error'));
      
      let isValid = true;
      
      // Basic required validation
      form.querySelectorAll('input[required], select[required]').forEach(input => {
        if (!input.value.trim() && (input.type !== 'checkbox' || !input.checked)) {
          isValid = false;
          input.closest('.field, .check').classList.add('has-error');
          const errEl = document.getElementById(`${input.id}-err`);
          if (errEl) {
            errEl.textContent = 'This field is required';
            errEl.style.display = 'block';
          }
        }
      });

      // Phone validation
      const phoneInput = document.getElementById('reg-phone');
      if (phoneInput && phoneInput.value.trim()) {
        const cleanPhone = phoneInput.value.trim().replace(/\D/g, '');
        if (cleanPhone.length < 10) {
          isValid = false;
          phoneInput.closest('.field').classList.add('has-error');
          const phoneErr = document.getElementById('reg-phone-err');
          if (phoneErr) {
            phoneErr.textContent = 'Please enter a valid 10-digit mobile number';
            phoneErr.style.display = 'block';
          }
        }
      }

      // Captcha validation
      if (regCaptchaInput) {
        const entered = regCaptchaInput.value.trim().toUpperCase();
        if (!entered) {
          isValid = false;
          if (captchaField) captchaField.classList.add('has-error');
          if (regCaptchaErr) {
            regCaptchaErr.textContent = 'Please enter the verification code';
            regCaptchaErr.style.display = 'block';
          }
        } else if (entered !== currentCaptchaCode) {
          isValid = false;
          if (captchaField) captchaField.classList.add('has-error');
          if (regCaptchaErr) {
            regCaptchaErr.textContent = 'Incorrect verification code. Please try again.';
            regCaptchaErr.style.display = 'block';
          }
          regCaptchaInput.value = '';
          generateCaptcha();
          regCaptchaInput.focus();
        }
      }

      if (!isValid) return;

      const submitBtn = form.querySelector('[data-submit]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Completing Registration...';
      submitBtn.disabled = true;

      // Generate Pass ID (SC + 6 random digits)
      const passId = 'SC' + Math.floor(100000 + Math.random() * 900000);
      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const role = typeSelect ? typeSelect.options[typeSelect.selectedIndex].text : 'Attendee';
      const passType = (document.querySelector('input[name="pass"]:checked') || {}).value || 'Full event pass';

      setTimeout(() => {
        if (form && successState) {
          form.hidden = true;
          successState.hidden = false;
          successState.focus();
          
          const passEmailEl = document.querySelector('[data-pass-email]');
          if (passEmailEl) passEmailEl.textContent = email;
          const passNameEl = document.querySelector('[data-pass-name]');
          if (passNameEl) passNameEl.textContent = name;
          const passRoleEl = document.querySelector('[data-pass-role]');
          if (passRoleEl) passRoleEl.textContent = role;
          const passTypeEl = document.querySelector('[data-pass-type]');
          if (passTypeEl) passTypeEl.textContent = passType;
          const passIdEl = document.querySelector('[data-pass-id]');
          if (passIdEl) passIdEl.textContent = passId;

          try {
            localStorage.setItem('sc26-registration', JSON.stringify({
              passId, name, email, role, passType, date: new Date().toISOString()
            }));
          } catch (e) { }

          showToast('Registration successful! Pass ID: ' + passId);
        }
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 400);
    });
  }
  
  // Register another
  const regAnother = document.querySelector('[data-register-another]');
  if (regAnother && form && successState) {
    regAnother.addEventListener('click', () => {
      form.reset();
      generateCaptcha();
      form.querySelectorAll('.field-error').forEach(el => el.style.display = 'none');
      form.querySelectorAll('.field, .check').forEach(el => el.classList.remove('has-error'));
      successState.hidden = true;
      form.hidden = false;
      const submitBtn = form.querySelector('[data-submit]');
      if (submitBtn) {
        submitBtn.textContent = 'Complete Registration';
        submitBtn.disabled = false;
      }
      if (pitchToggle) pitchToggle.dispatchEvent(new Event('change'));
      const nameInput = document.getElementById('reg-name');
      if (nameInput) nameInput.focus();
    });
  }

  // Print Pass Logic
  const printBtn = document.querySelector('[data-print-pass]');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

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

});
