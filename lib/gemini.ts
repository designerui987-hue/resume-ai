import { GoogleGenAI } from '@google/genai';

// Server-side Gemini client initialization
const apiKey = process.env.GEMINI_API_KEY;

export const aiClient = new GoogleGenAI({
  apiKey: apiKey || 'demo-mode-key',
});

// Utility to generate a professional summary based on title & details
export async function generateSummaryWithGemini(title: string, currentSummary?: string): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    return `Results-driven ${title || 'Professional'} with strong experience delivering impactful projects, optimizing technical workflows, and driving team success. Proven track record of quick adaptation and high performance.`;
  }

  const prompt = `You are an expert executive resume writer. Write a compelling, concise, ATS-optimized 3-sentence professional summary for a candidate applying for the role of "${title}". ${
    currentSummary ? `Refine and improve this draft: "${currentSummary}"` : ''
  } Return ONLY the summary paragraph text with no introductory text or markdown formatting.`;

  const response = await aiClient.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text?.trim() || '';
}

// Utility to rewrite work experience bullet points into strong action statements
export async function rewriteExperienceWithGemini(position: string, company: string, description: string): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    return `• Spearheaded core initiatives for ${position || 'role'} at ${company || 'company'}, driving efficiency and project delivery.\n• Collaboration across cross-functional teams to streamline workflows and improve overall performance metrics.\n• Implemented industry best practices resulting in measurable improvements in team productivity.`;
  }

  const prompt = `You are a professional career coach. Rewrite the following work experience draft for a ${position} at ${company} into 3 impactful, bulleted action statements using strong action verbs and quantified achievements where applicable:\n"${description}"\nReturn ONLY the bullet points.`;

  const response = await aiClient.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text?.trim() || '';
}

// Utility to generate a tailored cover letter
export async function generateCoverLetterWithGemini(fullName: string, targetRole: string, companyName: string, skills: string[]): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    return `Dear Hiring Manager,\n\nI am writing to express my enthusiastic interest in the ${targetRole || 'open position'} role at ${companyName || 'your company'}.\n\nWith a strong background in ${skills.slice(0, 3).join(', ') || 'relevant fields'}, I bring a track record of delivering quality results and driving value. I look forward to discussing how my experience aligns with your goals.\n\nSincerely,\n${fullName || 'Applicant'}`;
  }

  const prompt = `Write a professional 3-paragraph cover letter from ${fullName || 'a job applicant'} applying for the role of ${targetRole} at ${companyName}. Key candidate skills include: ${skills.join(', ')}. Return ONLY the cover letter text.`;

  const response = await aiClient.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text?.trim() || '';
}
