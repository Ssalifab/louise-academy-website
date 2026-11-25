# Louise Junior School website

Brand: burgundy `#8F000B`, charcoal `#454545`, white.

## Run locally
1. Install Node.js 20 or later.
2. Copy `.env.example` to `.env`.
3. Add your Resend API key and a verified sender address to `.env`.
4. Run `npm install`.
5. Run `npm run dev`.
6. Open http://localhost:3000.

## Enquiry email
The contact form POSTs to `/contact/enquiry` and sends the enquiry to:
- cssekikubo@yahoo.com
- louiseacademyug@gmail.com

Email delivery uses the Resend API from the Express backend. The sender address (`ENQUIRY_FROM`) must belong to a domain verified in Resend. Keep `RESEND_API_KEY` private and never put it in `public/js` or commit `.env`.

## Deploy to Netlify from GitHub
1. Push this project to a GitHub repository.
2. In Netlify, choose **Add new project → Import an existing project**.
3. Connect GitHub and select this repository.
4. Netlify reads `netlify.toml`. Build command: `npm install`; publish directory: `public`.
5. In Netlify **Project configuration → Environment variables**, add:
   - `RESEND_API_KEY` = your Resend API key
   - `ENQUIRY_FROM` = e.g. `Louise Junior School <website@your-verified-domain.com>` using a sender domain verified in Resend
   - `NODE_ENV` = `production`
6. Deploy/redeploy.

## Test
- Open the deployed site's Contact page.
- Submit an enquiry using an email address you can check.
- Confirm the success message appears.
- Check both recipient inboxes and Resend's email logs.
- If it fails, check Netlify **Functions → server → logs** and the Resend dashboard.

## Photos
Replace the image files in `public/images/` with school photos using the names listed in this README's previous image guide or the pages' image references. Keep the official logo at `public/images/louise-junior-school-logo.png`.

## Safety
The enquiry form is not a pupil admission/records form. Do not ask parents to send sensitive pupil data through this public enquiry form. The management system will later have secure authentication, validation, access controls and database storage.
