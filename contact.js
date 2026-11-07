/* =========================================================
   DEZYNVIA — contact.js
   Validates the inquiry form and submits it to the endpoint set in
   js/config.js (formEndpoint). If no endpoint is set, the form
   honestly reports that sending is not configured and offers
   WhatsApp instead. It never claims a message was delivered
   unless the server confirmed success.
   ========================================================= */
(function () {
  'use strict';

  var form = document.getElementById('contact-form');
  if (!form) return;

  var cfg = window.DEZYNVIA_CONFIG || {};
  var statusBox = document.getElementById('form-status');
  var submitBtn = form.querySelector('button[type="submit"]');
  var submitting = false;
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function showStatus(type, msg) {
    statusBox.className = 'form-status is-visible ' + type;
    statusBox.textContent = msg;
    statusBox.focus();
  }

  function setError(field, msg) {
    var wrap = field.closest('.field');
    var err = wrap.querySelector('.field-error');
    wrap.classList.toggle('has-error', !!msg);
    err.textContent = msg || '';
    if (msg) field.setAttribute('aria-invalid', 'true'); else field.removeAttribute('aria-invalid');
  }

  function validate() {
    var ok = true, firstBad = null;
    var name = form.elements.name, email = form.elements.email,
        service = form.elements.service, details = form.elements.details;

    function fail(el, msg) { setError(el, msg); ok = false; if (!firstBad) firstBad = el; }

    if (name.value.trim().length < 2) fail(name, 'Please enter your full name.'); else setError(name, '');
    if (!email.value.trim()) fail(email, 'Please enter your email address.');
    else if (!EMAIL_RE.test(email.value.trim())) fail(email, 'Please enter a valid email address.');
    else setError(email, '');
    if (!service.value) fail(service, 'Please choose a service.'); else setError(service, '');
    if (details.value.trim().length < 20) fail(details, 'Please describe your project (at least 20 characters).'); else setError(details, '');

    if (firstBad) firstBad.focus();
    return ok;
  }

  // Clear an error as soon as the user edits the field
  Array.prototype.forEach.call(form.elements, function (el) {
    el.addEventListener('input', function () { if (el.closest('.field')) setError(el, ''); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (submitting) return;                 // block duplicate submissions
    statusBox.className = 'form-status';    // hide old message

    // Honeypot: real users never fill this hidden field
    if (form.elements.company_website && form.elements.company_website.value) return;

    if (!validate()) {
      showStatus('error', 'Please fix the highlighted fields and try again.');
      return;
    }

    if (!cfg.formEndpoint) {
      showStatus('info',
        'Your message was NOT sent: the contact form is not connected to a service yet. ' +
        'Please use WhatsApp or email us directly. (Site owner: set formEndpoint in js/config.js.)');
      return;
    }

    submitting = true;
    submitBtn.disabled = true;
    var oldLabel = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';

    var data = new FormData(form);
    data.delete('company_website');

    fetch(cfg.formEndpoint, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    }).then(function (res) {
      if (res.ok) {
        form.reset();
        showStatus('success', 'Thank you! Your message was sent successfully. We will get back to you soon.');
      } else {
        showStatus('error', 'The server could not accept your message (error ' + res.status + '). Please try again or contact us on WhatsApp.');
      }
    }).catch(function () {
      showStatus('error', 'Network error: your message was not sent. Please check your connection and try again.');
    }).then(function () {
      submitting = false;
      submitBtn.disabled = false;
      submitBtn.textContent = oldLabel;
    });
  });

  /* ---------- "Send this via WhatsApp" with the form's details ---------- */
  var waBtn = document.getElementById('wa-from-form');
  if (waBtn) {
    waBtn.addEventListener('click', function () {
      var wa = window.DezynviaWhatsApp;
      if (!wa || !wa.configured()) {
        showStatus('info', 'WhatsApp is not configured yet. Site owner: set whatsappNumber in js/config.js.');
        return;
      }
      var f = form.elements;
      var lines = [cfg.whatsappMessage || 'Hello Dezynvia!'];
      if (f.name.value.trim()) lines.push('Name: ' + f.name.value.trim());
      if (f.service.value) lines.push('Service: ' + f.service.value);
      if (f.details.value.trim()) lines.push('Details: ' + f.details.value.trim());
      window.open(wa.url(lines.join('\n')), '_blank', 'noopener');
    });
  }
})();
