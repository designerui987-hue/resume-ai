export interface ActivityLogEntry {
  id: string;
  type: 'created' | 'edited' | 'ats_scan' | 'downloaded' | 'duplicated' | 'deleted';
  title: string;
  timestamp: string; // ISO string
}

const STORAGE_KEY = 'resume_ai_activity_log';

export function getInitialActivities(): ActivityLogEntry[] {
  const now = Date.now();
  return [
    { id: 'act-1', type: 'edited', title: 'Senior Frontend Developer', timestamp: new Date(now - 3600000 * 2).toISOString() },
    { id: 'act-2', type: 'downloaded', title: 'Product Manager', timestamp: new Date(now - 86400000 * 2).toISOString() },
    { id: 'act-3', type: 'ats_scan', title: 'Full Stack Developer', timestamp: new Date(now - 86400000 * 4).toISOString() },
    { id: 'act-4', type: 'edited', title: 'UI/UX Designer', timestamp: new Date(now - 86400000 * 7).toISOString() },
  ];
}

export function getActivityLogs(): ActivityLogEntry[] {
  if (typeof window === 'undefined') return getInitialActivities();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialActivities();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return getInitialActivities();
  }
}

export function logActivity(type: ActivityLogEntry['type'], title: string): ActivityLogEntry[] {
  const current = getActivityLogs();
  const newEntry: ActivityLogEntry = {
    id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    type,
    title,
    timestamp: new Date().toISOString(),
  };
  const updated = [newEntry, ...current].slice(0, 20); // Keep latest 20
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('activity_logged'));
    } catch (err) {
      console.error('Failed to log activity:', err);
    }
  }
  return updated;
}
