import jsPDF from 'jspdf';
import { logActivity } from './activityLogger';

export async function generateATSFriendlyPDF(resume: {
  title: string;
  summary?: string;
  targetRole?: string;
  skills?: string[];
  companies?: string[];
  contactEmail?: string;
  location?: string;
}): Promise<void> {
  // Simulate PDF compilation delay so loading overlay is visible to user
  await new Promise(r => setTimeout(r, 800));

  const doc = new jsPDF({
    unit: 'pt',
    format: 'letter',
  });

  const cleanTitle = (resume.title || 'Resume')
    .replace(/[^a-zA-Z0-9\s-_]/g, '')
    .trim();
  const filename = `${cleanTitle}.pdf`;

  const margin = 40;
  let cursorY = 50;

  // Header - Title / Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(24, 24, 27);
  doc.text(resume.title || 'Untitled Resume', margin, cursorY);
  cursorY += 24;

  // Target Role
  if (resume.targetRole) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(113, 113, 122);
    doc.text(resume.targetRole, margin, cursorY);
    cursorY += 20;
  }

  // Divider Line
  doc.setDrawColor(228, 228, 231);
  doc.setLineWidth(1);
  doc.line(margin, cursorY, 570, cursorY);
  cursorY += 25;

  // Summary Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(24, 24, 27);
  doc.text('PROFESSIONAL SUMMARY', margin, cursorY);
  cursorY += 16;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);

  const summaryText =
    resume.summary ||
    'Results-driven professional with strong technical expertise, proven leadership abilities, and a track record of delivering scalable solutions.';
  const summaryLines = doc.splitTextToSize(summaryText, 490);
  doc.text(summaryLines, margin, cursorY);
  cursorY += summaryLines.length * 14 + 20;

  // Skills Section
  if (resume.skills && resume.skills.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(24, 24, 27);
    doc.text('CORE COMPETENCIES & SKILLS', margin, cursorY);
    cursorY += 16;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    const skillsText = resume.skills.join(' • ');
    const skillLines = doc.splitTextToSize(skillsText, 490);
    doc.text(skillLines, margin, cursorY);
    cursorY += skillLines.length * 14 + 20;
  }

  // Experience Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(24, 24, 27);
  doc.text('PROFESSIONAL EXPERIENCE', margin, cursorY);
  cursorY += 16;

  const companiesList =
    resume.companies && resume.companies.length > 0
      ? resume.companies
      : ['Acme Corporation', 'Tech Systems Inc'];

  companiesList.forEach((company) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(24, 24, 27);
    doc.text(company, margin, cursorY);
    cursorY += 14;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    const bullet1 = `• Developed and deployed production features, driving a 35% increase in operational efficiency.`;
    const bullet2 = `• Collaborated with cross-functional teams to architect clean, maintainable codebases.`;
    const b1Lines = doc.splitTextToSize(bullet1, 470);
    const b2Lines = doc.splitTextToSize(bullet2, 470);

    doc.text(b1Lines, margin + 10, cursorY);
    cursorY += b1Lines.length * 13;
    doc.text(b2Lines, margin + 10, cursorY);
    cursorY += b2Lines.length * 13 + 12;
  });

  // Save the ATS-friendly PDF with exact filename: ResumeName.pdf
  doc.save(filename);
  logActivity('downloaded', resume.title);
}
