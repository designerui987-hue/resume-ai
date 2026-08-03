export interface ATSScoreDetails {
  overallScore: number;
  contentScore: number;
  formattingScore: number;
  keywordsScore: number;
  readabilityScore: number;
  colorCategory: 'Green' | 'Yellow' | 'Red';
  colorHex: string;
  badgeBg: string;
  badgeText: string;
  borderClass: string;
  progressColor: string;
}

export function getATSScoreColor(score: number): {
  category: 'Green' | 'Yellow' | 'Red';
  hex: string;
  badgeBg: string;
  badgeText: string;
  borderClass: string;
  progressColor: string;
} {
  if (score >= 80) {
    return {
      category: 'Green',
      hex: '#15803D',
      badgeBg: 'bg-emerald-50',
      badgeText: 'text-emerald-700',
      borderClass: 'border-emerald-200',
      progressColor: 'stroke-emerald-600',
    };
  }
  if (score >= 60) {
    return {
      category: 'Yellow',
      hex: '#D97706',
      badgeBg: 'bg-amber-50',
      badgeText: 'text-amber-700',
      borderClass: 'border-amber-200',
      progressColor: 'stroke-amber-500',
    };
  }
  return {
    category: 'Red',
    hex: '#DC2626',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    borderClass: 'border-rose-200',
    progressColor: 'stroke-rose-600',
  };
}

export function calculateDynamicATSScore(resume: {
  title?: string;
  summary?: string | null;
  target_role?: string | null;
  skills?: any[];
  experiences?: any[];
  contact_email?: string | null;
  location?: string | null;
  completion_score?: number;
  atsScore?: number;
}): ATSScoreDetails {
  let content = 20;
  let formatting = 20;
  let keywords = 20;
  let readability = 20;

  if (resume.summary && resume.summary.length > 30) content += 5;
  if (resume.experiences && resume.experiences.length > 0) content += 5;
  if (resume.location) formatting += 3;
  if (resume.contact_email) formatting += 2;

  const skillsCount = Array.isArray(resume.skills) ? resume.skills.length : 0;
  if (skillsCount >= 5) keywords += 5;
  if (resume.title && resume.title.length > 5) readability += 5;

  const rawOverall = resume.atsScore ?? resume.completion_score ?? (content + formatting + keywords + readability);
  const overallScore = Math.min(100, Math.max(0, rawOverall));

  const colors = getATSScoreColor(overallScore);

  return {
    overallScore,
    contentScore: Math.min(100, content * 4),
    formattingScore: Math.min(100, formatting * 4),
    keywordsScore: Math.min(100, keywords * 4),
    readabilityScore: Math.min(100, readability * 4),
    colorCategory: colors.category,
    colorHex: colors.hex,
    badgeBg: colors.badgeBg,
    badgeText: colors.badgeText,
    borderClass: colors.borderClass,
    progressColor: colors.progressColor,
  };
}
