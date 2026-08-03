import { NextRequest, NextResponse } from 'next/server';
import {
  generateSummaryWithGemini,
  rewriteExperienceWithGemini,
  generateCoverLetterWithGemini,
  enhanceSelectedTextWithGemini,
} from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, title, currentSummary, position, company, description, fullName, targetRole, companyName, skills } = body;

    if (action === 'generateSummary') {
      const result = await generateSummaryWithGemini(title, currentSummary);
      return NextResponse.json({ result });
    }

    if (action === 'rewriteExperience') {
      const result = await rewriteExperienceWithGemini(position, company, description);
      return NextResponse.json({ result });
    }

    if (action === 'generateCoverLetter') {
      const result = await generateCoverLetterWithGemini(fullName, targetRole, companyName, skills || []);
      return NextResponse.json({ result });
    }

    if (action === 'enhanceText') {
      const { text, enhancementType } = body;
      const result = await enhanceSelectedTextWithGemini(text, enhancementType);
      return NextResponse.json({ result });
    }

    return NextResponse.json({ error: 'Invalid AI action requested' }, { status: 400 });
  } catch (err: any) {
    console.error('API /api/ai Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to process AI request' },
      { status: 500 }
    );
  }
}
