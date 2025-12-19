import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Certificate } from '../types/course';
import { CertificateTemplate, CertificateMetadata, DigitalSignature } from '../types/certificate';
import { getCertificateTemplate } from './certificateTemplateService';
import { createCertificateVerification, generateQRCodeData } from './certificateVerificationService';

/**
 * Enhanced certificate generation with template support
 */
export const generateCertificateWithTemplate = async (
  certificate: Certificate,
  userName: string,
  templateId: string = 'classic-green',
  courseInstructor?: string,
  signature?: DigitalSignature
): Promise<{ pdf: Blob; verification: any; metadata: CertificateMetadata }> => {
  // Get template
  const template = await getCertificateTemplate(templateId);
  if (!template) {
    throw new Error('Template not found');
  }

  // Create metadata
  const metadata: CertificateMetadata = {
    certificateId: certificate.id,
    userId: certificate.userId,
    courseId: certificate.courseId,
    courseTitle: certificate.courseTitle,
    userName,
    issuedAt: certificate.issuedAt,
    templateId,
    verificationCode: '',
    signature,
    metadata: {},
  };

  // Create verification
  const verification = await createCertificateVerification(certificate, metadata);
  metadata.verificationCode = verification.verificationCode;
  metadata.qrCodeUrl = verification.qrCodeData;

  // Generate PDF
  const pdf = await generateCertificatePDFWithTemplate(
    certificate,
    userName,
    template,
    courseInstructor,
    signature,
    verification
  );

  return { pdf, verification, metadata };
};

/**
 * Generate PDF with template
 */
const generateCertificatePDFWithTemplate = async (
  certificate: Certificate,
  userName: string,
  template: CertificateTemplate,
  courseInstructor?: string,
  signature?: DigitalSignature,
  verification?: any
): Promise<Blob> => {
  const { design } = template;
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([design.size.width, design.size.height]);

  // Parse colors
  const parseColor = (color: string) => {
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16) / 255;
      const g = parseInt(color.slice(3, 5), 16) / 255;
      const b = parseInt(color.slice(5, 7), 16) / 255;
      return rgb(r, g, b);
    }
    return rgb(0.2, 0.2, 0.2); // Default
  };

  const primaryColor = parseColor(design.colors.primary);
  const secondaryColor = parseColor(design.colors.secondary);
  const accentColor = parseColor(design.colors.accent);
  const backgroundColor = parseColor(design.colors.background);
  const textColor = parseColor(design.colors.text);

  // Load fonts
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Draw background
  page.drawRectangle({
    x: 0,
    y: 0,
    width: design.size.width,
    height: design.size.height,
    color: backgroundColor,
  });

  // Draw border if enabled
  if (design.elements.showBorder) {
    page.drawRectangle({
      x: 20,
      y: 20,
      width: design.size.width - 40,
      height: design.size.height - 40,
      borderColor: primaryColor,
      borderWidth: 6,
    });

    page.drawRectangle({
      x: 40,
      y: 40,
      width: design.size.width - 80,
      height: design.size.height - 80,
      borderColor: secondaryColor,
      borderWidth: 3,
    });
  }

  const centerX = design.size.width / 2;
  const centerText = (text: string, size: number, font: any, y: number) => {
    const textWidth = font.widthOfTextAtSize(text, size);
    return centerX - textWidth / 2;
  };

  // Title
  const titleY = design.size.height - 150;
  page.drawText('CERTIFICATE OF COMPLETION', {
    x: centerText('CERTIFICATE OF COMPLETION', 32, helveticaBold, titleY),
    y: titleY,
    size: 32,
    font: helveticaBold,
    color: primaryColor,
  });

  // Name
  const nameY = titleY - 80;
  page.drawText(`This is to certify that`, {
    x: centerText(`This is to certify that`, 18, helvetica, nameY),
    y: nameY,
    size: 18,
    font: helvetica,
    color: textColor,
  });

  const userNameY = nameY - 50;
  page.drawText(userName, {
    x: centerText(userName, 28, helveticaBold, userNameY),
    y: userNameY,
    size: 28,
    font: helveticaBold,
    color: primaryColor,
  });

  // Course title
  const courseY = userNameY - 50;
  page.drawText(`has successfully completed the course`, {
    x: centerText(`has successfully completed the course`, 16, helvetica, courseY),
    y: courseY,
    size: 16,
    font: helvetica,
    color: textColor,
  });

  const courseTitleY = courseY - 50;
  page.drawText(certificate.courseTitle, {
    x: centerText(certificate.courseTitle, 24, helveticaBold, courseTitleY),
    y: courseTitleY,
    size: 24,
    font: helveticaBold,
    color: accentColor,
  });

  // Date
  if (design.elements.showDate) {
    const issueDate = new Date(certificate.issuedAt);
    const formattedDate = issueDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const dateY = courseTitleY - 60;
    page.drawText(`Issued on ${formattedDate}`, {
      x: centerText(`Issued on ${formattedDate}`, 14, helvetica, dateY),
      y: dateY,
      size: 14,
      font: helvetica,
      color: textColor,
    });
  }

  // Certificate ID
  if (design.elements.showCertificateId && verification) {
    const certIdY = 80;
    page.drawText(`Certificate ID: ${verification.verificationCode}`, {
      x: centerText(`Certificate ID: ${verification.verificationCode}`, 10, helveticaOblique, certIdY),
      y: certIdY,
      size: 10,
      font: helveticaOblique,
      color: textColor,
      opacity: 0.7,
    });
  }

  // QR Code (placeholder - would need actual QR code library)
  if (design.elements.showQRCode && verification) {
    // In production, embed actual QR code image
    const qrSize = 80;
    const qrX = design.size.width - qrSize - 30;
    const qrY = 30;
    
    // Draw placeholder rectangle for QR code
    page.drawRectangle({
      x: qrX,
      y: qrY,
      width: qrSize,
      height: qrSize,
      borderColor: primaryColor,
      borderWidth: 1,
    });
    
    page.drawText('QR', {
      x: qrX + qrSize / 2 - 10,
      y: qrY + qrSize / 2 - 5,
      size: 12,
      font: helvetica,
      color: primaryColor,
    });
  }

  // Signature
  if (design.elements.showSignature) {
    const signatureY = 120;
    if (signature) {
      page.drawText(signature.signerName, {
        x: centerX - 100,
        y: signatureY,
        size: 14,
        font: helveticaBold,
        color: textColor,
      });
      page.drawText(signature.signerTitle, {
        x: centerX - 100,
        y: signatureY - 20,
        size: 12,
        font: helvetica,
        color: textColor,
      });
    } else if (courseInstructor) {
      page.drawText(courseInstructor, {
        x: centerX - 100,
        y: signatureY,
        size: 14,
        font: helveticaBold,
        color: textColor,
      });
      page.drawText('Instructor', {
        x: centerX - 100,
        y: signatureY - 20,
        size: 12,
        font: helvetica,
        color: textColor,
      });
    }
  }

  // Branding
  if (design.branding) {
    const brandY = design.size.height - 50;
    if (design.branding.companyName) {
      page.drawText(design.branding.companyName, {
        x: centerText(design.branding.companyName, 16, helveticaBold, brandY),
        y: brandY,
        size: 16,
        font: helveticaBold,
        color: primaryColor,
      });
    }
    if (design.branding.tagline) {
      const taglineY = brandY - 20;
      page.drawText(design.branding.tagline, {
        x: centerText(design.branding.tagline, 12, helvetica, taglineY),
        y: taglineY,
        size: 12,
        font: helvetica,
        color: textColor,
        opacity: 0.7,
      });
    }
  }

  // Serialize PDF
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
};

/**
 * Download certificate with template
 */
export const downloadCertificateWithTemplate = async (
  certificate: Certificate,
  userName: string,
  templateId: string = 'classic-green',
  courseInstructor?: string,
  signature?: DigitalSignature
): Promise<void> => {
  const { pdf } = await generateCertificateWithTemplate(
    certificate,
    userName,
    templateId,
    courseInstructor,
    signature
  );

  const url = URL.createObjectURL(pdf);
  const link = document.createElement('a');
  link.href = url;
  link.download = `GreenKiddo_Certificate_${certificate.courseTitle.replace(/[^a-z0-9]/gi, '_')}_${certificate.id}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

