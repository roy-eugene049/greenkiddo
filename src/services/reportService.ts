import { CustomReport, ReportData, ReportFilters } from '../types/studentAnalytics';
import { getStudentProgressAnalytics } from './studentAnalyticsService';
import { getAnalyticsData } from './analyticsService';

const STORAGE_KEY_PREFIX = 'greenkiddo_reports_';

/**
 * Get all custom reports
 */
export const getCustomReports = async (): Promise<CustomReport[]> => {
  const key = `${STORAGE_KEY_PREFIX}custom`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

/**
 * Create a custom report
 */
export const createCustomReport = async (report: Omit<CustomReport, 'id' | 'createdAt' | 'updatedAt'>): Promise<CustomReport> => {
  const newReport: CustomReport = {
    ...report,
    id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const reports = await getCustomReports();
  reports.push(newReport);
  const key = `${STORAGE_KEY_PREFIX}custom`;
  localStorage.setItem(key, JSON.stringify(reports));

  return newReport;
};

/**
 * Generate report data
 */
export const generateReport = async (reportId: string, format: 'json' | 'csv' | 'pdf' = 'json'): Promise<ReportData> => {
  const reports = await getCustomReports();
  const report = reports.find(r => r.id === reportId);
  
  if (!report) {
    throw new Error('Report not found');
  }

  let data: any;

  switch (report.type) {
    case 'student-progress':
      // Get student progress for filtered users
      if (report.filters.users && report.filters.users.length > 0) {
        const progressPromises = report.filters.users.map(userId => 
          getStudentProgressAnalytics(userId)
        );
        data = await Promise.all(progressPromises);
      } else {
        // Get all users (would need user list in real implementation)
        data = [];
      }
      break;
    
    case 'course-performance':
      const analytics = await getAnalyticsData('all');
      data = analytics.coursePerformance;
      if (report.filters.courses) {
        data = data.filter((c: any) => report.filters.courses!.includes(c.courseId));
      }
      break;
    
    case 'engagement':
      // Get engagement data
      data = { message: 'Engagement data would be generated here' };
      break;
    
    case 'completion':
      const completionAnalytics = await getAnalyticsData('all');
      data = {
        totalCompletions: completionAnalytics.overview.totalCompletions,
        completionRate: completionAnalytics.overview.averageCompletionRate,
        courses: completionAnalytics.coursePerformance.map(c => ({
          courseId: c.courseId,
          courseTitle: c.courseTitle,
          completions: c.completions,
          completionRate: c.completionRate,
        })),
      };
      break;
    
    default:
      data = { message: 'Custom report data' };
  }

  return {
    report,
    data,
    generatedAt: new Date().toISOString(),
    format,
  };
};

/**
 * Export report to CSV
 */
export const exportReportToCSV = (reportData: ReportData): string => {
  const { report, data } = reportData;
  
  if (Array.isArray(data)) {
    if (data.length === 0) return '';
    
    // Get headers from first object
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map((row: any) => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value ?? '';
        }).join(',')
      ),
    ];
    
    return csvRows.join('\n');
  }
  
  // For non-array data, convert to key-value pairs
  const rows: string[][] = [];
  const flattenObject = (obj: any, prefix = '') => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          flattenObject(obj[key], newKey);
        } else {
          rows.push([newKey, String(obj[key])]);
        }
      }
    }
  };
  
  flattenObject(data);
  return ['Key,Value', ...rows.map(row => row.join(','))].join('\n');
};

/**
 * Export report to JSON
 */
export const exportReportToJSON = (reportData: ReportData): string => {
  return JSON.stringify(reportData.data, null, 2);
};

/**
 * Download file
 */
export const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

