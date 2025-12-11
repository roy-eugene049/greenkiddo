import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Certificate } from '../types/course';

/**
 * Generates a PDF certificate for course completion
 */
export const generateCertificatePDF = async (
  certificate: Certificate,
  userName: string,
  courseInstructor?: string
): Promise<Blob> => {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([800, 600]); // Landscape orientation for certificate

  // Define jungle green color palette
  const jungleGreen = rgb(0.133, 0.545, 0.133); // #228B22 - Forest green
  const darkJungleGreen = rgb(0.0, 0.392, 0.0); // #006400 - Dark green
  const lightJungleGreen = rgb(0.565, 0.933, 0.565); // #90EE90 - Light green
  const emeraldGreen = rgb(0.180, 0.545, 0.341); // #2E8B57 - Sea green
  const mossGreen = rgb(0.278, 0.443, 0.278); // #475C47 - Moss green
  const darkGray = rgb(0.05, 0.1, 0.05); // Dark background
  const lightGray = rgb(0.6, 0.7, 0.6); // Light text
  const white = rgb(1, 1, 1);
  const cream = rgb(0.98, 0.98, 0.95); // Cream background

  // Load fonts
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Draw cream background
  page.drawRectangle({
    x: 0,
    y: 0,
    width: 800,
    height: 600,
    color: cream,
  });

  // Draw outer jungle green border with organic pattern
  page.drawRectangle({
    x: 20,
    y: 20,
    width: 760,
    height: 560,
    borderColor: darkJungleGreen,
    borderWidth: 6,
  });

  // Draw inner decorative border with leaf pattern effect
  page.drawRectangle({
    x: 40,
    y: 40,
    width: 720,
    height: 520,
    borderColor: jungleGreen,
    borderWidth: 3,
  });

  // Draw subtle background pattern - leaf-like shapes
  const drawLeafPattern = () => {
    // Top corners - leaf clusters
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const radius = 60 + (i % 3) * 15;
      const x = 400 + Math.cos(angle) * radius;
      const y = 500 + Math.sin(angle) * radius;
      
      // Draw small leaf shape (simplified as circles with opacity)
      page.drawCircle({
        x,
        y,
        size: 8 + (i % 2) * 4,
        color: lightJungleGreen,
        opacity: 0.15,
      });
    }

    // Bottom corners - similar pattern
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const radius = 60 + (i % 3) * 15;
      const x = 400 + Math.cos(angle) * radius;
      const y = 100 + Math.sin(angle) * radius;
      
      page.drawCircle({
        x,
        y,
        size: 8 + (i % 2) * 4,
        color: lightJungleGreen,
        opacity: 0.15,
      });
    }
  };

  drawLeafPattern();

  // Draw decorative vine borders on sides
  const drawVineBorder = (startX: number, startY: number, endY: number, isLeft: boolean) => {
    const segments = 12;
    const step = (endY - startY) / segments;
    
    for (let i = 0; i < segments; i++) {
      const y = startY + i * step;
      const x = isLeft ? startX : 800 - startX;
      const offset = (i % 2 === 0 ? 1 : -1) * 8;
      
      // Draw small leaf
      page.drawCircle({
        x: x + offset,
        y,
        size: 6,
        color: emeraldGreen,
        opacity: 0.4,
      });
      
      // Draw connecting line
      if (i < segments - 1) {
        page.drawLine({
          start: { x: x + offset, y },
          end: { x: x + (i % 2 === 0 ? 1 : -1) * 8, y: y + step },
          thickness: 1.5,
          color: mossGreen,
          opacity: 0.3,
        });
      }
    }
  };

  drawVineBorder(50, 80, 520, true);
  drawVineBorder(50, 80, 520, false);

  // Helper function to center text
  const centerText = (text: string, fontSize: number, font: any, y: number): number => {
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    return (800 - textWidth) / 2; // Center horizontally on 800px wide page
  };

  // Decorative leaf elements around title
  const drawDecorativeLeaves = (centerX: number, centerY: number) => {
    // Left leaf cluster
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 0.8 - Math.PI / 2;
      const radius = 25 + i * 5;
      const x = centerX - 120 + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      page.drawCircle({
        x,
        y,
        size: 5 + i,
        color: emeraldGreen,
        opacity: 0.25,
      });
    }
    
    // Right leaf cluster
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 0.8 - Math.PI / 2;
      const radius = 25 + i * 5;
      const x = centerX + 120 + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      page.drawCircle({
        x,
        y,
        size: 5 + i,
        color: emeraldGreen,
        opacity: 0.25,
      });
    }
  };

  // Title with decorative elements
  const titleText = 'CERTIFICATE OF COMPLETION';
  const titleY = 520;
  drawDecorativeLeaves(400, titleY);
  
  page.drawText(titleText, {
    x: centerText(titleText, 38, helveticaBold, titleY),
    y: titleY,
    size: 38,
    font: helveticaBold,
    color: darkJungleGreen,
  });

  // Subtitle with eco theme
  const subtitleText = 'GreenKiddo Learning Platform';
  page.drawText(subtitleText, {
    x: centerText(subtitleText, 18, helveticaOblique, 480),
    y: 480,
    size: 18,
    font: helveticaOblique,
    color: emeraldGreen,
  });

  // Decorative line with leaf accents
  const drawDecorativeLine = (y: number) => {
    page.drawLine({
      start: { x: 150, y },
      end: { x: 250, y },
      thickness: 2,
      color: mossGreen,
      opacity: 0.5,
    });
    
    // Leaf on left
    page.drawCircle({
      x: 200,
      y: y + 3,
      size: 4,
      color: emeraldGreen,
      opacity: 0.6,
    });
    
    page.drawLine({
      start: { x: 550, y },
      end: { x: 650, y },
      thickness: 2,
      color: mossGreen,
      opacity: 0.5,
    });
    
    // Leaf on right
    page.drawCircle({
      x: 600,
      y: y + 3,
      size: 4,
      color: emeraldGreen,
      opacity: 0.6,
    });
  };

  // This certifies text
  const certifiesText = 'This is to certify that';
  page.drawText(certifiesText, {
    x: centerText(certifiesText, 20, helvetica, 420),
    y: 420,
    size: 20,
    font: helvetica,
    color: darkGray,
  });

  // Decorative line above name
  drawDecorativeLine(380);

  // Student name (centered and prominent with jungle green)
  page.drawText(userName, {
    x: centerText(userName, 36, helveticaBold, 360),
    y: 360,
    size: 36,
    font: helveticaBold,
    color: darkJungleGreen,
  });

  // Decorative line below name
  drawDecorativeLine(330);

  // Has successfully completed text
  const completedText = 'has successfully completed the course';
  page.drawText(completedText, {
    x: centerText(completedText, 20, helvetica, 310),
    y: 310,
    size: 20,
    font: helvetica,
    color: darkGray,
  });

  // Course title with leaf accents
  const courseTitle = certificate.courseTitle;
  const courseTitleY = 260;
  
  // Small decorative leaves around course title
  page.drawCircle({
    x: 150,
    y: courseTitleY + 5,
    size: 5,
    color: lightJungleGreen,
    opacity: 0.4,
  });
  page.drawCircle({
    x: 650,
    y: courseTitleY + 5,
    size: 5,
    color: lightJungleGreen,
    opacity: 0.4,
  });
  
  page.drawText(courseTitle, {
    x: centerText(courseTitle, 26, helveticaBold, courseTitleY),
    y: courseTitleY,
    size: 26,
    font: helveticaBold,
    color: jungleGreen,
  });

  // Decorative tree/plant elements at bottom
  const drawBottomDecoration = () => {
    // Left side plant
    for (let i = 0; i < 6; i++) {
      const x = 100 + i * 8;
      const y = 120 - i * 3;
      page.drawCircle({
        x,
        y,
        size: 4 + (i % 2) * 2,
        color: emeraldGreen,
        opacity: 0.3,
      });
    }
    
    // Right side plant
    for (let i = 0; i < 6; i++) {
      const x = 700 - i * 8;
      const y = 120 - i * 3;
      page.drawCircle({
        x,
        y,
        size: 4 + (i % 2) * 2,
        color: emeraldGreen,
        opacity: 0.3,
      });
    }
  };

  drawBottomDecoration();

  // Date with eco styling
  const issueDate = new Date(certificate.issuedAt);
  const formattedDate = issueDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const dateText = `Issued on ${formattedDate}`;
  page.drawText(dateText, {
    x: centerText(dateText, 16, helvetica, 200),
    y: 200,
    size: 16,
    font: helvetica,
    color: mossGreen,
  });

  // Signature line with decorative elements
  if (courseInstructor) {
    const instructorText = `Instructor: ${courseInstructor}`;
    page.drawText(instructorText, {
      x: centerText(instructorText, 15, helvetica, 150),
      y: 150,
      size: 15,
      font: helvetica,
      color: mossGreen,
    });
  }

  // Certificate ID with leaf icon
  const certIdText = `Certificate ID: ${certificate.id}`;
  page.drawCircle({
    x: 100,
    y: 90,
    size: 3,
    color: emeraldGreen,
    opacity: 0.5,
  });
  page.drawText(certIdText, {
    x: centerText(certIdText, 11, helveticaOblique, 90),
    y: 90,
    size: 11,
    font: helveticaOblique,
    color: mossGreen,
    opacity: 0.8,
  });

  // Decorative corner elements - organic leaf clusters
  const drawCornerLeaves = (x: number, y: number, isTop: boolean, isLeft: boolean) => {
    const direction = isTop ? 1 : -1;
    const side = isLeft ? 1 : -1;
    
    // Draw leaf cluster
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 0.6;
      const radius = 15 + (i % 3) * 5;
      const leafX = x + Math.cos(angle) * radius * side;
      const leafY = y + Math.sin(angle) * radius * direction;
      
      page.drawCircle({
        x: leafX,
        y: leafY,
        size: 4 + (i % 2) * 2,
        color: emeraldGreen,
        opacity: 0.4,
      });
    }
    
    // Draw connecting vine
    for (let i = 0; i < 5; i++) {
      const offsetX = i * 6 * side;
      const offsetY = i * 4 * direction;
      page.drawCircle({
        x: x + offsetX,
        y: y + offsetY,
        size: 2,
        color: mossGreen,
        opacity: 0.3,
      });
    }
  };

  // Draw corner decorations
  drawCornerLeaves(50, 550, true, true);   // Top-left
  drawCornerLeaves(750, 550, true, false);  // Top-right
  drawCornerLeaves(50, 50, false, true);   // Bottom-left
  drawCornerLeaves(750, 50, false, false);  // Bottom-right

  // Serialize the PDF
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
};

/**
 * Downloads a certificate PDF
 */
export const downloadCertificatePDF = async (
  certificate: Certificate,
  userName: string,
  courseInstructor?: string
): Promise<void> => {
  const pdfBlob = await generateCertificatePDF(certificate, userName, courseInstructor);
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `GreenKiddo_Certificate_${certificate.courseTitle.replace(/[^a-z0-9]/gi, '_')}_${certificate.id}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

