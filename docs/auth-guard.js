'use strict';

/**
 * AuthGuard Module - Authentication & 2FA for Vitaliteitstool Analyzer
 * Nederlandse gemeente tool met wachtwoordbeveiliging + TOTP 2FA
 * Volledig in-browser, geen externe afhankelijkheden
 */

// Configuratieconstanten
const AUTH_CONFIG = {
  PASSWORD_MIN_LENGTH: 12,
  PASSWORD_SALT_LENGTH: 16,
  PBKDF2_ITERATIONS: 100000,
  PBKDF2_HASH_ALGORITHM: 'SHA-256',
  TOTP_SECRET_LENGTH: 20,
  TOTP_DIGITS: 6,
  TOTP_PERIOD: 30,
  TOTP_WINDOW: 1,
  SESSION_DURATION_MS: 8 * 60 * 60 * 1000, // 8 uur
  STORAGE_KEY_CONFIG: 'vitaliteitstool-auth-config',
  STORAGE_KEY_TOTP: 'vitaliteitstool-totp-encrypted',
  STORAGE_KEY_SESSION: 'vitaliteitstool-session',
  STORAGE_KEY_ATTEMPTS: 'vitaliteitstool-attempts',
  BRUTE_FORCE_BACKOFF_MS: [0, 0, 5000, 15000, 30000, 60000, 120000],
};

// Base32 alfabet voor TOTP secret encoding
const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

/**
 * Hulpfunctie: Random bytes genereren
 */
async function generateRandomBytes(length) {
  const buffer = new Uint8Array(length);
  crypto.getRandomValues(buffer);
  return buffer;
}

/**
 * Hulpfunctie: Buffer naar base64 converteren
 */
function bufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Hulpfunctie: Base64 naar buffer converteren
 */
function base64ToBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Hulpfunctie: Buffer naar hexadecimaal converteren
 */
function bufferToHex(buffer) {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Hulpfunctie: Buffer naar base32 converteren (voor TOTP QR code)
 */
function bufferToBase32(buffer) {
  const bytes = new Uint8Array(buffer);
  let result = '';
  let bits = 0;
  let value = 0;

  for (let i = 0; i < bytes.length; i++) {
    value = (value << 8) | bytes[i];
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      result += BASE32_ALPHABET[(value >> bits) & 31];
    }
  }

  if (bits > 0) {
    result += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }

  return result;
}

/**
 * Hulpfunctie: Base32 naar buffer converteren
 */
function base32ToBuffer(base32) {
  const base32Upper = base32.toUpperCase().replace(/=/g, '');
  const bytes = [];
  let bits = 0;
  let value = 0;

  for (let i = 0; i < base32Upper.length; i++) {
    const idx = BASE32_ALPHABET.indexOf(base32Upper[i]);
    if (idx === -1) throw new Error('Invalid base32 character');
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bits -= 8;
      bytes.push((value >> bits) & 255);
    }
  }

  return new Uint8Array(bytes).buffer;
}

/**
 * Hulpfunctie: OTP URI formatteren voor handmatige invoer
 * QR-code generatie wordt toegevoegd bij Tauri-migratie (via npm qrcode library)
 * Voor nu: handmatige sleutelinvoer met kopieerknop
 */
function formatSecretForDisplay(secret) {
  // Groepeer in blokken van 4 voor leesbaarheid
  return secret.match(/.{1,4}/g).join(' ');
}

/**
 * Hulpfunctie: Wachtwoord validatie
 */
function validatePassword(password) {
  if (password.length < AUTH_CONFIG.PASSWORD_MIN_LENGTH) {
    return { valid: false, error: `Minimaal ${AUTH_CONFIG.PASSWORD_MIN_LENGTH} tekens vereist` };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Minimaal één hoofdletter vereist' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Minimaal één kleine letter vereist' };
  }
  if (!/\d/.test(password)) {
    return { valid: false, error: 'Minimaal één cijfer vereist' };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, error: 'Minimaal één speciaal teken vereist' };
  }
  return { valid: true };
}

/**
 * PBKDF2 wachtwoordhashing
 */
async function hashPassword(password, saltBuffer = null) {
  if (!saltBuffer) {
    saltBuffer = await generateRandomBytes(AUTH_CONFIG.PASSWORD_SALT_LENGTH);
  }

  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  const keyBuffer = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: AUTH_CONFIG.PBKDF2_ITERATIONS,
      hash: AUTH_CONFIG.PBKDF2_HASH_ALGORITHM,
    },
    keyBuffer,
    256
  );

  return {
    salt: bufferToBase64(saltBuffer),
    hash: bufferToBase64(derivedBits),
  };
}

/**
 * Wachtwoord verifiëren
 */
async function verifyPassword(password, config) {
  const saltBuffer = base64ToBuffer(config.salt);
  const hashResult = await hashPassword(password, saltBuffer);
  return hashResult.hash === config.hash;
}

/**
 * TOTP secret genereren
 */
async function generateTotpSecret() {
  return await generateRandomBytes(AUTH_CONFIG.TOTP_SECRET_LENGTH);
}

/**
 * TOTP code genereren op basis van secret
 */
async function generateTotpCode(secretBuffer, timestamp = null) {
  if (!timestamp) {
    timestamp = Math.floor(Date.now() / 1000);
  }

  let counter = Math.floor(timestamp / AUTH_CONFIG.TOTP_PERIOD);
  const counterBuffer = new Uint8Array(8);
  for (let i = 7; i >= 0; i--) {
    counterBuffer[i] = counter & 0xff;
    counter >>= 8;
  }

  const key = await crypto.subtle.importKey(
    'raw',
    secretBuffer,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );

  const hmac = await crypto.subtle.sign('HMAC', key, counterBuffer.buffer);
  const hmacBytes = new Uint8Array(hmac);

  const offset = hmacBytes[hmacBytes.length - 1] & 0x0f;
  const code = (
    ((hmacBytes[offset] & 0x7f) << 24) |
    ((hmacBytes[offset + 1] & 0xff) << 16) |
    ((hmacBytes[offset + 2] & 0xff) << 8) |
    (hmacBytes[offset + 3] & 0xff)
  ) % Math.pow(10, AUTH_CONFIG.TOTP_DIGITS);

  return code.toString().padStart(AUTH_CONFIG.TOTP_DIGITS, '0');
}

/**
 * TOTP code valideren (met venster tolerantie)
 */
async function verifyTotpCode(secretBuffer, code) {
  const currentTimestamp = Math.floor(Date.now() / 1000);

  for (let i = -AUTH_CONFIG.TOTP_WINDOW; i <= AUTH_CONFIG.TOTP_WINDOW; i++) {
    const testTimestamp = currentTimestamp + (i * AUTH_CONFIG.TOTP_PERIOD);
    const testCode = await generateTotpCode(secretBuffer, testTimestamp);
    if (testCode === code) {
      return true;
    }
  }

  return false;
}

/**
 * Sleutel afleiden van wachtwoord voor TOTP-codering
 */
async function deriveEncryptionKey(password) {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  // Vaste salt voor TOTP-versleuteling (niet gebruiker-specifiek voor eenvoudigheid)
  const salt = new Uint8Array([
    0x56, 0x69, 0x74, 0x61, 0x6c, 0x69, 0x74, 0x65, 0x69, 0x74, 0x73, 0x74, 0x6f, 0x6f, 0x6c, 0x00,
  ]);

  const keyBuffer = await crypto.subtle.importKey('raw', passwordBuffer, 'PBKDF2', false, [
    'deriveBits',
  ]);

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 50000,
      hash: 'SHA-256',
    },
    keyBuffer,
    256
  );

  return await crypto.subtle.importKey('raw', derivedBits, { name: 'AES-GCM' }, false, [
    'encrypt',
    'decrypt',
  ]);
}

/**
 * TOTP secret versleutelen
 */
async function encryptTotpSecret(secretBuffer, password) {
  const encryptionKey = await deriveEncryptionKey(password);
  const iv = await generateRandomBytes(12);

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    encryptionKey,
    secretBuffer
  );

  return {
    iv: bufferToBase64(iv),
    encrypted: bufferToBase64(encryptedBuffer),
  };
}

/**
 * TOTP secret ontsleutelen
 */
async function decryptTotpSecret(encryptedData, password) {
  const encryptionKey = await deriveEncryptionKey(password);
  const iv = base64ToBuffer(encryptedData.iv);
  const encryptedBuffer = base64ToBuffer(encryptedData.encrypted);

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv },
    encryptionKey,
    encryptedBuffer
  );

  return decryptedBuffer;
}

/**
 * Brute force backoff berekenen
 */
function getBackoffDuration(attemptCount) {
  if (attemptCount >= AUTH_CONFIG.BRUTE_FORCE_BACKOFF_MS.length) {
    return AUTH_CONFIG.BRUTE_FORCE_BACKOFF_MS[AUTH_CONFIG.BRUTE_FORCE_BACKOFF_MS.length - 1];
  }
  return AUTH_CONFIG.BRUTE_FORCE_BACKOFF_MS[attemptCount];
}

/**
 * Sessie aanmaken
 */
function createSession() {
  const session = {
    authenticated: true,
    timestamp: Date.now(),
  };
  sessionStorage.setItem(AUTH_CONFIG.STORAGE_KEY_SESSION, JSON.stringify(session));
}

/**
 * Sessie ophalen
 */
function getSession() {
  const sessionData = sessionStorage.getItem(AUTH_CONFIG.STORAGE_KEY_SESSION);
  if (!sessionData) return null;

  try {
    const session = JSON.parse(sessionData);
    const age = Date.now() - session.timestamp;

    if (age > AUTH_CONFIG.SESSION_DURATION_MS) {
      sessionStorage.removeItem(AUTH_CONFIG.STORAGE_KEY_SESSION);
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

/**
 * HTML escapen voor veiligheid
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Setup-scherm renderen
 */
function renderSetupScreen(container, onSuccess, onError) {
  const setupHtml = `
    <div class="auth-guard-container auth-guard-setup">
      <div class="auth-guard-card">
        <div class="auth-guard-header">
          <h1 class="auth-guard-title">Vitaliteitstool Analyzer</h1>
          <p class="auth-guard-subtitle">Eerste keer instellen</p>
        </div>

        <div class="auth-guard-content">
          <!-- Stap 1: Wachtwoord instellen -->
          <div class="auth-guard-step auth-guard-step-active" data-step="1">
            <h2 class="auth-guard-step-title">Stap 1: Beveiligd wachtwoord instellen</h2>
            <p class="auth-guard-step-description">
              Kies een sterk wachtwoord om de analyzer te beschermen.
            </p>

            <div class="auth-guard-form-group">
              <label for="setup-password" class="auth-guard-label">Wachtwoord</label>
              <input
                id="setup-password"
                type="password"
                class="auth-guard-input"
                placeholder="Voer een sterk wachtwoord in"
                autocomplete="new-password"
              />
              <div class="auth-guard-error-message" id="setup-password-error"></div>
            </div>

            <div class="auth-guard-form-group">
              <label for="setup-password-confirm" class="auth-guard-label">Wachtwoord bevestigen</label>
              <input
                id="setup-password-confirm"
                type="password"
                class="auth-guard-input"
                placeholder="Bevestig het wachtwoord"
                autocomplete="new-password"
              />
            </div>

            <div class="auth-guard-requirements">
              <p class="auth-guard-requirements-title">Vereisten:</p>
              <ul class="auth-guard-requirements-list">
                <li data-requirement="length" class="auth-guard-requirement">
                  <span class="auth-guard-requirement-icon">○</span>
                  <span class="auth-guard-requirement-text">Minimaal 12 tekens</span>
                </li>
                <li data-requirement="uppercase" class="auth-guard-requirement">
                  <span class="auth-guard-requirement-icon">○</span>
                  <span class="auth-guard-requirement-text">Minimaal één hoofdletter (A-Z)</span>
                </li>
                <li data-requirement="lowercase" class="auth-guard-requirement">
                  <span class="auth-guard-requirement-icon">○</span>
                  <span class="auth-guard-requirement-text">Minimaal één kleine letter (a-z)</span>
                </li>
                <li data-requirement="digit" class="auth-guard-requirement">
                  <span class="auth-guard-requirement-icon">○</span>
                  <span class="auth-guard-requirement-text">Minimaal één cijfer (0-9)</span>
                </li>
                <li data-requirement="special" class="auth-guard-requirement">
                  <span class="auth-guard-requirement-icon">○</span>
                  <span class="auth-guard-requirement-text">Minimaal één speciaal teken (!@#$%^&*)</span>
                </li>
              </ul>
            </div>

            <button class="auth-guard-button auth-guard-button-primary" id="setup-next-btn">
              Volgende
            </button>
            <div class="auth-guard-error-message" id="setup-step1-error"></div>
          </div>

          <!-- Stap 2: 2FA setup -->
          <div class="auth-guard-step" data-step="2">
            <h2 class="auth-guard-step-title">Stap 2: Twee-factor authenticatie instellen</h2>
            <p class="auth-guard-step-description">
              Open uw authenticatie-app (Google Authenticator, Microsoft Authenticator, etc.)
              en kies <strong>&ldquo;Sleutel handmatig invoeren&rdquo;</strong>.
            </p>

            <div class="auth-guard-secret-container">
              <div class="auth-guard-secret-field">
                <label class="auth-guard-label">Accountnaam</label>
                <div class="auth-guard-secret-value">Vitaliteitstool Analyzer</div>
              </div>
              <div class="auth-guard-secret-field">
                <label class="auth-guard-label">Sleutel (geheim)</label>
                <code id="setup-totp-secret" class="auth-guard-secret-key"></code>
                <button type="button" class="auth-guard-copy-btn" id="setup-copy-secret">
                  Kopieer sleutel
                </button>
              </div>
              <div class="auth-guard-secret-field">
                <label class="auth-guard-label">Type</label>
                <div class="auth-guard-secret-value">Tijdgebaseerd (TOTP)</div>
              </div>
            </div>

            <div class="auth-guard-form-group">
              <label for="setup-totp-code" class="auth-guard-label">Voer de 6-cijferige code in</label>
              <input
                id="setup-totp-code"
                type="text"
                class="auth-guard-input auth-guard-input-code"
                placeholder="000000"
                maxlength="6"
                inputmode="numeric"
              />
              <div class="auth-guard-error-message" id="setup-totp-error"></div>
            </div>

            <button class="auth-guard-button auth-guard-button-primary" id="setup-activate-btn">
              Activeren
            </button>
            <button class="auth-guard-button auth-guard-button-secondary" id="setup-back-btn">
              Terug
            </button>
            <div class="auth-guard-error-message" id="setup-step2-error"></div>
          </div>
        </div>
      </div>
    </div>

    <style>
      .auth-guard-container {
        font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        color: var(--color-text, #1a1a1a);
        background: var(--color-bg, #ffffff);
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }

      .auth-guard-card {
        background: var(--color-surface, #f5f5f5);
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 500px;
        padding: 40px;
      }

      .auth-guard-header {
        text-align: center;
        margin-bottom: 40px;
      }

      .auth-guard-title {
        margin: 0 0 8px 0;
        font-size: 28px;
        font-weight: 600;
        color: var(--color-text, #1a1a1a);
      }

      .auth-guard-subtitle {
        margin: 0;
        font-size: 16px;
        color: var(--color-text-secondary, #666666);
      }

      .auth-guard-step {
        display: none;
      }

      .auth-guard-step-active {
        display: block;
      }

      .auth-guard-step-title {
        margin: 0 0 8px 0;
        font-size: 18px;
        font-weight: 600;
        color: var(--color-text, #1a1a1a);
      }

      .auth-guard-step-description {
        margin: 0 0 20px 0;
        font-size: 14px;
        color: var(--color-text-secondary, #666666);
        line-height: 1.6;
      }

      .auth-guard-form-group {
        margin-bottom: 20px;
      }

      .auth-guard-label {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 500;
        color: var(--color-text, #1a1a1a);
      }

      .auth-guard-input {
        width: 100%;
        padding: 12px;
        font-size: 14px;
        border: 2px solid var(--color-border, #e0e0e0);
        border-radius: 6px;
        background: var(--color-input-bg, #ffffff);
        color: var(--color-text, #1a1a1a);
        box-sizing: border-box;
        transition: border-color 0.2s;
      }

      .auth-guard-input:focus {
        outline: none;
        border-color: var(--color-primary, #0066cc);
      }

      .auth-guard-input-code {
        font-size: 20px;
        letter-spacing: 4px;
        text-align: center;
        font-family: 'Courier New', monospace;
        font-weight: 600;
      }

      .auth-guard-requirements {
        background: var(--color-bg, #ffffff);
        border: 1px solid var(--color-border, #e0e0e0);
        border-radius: 6px;
        padding: 16px;
        margin-bottom: 20px;
      }

      .auth-guard-requirements-title {
        margin: 0 0 12px 0;
        font-size: 14px;
        font-weight: 600;
        color: var(--color-text, #1a1a1a);
      }

      .auth-guard-requirements-list {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .auth-guard-requirement {
        display: flex;
        align-items: center;
        padding: 6px 0;
        font-size: 13px;
        color: var(--color-text-secondary, #666666);
      }

      .auth-guard-requirement-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        margin-right: 8px;
        font-weight: bold;
        color: var(--color-text-secondary, #999999);
      }

      .auth-guard-requirement.auth-guard-requirement-met {
        color: var(--color-success, #28a745);
      }

      .auth-guard-requirement.auth-guard-requirement-met .auth-guard-requirement-icon {
        color: var(--color-success, #28a745);
      }

      .auth-guard-secret-container {
        background: var(--color-bg, #ffffff);
        border: 2px solid var(--color-primary, #0066cc);
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
      }

      .auth-guard-secret-field {
        margin-bottom: 16px;
      }

      .auth-guard-secret-field:last-child {
        margin-bottom: 0;
      }

      .auth-guard-secret-value {
        font-size: 14px;
        color: var(--color-text, #1a1a1a);
        font-weight: 500;
      }

      .auth-guard-secret-key {
        display: block;
        padding: 12px;
        background: var(--color-surface, #f0f0f0);
        border: 1px solid var(--color-border, #e0e0e0);
        border-radius: 6px;
        font-family: 'Courier New', monospace;
        font-size: 16px;
        font-weight: 700;
        letter-spacing: 2px;
        word-break: break-all;
        text-align: center;
        color: var(--color-text, #1a1a1a);
        margin-bottom: 8px;
        user-select: all;
      }

      .auth-guard-copy-btn {
        display: block;
        width: 100%;
        padding: 8px;
        font-size: 13px;
        font-weight: 500;
        color: var(--color-primary, #0066cc);
        background: transparent;
        border: 1px solid var(--color-primary, #0066cc);
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .auth-guard-copy-btn:hover {
        background: var(--color-primary, #0066cc);
        color: white;
      }

      .auth-guard-copy-btn.auth-guard-copy-success {
        background: var(--color-success, #28a745);
        border-color: var(--color-success, #28a745);
        color: white;
      }

      .auth-guard-button {
        width: 100%;
        padding: 12px;
        font-size: 14px;
        font-weight: 600;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
        margin-bottom: 12px;
      }

      .auth-guard-button-primary {
        background: var(--color-primary, #0066cc);
        color: white;
      }

      .auth-guard-button-primary:hover {
        background: var(--color-primary-dark, #0052a3);
      }

      .auth-guard-button-primary:disabled {
        background: var(--color-text-secondary, #cccccc);
        cursor: not-allowed;
      }

      .auth-guard-button-secondary {
        background: var(--color-secondary, #e0e0e0);
        color: var(--color-text, #1a1a1a);
      }

      .auth-guard-button-secondary:hover {
        background: var(--color-secondary-dark, #d0d0d0);
      }

      .auth-guard-error-message {
        font-size: 13px;
        color: var(--color-error, #dc3545);
        margin-top: 8px;
        display: none;
      }

      .auth-guard-error-message.auth-guard-error-show {
        display: block;
      }
    </style>
  `;

  container.innerHTML = setupHtml;

  let setupTotpSecret = null;
  let setupTotpSecretBuffer = null;
  const passwordInput = container.querySelector('#setup-password');
  const passwordConfirmInput = container.querySelector('#setup-password-confirm');
  const nextBtn = container.querySelector('#setup-next-btn');
  const backBtn = container.querySelector('#setup-back-btn');
  const activateBtn = container.querySelector('#setup-activate-btn');
  const totpCodeInput = container.querySelector('#setup-totp-code');

  // Wachtwoord-vereisten bijwerken in realtime
  function updatePasswordRequirements() {
    const password = passwordInput.value;

    const requirements = {
      length: password.length >= AUTH_CONFIG.PASSWORD_MIN_LENGTH,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      digit: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };

    Object.entries(requirements).forEach(([key, met]) => {
      const element = container.querySelector(`[data-requirement="${key}"]`);
      if (met) {
        element.classList.add('auth-guard-requirement-met');
        element.querySelector('.auth-guard-requirement-icon').textContent = '✓';
      } else {
        element.classList.remove('auth-guard-requirement-met');
        element.querySelector('.auth-guard-requirement-icon').textContent = '○';
      }
    });

    return requirements;
  }

  passwordInput.addEventListener('input', updatePasswordRequirements);

  // Stap 1: Wachtwoord validatie en volgende
  nextBtn.addEventListener('click', async () => {
    const errorEl = container.querySelector('#setup-step1-error');
    errorEl.classList.remove('auth-guard-error-show');

    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;

    if (password !== passwordConfirm) {
      errorEl.textContent = 'Wachtwoorden komen niet overeen';
      errorEl.classList.add('auth-guard-error-show');
      return;
    }

    const validation = validatePassword(password);
    if (!validation.valid) {
      errorEl.textContent = validation.error;
      errorEl.classList.add('auth-guard-error-show');
      return;
    }

    // TOTP secret genereren
    setupTotpSecretBuffer = await generateTotpSecret();
    setupTotpSecret = bufferToBase32(setupTotpSecretBuffer);

    // Secret weergeven in leesbaar formaat
    container.querySelector('#setup-totp-secret').textContent = formatSecretForDisplay(setupTotpSecret);

    // Kopieerknop instellen
    const copyBtn = container.querySelector('#setup-copy-secret');
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(setupTotpSecret);
        copyBtn.textContent = 'Gekopieerd!';
        copyBtn.classList.add('auth-guard-copy-success');
        setTimeout(() => {
          copyBtn.textContent = 'Kopieer sleutel';
          copyBtn.classList.remove('auth-guard-copy-success');
        }, 2000);
      } catch {
        // Fallback: selecteer de tekst
        const secretEl = container.querySelector('#setup-totp-secret');
        const range = document.createRange();
        range.selectNodeContents(secretEl);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        copyBtn.textContent = 'Selecteer en kopieer met Ctrl+C';
      }
    });

    // Naar stap 2 gaan
    container.querySelector('[data-step="1"]').classList.remove('auth-guard-step-active');
    container.querySelector('[data-step="2"]').classList.add('auth-guard-step-active');
  });

  // Stap 2: Terug naar stap 1
  backBtn.addEventListener('click', () => {
    container.querySelector('[data-step="2"]').classList.remove('auth-guard-step-active');
    container.querySelector('[data-step="1"]').classList.add('auth-guard-step-active');
  });

  // Stap 2: TOTP code validatie en activeren
  activateBtn.addEventListener('click', async () => {
    const errorEl = container.querySelector('#setup-step2-error');
    const totpErrorEl = container.querySelector('#setup-totp-error');
    errorEl.classList.remove('auth-guard-error-show');
    totpErrorEl.classList.remove('auth-guard-error-show');

    const totpCode = totpCodeInput.value.trim();

    if (totpCode.length !== AUTH_CONFIG.TOTP_DIGITS) {
      totpErrorEl.textContent = `Voer een ${AUTH_CONFIG.TOTP_DIGITS}-cijferige code in`;
      totpErrorEl.classList.add('auth-guard-error-show');
      return;
    }

    // TOTP valideren
    const isValid = await verifyTotpCode(setupTotpSecretBuffer, totpCode);
    if (!isValid) {
      totpErrorEl.textContent = 'Ongeldige code. Controleer uw authenticatie-app.';
      totpErrorEl.classList.add('auth-guard-error-show');
      return;
    }

    try {
      nextBtn.disabled = true;
      activateBtn.disabled = true;

      const password = passwordInput.value;

      // Wachtwoord hashen
      const passwordConfig = await hashPassword(password);

      // TOTP secret versleutelen
      const encryptedTotp = await encryptTotpSecret(setupTotpSecretBuffer, password);

      // Opslaan
      localStorage.setItem(
        AUTH_CONFIG.STORAGE_KEY_CONFIG,
        JSON.stringify(passwordConfig)
      );
      localStorage.setItem(
        AUTH_CONFIG.STORAGE_KEY_TOTP,
        JSON.stringify(encryptedTotp)
      );

      // Sessie aanmaken
      createSession();

      // Success callback
      onSuccess();
    } catch (error) {
      errorEl.textContent = `Fout bij setup: ${error.message}`;
      errorEl.classList.add('auth-guard-error-show');
      nextBtn.disabled = false;
      activateBtn.disabled = false;
    }
  });

  // Alleen getallen toestaan in TOTP-invoer
  totpCodeInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^\d]/g, '');
  });
}

/**
 * Login-scherm renderen
 */
function renderLoginScreen(container, onSuccess, onError) {
  const loginHtml = `
    <div class="auth-guard-container auth-guard-login">
      <div class="auth-guard-card">
        <div class="auth-guard-header">
          <h1 class="auth-guard-title">Vitaliteitstool Analyzer</h1>
          <p class="auth-guard-subtitle">Inloggen</p>
        </div>

        <div class="auth-guard-content">
          <div class="auth-guard-form-group">
            <label for="login-password" class="auth-guard-label">Wachtwoord</label>
            <input
              id="login-password"
              type="password"
              class="auth-guard-input"
              placeholder="Voer uw wachtwoord in"
              autocomplete="current-password"
            />
          </div>

          <div class="auth-guard-form-group">
            <label for="login-totp" class="auth-guard-label">2FA Code (van uw authenticatie-app)</label>
            <input
              id="login-totp"
              type="text"
              class="auth-guard-input auth-guard-input-code"
              placeholder="000000"
              maxlength="6"
              inputmode="numeric"
            />
          </div>

          <div class="auth-guard-lockout-message" id="login-lockout" style="display: none;">
            <strong>Te veel inlogpogingen.</strong><br />
            Probeer het over <span id="login-lockout-seconds">0</span> seconde opnieuw.
          </div>

          <button class="auth-guard-button auth-guard-button-primary" id="login-btn">
            Inloggen
          </button>

          <div class="auth-guard-error-message" id="login-error"></div>
        </div>
      </div>
    </div>

    <style>
      .auth-guard-container {
        font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        color: var(--color-text, #1a1a1a);
        background: var(--color-bg, #ffffff);
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }

      .auth-guard-card {
        background: var(--color-surface, #f5f5f5);
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
        padding: 40px;
      }

      .auth-guard-header {
        text-align: center;
        margin-bottom: 40px;
      }

      .auth-guard-title {
        margin: 0 0 8px 0;
        font-size: 28px;
        font-weight: 600;
        color: var(--color-text, #1a1a1a);
      }

      .auth-guard-subtitle {
        margin: 0;
        font-size: 16px;
        color: var(--color-text-secondary, #666666);
      }

      .auth-guard-form-group {
        margin-bottom: 20px;
      }

      .auth-guard-label {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 500;
        color: var(--color-text, #1a1a1a);
      }

      .auth-guard-input {
        width: 100%;
        padding: 12px;
        font-size: 14px;
        border: 2px solid var(--color-border, #e0e0e0);
        border-radius: 6px;
        background: var(--color-input-bg, #ffffff);
        color: var(--color-text, #1a1a1a);
        box-sizing: border-box;
        transition: border-color 0.2s;
      }

      .auth-guard-input:focus {
        outline: none;
        border-color: var(--color-primary, #0066cc);
      }

      .auth-guard-input-code {
        font-size: 20px;
        letter-spacing: 4px;
        text-align: center;
        font-family: 'Courier New', monospace;
        font-weight: 600;
      }

      .auth-guard-button {
        width: 100%;
        padding: 12px;
        font-size: 14px;
        font-weight: 600;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
        margin-bottom: 12px;
        background: var(--color-primary, #0066cc);
        color: white;
      }

      .auth-guard-button:hover {
        background: var(--color-primary-dark, #0052a3);
      }

      .auth-guard-button:disabled {
        background: var(--color-text-secondary, #cccccc);
        cursor: not-allowed;
      }

      .auth-guard-error-message {
        font-size: 13px;
        color: var(--color-error, #dc3545);
        margin-top: 8px;
        display: none;
      }

      .auth-guard-error-message.auth-guard-error-show {
        display: block;
      }

      .auth-guard-lockout-message {
        background: var(--color-warning-bg, #fff3cd);
        border: 1px solid var(--color-warning-border, #ffc107);
        color: var(--color-warning-text, #856404);
        padding: 12px;
        border-radius: 6px;
        font-size: 13px;
        margin-bottom: 12px;
        line-height: 1.6;
      }
    </style>
  `;

  container.innerHTML = loginHtml;

  const passwordInput = container.querySelector('#login-password');
  const totpInput = container.querySelector('#login-totp');
  const loginBtn = container.querySelector('#login-btn');
  const errorEl = container.querySelector('#login-error');
  const lockoutEl = container.querySelector('#login-lockout');
  const lockoutSecondsEl = container.querySelector('#login-lockout-seconds');

  // Alleen getallen toestaan in TOTP-invoer
  totpInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^\d]/g, '');
  });

  // Brute force lockout controleren
  function checkBruteForceStatus() {
    const attemptsData = sessionStorage.getItem(AUTH_CONFIG.STORAGE_KEY_ATTEMPTS);
    if (!attemptsData) return { locked: false };

    try {
      const attempts = JSON.parse(attemptsData);
      const now = Date.now();
      const backoffDuration = getBackoffDuration(attempts.count);
      const timeRemaining = attempts.lastAttemptTime + backoffDuration - now;

      if (timeRemaining > 0) {
        return { locked: true, timeRemaining };
      } else {
        // Lockout verlopen — teller NIET resetten zodat backoff blijft escaleren
        // Teller wordt alleen gewist bij succesvol inloggen
        return { locked: false };
      }
    } catch {
      return { locked: false };
    }
  }

  // Brute force status aanvankelijk controleren
  function updateBruteForceUI() {
    const status = checkBruteForceStatus();
    if (status.locked) {
      lockoutEl.style.display = 'block';
      loginBtn.disabled = true;
      passwordInput.disabled = true;
      totpInput.disabled = true;

      const updateCountdown = () => {
        const status = checkBruteForceStatus();
        if (status.locked) {
          const seconds = Math.ceil(status.timeRemaining / 1000);
          lockoutSecondsEl.textContent = seconds;
          setTimeout(updateCountdown, 100);
        } else {
          lockoutEl.style.display = 'none';
          loginBtn.disabled = false;
          passwordInput.disabled = false;
          totpInput.disabled = false;
          passwordInput.focus();
        }
      };

      updateCountdown();
    } else {
      lockoutEl.style.display = 'none';
      loginBtn.disabled = false;
      passwordInput.disabled = false;
      totpInput.disabled = false;
      passwordInput.focus();
    }
  }

  updateBruteForceUI();

  // Login-knop handler
  loginBtn.addEventListener('click', async () => {
    errorEl.classList.remove('auth-guard-error-show');

    const status = checkBruteForceStatus();
    if (status.locked) {
      return;
    }

    const password = passwordInput.value;
    const totpCode = totpInput.value.trim();

    if (!password || totpCode.length !== AUTH_CONFIG.TOTP_DIGITS) {
      errorEl.textContent = 'Vul beide velden in';
      errorEl.classList.add('auth-guard-error-show');
      return;
    }

    try {
      loginBtn.disabled = true;

      // Wachtwoord en TOTP verifiëren
      const configData = localStorage.getItem(AUTH_CONFIG.STORAGE_KEY_CONFIG);
      const encryptedTotpData = localStorage.getItem(AUTH_CONFIG.STORAGE_KEY_TOTP);

      if (!configData || !encryptedTotpData) {
        errorEl.textContent = 'Configuratiegegevens niet gevonden';
        errorEl.classList.add('auth-guard-error-show');
        loginBtn.disabled = false;
        return;
      }

      const config = JSON.parse(configData);
      const encryptedTotp = JSON.parse(encryptedTotpData);

      // Wachtwoord verifiëren
      const passwordValid = await verifyPassword(password, config);
      if (!passwordValid) {
        recordFailedAttempt();
        errorEl.textContent = 'Wachtwoord onjuist';
        errorEl.classList.add('auth-guard-error-show');
        loginBtn.disabled = false;
        updateBruteForceUI();
        return;
      }

      // TOTP verifiëren
      const totpSecretBuffer = await decryptTotpSecret(encryptedTotp, password);
      const totpValid = await verifyTotpCode(totpSecretBuffer, totpCode);

      if (!totpValid) {
        recordFailedAttempt();
        errorEl.textContent = 'Ongeldige 2FA-code';
        errorEl.classList.add('auth-guard-error-show');
        loginBtn.disabled = false;
        updateBruteForceUI();
        return;
      }

      // Succesvol ingelogd
      sessionStorage.removeItem(AUTH_CONFIG.STORAGE_KEY_ATTEMPTS);
      createSession();
      onSuccess();
    } catch (error) {
      recordFailedAttempt();
      errorEl.textContent = `Inlogfout: ${error.message}`;
      errorEl.classList.add('auth-guard-error-show');
      loginBtn.disabled = false;
      updateBruteForceUI();
    }
  });

  // Enter-toets ondersteuning
  [passwordInput, totpInput].forEach((input) => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !loginBtn.disabled) {
        loginBtn.click();
      }
    });
  });
}

/**
 * Mislukte inlogpoging registreren
 */
function recordFailedAttempt() {
  const attemptsData = sessionStorage.getItem(AUTH_CONFIG.STORAGE_KEY_ATTEMPTS);
  let attempts;

  if (attemptsData) {
    try {
      attempts = JSON.parse(attemptsData);
      attempts.count += 1;
      attempts.lastAttemptTime = Date.now();
    } catch {
      attempts = { count: 1, lastAttemptTime: Date.now() };
    }
  } else {
    attempts = { count: 1, lastAttemptTime: Date.now() };
  }

  sessionStorage.setItem(AUTH_CONFIG.STORAGE_KEY_ATTEMPTS, JSON.stringify(attempts));
}

/**
 * Public API: AuthGuard object
 */
const AuthGuard = {
  /**
   * Controleren of setup voltooid is
   */
  isConfigured() {
    const configData = localStorage.getItem(AUTH_CONFIG.STORAGE_KEY_CONFIG);
    const totpData = localStorage.getItem(AUTH_CONFIG.STORAGE_KEY_TOTP);
    return !!(configData && totpData);
  },

  /**
   * Controleren of huidige sessie geldig is
   */
  isAuthenticated() {
    return !!getSession();
  },

  /**
   * Auth-scherm weergeven (setup of login)
   */
  showAuthScreen(containerEl, onSuccess) {
    if (typeof containerEl !== 'object' || !containerEl) {
      throw new Error('containerEl moet een geldig DOM-element zijn');
    }
    if (typeof onSuccess !== 'function') {
      throw new Error('onSuccess moet een function zijn');
    }

    if (this.isConfigured()) {
      renderLoginScreen(containerEl, onSuccess);
    } else {
      renderSetupScreen(containerEl, onSuccess);
    }
  },

  /**
   * Sessie afmelden
   */
  logout() {
    sessionStorage.removeItem(AUTH_CONFIG.STORAGE_KEY_SESSION);
    sessionStorage.removeItem(AUTH_CONFIG.STORAGE_KEY_ATTEMPTS);
  },

  /**
   * Alle configuratie wissen (admin reset)
   */
  resetAll() {
    localStorage.removeItem(AUTH_CONFIG.STORAGE_KEY_CONFIG);
    localStorage.removeItem(AUTH_CONFIG.STORAGE_KEY_TOTP);
    sessionStorage.removeItem(AUTH_CONFIG.STORAGE_KEY_SESSION);
    sessionStorage.removeItem(AUTH_CONFIG.STORAGE_KEY_ATTEMPTS);
  },
};

// Globaal beschikbaar stellen
window.AuthGuard = AuthGuard;

// Module export voor mogelijke bundling
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AuthGuard;
}
