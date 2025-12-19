export interface CertificateTemplate {
  id: string;
  name: string;
  description: string;
  previewImage?: string;
  design: CertificateDesign;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CertificateDesign {
  layout: 'landscape' | 'portrait';
  size: { width: number; height: number };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    title: string;
    body: string;
    signature: string;
  };
  elements: {
    showLogo: boolean;
    showBorder: boolean;
    showWatermark: boolean;
    showQRCode: boolean;
    showSignature: boolean;
    showDate: boolean;
    showCertificateId: boolean;
    decorativeElements: 'minimal' | 'moderate' | 'elaborate';
  };
  branding?: {
    logoUrl?: string;
    logoPosition: 'top-left' | 'top-center' | 'top-right';
    companyName?: string;
    tagline?: string;
  };
}

export interface CertificateVerification {
  certificateId: string;
  verificationCode: string;
  qrCodeData: string;
  verificationUrl: string;
  isValid: boolean;
  issuedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface DigitalSignature {
  signerName: string;
  signerTitle: string;
  signatureImage?: string; // Base64 or URL
  signatureDate: string;
  certificateId: string;
}

export interface CertificateMetadata {
  certificateId: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  userName: string;
  issuedAt: string;
  templateId: string;
  verificationCode: string;
  qrCodeUrl?: string;
  signature?: DigitalSignature;
  metadata: Record<string, any>;
}

