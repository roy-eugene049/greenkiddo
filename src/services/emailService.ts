/**
 * Email Service
 * 
 * Handles sending emails with support for:
 * - Multiple email providers (Resend, SendGrid, SMTP)
 * - Email templates
 * - HTML and plain text emails
 * - Email preferences
 */

import { apiClient } from './api/client';
import { handleApiError } from './api/errorHandler';
import { getPlatformSettings } from './settingsService';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  fromName?: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: string | ArrayBuffer;
    contentType?: string;
  }>;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send email using API
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  try {
    // Get platform settings for default from email
    const settings = await getPlatformSettings();
    
    const emailData = {
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text,
      from: options.from || settings.email.fromEmail,
      fromName: options.fromName || settings.email.fromName,
      replyTo: options.replyTo,
      attachments: options.attachments,
    };

    // For development, use mock email service
    if (import.meta.env.DEV) {
      return await mockSendEmail(emailData);
    }

    // Real API call (when backend is ready)
    const response = await apiClient.post<EmailResult>(
      '/api/email/send',
      emailData
    );

    return response;
  } catch (error) {
    const { userMessage } = handleApiError(error as Error, 'sendEmail');
    return {
      success: false,
      error: userMessage,
    };
  }
}

/**
 * Mock email sending for development
 */
async function mockSendEmail(data: {
  to: string[];
  subject: string;
  html?: string;
  text?: string;
  from: string;
  fromName: string;
}): Promise<EmailResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Log email to console in development
  if (import.meta.env.DEV) {
    console.log('📧 Email sent (mock):', {
      to: data.to,
      subject: data.subject,
      from: `${data.fromName} <${data.from}>`,
      preview: data.text || data.html?.substring(0, 100) + '...',
    });
  }

  // Store in localStorage for email preview (optional)
  const emailLog = JSON.parse(localStorage.getItem('greenkiddo_email_log') || '[]');
  emailLog.unshift({
    ...data,
    sentAt: new Date().toISOString(),
    id: `email-${Date.now()}`,
  });
  // Keep only last 50 emails
  if (emailLog.length > 50) {
    emailLog.splice(50);
  }
  localStorage.setItem('greenkiddo_email_log', JSON.stringify(emailLog));

  return {
    success: true,
    messageId: `mock-${Date.now()}`,
  };
}

/**
 * Get email log (for development/testing)
 */
export function getEmailLog(): Array<{
  id: string;
  to: string[];
  subject: string;
  from: string;
  fromName: string;
  html?: string;
  text?: string;
  sentAt: string;
}> {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('greenkiddo_email_log') || '[]');
}

/**
 * Clear email log
 */
export function clearEmailLog(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('greenkiddo_email_log');
  }
}

/**
 * Check if email notifications are enabled for a specific type
 */
export async function isEmailNotificationEnabled(type: 'signup' | 'enrollment' | 'completion' | 'achievement' | 'weeklyDigest'): Promise<boolean> {
  const settings = await getPlatformSettings();
  
  switch (type) {
    case 'signup':
      return settings.notifications.emailOnSignup;
    case 'enrollment':
      return settings.notifications.emailOnEnrollment;
    case 'completion':
      return settings.notifications.emailOnCompletion;
    case 'achievement':
      return settings.notifications.emailOnAchievement;
    case 'weeklyDigest':
      return settings.notifications.emailWeeklyDigest;
    default:
      return false;
  }
}

