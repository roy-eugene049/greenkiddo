/**
 * Email Templates
 * 
 * HTML email templates for various notification types
 */

import { Course } from '../types/course';
import { getPlatformSettings } from './settingsService';

export interface WelcomeEmailData {
  userName: string;
  userEmail: string;
}

export interface EnrollmentEmailData {
  userName: string;
  courseTitle: string;
  courseId: string;
  instructorName: string;
}

export interface CompletionEmailData {
  userName: string;
  courseTitle: string;
  courseId: string;
  certificateUrl?: string;
}

export interface AchievementEmailData {
  userName: string;
  achievementName: string;
  achievementDescription: string;
  achievementIcon?: string;
}

export interface WeeklyDigestEmailData {
  userName: string;
  weekStart: string;
  weekEnd: string;
  coursesCompleted: number;
  lessonsCompleted: number;
  achievementsEarned: number;
  timeSpent: string;
  recommendedCourses: Course[];
}

export interface PasswordResetEmailData {
  userName: string;
  resetLink: string;
  expiresIn: string;
}

/**
 * Base email template wrapper
 */
function getBaseTemplate(content: string, settings?: any): string {
  const siteName = settings?.siteName || 'GreenKiddo';
  const siteDescription = settings?.siteDescription || 'Sustainable Learning Platform for Kids';
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${siteName}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .email-header {
      background: linear-gradient(135deg, #1a1a1a 0%, #0d4d0d 100%);
      padding: 30px 20px;
      text-align: center;
    }
    .email-header h1 {
      color: #34f63a;
      margin: 0;
      font-size: 28px;
      font-weight: bold;
    }
    .email-body {
      padding: 40px 30px;
    }
    .email-footer {
      background-color: #1a1a1a;
      padding: 20px;
      text-align: center;
      color: #999999;
      font-size: 12px;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      background-color: #34f63a;
      color: #000000;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      margin: 20px 0;
    }
    .button:hover {
      background-color: #22d329;
    }
    .course-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 20px;
      margin: 15px 0;
      background-color: #f9f9f9;
    }
    .achievement-badge {
      display: inline-block;
      background-color: #34f63a;
      color: #000000;
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: bold;
      margin: 10px 5px 10px 0;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>🌱 ${siteName}</h1>
      <p style="color: #ffffff; margin: 10px 0 0 0;">${siteDescription}</p>
    </div>
    <div class="email-body">
      ${content}
    </div>
    <div class="email-footer">
      <p>© ${new Date().getFullYear()} ${siteName}. All rights reserved.</p>
      <p>You're receiving this email because you have an account with ${siteName}.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Welcome email template
 */
export async function getWelcomeEmail(data: WelcomeEmailData): Promise<{ subject: string; html: string; text: string }> {
  const settings = await getPlatformSettings();
  
  const content = `
    <h2 style="color: #1a1a1a; margin-top: 0;">Welcome to GreenKiddo, ${data.userName}! 🌱</h2>
    <p>We're thrilled to have you join our community of young environmental champions!</p>
    <p>At GreenKiddo, you'll discover fun and engaging courses about sustainability, climate change, and how to make a positive impact on our planet.</p>
    <p><strong>Here's what you can do:</strong></p>
    <ul>
      <li>📚 Explore our courses on sustainability and environmental science</li>
      <li>🏆 Earn badges and certificates as you learn</li>
      <li>💬 Connect with other eco-warriors in our community forum</li>
      <li>📖 Read our blog for tips and inspiration</li>
    </ul>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${typeof window !== 'undefined' ? (typeof window !== 'undefined' ? window.location.origin : 'https://greenkiddo.com') : 'https://greenkiddo.com'}/dashboard" class="button">Start Learning</a>
    </div>
    <p>If you have any questions, feel free to reach out to our support team.</p>
    <p>Happy learning!<br><strong>The GreenKiddo Team</strong></p>
  `;

  return {
    subject: `Welcome to ${settings.siteName}! 🌱`,
    html: getBaseTemplate(content, settings),
    text: `Welcome to ${settings.siteName}, ${data.userName}!\n\nWe're thrilled to have you join our community. Start learning at ${typeof window !== 'undefined' ? (typeof window !== 'undefined' ? window.location.origin : 'https://greenkiddo.com') : 'https://greenkiddo.com'}/dashboard`,
  };
}

/**
 * Course enrollment email template
 */
export async function getEnrollmentEmail(data: EnrollmentEmailData): Promise<{ subject: string; html: string; text: string }> {
  const settings = await getPlatformSettings();
  
  const content = `
    <h2 style="color: #1a1a1a; margin-top: 0;">You're enrolled in "${data.courseTitle}"! 🎉</h2>
    <p>Hi ${data.userName},</p>
    <p>Great news! You've successfully enrolled in <strong>${data.courseTitle}</strong>.</p>
    <div class="course-card">
      <h3 style="margin-top: 0;">${data.courseTitle}</h3>
      <p><strong>Instructor:</strong> ${data.instructorName}</p>
    </div>
    <p>You can now start learning at your own pace. Access your course anytime from your dashboard.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${(typeof window !== 'undefined' ? window.location.origin : 'https://greenkiddo.com')}/courses/${data.courseId}" class="button">Start Course</a>
    </div>
    <p>Happy learning!</p>
  `;

  return {
    subject: `You're enrolled: ${data.courseTitle}`,
    html: getBaseTemplate(content, settings),
    text: `You're enrolled in "${data.courseTitle}"!\n\nStart learning at ${(typeof window !== 'undefined' ? window.location.origin : 'https://greenkiddo.com')}/courses/${data.courseId}`,
  };
}

/**
 * Course completion email template
 */
export async function getCompletionEmail(data: CompletionEmailData): Promise<{ subject: string; html: string; text: string }> {
  const settings = await getPlatformSettings();
  
  const content = `
    <h2 style="color: #1a1a1a; margin-top: 0;">Congratulations! 🎓</h2>
    <p>Hi ${data.userName},</p>
    <p>Amazing work! You've successfully completed <strong>${data.courseTitle}</strong>!</p>
    <p>Your dedication to learning about sustainability is inspiring. Keep up the great work!</p>
    ${data.certificateUrl ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.certificateUrl}" class="button">Download Certificate</a>
      </div>
    ` : ''}
    <p>Continue your learning journey by exploring more courses:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${(typeof window !== 'undefined' ? window.location.origin : 'https://greenkiddo.com')}/courses" class="button">Browse Courses</a>
    </div>
    <p>Thank you for being part of the GreenKiddo community!</p>
  `;

  return {
    subject: `Course Completed: ${data.courseTitle} 🎉`,
    html: getBaseTemplate(content, settings),
    text: `Congratulations! You've completed "${data.courseTitle}"!\n\n${data.certificateUrl ? `Download your certificate: ${data.certificateUrl}\n\n` : ''}Browse more courses: ${(typeof window !== 'undefined' ? window.location.origin : 'https://greenkiddo.com')}/courses`,
  };
}

/**
 * Achievement email template
 */
export async function getAchievementEmail(data: AchievementEmailData): Promise<{ subject: string; html: string; text: string }> {
  const settings = await getPlatformSettings();
  
  const content = `
    <h2 style="color: #1a1a1a; margin-top: 0;">Achievement Unlocked! 🏆</h2>
    <p>Hi ${data.userName},</p>
    <p>Congratulations! You've earned a new achievement:</p>
    <div style="text-align: center; margin: 30px 0;">
      <div class="achievement-badge">
        ${data.achievementIcon || '🏆'} ${data.achievementName}
      </div>
    </div>
    <p><strong>${data.achievementDescription}</strong></p>
    <p>Keep learning and earning more achievements!</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${(typeof window !== 'undefined' ? window.location.origin : 'https://greenkiddo.com')}/dashboard/achievements" class="button">View Achievements</a>
    </div>
  `;

  return {
    subject: `Achievement Unlocked: ${data.achievementName}! 🏆`,
    html: getBaseTemplate(content, settings),
    text: `Achievement Unlocked: ${data.achievementName}!\n\n${data.achievementDescription}\n\nView all achievements: ${(typeof window !== 'undefined' ? window.location.origin : 'https://greenkiddo.com')}/dashboard/achievements`,
  };
}

/**
 * Weekly digest email template
 */
export async function getWeeklyDigestEmail(data: WeeklyDigestEmailData): Promise<{ subject: string; html: string; text: string }> {
  const settings = await getPlatformSettings();
  
  const recommendedCoursesHtml = data.recommendedCourses.length > 0
    ? `
      <h3 style="color: #1a1a1a;">Recommended for You</h3>
      ${data.recommendedCourses.map(course => `
        <div class="course-card">
          <h4 style="margin-top: 0;">${course.title}</h4>
          <p style="margin-bottom: 10px;">${course.description.substring(0, 100)}...</p>
          <a href="${(typeof window !== 'undefined' ? window.location.origin : 'https://greenkiddo.com')}/courses/${course.id}" style="color: #34f63a; text-decoration: none;">View Course →</a>
        </div>
      `).join('')}
    `
    : '';

  const content = `
    <h2 style="color: #1a1a1a; margin-top: 0;">Your Weekly Learning Summary 📊</h2>
    <p>Hi ${data.userName},</p>
    <p>Here's what you accomplished this week (${data.weekStart} - ${data.weekEnd}):</p>
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <div style="display: flex; justify-content: space-around; text-align: center;">
        <div>
          <div style="font-size: 32px; font-weight: bold; color: #34f63a;">${data.coursesCompleted}</div>
          <div style="color: #666;">Courses Completed</div>
        </div>
        <div>
          <div style="font-size: 32px; font-weight: bold; color: #34f63a;">${data.lessonsCompleted}</div>
          <div style="color: #666;">Lessons Completed</div>
        </div>
        <div>
          <div style="font-size: 32px; font-weight: bold; color: #34f63a;">${data.achievementsEarned}</div>
          <div style="color: #666;">Achievements</div>
        </div>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #666;">
        <strong>Time Spent:</strong> ${data.timeSpent}
      </div>
    </div>
    ${recommendedCoursesHtml}
    <div style="text-align: center; margin: 30px 0;">
      <a href="${(typeof window !== 'undefined' ? window.location.origin : 'https://greenkiddo.com')}/dashboard" class="button">Continue Learning</a>
    </div>
    <p>Keep up the amazing work! 🌱</p>
  `;

  return {
    subject: `Your Weekly Learning Summary - ${data.weekEnd}`,
    html: getBaseTemplate(content, settings),
    text: `Your Weekly Learning Summary\n\nCourses Completed: ${data.coursesCompleted}\nLessons Completed: ${data.lessonsCompleted}\nAchievements: ${data.achievementsEarned}\nTime Spent: ${data.timeSpent}\n\nContinue learning: ${(typeof window !== 'undefined' ? window.location.origin : 'https://greenkiddo.com')}/dashboard`,
  };
}

/**
 * Password reset email template
 */
export async function getPasswordResetEmail(data: PasswordResetEmailData): Promise<{ subject: string; html: string; text: string }> {
  const settings = await getPlatformSettings();
  
  const content = `
    <h2 style="color: #1a1a1a; margin-top: 0;">Password Reset Request</h2>
    <p>Hi ${data.userName},</p>
    <p>We received a request to reset your password. Click the button below to create a new password:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.resetLink}" class="button">Reset Password</a>
    </div>
    <p>This link will expire in ${data.expiresIn}.</p>
    <p style="color: #999; font-size: 12px;">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
  `;

  return {
    subject: 'Reset Your Password - GreenKiddo',
    html: getBaseTemplate(content, settings),
    text: `Password Reset Request\n\nHi ${data.userName},\n\nClick this link to reset your password: ${data.resetLink}\n\nThis link expires in ${data.expiresIn}.\n\nIf you didn't request this, please ignore this email.`,
  };
}

