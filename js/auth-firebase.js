// Simple Firebase Phone Auth helper (uses compat SDK)
// Depends on FIREBASE_CONFIG being defined in js/firebase-config.js

if (typeof FIREBASE_CONFIG === 'undefined') {
  console.warn('FIREBASE_CONFIG not found. Please create js/firebase-config.js with your Firebase config.');
}

if (window.firebase && typeof FIREBASE_CONFIG !== 'undefined') {
  firebase.initializeApp(FIREBASE_CONFIG);
  const auth = firebase.auth();

  const phoneInput = document.getElementById('phone');
  const sendBtn = document.getElementById('sendOtp');
  const otpInput = document.getElementById('otp');
  const verifyBtn = document.getElementById('verifyOtp');
  const authMessage = document.getElementById('authMessage');

  let confirmationResult = null;
  let recaptchaRendered = false;

  function showMessage(msg, isError = false){
    authMessage.textContent = msg;
    authMessage.style.color = isError ? '#b91c1c' : '#0f766e';
  }

  function ensureRecaptcha(){
    if (recaptchaRendered) return;
    // invisible recaptcha
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      size: 'invisible'
    });
    recaptchaRendered = true;
  }

  sendBtn.addEventListener('click', async () => {
    const phone = phoneInput.value.trim();
    if (!phone) { showMessage('Enter a phone number in international format (e.g. +8801...)', true); return; }

    ensureRecaptcha();
    showMessage('Sending code...');
    try {
      const appVerifier = window.recaptchaVerifier;
      confirmationResult = await auth.signInWithPhoneNumber(phone, appVerifier);
      showMessage('OTP sent. Enter the code you received.');
    } catch (err) {
      console.error('sendOtp error', err);
      showMessage('Failed to send OTP: ' + (err.message || err), true);
    }
  });

  verifyBtn.addEventListener('click', async () => {
    const code = otpInput.value.trim();
    if (!code) { showMessage('Enter the OTP code.', true); return; }
    if (!confirmationResult) { showMessage('No OTP request found. Send OTP first.', true); return; }

    showMessage('Verifying...');
    try {
      const result = await confirmationResult.confirm(code);
      const user = result.user;
      const token = await user.getIdToken();
      // Store phone & token locally for now (you can send token to your backend)
      localStorage.setItem('bm_user_phone', user.phoneNumber || '');
      localStorage.setItem('bm_user_token', token);
      showMessage('Phone verified — welcome!');
    } catch (err) {
      console.error('verifyOtp error', err);
      showMessage('Verification failed: ' + (err.message || err), true);
    }
  });

  // Optional: observe auth state (useful if you need to show logged-in state)
  auth.onAuthStateChanged(user => {
    if (user) {
      // user is signed in
      // console.log('User signed in:', user.phoneNumber);
    } else {
      // signed out
    }
  });

} else {
  console.warn('Firebase SDK not loaded or FIREBASE_CONFIG missing. OTP UI will not work until configured.');
}
