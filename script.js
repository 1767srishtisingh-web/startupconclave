/* =========================================================
   Startup Conclave '26 — interactions (vanilla JS, no backend)
   ========================================================= */
(function () {
  'use strict';

  // Registration deadline: 10 October 2026, 11:59:59 pm IST
  var DEADLINE = new Date('2026-10-10T23:59:59+05:30');
  var STORAGE_KEY = 'sc26-registration';
  var THEME_KEY = 'sc26-theme';

  // OPTIONAL: paste a form-service URL here (e.g. https://formspree.io/f/xxxxxx)
  // to receive registrations by email. Leave empty to run in preview mode,
  // where registrations are stored only in the visitor's browser.
  var FORM_ENDPOINT = '';

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  // Safe storage helpers (storage can be blocked, e.g. private mode)
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } },
    remove: function (k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } }
  };

  /* ---------- Toast ---------- */
  var toastEl = $('[data-toast]');
  var toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-visible'); }, 3200);
  }

  /* ---------- Theme toggle ---------- */
  var themeBtn = $('[data-theme-toggle]');
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function currentTheme() {
    var set = document.documentElement.getAttribute('data-theme');
    if (set) return set;
    return mq && mq.matches ? 'dark' : 'light';
  }
  function syncThemeButton() {
    if (!themeBtn) return;
    var dark = currentTheme() === 'dark';
    themeBtn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#0A1528' : '#F4F6FA');
  }
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      store.set(THEME_KEY, next);
      syncThemeButton();
    });
    syncThemeButton();
  }

  /* ---------- Header: scrolled state ---------- */
  var header = $('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  var nav = $('#main-nav');
  var navToggle = $('[data-nav-toggle]');

  function setNav(open) {
    if (!nav || !navToggle) return;
    nav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('nav-open', open);
  }
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      setNav(navToggle.getAttribute('aria-expanded') !== 'true');
    });
  }
  if (nav) {
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav && nav.classList.contains('is-open')) {
      setNav(false);
      navToggle.focus();
    }
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 960 && nav && nav.classList.contains('is-open')) setNav(false);
  });

  /* ---------- Active nav link on scroll ---------- */
  var navLinks = $$('.nav-link');
  var sections = navLinks
    .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting; });
      var active = null;
      for (var i = 0; i < sections.length; i++) {
        if (visible[sections[i].id]) { active = sections[i].id; break; }
      }
      navLinks.forEach(function (a) {
        var on = a.getAttribute('href') === '#' + active;
        a.classList.toggle('is-current', on);
        if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { io.observe(s); });
  }

  /* ---------- Countdown ---------- */
  var cdWrap = $('[data-countdown]');
  var cdInline = $('[data-countdown-inline]');
  var pad = function (n) { return String(n).padStart(2, '0'); };

  function tick() {
    var diff = DEADLINE.getTime() - Date.now();
    if (diff <= 0) {
      if (cdWrap) {
        cdWrap.classList.add('is-closed');
        $$('[data-cd]', cdWrap).forEach(function (el) { el.textContent = '00'; });
      }
      if (cdInline) cdInline.textContent = 'Registration closed';
      closeRegistration();
      return false;
    }
    var s = Math.floor(diff / 1000);
    var d = Math.floor(s / 86400);
    var h = Math.floor((s % 86400) / 3600);
    var m = Math.floor((s % 3600) / 60);
    var sec = s % 60;
    if (cdWrap) {
      $('[data-cd="days"]', cdWrap).textContent = pad(d);
      $('[data-cd="hours"]', cdWrap).textContent = pad(h);
      $('[data-cd="minutes"]', cdWrap).textContent = pad(m);
      $('[data-cd="seconds"]', cdWrap).textContent = pad(sec);
    }
    if (cdInline) {
      cdInline.textContent = d > 0
        ? d + (d === 1 ? ' day, ' : ' days, ') + h + (h === 1 ? ' hour' : ' hours')
        : h + ' h ' + m + ' min';
    }
    return true;
  }

  /* ---------- Schedule: day tabs ---------- */
  var dayTabs = $$('[data-day-tab]');
  function selectDay(tab, focus) {
    dayTabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
    if (focus) tab.focus();
  }
  dayTabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectDay(tab); });
    tab.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        var next = dayTabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + dayTabs.length) % dayTabs.length];
        selectDay(next, true);
      }
    });
  });

  /* ---------- Schedule: type filter ---------- */
  var sessionChips = $$('[data-session-filter]');
  sessionChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var type = chip.getAttribute('data-session-filter');
      sessionChips.forEach(function (c) {
        var on = c === chip;
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-pressed', String(on));
      });
      $$('.day-panel').forEach(function (panel) {
        var shown = 0;
        $$('.session', panel).forEach(function (s) {
          var match = type === 'all' || s.getAttribute('data-type') === type;
          s.classList.toggle('is-hidden', !match);
          if (match) shown++;
        });
        var empty = $('.empty-state', panel);
        if (empty) empty.hidden = shown > 0;
      });
    });
  });

  /* ---------- Schedule: add to calendar (.ics) ---------- */
  var ICS_EVENTS = {
    day1: { start: '20261015T033000Z', end: '20261015T123000Z', title: "Startup Conclave '26, Day 1", desc: 'Ideate and ignite: keynotes, workshop and pitch competition round 1.' },
    day2: { start: '20261016T040000Z', end: '20261016T123000Z', title: "Startup Conclave '26, Day 2", desc: 'Inspire and impact: masterclasses, pitch finals and seed funding announcement.' }
  };
  $$('[data-ics]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var ev = ICS_EVENTS[btn.getAttribute('data-ics')];
      if (!ev) return;
      var stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      var ics = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//AKGEC IDEA Lab//Startup Conclave 26//EN', 'CALSCALE:GREGORIAN',
        'BEGIN:VEVENT',
        'UID:' + btn.getAttribute('data-ics') + '-sc26@akgec.ac.in',
        'DTSTAMP:' + stamp,
        'DTSTART:' + ev.start,
        'DTEND:' + ev.end,
        'SUMMARY:' + ev.title,
        'DESCRIPTION:' + ev.desc,
        'LOCATION:AKGEC Campus\\, 27th KM Milestone\\, Delhi-Meerut Expressway\\, Ghaziabad',
        'END:VEVENT', 'END:VCALENDAR'
      ].join('\r\n');
      var blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'startup-conclave-26-' + btn.getAttribute('data-ics') + '.ics';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      toast('Calendar file downloaded. Open it to add the event.');
    });
  });

  /* ---------- Speakers: filter ---------- */
  var roleChips = $$('[data-role-filter]');
  roleChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var role = chip.getAttribute('data-role-filter');
      roleChips.forEach(function (c) {
        var on = c === chip;
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-pressed', String(on));
      });
      $$('.speaker').forEach(function (s) {
        s.classList.toggle('is-hidden', !(role === 'all' || s.getAttribute('data-role') === role));
      });
    });
  });

  /* ---------- Dialog helpers ---------- */
  var lastFocus = null;
  function openModal(dlg) {
    if (!dlg) return;
    lastFocus = document.activeElement;
    if (typeof dlg.showModal === 'function') dlg.showModal();
    else dlg.setAttribute('open', '');
    document.body.classList.add('modal-open');
  }
  function closeModal(dlg) {
    if (!dlg) return;
    if (typeof dlg.close === 'function') dlg.close();
    else dlg.removeAttribute('open');
  }
  $$('dialog.modal').forEach(function (dlg) {
    dlg.addEventListener('close', function () {
      document.body.classList.remove('modal-open');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    });
    // Click on backdrop closes
    dlg.addEventListener('click', function (e) {
      if (e.target === dlg) closeModal(dlg);
    });
    $$('[data-modal-close]', dlg).forEach(function (b) {
      b.addEventListener('click', function () { closeModal(dlg); });
    });
  });

  /* ---------- Poster lightbox ---------- */
  var posterModal = $('[data-poster-modal]');
  $$('[data-poster-open]').forEach(function (btn) {
    btn.addEventListener('click', function () { openModal(posterModal); });
  });

  /* ---------- Speaker details ---------- */
  var SPEAKERS = {
    aman: {
      initials: 'AK', color: 'var(--blue)', name: 'Aman Kumar', role: 'AI Research Director, TechVision',
      bio: 'Aman leads applied AI research at TechVision and advises early-stage teams building on machine learning. He started his first venture as an undergraduate.',
      session: 'Keynote: Building a startup from campus. Day 1, 10:45'
    },
    ravi: {
      initials: 'RM', color: 'var(--green)', name: 'Dr. Ravi Menon', role: 'CTO, Quantum Startups',
      bio: 'Ravi has built engineering teams from the first hire to over a hundred people, and mentors founders on technical hiring and architecture choices.',
      session: 'Fireside chat: From first customer to first hire. Day 2, 11:00'
    },
    sangam: {
      initials: 'SG', color: 'var(--red)', name: 'Sangam', role: 'Partner, Horizon Ventures',
      bio: 'Sangam invests in pre-seed and seed-stage companies across SaaS and deep tech, and sits on the investor jury for both pitch rounds.',
      session: 'Jury, pitch competition round 1 (Day 1, 14:00) and finals (Day 2, 12:00)'
    },
    abhishek: {
      initials: 'AB', color: 'var(--amber)', name: 'Abhishek', role: 'Co-founder, Nexus Labs',
      bio: 'Abhishek co-founded Nexus Labs and has shipped products used by thousands of students. He runs mentor office hours on both days.',
      session: 'Workshop: Prototyping on a student budget. Day 2, 09:30'
    }
  };
  var speakerModal = $('[data-speaker-modal]');
  $$('[data-speaker]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var s = SPEAKERS[btn.getAttribute('data-speaker')];
      if (!s || !speakerModal) return;
      var av = $('[data-sm-avatar]', speakerModal);
      av.textContent = s.initials;
      av.style.setProperty('--avatar', s.color);
      $('[data-sm-name]', speakerModal).textContent = s.name;
      $('[data-sm-role]', speakerModal).textContent = s.role;
      $('[data-sm-bio]', speakerModal).textContent = s.bio;
      $('[data-sm-session]', speakerModal).textContent = s.session;
      openModal(speakerModal);
    });
  });

  /* ---------- Who it's for ---------- */
  var AUDIENCE = {
    student: {
      label: 'student',
      title: 'You have an idea and want to know if it’s worth pursuing',
      desc: 'Test your idea with mentors, learn how founders validate early, and pitch in round 1 even if you only have a concept.',
      gets: ['Problem-framing workshop with mentors', 'A place in the pitch competition', 'Talks from founders who started in college'],
      bring: 'Your college ID and your idea in one sentence.',
      pass: 'Full event'
    },
    startup: {
      label: 'startup',
      title: 'You’re building and need feedback, funding or both',
      desc: 'Pitch to an investor jury, compete for the ~₹50,000 prize pool, pre-incubation pathways and seed-funding access.',
      gets: ['Two pitch rounds in front of investors', 'Eligibility for seed funding', 'Mentor office hours on unit economics'],
      bring: 'A five-minute deck, a laptop, and any traction numbers you have.',
      pass: 'Full event'
    },
    innovator: {
      label: 'innovator',
      title: 'You’ve built something and want to find its market',
      desc: 'Bring a prototype, research project or invention and learn how to turn it into a product people will pay for.',
      gets: ['Prototyping and market-fit workshops', 'Introductions to potential co-founders', 'A path into AKGEC IDEA Lab incubation'],
      bring: 'Photos or a demo of what you’ve built.',
      pass: 'Full event or Day 2'
    },
    entrepreneur: {
      label: 'entrepreneur',
      title: 'You’ve done this before and want to meet what’s next',
      desc: 'Meet student founders and early teams, share what you’ve learned at the roundtables, and scout ideas worth backing.',
      gets: ['Founder roundtables and investor meetups', 'Early look at pitching teams', 'Networking across both days'],
      bring: 'Business cards or a QR code for your profile.',
      pass: 'Day 1 or full event'
    }
  };
  var segments = $$('[data-audience]');
  var audPanel = $('#audience-panel');
  var regType = $('#reg-type');

  function renderAudience(key) {
    var a = AUDIENCE[key];
    if (!a || !audPanel) return;
    $('[data-audience-title]', audPanel).textContent = a.title;
    $('[data-audience-desc]', audPanel).textContent = a.desc;
    var list = $('[data-audience-gets]', audPanel);
    list.innerHTML = '';
    a.gets.forEach(function (g) {
      var li = document.createElement('li');
      li.textContent = g;
      list.appendChild(li);
    });
    $('[data-audience-bring]', audPanel).textContent = a.bring;
    $('[data-audience-pass]', audPanel).textContent = a.pass;
    var cta = $('[data-audience-cta]', audPanel);
    cta.textContent = 'Register as ' + (/^[aeiou]/.test(a.label) ? 'an ' : 'a ') + a.label;
    cta.setAttribute('data-type', key);
  }
  function selectSegment(seg, focus) {
    segments.forEach(function (s) {
      var on = s === seg;
      s.setAttribute('aria-selected', String(on));
      s.tabIndex = on ? 0 : -1;
    });
    if (audPanel) audPanel.setAttribute('aria-labelledby', seg.id);
    renderAudience(seg.getAttribute('data-audience'));
    if (focus) seg.focus();
  }
  segments.forEach(function (seg, i) {
    seg.addEventListener('click', function () { selectSegment(seg); });
    seg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        var next = segments[(i + (e.key === 'ArrowRight' ? 1 : -1) + segments.length) % segments.length];
        selectSegment(next, true);
      }
    });
  });
  if (segments.length) renderAudience('student');

  var audCta = $('[data-audience-cta]');
  if (audCta && regType) {
    audCta.addEventListener('click', function () {
      regType.value = audCta.getAttribute('data-type') || 'student';
      regType.dispatchEvent(new Event('change'));
    });
  }

  /* ---------- Registration form ---------- */
  var form = $('[data-reg-form]');
  var success = $('[data-reg-success]');
  var closed = $('[data-reg-closed]');
  var pitchToggle = form ? $('[data-pitch-toggle]', form) : null;
  var pitchFields = form ? $('[data-pitch-fields]', form) : null;
  var exhibitToggle = form ? $('[data-exhibit-toggle]', form) : null;
  var exhibitFields = form ? $('[data-exhibit-fields]', form) : null;
  var passHint = form ? $('[data-pass-hint]', form) : null;
  var registrationOpen = true;

  function closeRegistration() {
    if (!registrationOpen) return;
    registrationOpen = false;
    if (form) form.hidden = true;
    if (closed && (!success || success.hidden)) closed.hidden = false;
  }

  function isStudent() { return regType && regType.value === 'student'; }

  function updateTypeFields() {
    if (!form) return;
    var student = isStudent();
    $$('[data-student-only]', form).forEach(function (el) { el.hidden = !student; });
    $('#reg-year').required = student;
    var label = $('[data-org-label]', form);
    var map = { student: 'College', startup: 'Startup name', innovator: 'Institution or organisation', entrepreneur: 'Company' };
    if (label) label.textContent = map[regType.value] || 'Organisation';
    var hint = $('[data-email-hint]', form);
    if (hint) {
      hint.textContent = student
        ? 'Students register with their college email (ending in .ac.in or .edu).'
        : 'Use the email you check most. We’ll send payment details and updates here.';
    }
    clearError('reg-email');
    clearError('reg-year');
  }

  function updateTrackFields() {
    if (!form) return;
    var pitchOn = !!(pitchToggle && pitchToggle.checked);
    var exhibitOn = !!(exhibitToggle && exhibitToggle.checked);

    if (pitchFields) pitchFields.hidden = !pitchOn;
    var ventureInput = $('#reg-venture');
    if (ventureInput) ventureInput.required = pitchOn;

    if (exhibitFields) exhibitFields.hidden = !exhibitOn;
    var exhibitInput = $('#reg-exhibit-name');
    if (exhibitInput) exhibitInput.required = exhibitOn;

    var eitherOn = pitchOn || exhibitOn;
    $$('input[name="pass"]', form).forEach(function (r) {
      if (r.value !== 'Full event pass') r.disabled = eitherOn;
      if (eitherOn && r.value === 'Full event pass') r.checked = true;
    });
    if (passHint) passHint.hidden = !eitherOn;
  }

  function setError(id, msg) {
    var input = document.getElementById(id);
    var err = document.getElementById(id + '-err');
    if (err) err.textContent = msg;
    if (input) {
      input.setAttribute('aria-invalid', 'true');
      var desc = (input.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
      if (desc.indexOf(id + '-err') === -1) desc.push(id + '-err');
      input.setAttribute('aria-describedby', desc.join(' '));
      var field = input.closest('.field');
      if (field) field.classList.add('has-error');
    }
  }
  function clearError(id) {
    var input = document.getElementById(id);
    var err = document.getElementById(id + '-err');
    if (err) err.textContent = '';
    if (input) {
      input.removeAttribute('aria-invalid');
      var field = input.closest('.field');
      if (field) field.classList.remove('has-error');
    }
  }

  var COLLEGE_EMAIL = /@[a-z0-9.-]+\.(ac\.in|edu|edu\.in)$/i;
  var ANY_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function validate() {
    var ok = true;
    var first = null;
    function fail(id, msg) {
      setError(id, msg);
      ok = false;
      if (!first) first = document.getElementById(id);
    }
    ['reg-name', 'reg-email', 'reg-phone', 'reg-org', 'reg-year', 'reg-venture', 'reg-exhibit-name', 'reg-agree'].forEach(clearError);

    var name = form.name.value.trim();
    if (name.length < 2) fail('reg-name', 'Enter your full name.');

    if (isStudent() && !form.year.value) fail('reg-year', 'Select your year of study.');

    var email = form.email.value.trim();
    if (!email) fail('reg-email', 'Enter your email address.');
    else if (!ANY_EMAIL.test(email)) fail('reg-email', 'Enter an email in the format name@example.com.');
    else if (isStudent() && !COLLEGE_EMAIL.test(email)) fail('reg-email', 'Use your college email ending in .ac.in or .edu. Registering as a startup or innovator? Change “Joining as” above.');

    var phone = form.phone.value.replace(/[\s-]/g, '').replace(/^(\+91|0)/, '');
    if (!/^[6-9]\d{9}$/.test(phone)) fail('reg-phone', 'Enter a 10-digit Indian mobile number.');

    if (!form.org.value.trim()) {
      var lbl = $('[data-org-label]', form);
      fail('reg-org', 'Enter your ' + (lbl ? lbl.textContent.toLowerCase() : 'organisation') + '.');
    }

    if (pitchToggle.checked && !form.venture.value.trim()) fail('reg-venture', 'Enter a name for your startup or idea. A working title is fine.');

    if (exhibitToggle && exhibitToggle.checked && !form.exhibit_name.value.trim()) fail('reg-exhibit-name', 'Enter the name of the product or prototype you will exhibit.');

    if (!form.agree.checked) {
      var e = document.getElementById('reg-agree-err');
      if (e) e.textContent = 'Tick this box to confirm before registering.';
      ok = false;
      if (!first) first = form.agree;
    }

    if (first) first.focus();
    return ok;
  }

  function makePassId() {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var out = '';
    for (var i = 0; i < 5; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return 'SC26-' + out;
  }

  var TYPE_LABEL = { student: 'Student', startup: 'Startup', innovator: 'Innovator', entrepreneur: 'Entrepreneur' };

  function showPass(data) {
    if (!success) return;
    $('[data-pass-name]', success).textContent = data.name;
    var tracks = [];
    if (data.exhibit) tracks.push('exhibiting');
    if (data.pitch) tracks.push('pitching');
    $('[data-pass-type]', success).textContent = data.pass + (tracks.length ? ', ' + tracks.join(' & ') : '');
    $('[data-pass-role]', success).textContent = TYPE_LABEL[data.type] || data.type;
    $('[data-pass-id]', success).textContent = data.id;
    var msg = $('[data-success-msg]', success);
    if (FORM_ENDPOINT) {
      msg.innerHTML = 'Your pass is saved. Payment details will be sent to <strong></strong>.';
    } else {
      msg.innerHTML = 'Your pass is saved in this browser. In preview mode no email is sent to <strong></strong>.';
    }
    $('strong', msg).textContent = data.email;
    form.hidden = true;
    if (closed) closed.hidden = true;
    success.hidden = false;
  }

  if (form) {
    regType.addEventListener('change', updateTypeFields);
    pitchToggle.addEventListener('change', updateTrackFields);
    if (exhibitToggle) exhibitToggle.addEventListener('change', updateTrackFields);

    // Clear an error as soon as the person edits that field
    form.addEventListener('input', function (e) {
      if (e.target.id) clearError(e.target.id);
      if (e.target.name === 'agree') {
        var err = document.getElementById('reg-agree-err');
        if (err) err.textContent = '';
      }
    });
    form.addEventListener('change', function (e) {
      if (e.target.name === 'agree') {
        var err = document.getElementById('reg-agree-err');
        if (err) err.textContent = '';
      }
    });

    var oneliner = $('#reg-oneliner');
    var counter = $('[data-char-count]');
    if (oneliner && counter) {
      oneliner.addEventListener('input', function () { counter.textContent = oneliner.value.length; });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!registrationOpen) return;
      if (!validate()) return;

      var data = {
        id: makePassId(),
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        type: form.type.value,
        year: isStudent() ? form.year.value : '',
        org: form.org.value.trim(),
        pass: (form.querySelector('input[name="pass"]:checked') || {}).value || 'Full event pass',
        pitch: pitchToggle.checked,
        venture: pitchToggle.checked ? form.venture.value.trim() : '',
        team: pitchToggle.checked ? form.team.value : '',
        oneliner: pitchToggle.checked ? form.oneliner.value.trim() : '',
        exhibit: !!(exhibitToggle && exhibitToggle.checked),
        exhibitName: exhibitToggle && exhibitToggle.checked ? form.exhibit_name.value.trim() : '',
        prototypeStage: exhibitToggle && exhibitToggle.checked ? form.prototype_stage.value : '',
        createdAt: new Date().toISOString()
      };

      var formErr = $('[data-form-error]', form);
      var submitBtn = $('[data-submit]', form);
      formErr.textContent = '';

      function done() {
        store.set(STORAGE_KEY, JSON.stringify(data));
        showPass(data);
        success.focus();
        toast('Registered. Your pass ID is ' + data.id + '.');
      }

      if (!FORM_ENDPOINT) { done(); return; }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Registering…';
      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        done();
      }).catch(function () {
        formErr.textContent = 'Registration didn’t go through. Check your connection and select Register again, or call a coordinator listed below.';
      }).then(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Register';
      });
    });

    var demoNote = $('[data-demo-note]', form);
    if (demoNote) demoNote.hidden = !!FORM_ENDPOINT;

    updateTypeFields();
    updateTrackFields();
  }

  // Restore a saved registration
  var saved = store.get(STORAGE_KEY);
  if (saved && form) {
    try { showPass(JSON.parse(saved)); } catch (e) { store.remove(STORAGE_KEY); }
  }

  var printBtn = $('[data-print-pass]');
  if (printBtn) printBtn.addEventListener('click', function () { window.print(); });

  var againBtn = $('[data-register-another]');
  if (againBtn) {
    againBtn.addEventListener('click', function () {
      store.remove(STORAGE_KEY);
      form.reset();
      updateTypeFields();
      updateTrackFields();
      var c = $('[data-char-count]');
      if (c) c.textContent = '0';
      success.hidden = true;
      if (registrationOpen) {
        form.hidden = false;
        form.name.focus();
      } else if (closed) {
        closed.hidden = false;
      }
    });
  }

  // "Register to pitch" in the funding band pre-ticks the pitch option
  $$('[data-preselect-pitch]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (pitchToggle && !pitchToggle.checked) {
        pitchToggle.checked = true;
        updateTrackFields();
      }
    });
  });

  // "Register for Exhibition" buttons pre-tick the exhibition track
  $$('[data-preselect-exhibit]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (exhibitToggle && !exhibitToggle.checked) {
        exhibitToggle.checked = true;
        updateTrackFields();
      }
    });
  });

  /* ---------- Event journey: hover (desktop) or tap (touch) to open a stage ---------- */
  var journey = $('[data-journey]');
  var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (journey) {
    var stages = $$('.jr-item', journey);
    var hoverTimer = null;

    function setStage(item, open) {
      item.classList.toggle('is-open', open);
      $('.jr-toggle', item).setAttribute('aria-expanded', String(open));
    }
    function openOnly(target) {
      stages.forEach(function (item) { setStage(item, item === target); });
    }

    stages.forEach(function (item) {
      var toggle = $('.jr-toggle', item);

      toggle.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');
        // Mouse users open by hovering, so a click never collapses the card under the cursor.
        // On touch screens (and via keyboard on touch devices) a second tap closes it.
        if (isOpen && !finePointer) setStage(item, false);
        else openOnly(item);
      });

      if (finePointer) {
        // Short delay so sweeping the cursor across the list doesn't flicker every stage open
        item.addEventListener('pointerenter', function () {
          clearTimeout(hoverTimer);
          hoverTimer = setTimeout(function () {
            if (!item.classList.contains('is-open')) openOnly(item);
          }, 140);
        });
        item.addEventListener('pointerleave', function () { clearTimeout(hoverTimer); });
      }
    });
  }

  // Journey arrow links with data-goto-day open the matching schedule tab
  $$('[data-goto-day]').forEach(function (link) {
    link.addEventListener('click', function () {
      var tab = document.getElementById('tab-' + link.getAttribute('data-goto-day'));
      if (tab && tab.getAttribute('aria-selected') !== 'true') tab.click();
    });
  });

  // Start countdown after the form is wired so a closed deadline hides it correctly
  if (tick()) {
    var timer = setInterval(function () { if (!tick()) clearInterval(timer); }, 1000);
  }

  /* ---------- Newsletter ---------- */
  var news = $('[data-news-form]');
  if (news) {
    var newsErr = $('[data-news-error]');
    var newsInput = $('input', news);
    newsInput.addEventListener('input', function () { newsErr.textContent = ''; });
    news.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = newsInput.value.trim();
      if (!ANY_EMAIL.test(v)) {
        newsErr.textContent = 'Enter a valid email address, like name@example.com.';
        newsInput.focus();
        return;
      }
      newsErr.textContent = '';
      store.set('sc26-newsletter', v);
      news.reset();
      toast('Subscribed. Updates will go to ' + v + '.');
    });
  }

  /* ---------- Hero mini-countdown widget (data-hero-countdown) ---------- */
  (function () {
    var widget = document.querySelector('[data-hero-countdown]');
    if (!widget) return;
    function pad(n) { return String(n).padStart(2, '0'); }
    function tick() {
      var diff = DEADLINE - Date.now();
      if (diff <= 0) {
        widget.innerHTML = '<span style="font-size:0.9rem;font-weight:700;color:var(--red)">Registration Closed</span>';
        return;
      }
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      var days  = widget.querySelector('[data-hcd="days"]');
      var hours = widget.querySelector('[data-hcd="hours"]');
      var mins  = widget.querySelector('[data-hcd="mins"]');
      var secs  = widget.querySelector('[data-hcd="secs"]');
      if (days)  days.textContent  = pad(d);
      if (hours) hours.textContent = pad(h);
      if (mins)  mins.textContent  = pad(m);
      if (secs)  secs.textContent  = pad(s);
    }
    tick();
    setInterval(tick, 1000);
  })();
})();
