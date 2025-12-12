/**
 * Data Migration Utilities
 * 
 * Utilities to help migrate from localStorage-based data to API-based data.
 * This allows for a smooth transition when backend is ready.
 */

/**
 * Migration status
 */
export interface MigrationStatus {
  completed: boolean;
  timestamp: string;
  version: string;
}

const MIGRATION_KEY = 'greenkiddo_migration_status';
const CURRENT_VERSION = '1.0.0';

/**
 * Check if migration has been completed
 */
export function isMigrationComplete(): boolean {
  if (typeof window === 'undefined') return false;
  
  const status = localStorage.getItem(MIGRATION_KEY);
  if (!status) return false;
  
  try {
    const parsed: MigrationStatus = JSON.parse(status);
    return parsed.completed && parsed.version === CURRENT_VERSION;
  } catch {
    return false;
  }
}

/**
 * Mark migration as complete
 */
export function markMigrationComplete(): void {
  if (typeof window === 'undefined') return;
  
  const status: MigrationStatus = {
    completed: true,
    timestamp: new Date().toISOString(),
    version: CURRENT_VERSION,
  };
  
  localStorage.setItem(MIGRATION_KEY, JSON.stringify(status));
}

/**
 * Export localStorage data for migration
 */
export function exportLocalStorageData(): Record<string, any> {
  if (typeof window === 'undefined') return {};
  
  const data: Record<string, any> = {};
  const prefix = 'greenkiddo_';
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix)) {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          data[key] = JSON.parse(value);
        }
      } catch {
        // Skip non-JSON values
      }
    }
  }
  
  return data;
}

/**
 * Import data into localStorage (for testing/rollback)
 */
export function importLocalStorageData(data: Record<string, any>): void {
  if (typeof window === 'undefined') return;
  
  Object.entries(data).forEach(([key, value]) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to import ${key}:`, error);
    }
  });
}

/**
 * Clear all migration-related data
 */
export function clearMigrationData(): void {
  if (typeof window === 'undefined') return;
  
  const prefix = 'greenkiddo_';
  const keysToRemove: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix)) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
}

/**
 * Migrate specific data type
 */
export async function migrateDataType<T>(
  type: string,
  exportFn: () => T[],
  importFn: (data: T[]) => Promise<void>
): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const data = exportFn();
    await importFn(data);
    return { success: true, count: data.length };
  } catch (error) {
    return {
      success: false,
      count: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Batch migrate multiple data types
 */
export async function batchMigrate(
  migrations: Array<{
    type: string;
    exportFn: () => any[];
    importFn: (data: any[]) => Promise<void>;
  }>
): Promise<Record<string, { success: boolean; count: number; error?: string }>> {
  const results: Record<string, { success: boolean; count: number; error?: string }> = {};
  
  for (const migration of migrations) {
    results[migration.type] = await migrateDataType(
      migration.type,
      migration.exportFn,
      migration.importFn
    );
  }
  
  return results;
}

