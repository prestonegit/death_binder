// Native Web Crypto API wrappers for AES-GCM encryption/decryption

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Derive a key from a password using PBKDF2
async function getEncryptionKey(password: string, salt: ArrayBuffer): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  
  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export interface EncryptedPayload {
  salt: string;
  iv: string;
  ciphertext: string;
}

/**
 * Encrypts data using AES-GCM 256 with a password
 */
export async function encryptData(data: string, password: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);

  // Generate 16 bytes salt and 12 bytes IV
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const key = await getEncryptionKey(password, salt.buffer);

  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv.buffer
    },
    key,
    dataBuffer
  );

  const payload: EncryptedPayload = {
    salt: arrayBufferToBase64(salt.buffer),
    iv: arrayBufferToBase64(iv.buffer),
    ciphertext: arrayBufferToBase64(ciphertextBuffer)
  };

  return JSON.stringify(payload);
}

/**
 * Decrypts data using AES-GCM 256 with a password
 */
export async function decryptData(encryptedJson: string, password: string): Promise<string> {
  try {
    const payload: EncryptedPayload = JSON.parse(encryptedJson);
    if (!payload.salt || !payload.iv || !payload.ciphertext) {
      throw new Error('Invalid encrypted file format.');
    }

    const salt = base64ToArrayBuffer(payload.salt);
    const iv = base64ToArrayBuffer(payload.iv);
    const ciphertext = base64ToArrayBuffer(payload.ciphertext);

    const key = await getEncryptionKey(password, salt);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      ciphertext
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt data. Ensure the password is correct.');
  }
}
