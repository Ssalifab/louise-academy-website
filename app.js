require('dotenv').config();
const express = require('express');
const path = require('path');

const publicRoutes = require('./routes/public.routes');
const authRoutes = require('./routes/auth.routes');
const admissionsRoutes = require('./routes/admissions.routes');
const academicRoutes = require('./routes/academic.routes');
const financeRoutes = require('./routes/finance.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();
const PORT = process.env.PORT || 3000;
const APP_ROOT = process.env.APP_ROOT || process.cwd();

app.set('view engine', 'pug');
app.set('views', path.join(APP_ROOT, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '20kb' }));
app.use(express.static(path.join(APP_ROOT, 'public')));

app.use('/', publicRoutes);
app.use('/auth', authRoutes);
app.use('/admissions', admissionsRoutes);
app.use('/academics', academicRoutes);
app.use('/finance', financeRoutes);
app.use('/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).render('pages/404', { title: 'Page not found' });
});

// Netlify Functions imports the Express app. Start a local server only
// when this file is run directly with `npm run dev` or `npm start`.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Louise Junior School website running at http://localhost:${PORT}`);
  });
}

module.exports = app;
