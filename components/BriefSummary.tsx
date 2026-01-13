'use client';

import { motion } from 'framer-motion';
import { Question } from '@/lib/questionConfig';

interface BriefSummaryProps {
  answers: Record<string, any>;
  questions: Question[];
  onEdit: () => void;
}

export default function BriefSummary({ answers, questions, onEdit }: BriefSummaryProps) {
  const handleSendBrief = () => {
    console.log('Brief submitted:', answers);
    // Show toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed top-20 right-4 bg-creative-purple text-black px-6 py-4 rounded-lg shadow-lg z-50';
    toast.textContent = 'Brief sent successfully!';
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const getAnswerDisplay = (question: Question): string => {
    const answer = answers[question.id];
    if (!answer) return 'Not answered';

    switch (question.type) {
      case 'multi-select-tags':
        if (question.id === 'concept-keywords' && answer && typeof answer === 'object') {
          const selectedValues = Array.isArray(answer.selected) ? answer.selected : [];
          const otherValues = Array.isArray(answer.other)
            ? answer.other.filter((item: string) => item.trim())
            : [];
          const otherInput = typeof answer.otherInput === 'string' ? answer.otherInput.trim() : '';
          const combined = [...selectedValues, ...otherValues];
          if (otherInput) {
            combined.push(otherInput);
          }
          return combined.length > 0 ? combined.join(', ') : 'Not answered';
        }
        return Array.isArray(answer) && answer.length > 0
          ? answer.join(', ')
          : 'Not answered';

      case 'multi-select':
        return Array.isArray(answer) && answer.length > 0
          ? answer.join(', ')
          : 'Not answered';

      case 'visual-grid':
        return Array.isArray(answer) && answer.length > 0
          ? answer.join(', ')
          : 'Not answered';

      case 'single-select':
      case 'dropdown':
        if (question.id === 'budget-range') {
          const rangeValue = typeof answer === 'string' ? answer : answer?.value;
          if (rangeValue === 'Custom fixed budget') {
            return answer?.customBudget ? `Custom: ${answer.customBudget}` : 'Custom fixed budget';
          }
          return rangeValue || 'Not answered';
        }
        return answer || 'Not answered';

      case 'text-input':
      case 'date-input':
        return answer || 'Not answered';

      case 'file-upload':
        return Array.isArray(answer) && answer.length > 0
          ? answer.map((file: File) => file.name).join(', ')
          : 'Not answered';

      case 'file-or-links': {
        const filesValue = Array.isArray(answer?.files) ? answer.files : [];
        const linksValue = typeof answer?.links === 'string' ? answer.links.trim() : '';
        const fileNames = filesValue.length > 0
          ? filesValue.map((file: File) => file.name).join(', ')
          : '';
        const links = linksValue
          ? linksValue.split('\n').map((line: string) => line.trim()).filter(Boolean).join(', ')
          : '';
        if (!fileNames && !links) return 'Not answered';
        if (fileNames && links) return `${fileNames}; ${links}`;
        return fileNames || links || 'Not answered';
      }

      case 'secondary-functions':
        return Array.isArray(answer) && answer.length > 0
          ? answer.join(', ')
          : 'Not answered';

      case 'dimensions':
        return Array.isArray(answer) && answer.some((v) => v)
          ? `${answer[0] || '-'}m × ${answer[1] || '-'}m × ${answer[2] || '-'}m`
          : 'Not answered';

      case 'logistics':
        if (!answer || typeof answer !== 'object') return 'Not answered';
        const parts = [];
        if (answer.venueType) {
          parts.push(`Venue: ${answer.venueType}${answer.venueTypeOther ? ` (${answer.venueTypeOther})` : ''}`);
        }
        if (answer.duration) {
          parts.push(`Duration: ${answer.duration}${answer.durationOther ? ` (${answer.durationOther})` : ''}`);
        }
        if (answer.powerAccess) parts.push(`Power: ${answer.powerAccess}`);
        if (answer.floorLoading) {
          parts.push(`Floor: ${answer.floorLoading}${answer.floorLoadingOther ? ` (${answer.floorLoadingOther})` : ''}`);
        }
        return parts.length > 0 ? parts.join(', ') : 'Not answered';

      default:
        return String(answer);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto px-4"
    >
      {/* Print-only header */}
      <div className="hidden print:block mb-8 pb-6 border-b-2 border-gray-300">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#cea0ff' }}>
          Moonworks Creative
        </h1>
        <p className="text-gray-600">Project Brief</p>
      </div>

      <div className="mb-4 text-sm text-gray-400 uppercase tracking-wider">Review</div>
      <h2 className="text-4xl md:text-5xl font-bold mb-12 text-white">
        Review Your Brief
      </h2>

      <div className="bg-dark-grey rounded-lg border border-gray-700 p-8 space-y-8">
        {questions
          .filter((q) => q.type !== 'intro')
          .map((question) => (
            <div key={question.id} className="border-b border-gray-800 pb-6 last:border-0">
              <h3 className="text-xl font-semibold text-white mb-2">{question.title}</h3>
              <p className="text-gray-300 text-lg">{getAnswerDisplay(question)}</p>
            </div>
          ))}
      </div>

      <div className="flex items-center justify-center gap-4 mt-12 print:hidden">
        <button
          onClick={onEdit}
          className="px-6 py-3 bg-dark-grey border border-gray-700 rounded-lg text-white hover:border-creative-purple/50 transition-colors"
        >
          Edit Brief
        </button>
        <button
          onClick={handleSendBrief}
          className="px-8 py-3 bg-creative-purple text-black rounded-lg font-medium hover:bg-creative-purple/90 transition-colors"
        >
          Send Brief
        </button>
        <button
          onClick={handlePrintPDF}
          className="px-8 py-3 bg-dark-grey border border-gray-700 rounded-lg text-white hover:border-creative-purple/50 transition-colors"
        >
          Save as PDF
        </button>
      </div>

      {/* Print-only styling */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 2cm;
          }
          body {
            background: white;
            color: black;
          }
          .print\\:hidden {
            display: none !important;
          }
          .bg-dark-grey {
            background: #f5f5f5 !important;
            color: black !important;
          }
          .text-white {
            color: black !important;
          }
          .text-gray-300 {
            color: #333 !important;
          }
          .text-gray-400 {
            color: #666 !important;
          }
          .border-gray-700,
          .border-gray-800 {
            border-color: #ddd !important;
          }
          h2 {
            color: #cea0ff !important;
            margin-bottom: 1rem !important;
          }
          h3 {
            color: #000 !important;
          }
        }
      `}</style>
    </motion.div>
  );
}
