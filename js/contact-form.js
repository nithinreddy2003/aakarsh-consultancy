/**
 * Aakarsh Consultancy - Contact Form Integration
 * Saves enquiries to Google Forms
 * Includes honeypot and timing protection against spam
 */

(function() {
  'use strict';

  // Spam protection
  let formLoadTime = Date.now();
  const MIN_SUBMIT_TIME = 3000; // 3 seconds minimum

  // Google Forms endpoint
  const GF_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScMdhOVnQIMDPOTuhHrrldPGZHyLtVk8RDdWmTi7z2KNs-iqQ/formResponse';

  function submitToGoogleForms(name, email, phone, type, message) {
    const body = new URLSearchParams();
    body.append('entry.1063148674', name);
    body.append('entry.1287723477', email);
    body.append('entry.1533987873', phone);
    body.append('entry.972398714', type);
    body.append('entry.704444221', message);
    
    fetch(GF_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    }).catch(() => {});
  }

  function setupForm(formId, btnId, statusId, enquiryType, extraFieldName) {
    const form = document.getElementById(formId);
    const btn = document.getElementById(btnId);
    const status = document.getElementById(statusId);
    
    if (!form) return;

    // Add honeypot field (hidden from real users)
    const honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = 'website';
    honeypot.style.position = 'absolute';
    honeypot.style.left = '-9999px';
    honeypot.tabIndex = -1;
    honeypot.setAttribute('autocomplete', 'off');
    form.appendChild(honeypot);

    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      // Spam checks
      const timeSinceLoad = Date.now() - formLoadTime;
      if (timeSinceLoad < MIN_SUBMIT_TIME) {
        status.textContent = 'Please wait a moment before submitting.';
        status.style.color = '#E30C17';
        return;
      }

      // Honeypot check
      if (honeypot.value) {
        // Bot detected - silently fail
        status.textContent = '✓ Received. We will be in touch shortly.';
        status.style.color = '#16A34A';
        form.reset();
        return;
      }

      // Validate
      if (!form.checkValidity()) {
        const firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus();
        status.textContent = 'Please fill in all required fields.';
        status.style.color = '#E30C17';
        return;
      }

      // Disable button
      btn.disabled = true;
      const originalText = btn.textContent;
      btn.textContent = 'Sending…';
      status.textContent = '';

      // Collect data
      const name = (form.elements['name'] || {}).value || '';
      const email = (form.elements['email'] || {}).value || '';
      const phone = (form.elements['phone'] || {}).value || '';
      const message = (form.elements['message'] || {}).value || '';
      const extra = extraFieldName ? (form.elements[extraFieldName] || {}).value || '' : '';

      const fullMessage = extra ? `${extra}\n\n${message}` : message;

      // Submit to Google Forms
      submitToGoogleForms(name, email, phone, enquiryType, fullMessage);

      // Show success
      setTimeout(() => {
        status.textContent = '✓ Received. We will be in touch shortly.';
        status.style.color = '#16A34A';
        form.reset();
        btn.disabled = false;
        btn.textContent = originalText;
        
        // Reset form load time for re-submissions
        formLoadTime = Date.now();
      }, 800);
    });
  }

  // Initialize when DOM is ready
  function init() {
    // Setup employer form
    setupForm(
      'employer-form',
      'ef-btn',
      'ef-status',
      'Employer with a requirement',
      'service'
    );

    // Setup candidate form
    setupForm(
      'candidate-form',
      'cf-btn',
      'cf-status',
      'Candidate looking for a role',
      'worktype'
    );

    // Resume file validation
    const resumeInput = document.getElementById('cf-resume');
    const resumeNote = document.getElementById('cf-resume-note');
    
    if (resumeInput && resumeNote) {
      resumeInput.addEventListener('change', function() {
        const file = resumeInput.files[0];
        if (!file) return;

        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        if (file.size > maxSize) {
          resumeNote.textContent = 'File too large. Please upload under 5 MB.';
          resumeNote.style.color = '#E30C17';
          resumeInput.value = '';
          return;
        }

        if (!allowedTypes.includes(file.type)) {
          resumeNote.textContent = 'Please upload PDF or Word document only.';
          resumeNote.style.color = '#E30C17';
          resumeInput.value = '';
          return;
        }

        resumeNote.textContent = '✓ ' + file.name + ' selected.';
        resumeNote.style.color = '#16A34A';
      });
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
