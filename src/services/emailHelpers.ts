/**
 * Email Helpers
 * 
 * Convenience functions for sending common email types
 */

import { sendEmail, isEmailNotificationEnabled } from './emailService';
import {
  getWelcomeEmail,
  getEnrollmentEmail,
  getCompletionEmail,
  getAchievementEmail,
  getWeeklyDigestEmail,
  getPasswordResetEmail,
  type WelcomeEmailData,
  type EnrollmentEmailData,
  type CompletionEmailData,
  type AchievementEmailData,
  type WeeklyDigestEmailData,
  type PasswordResetEmailData,
} from './emailTemplates';

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
  if (!(await isEmailNotificationEnabled('signup'))) {
    return false;
  }

  try {
    const template = await getWelcomeEmail(data);
    const result = await sendEmail({
      to: data.userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
    return result.success;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
}

/**
 * Send course enrollment confirmation email
 */
export async function sendEnrollmentEmail(data: EnrollmentEmailData & { userEmail: string }): Promise<boolean> {
  if (!(await isEmailNotificationEnabled('enrollment'))) {
    return false;
  }

  try {
    const template = await getEnrollmentEmail(data);
    const result = await sendEmail({
      to: data.userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
    return result.success;
  } catch (error) {
    console.error('Error sending enrollment email:', error);
    return false;
  }
}

/**
 * Send course completion email
 */
export async function sendCompletionEmail(data: CompletionEmailData & { userEmail: string }): Promise<boolean> {
  if (!(await isEmailNotificationEnabled('completion'))) {
    return false;
  }

  try {
    const template = await getCompletionEmail(data);
    const result = await sendEmail({
      to: data.userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
    return result.success;
  } catch (error) {
    console.error('Error sending completion email:', error);
    return false;
  }
}

/**
 * Send achievement notification email
 */
export async function sendAchievementEmail(data: AchievementEmailData & { userEmail: string }): Promise<boolean> {
  if (!(await isEmailNotificationEnabled('achievement'))) {
    return false;
  }

  try {
    const template = await getAchievementEmail(data);
    const result = await sendEmail({
      to: data.userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
    return result.success;
  } catch (error) {
    console.error('Error sending achievement email:', error);
    return false;
  }
}

/**
 * Send weekly digest email
 */
export async function sendWeeklyDigestEmail(data: WeeklyDigestEmailData & { userEmail: string }): Promise<boolean> {
  if (!(await isEmailNotificationEnabled('weeklyDigest'))) {
    return false;
  }

  try {
    const template = await getWeeklyDigestEmail(data);
    const result = await sendEmail({
      to: data.userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
    return result.success;
  } catch (error) {
    console.error('Error sending weekly digest email:', error);
    return false;
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(data: PasswordResetEmailData & { userEmail: string }): Promise<boolean> {
  try {
    const template = await getPasswordResetEmail(data);
    const result = await sendEmail({
      to: data.userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
    return result.success;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
}

