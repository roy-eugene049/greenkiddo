import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Note } from '../types/course';

interface ExportNotesOptions {
  notes: Note[];
  lessonTitle: string;
  courseTitle: string;
  userName: string;
}

/**
 * Generates a PDF document from lesson notes
 */
export const generateNotesPDF = async (options: ExportNotesOptions): Promise<Blob> => {
  const { notes, lessonTitle, courseTitle, userName } = options;

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // Standard US Letter size

  // Define colors
  const greenColor = rgb(0.204, 0.961, 0.227); // #34f63a (green-ecco)
  const darkGray = rgb(0.1, 0.1, 0.1);
  const lightGray = rgb(0.4, 0.4, 0.4);
  const white = rgb(1, 1, 1);

  // Load fonts
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  let yPosition = 750; // Start from top

  // Header
  page.drawText('GreenKiddo Learning Notes', {
    x: 50,
    y: yPosition,
    size: 24,
    font: helveticaBold,
    color: greenColor,
  });
  yPosition -= 30;

  // Course and lesson info
  page.drawText(`Course: ${courseTitle}`, {
    x: 50,
    y: yPosition,
    size: 14,
    font: helvetica,
    color: white,
  });
  yPosition -= 20;

  page.drawText(`Lesson: ${lessonTitle}`, {
    x: 50,
    y: yPosition,
    size: 14,
    font: helvetica,
    color: white,
  });
  yPosition -= 20;

  page.drawText(`Student: ${userName}`, {
    x: 50,
    y: yPosition,
    size: 12,
    font: helveticaOblique,
    color: lightGray,
  });
  yPosition -= 30;

  // Draw a line separator
  page.drawLine({
    start: { x: 50, y: yPosition },
    end: { x: 562, y: yPosition },
    thickness: 1,
    color: greenColor,
  });
  yPosition -= 30;

  // Export date
  const exportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  page.drawText(`Exported on: ${exportDate}`, {
    x: 50,
    y: yPosition,
    size: 10,
    font: helveticaOblique,
    color: lightGray,
  });
  yPosition -= 40;

  // Notes content
  let currentPage = page;
  const pages = [currentPage];

  if (notes.length === 0) {
    currentPage.drawText('No notes available for this lesson.', {
      x: 50,
      y: yPosition,
      size: 12,
      font: helvetica,
      color: lightGray,
    });
  } else {
    notes.forEach((note, index) => {
      // Check if we need a new page
      if (yPosition < 100) {
        const newPage = pdfDoc.addPage([612, 792]);
        pages.push(newPage);
        currentPage = newPage;
        yPosition = 750;
      }

      // Note number
      currentPage.drawText(`Note ${index + 1}`, {
        x: 50,
        y: yPosition,
        size: 14,
        font: helveticaBold,
        color: greenColor,
      });
      yPosition -= 20;

      // Note date
      const noteDate = new Date(note.updatedAt || note.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      currentPage.drawText(noteDate, {
        x: 50,
        y: yPosition,
        size: 10,
        font: helveticaOblique,
        color: lightGray,
      });
      yPosition -= 20;

      // Note content (split into lines if too long)
      const maxWidth = 512; // Page width minus margins
      const fontSize = 11;
      const lineHeight = 14;
      const words = note.content.split(' ');
      let currentLine = '';

      words.forEach((word) => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const textWidth = helvetica.widthOfTextAtSize(testLine, fontSize);

        if (textWidth > maxWidth && currentLine) {
          // Check if we need a new page before drawing
          if (yPosition < 50) {
            const newPage = pdfDoc.addPage([612, 792]);
            pages.push(newPage);
            currentPage = newPage;
            yPosition = 750;
          }
          currentPage.drawText(currentLine, {
            x: 50,
            y: yPosition,
            size: fontSize,
            font: helvetica,
            color: white,
          });
          yPosition -= lineHeight;
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });

      // Draw remaining line
      if (currentLine) {
        if (yPosition < 50) {
          const newPage = pdfDoc.addPage([612, 792]);
          pages.push(newPage);
          currentPage = newPage;
          yPosition = 750;
        }
        currentPage.drawText(currentLine, {
          x: 50,
          y: yPosition,
          size: fontSize,
          font: helvetica,
          color: white,
        });
        yPosition -= lineHeight;
      }

      yPosition -= 20; // Space between notes
    });
  }

  // Footer on last page
  const allPages = pdfDoc.getPages();
  const lastPage = allPages[allPages.length - 1];
  lastPage.drawText('Generated by GreenKiddo Learning Platform', {
    x: 50,
    y: 30,
    size: 8,
    font: helveticaOblique,
    color: lightGray,
  });

  // Serialize the PDF
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
};

/**
 * Downloads notes as a PDF
 */
export const downloadNotesPDF = async (options: ExportNotesOptions): Promise<void> => {
  const pdfBlob = await generateNotesPDF(options);
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  const safeTitle = options.lessonTitle.replace(/[^a-z0-9]/gi, '_');
  link.download = `GreenKiddo_Notes_${safeTitle}_${new Date().toISOString().split('T')[0]}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

