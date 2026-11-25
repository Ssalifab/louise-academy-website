const SCHOOL_RECIPIENTS = [
  'cssekikubo@yahoo.com',
  'louiseacademyug@gmail.com'
];

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

async function sendSchoolEnquiry({ name, email, phone, enquiryType, message }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ENQUIRY_FROM;

  if (!apiKey || !from) {
    throw new Error('Email service is not configured. Add RESEND_API_KEY and ENQUIRY_FROM.');
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone || 'Not provided');
  const safeType = escapeHtml(enquiryType);
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, '<br>');

  const payload = {
    from,
    to: SCHOOL_RECIPIENTS,
    reply_to: email,
    subject: `[Louise Junior School website] ${enquiryType} enquiry from ${name}`,
    text: [
      'New enquiry from the Louise Junior School website',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || 'Not provided'}`,
      `Enquiry type: ${enquiryType}`,
      '',
      'Message:',
      message
    ].join('\n'),
    html: `
      <h2>New website enquiry — Louise Junior School</h2>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Phone:</strong> ${safePhone}</p>
      <p><strong>Enquiry type:</strong> ${safeType}</p>
      <hr>
      <p><strong>Message:</strong></p>
      <p>${safeMessage}</p>
    `
  };

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Do not log or expose the API key. Resend's response message is safe to
    // use in server logs, but the public response should remain generic.
    console.error('Resend email error:', response.status, result.message || result.name || 'Unknown error');
    throw new Error('The email provider rejected the message.');
  }

  return result;
}

module.exports = { sendSchoolEnquiry };
