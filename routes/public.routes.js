const express = require('express');
const router = express.Router();
const { sendSchoolEnquiry } = require('../services/emailService');

router.get('/', (req, res) => res.render('pages/home', { title: 'Home' }));
router.get('/about', (req, res) => res.render('pages/about', { title: 'About Louise Junior School' }));
router.get('/academics', (req, res) => res.render('pages/academics', { title: 'Academics' }));
router.get('/admissions', (req, res) => res.render('pages/admissions', { title: 'Admissions' }));
router.get('/school-life', (req, res) => res.render('pages/school-life', { title: 'School Life' }));
router.get('/impact', (req, res) => res.render('pages/impact', { title: 'Our Impact' }));
router.get('/contact', (req, res) => res.render('pages/contact', { title: 'Contact Louise Junior School' }));

// Public enquiry form. Validate on the server; never trust browser validation alone.
router.post('/contact/enquiry', async (req, res) => {
  const { name, email, phone, enquiryType, message, website } = req.body || {};

  // Honeypot field: real visitors leave it blank.
  if (website) {
    return res.status(200).json({ success: true, message: 'Thank you. Your enquiry has been received.' });
  }

  const cleanName = String(name || '').trim();
  const cleanEmail = String(email || '').trim();
  const cleanPhone = String(phone || '').trim();
  const cleanType = String(enquiryType || '').trim();
  const cleanMessage = String(message || '').trim();

  const allowedTypes = [
    'Admissions',
    'Fees',
    'Academics',
    'Partnership or donation',
    'General'
  ];

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    cleanName.length < 2 || cleanName.length > 100 ||
    !emailPattern.test(cleanEmail) || cleanEmail.length > 254 ||
    cleanPhone.length > 30 ||
    !allowedTypes.includes(cleanType) ||
    cleanMessage.length < 5 || cleanMessage.length > 4000
  ) {
    return res.status(400).json({
      success: false,
      message: 'Please check your details and complete all required fields.'
    });
  }

  try {
    await sendSchoolEnquiry({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      enquiryType: cleanType,
      message: cleanMessage
    });

    return res.status(200).json({
      success: true,
      message: 'Thank you! Your enquiry has been sent to Louise Junior School. We will get back to you.'
    });
  } catch (error) {
    console.error('Website enquiry failed:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Sorry, we could not send your enquiry right now. Please email the school directly or call us.'
    });
  }
});

module.exports = router;
