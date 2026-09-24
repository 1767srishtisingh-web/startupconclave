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
  const targetDate = new Date('2026-10-10T23:59:59').getTime();

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
      inlineCountdown.textContent = `${days}d ${hours}h ${minutes}m`;
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

  // Basic Form Submission Demo
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Reset errors
      form.querySelectorAll('.field-error').forEach(el => el.style.display = 'none');
      form.querySelectorAll('.field').forEach(el => el.classList.remove('has-error'));
      
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

      if (!isValid) return;

      // Real API call to send OTP
      const submitBtn = form.querySelector('[data-submit]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Processing...';
      submitBtn.disabled = true;

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      
      const recaptchaResponse = document.querySelector('.g-recaptcha-response');
      if (recaptchaResponse) {
        data.recaptchaToken = recaptchaResponse.value;
      }

      fetch('/register/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(resData => {
        if (!resData.success) {
          throw new Error(resData.message || 'Something went wrong');
        }
        
        const otpModal = document.querySelector('[data-otp-modal]');
        if (otpModal) otpModal.showModal();
      })
      .catch(err => {
        const errorEl = form.querySelector('[data-form-error]');
        if (errorEl) {
          errorEl.textContent = err.message;
          errorEl.style.display = 'block';
        }
      })
      .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
    });
  }
  
  // OTP Verification Logic
  const otpModal = document.querySelector('[data-otp-modal]');
  const otpBtn = document.getElementById('verify-otp-btn');
  const otpClose = document.querySelector('[data-otp-close]');
  
  const otpInputs = document.querySelectorAll('.otp-digit');
  const hiddenOtpInput = document.getElementById('otp-input');
  
  if (otpInputs.length > 0) {
    otpInputs.forEach((input, index) => {
      input.addEventListener('input', (e) => {
        // Auto advance
        if (e.target.value.length === 1) {
          if (index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
          }
        }
        updateHiddenOtp();
      });
      input.addEventListener('keydown', (e) => {
        // Auto backspace
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
          otpInputs[index - 1].focus();
        }
      });
    });
    
    function updateHiddenOtp() {
      let val = '';
      otpInputs.forEach(i => val += i.value);
      if (hiddenOtpInput) hiddenOtpInput.value = val;
    }
  }
  
  if (otpModal && otpBtn) {
    if (otpClose) {
      otpClose.addEventListener('click', () => otpModal.close());
    }

    otpBtn.addEventListener('click', () => {
      const otpInput = document.getElementById('otp-input').value;
      const email = document.getElementById('reg-email').value;
      const otpErr = document.getElementById('otp-err');
      
      if (otpInput.length < 4) {
        otpErr.textContent = 'Please enter the 4-digit OTP';
        return;
      }
      
      otpBtn.disabled = true;
      otpBtn.textContent = 'Verifying...';
      otpErr.textContent = '';
      
      fetch('/register/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpInput })
      })
      .then(res => res.json())
      .then(resData => {
        if (!resData.success) throw new Error(resData.message);
        
        otpModal.close();
        
        if (form && successState) {
          form.hidden = true;
          successState.hidden = false;
          successState.focus();
          
          const name = document.getElementById('reg-name').value;
          const role = typeSelect ? typeSelect.options[typeSelect.selectedIndex].text : '';
          const passType = document.querySelector('input[name="pass"]:checked').value;
          
          const passEmailEl = document.querySelector('[data-pass-email]');
          if (passEmailEl) passEmailEl.textContent = email;
          const passNameEl = document.querySelector('[data-pass-name]');
          if (passNameEl) passNameEl.textContent = name;
          const passRoleEl = document.querySelector('[data-pass-role]');
          if (passRoleEl) passRoleEl.textContent = role;
          const passTypeEl = document.querySelector('[data-pass-type]');
          if (passTypeEl) passTypeEl.textContent = passType;
          const passIdEl = document.querySelector('[data-pass-id]');
          if (passIdEl) passIdEl.textContent = resData.id || 'SC000000';
        }
      })
      .catch(err => {
        otpErr.textContent = err.message;
      })
      .finally(() => {
        otpBtn.disabled = false;
        otpBtn.textContent = 'Verify & Submit';
      });
    });
  }
  
  // Register another
  const regAnother = document.querySelector('[data-register-another]');
  if (regAnother && form && successState) {
    regAnother.addEventListener('click', () => {
      form.reset();
      successState.hidden = true;
      form.hidden = false;
      const submitBtn = form.querySelector('[data-submit]');
      if (submitBtn) {
        submitBtn.textContent = 'Complete Registration';
        submitBtn.disabled = false;
      }
      if (pitchToggle) pitchToggle.dispatchEvent(new Event('change'));
    });
  }

  // Print Pass Logic
  const printBtn = document.querySelector('[data-print-pass]');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }



  /* --- 8. EVENT JOURNEY ACCORDION --- */
  const journey = document.querySelector('[data-journey]');
  const finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (journey) {
    const stages = Array.from(journey.querySelectorAll('.jr-item'));
    let hoverTimer = null;

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

      toggle.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        if (isOpen && !finePointer) setStage(item, false);
        else openOnly(item);
      });

      if (finePointer) {
        item.addEventListener('pointerenter', () => {
          clearTimeout(hoverTimer);
          hoverTimer = setTimeout(() => {
            if (!item.classList.contains('is-open')) openOnly(item);
          }, 140);
        });
        item.addEventListener('pointerleave', () => { clearTimeout(hoverTimer); });
      }
    });
  }

  // Journey arrow links with data-goto-day open the matching schedule tab
  document.querySelectorAll('[data-goto-day]').forEach(link => {
    link.addEventListener('click', () => {
      const tab = document.getElementById('tab-' + link.getAttribute('data-goto-day'));
      if (tab && tab.getAttribute('aria-selected') !== 'true') tab.click();
    });
  });

});
