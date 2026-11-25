// Public website interactions and AJAX enquiry form submission.
const enquiryForm = document.querySelector('#enquiryForm');

if (enquiryForm) {
  const submitButton = document.querySelector('#enquirySubmit');
  const message = document.querySelector('#formMessage');
  const buttonLabel = submitButton?.querySelector('.button-label');
  const buttonLoading = submitButton?.querySelector('.button-loading');

  enquiryForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!enquiryForm.reportValidity()) return;

    submitButton.disabled = true;
    if (buttonLabel) buttonLabel.classList.add('d-none');
    if (buttonLoading) buttonLoading.classList.remove('d-none');

    if (message) {
      message.textContent = 'Sending your enquiry...';
      message.classList.remove('text-danger', 'text-success');
    }

    try {
      const response = await fetch(enquiryForm.action, {
        method: 'POST',
        body: new URLSearchParams(new FormData(enquiryForm)),
        headers: { Accept: 'application/json' }
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Unable to send your enquiry.');
      }

      if (message) {
        message.textContent = result.message;
        message.classList.add('text-success');
      }
      enquiryForm.reset();
    } catch (error) {
      if (message) {
        message.textContent = error.message || 'Connection problem. Please try again or contact the school directly.';
        message.classList.add('text-danger');
      }
    } finally {
      submitButton.disabled = false;
      if (buttonLabel) buttonLabel.classList.remove('d-none');
      if (buttonLoading) buttonLoading.classList.add('d-none');
    }
  });
}
