/* Concitor TCG — shared JS */

// ── Mobile nav ──
(function () {
  var toggle = document.getElementById('nav-toggle');
  var mobileNav = document.getElementById('mobile-nav');
  if (!toggle || !mobileNav) return;
  toggle.addEventListener('click', function () {
    var open = mobileNav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();

// ── Hash-based tab routing ──
// Used on services.html (svc-tab-btn + svc-content[data-svc])
// and on index.html (tech-tab + tech-panel[data-tech])
(function () {
  // Services tabs
  var svcBtns = document.querySelectorAll('.svc-tab-btn');
  var svcPanels = document.querySelectorAll('.svc-content');
  if (svcBtns.length && svcPanels.length) {
    function activateSvc(id) {
      svcBtns.forEach(function (b) {
        var active = b.dataset.svc === id;
        b.classList.toggle('active', active);
        b.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      svcPanels.forEach(function (p) {
        p.classList.toggle('active', p.dataset.svc === id);
      });
    }
    svcBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.dataset.svc;
        history.replaceState(null, '', '#' + id);
        activateSvc(id);
      });
      b.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); b.click(); }
      });
    });
    var hash = location.hash.replace('#', '');
    var valid = ['navigate', 'perform', 'transform'];
    activateSvc(valid.includes(hash) ? hash : 'navigate');
  }

  // Tech tabs (index)
  var techBtns = document.querySelectorAll('.tech-tab');
  var techPanels = document.querySelectorAll('.tech-panel');
  if (techBtns.length && techPanels.length) {
    function activateTech(idx) {
      techBtns.forEach(function (b, i) {
        var active = i === idx;
        b.classList.toggle('active', active);
        b.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      techPanels.forEach(function (p, i) {
        p.style.display = i === idx ? 'block' : 'none';
      });
    }
    techBtns.forEach(function (b, i) {
      b.addEventListener('click', function () { activateTech(i); });
      b.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); b.click(); }
      });
    });
    activateTech(0);
  }
})();

// ── Contact form ──
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;
  var success = document.getElementById('form-success');
  var error = document.getElementById('form-error');
  var another = document.getElementById('form-another');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    // Honeypot check
    if (form.querySelector('[name="_honey"]').value) return;

    var data = new FormData(form);
    fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    }).then(function (res) {
      if (res.ok) {
        form.style.display = 'none';
        success.classList.add('visible');
        if (error) error.classList.remove('visible');
      } else {
        return res.json().then(function (j) {
          throw new Error(j.error || 'Send failed');
        });
      }
    }).catch(function (err) {
      if (error) {
        error.textContent = 'Something went wrong — please try again or email us directly at ckwon@concitor.com';
        error.classList.add('visible');
      }
    });
  });

  if (another) {
    another.addEventListener('click', function () {
      success.classList.remove('visible');
      form.reset();
      form.style.display = 'flex';
    });
  }
})();
