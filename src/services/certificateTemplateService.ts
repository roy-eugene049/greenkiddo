import { CertificateTemplate, CertificateDesign } from '../types/certificate';

const STORAGE_KEY_PREFIX = 'greenkiddo_cert_templates_';

/**
 * Default certificate templates
 */
const DEFAULT_TEMPLATES: CertificateTemplate[] = [
  {
    id: 'classic-green',
    name: 'Classic Green',
    description: 'Traditional design with green theme and decorative borders',
    isDefault: true,
    isActive: true,
    design: {
      layout: 'landscape',
      size: { width: 800, height: 600 },
      colors: {
        primary: '#228B22', // Forest green
        secondary: '#006400', // Dark green
        accent: '#2E8B57', // Sea green
        background: '#FAFAF5', // Cream
        text: '#1a1a1a',
      },
      fonts: {
        title: 'Helvetica-Bold',
        body: 'Helvetica',
        signature: 'Helvetica-Oblique',
      },
      elements: {
        showLogo: true,
        showBorder: true,
        showWatermark: false,
        showQRCode: true,
        showSignature: true,
        showDate: true,
        showCertificateId: true,
        decorativeElements: 'elaborate',
      },
      branding: {
        logoPosition: 'top-center',
        companyName: 'GreenKiddo',
        tagline: 'Empowering Future Generations',
      },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Clean and minimalist design with subtle accents',
    isDefault: false,
    isActive: true,
    design: {
      layout: 'landscape',
      size: { width: 800, height: 600 },
      colors: {
        primary: '#34f63a', // Green-ecco
        secondary: '#1a1a1a',
        accent: '#34f63a',
        background: '#ffffff',
        text: '#1a1a1a',
      },
      fonts: {
        title: 'Helvetica-Bold',
        body: 'Helvetica',
        signature: 'Helvetica',
      },
      elements: {
        showLogo: true,
        showBorder: false,
        showWatermark: false,
        showQRCode: true,
        showSignature: true,
        showDate: true,
        showCertificateId: true,
        decorativeElements: 'minimal',
      },
      branding: {
        logoPosition: 'top-center',
        companyName: 'GreenKiddo',
      },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'elegant-formal',
    name: 'Elegant Formal',
    description: 'Professional design suitable for formal recognition',
    isDefault: false,
    isActive: true,
    design: {
      layout: 'portrait',
      size: { width: 600, height: 800 },
      colors: {
        primary: '#1a1a1a',
        secondary: '#34f63a',
        accent: '#228B22',
        background: '#ffffff',
        text: '#1a1a1a',
      },
      fonts: {
        title: 'Helvetica-Bold',
        body: 'Helvetica',
        signature: 'Helvetica-Oblique',
      },
      elements: {
        showLogo: true,
        showBorder: true,
        showWatermark: true,
        showQRCode: true,
        showSignature: true,
        showDate: true,
        showCertificateId: true,
        decorativeElements: 'moderate',
      },
      branding: {
        logoPosition: 'top-center',
        companyName: 'GreenKiddo',
        tagline: 'Sustainability Education Platform',
      },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Get all certificate templates
 */
export const getCertificateTemplates = async (): Promise<CertificateTemplate[]> => {
  const key = `${STORAGE_KEY_PREFIX}all`;
  const stored = localStorage.getItem(key);
  
  if (stored) {
    return JSON.parse(stored);
  }

  // Save default templates
  localStorage.setItem(key, JSON.stringify(DEFAULT_TEMPLATES));
  return DEFAULT_TEMPLATES;
};

/**
 * Get template by ID
 */
export const getCertificateTemplate = async (templateId: string): Promise<CertificateTemplate | null> => {
  const templates = await getCertificateTemplates();
  return templates.find(t => t.id === templateId) || null;
};

/**
 * Create custom template
 */
export const createCertificateTemplate = async (
  template: Omit<CertificateTemplate, 'id' | 'createdAt' | 'updatedAt'>
): Promise<CertificateTemplate> => {
  const newTemplate: CertificateTemplate = {
    ...template,
    id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const templates = await getCertificateTemplates();
  templates.push(newTemplate);
  const key = `${STORAGE_KEY_PREFIX}all`;
  localStorage.setItem(key, JSON.stringify(templates));

  return newTemplate;
};

/**
 * Update template
 */
export const updateCertificateTemplate = async (
  templateId: string,
  updates: Partial<CertificateTemplate>
): Promise<CertificateTemplate> => {
  const templates = await getCertificateTemplates();
  const index = templates.findIndex(t => t.id === templateId);
  
  if (index === -1) {
    throw new Error('Template not found');
  }

  templates[index] = {
    ...templates[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const key = `${STORAGE_KEY_PREFIX}all`;
  localStorage.setItem(key, JSON.stringify(templates));

  return templates[index];
};

/**
 * Delete template
 */
export const deleteCertificateTemplate = async (templateId: string): Promise<void> => {
  const templates = await getCertificateTemplates();
  const filtered = templates.filter(t => t.id !== templateId);
  const key = `${STORAGE_KEY_PREFIX}all`;
  localStorage.setItem(key, JSON.stringify(filtered));
};

/**
 * Set default template
 */
export const setDefaultTemplate = async (templateId: string): Promise<void> => {
  const templates = await getCertificateTemplates();
  
  templates.forEach(t => {
    t.isDefault = t.id === templateId;
  });

  const key = `${STORAGE_KEY_PREFIX}all`;
  localStorage.setItem(key, JSON.stringify(templates));
};

