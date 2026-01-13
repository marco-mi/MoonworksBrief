'use client';

import { useState, useEffect, useCallback } from 'react';
import { questions, Question } from '@/lib/questionConfig';
import ProgressBar from './ProgressBar';
import QuestionCard from './QuestionCard';
import BriefSummary from './BriefSummary';
import { ChevronUp, ChevronDown } from 'lucide-react';

export default function BriefBuilder() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showSummary, setShowSummary] = useState(false);

  // Filter questions based on answers
  const visibleQuestions = questions.filter((q) => {
    if (q.id === 'secondary-functions') {
      return !!answers['primary-function'];
    }
    return true;
  });

  useEffect(() => {
    if (visibleQuestions.length > 0 && currentIndex >= visibleQuestions.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex, visibleQuestions.length]);

  if (visibleQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black py-20">
        <p className="text-white text-lg">No brief questions available.</p>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / visibleQuestions.length) * 100;

  const currentQuestion = visibleQuestions[currentIndex] || visibleQuestions[0];

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev < visibleQuestions.length - 1) {
        return prev + 1;
      }
      setShowSummary(true);
      return prev;
    });
  }, [visibleQuestions.length]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const handleSkip = useCallback(() => {
    handleNext();
  }, [handleNext]);

  const handleAnswerChange = useCallback((value: any) => {
    if (!currentQuestion) return;
    setAnswers((prev) => {
      const newAnswers = {
        ...prev,
        [currentQuestion.id]: value,
      };
      if (currentQuestion.id === 'budget-range') {
        const nextValue = typeof value === 'string' ? { value } : value;
        if (nextValue?.value !== 'Custom fixed budget') {
          newAnswers[currentQuestion.id] = { value: nextValue?.value || '' };
        } else {
          newAnswers[currentQuestion.id] = {
            value: nextValue?.value || 'Custom fixed budget',
            customBudget: nextValue?.customBudget || '',
          };
        }
        return newAnswers;
      }
      return newAnswers;
    });
  }, [currentQuestion]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter' && !showSummary) {
      const canGoNext = !currentQuestion.required || answers[currentQuestion.id];
      if (canGoNext) {
        handleNext();
      }
    }
  }, [showSummary, currentQuestion, answers, handleNext]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const canGoNext = !currentQuestion.required || !!answers[currentQuestion.id];
  const canGoPrevious = currentIndex > 0;

  if (showSummary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black pt-32 pb-20">
        <BriefSummary
          answers={answers}
          questions={questions}
          onEdit={() => setShowSummary(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black pt-32 pb-20 relative">
      <ProgressBar progress={progress} />

      <div className="w-full max-w-6xl mx-auto px-4">
        <QuestionCard
          key={currentIndex}
          question={currentQuestion}
          value={answers[currentQuestion.id]}
          onChange={handleAnswerChange}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSkip={handleSkip}
          canGoNext={canGoNext}
          canGoPrevious={canGoPrevious}
          allAnswers={answers}
        />
      </div>

      {/* Up/Down Arrow Navigation */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 print:hidden">
        <button
          onClick={handlePrevious}
          disabled={!canGoPrevious}
          className={`p-3 rounded-full border transition-all ${
            canGoPrevious
              ? 'border-gray-700 text-white hover:border-creative-purple hover:bg-creative-purple/10'
              : 'border-gray-800 text-gray-600 cursor-not-allowed'
          }`}
        >
          <ChevronUp size={24} />
        </button>
        <button
          onClick={handleNext}
          disabled={!canGoNext}
          className={`p-3 rounded-full border transition-all ${
            canGoNext
              ? 'border-gray-700 text-white hover:border-creative-purple hover:bg-creative-purple/10'
              : 'border-gray-800 text-gray-600 cursor-not-allowed'
          }`}
        >
          <ChevronDown size={24} />
        </button>
      </div>
    </div>
  );
}
