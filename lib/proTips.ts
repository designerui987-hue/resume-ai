import { ResumeItem } from '@/components/resumes/ResumeCard';

export function generatePersonalizedTips(resumes: ResumeItem[]): string[] {
  const todayStr = new Date().toISOString().slice(0, 10);
  const dayHash = todayStr.split('-').reduce((acc, part) => acc + parseInt(part, 10), 0);

  const tipsPool: string[] = [];

  if (!resumes || resumes.length === 0) {
    return [
      'Create your first resume with targeted job keywords',
      'Add measurable achievements (% metrics, revenue growth)',
      'Include a clear 3-sentence professional summary',
      'Ensure formatting is clean and ATS-friendly',
      'Tailor your target role title to match job postings',
    ];
  }

  // 1. Analyze ATS Scores
  const lowScoreResumes = resumes.filter(r => r.atsScore < 80);
  if (lowScoreResumes.length > 0) {
    const target = lowScoreResumes[dayHash % lowScoreResumes.length];
    tipsPool.push(`Boost ATS score on "${target.title}" by adding measurable impact metrics`);
  }

  // 2. Analyze Skills & Keywords
  const needsKeywords = resumes.filter(r => (r.skills?.length ?? 0) < 6);
  if (needsKeywords.length > 0) {
    const target = needsKeywords[(dayHash + 1) % needsKeywords.length];
    tipsPool.push(`Include 5+ core technical keywords in "${target.title}"`);
  } else {
    tipsPool.push(`Align skills in "${resumes[0].title}" directly with job description requirements`);
  }

  // 3. Analyze Drafts
  const drafts = resumes.filter(r => r.status === 'Draft');
  if (drafts.length > 0) {
    const target = drafts[(dayHash + 2) % drafts.length];
    tipsPool.push(`Complete summary and contact details for draft "${target.title}"`);
  } else {
    tipsPool.push(`Improve formatting & section spacing for optimal ATS parsing`);
  }

  // 4. High scoring / Best resume tip
  const best = [...resumes].sort((a, b) => b.atsScore - a.atsScore)[0];
  if (best) {
    tipsPool.push(`Tailor "${best.title}" (ATS ${best.atsScore}) for executive job matches`);
  }

  // 5. General structural & formatting tips
  const generalPool = [
    'Replace passive verbs with strong action verbs (Led, Engineered, Scaled)',
    'Add numerical outcomes (e.g. "reduced latency by 40%")',
    'Format dates consistently (e.g., MMM YYYY)',
    'Keep your target role title aligned with modern job postings',
    'Ensure email address uses a professional domain name',
  ];

  const rotatedGeneral = generalPool[(dayHash + 3) % generalPool.length];
  tipsPool.push(rotatedGeneral);

  return Array.from(new Set(tipsPool)).slice(0, 5);
}
