import { CertificateVerification, CertificateMetadata } from '../types/certificate';
import { Certificate } from '../types/course';

const STORAGE_KEY_PREFIX = 'greenkiddo_cert_verification_';

/**
 * Generate verification code
 */
const generateVerificationCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding confusing characters
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

/**
 * Generate QR code data URL
 */
export const generateQRCodeData = async (verificationUrl: string): Promise<string> => {
  // In a real implementation, you would use a QR code library like qrcode
  // For now, we'll return a data URL placeholder
  // This would typically use: import QRCode from 'qrcode';
  // const qrDataUrl = await QRCode.toDataURL(verificationUrl);
  
  // Mock QR code generation
  return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==`;
};

/**
 * Create certificate verification record
 */
export const createCertificateVerification = async (
  certificate: Certificate,
  metadata: CertificateMetadata
): Promise<CertificateVerification> => {
  const verificationCode = generateVerificationCode();
  const verificationUrl = `${window.location.origin}/verify/${verificationCode}`;
  const qrCodeData = await generateQRCodeData(verificationUrl);

  const verification: CertificateVerification = {
    certificateId: certificate.id,
    verificationCode,
    qrCodeData,
    verificationUrl,
    isValid: true,
    issuedAt: certificate.issuedAt,
  };

  // Save verification record
  const key = `${STORAGE_KEY_PREFIX}${certificate.id}`;
  localStorage.setItem(key, JSON.stringify(verification));

  // Also save by verification code for lookup
  const codeKey = `${STORAGE_KEY_PREFIX}code_${verificationCode}`;
  localStorage.setItem(codeKey, JSON.stringify({ certificateId: certificate.id, metadata }));

  return verification;
};

/**
 * Verify certificate by code
 */
export const verifyCertificate = async (verificationCode: string): Promise<{
  isValid: boolean;
  certificate?: Certificate;
  metadata?: CertificateMetadata;
  error?: string;
}> => {
  const codeKey = `${STORAGE_KEY_PREFIX}code_${verificationCode}`;
  const stored = localStorage.getItem(codeKey);

  if (!stored) {
    return {
      isValid: false,
      error: 'Certificate not found',
    };
  }

  const { certificateId, metadata } = JSON.parse(stored);
  const key = `${STORAGE_KEY_PREFIX}${certificateId}`;
  const verification: CertificateVerification = JSON.parse(localStorage.getItem(key) || '{}');

  if (!verification.isValid) {
    return {
      isValid: false,
      error: 'Certificate has been revoked',
    };
  }

  // Update verification record
  verification.verifiedAt = new Date().toISOString();
  localStorage.setItem(key, JSON.stringify(verification));

  return {
    isValid: true,
    metadata,
  };
};

/**
 * Get verification by certificate ID
 */
export const getCertificateVerification = async (certificateId: string): Promise<CertificateVerification | null> => {
  const key = `${STORAGE_KEY_PREFIX}${certificateId}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : null;
};

/**
 * Revoke certificate
 */
export const revokeCertificate = async (certificateId: string): Promise<void> => {
  const key = `${STORAGE_KEY_PREFIX}${certificateId}`;
  const verification: CertificateVerification = JSON.parse(localStorage.getItem(key) || '{}');
  
  if (verification) {
    verification.isValid = false;
    localStorage.setItem(key, JSON.stringify(verification));
  }
};

