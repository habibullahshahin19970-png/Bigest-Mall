## Firebase Authentication setup (Phone / OTP)

This project includes a simple front-end implementation for phone-number OTP sign-in using Firebase Authentication.

Setup steps

1. Create a Firebase project
   - Go to https://console.firebase.google.com/ and add a new project (or use an existing one).

2. Enable Phone authentication
   - In the Firebase Console, go to Authentication -> Sign-in method -> enable Phone.
   - Add your site domain to the list of Authorized domains (e.g. `habibullahshahin19970-png.github.io`).

3. Add test phone numbers (recommended during development)
   - In Authentication -> Sign-in method -> Phone, add one or more test phone numbers with verification codes so you don't consume SMS during development.

4. Copy your Firebase config and add it to `js/firebase-config.js`
   - In Project Settings -> SDK setup and configuration -> Config, copy the configuration object.
   - Replace the placeholders in `js/firebase-config.js` with your values.

5. Serve the site over HTTPS (GitHub Pages is HTTPS — OK). The Firebase reCAPTCHA requires secure contexts.

6. Test the flow
   - Load the site, enter a phone number (or test number), click "Send OTP" and then enter the code. On success a Firebase ID token will be stored in localStorage under `bm_user_token` and the phone under `bm_user_phone`.

Security notes

- Do not commit real API keys or service account credentials to public repos. The Firebase web config is okay to include in client code, but keep server credentials secret.
- For production flows, verify ID tokens on your server before trusting them and creating sessions.
- Use test phone numbers during development to avoid SMS costs and rate limits.
