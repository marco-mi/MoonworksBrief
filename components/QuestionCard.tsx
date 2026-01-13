'use client';
import { ChevronLeft, ChevronRight, ChevronDown as ChevronDownIcon } from 'lucide-react';
import { Question } from '@/lib/questionConfig';

interface QuestionCardProps {
  question: Question;
  value: any;
  onChange: (value: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  allAnswers?: Record<string, any>;
}

export default function QuestionCard({
  question,
  value,
  onChange,
  onNext,
  onPrevious,
  onSkip,
  canGoNext,
  canGoPrevious,
  allAnswers = {},
}: QuestionCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canGoNext) {
      onNext();
    }
  };

  const renderInput = () => {
    switch (question.type) {
      case 'multi-select-tags':
        return (
          <div className="flex flex-wrap gap-3 mt-8">
            {question.options?.map((option) => {
              const isSelected = Array.isArray(value) && value.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    const current = Array.isArray(value) ? value : [];
                    if (isSelected) {
                      onChange(current.filter((v) => v !== option));
                    } else {
                      onChange([...current, option]);
                    }
                  }}
                  className={`px-6 py-3 rounded-full text-lg font-medium transition-all duration-200 ${
                    isSelected
                      ? 'bg-creative-purple text-black'
                      : 'bg-dark-grey text-white border border-gray-700 hover:border-creative-purple/50'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        );

      case 'visual-grid':
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {question.gridOptions?.map((option) => {
              const isSelected = Array.isArray(value) && value.includes(option.label);
              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => {
                    const current = Array.isArray(value) ? value : [];
                    if (isSelected) {
                      onChange(current.filter((v) => v !== option.label));
                    } else {
                      onChange([...current, option.label]);
                    }
                  }}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-creative-purple ring-2 ring-creative-purple/50'
                      : 'border-gray-700 hover:border-creative-purple/50'
                  }`}
                  style={{ background: option.gradient }}
                >
                  <div className="absolute inset-0 bg-black/20 flex items-end justify-center pb-4">
                    <span className="text-white font-medium text-sm">{option.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        );

      case 'multi-select':
        return (
          <div className="space-y-3 mt-8">
            {question.options?.map((option) => {
              const current = Array.isArray(value) ? value : [];
              const hasOther = option === 'Other';
              const otherEntry = current.find((item) => String(item).startsWith('Other'));
              const isOtherSelected = !!otherEntry;
              const isSelected = hasOther ? isOtherSelected : current.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    if (hasOther) {
                      if (isOtherSelected) {
                        onChange(current.filter((v) => !String(v).startsWith('Other')));
                      } else {
                        onChange([...current, 'Other']);
                      }
                      return;
                    }
                    if (isSelected) {
                      onChange(current.filter((v) => v !== option));
                    } else {
                      onChange([...current, option]);
                    }
                  }}
                  className={`w-full text-left px-6 py-4 rounded-lg text-lg transition-all duration-200 ${
                    isSelected
                      ? 'bg-creative-purple text-black'
                      : 'bg-dark-grey text-white border border-gray-700 hover:border-creative-purple/50'
                  }`}
                >
                  {option}
                </button>
              );
            })}
            {question.options?.includes('Other') &&
              Array.isArray(value) &&
              value.some((item) => String(item).startsWith('Other')) && (
              <input
                type="text"
                placeholder={
                  question.id === 'required-assets'
                    ? 'What assets do you need?'
                    : question.id === 'signage-needs'
                      ? 'What kind of signage is needed?'
                      : 'Other (specify)'
                }
                value={
                  value
                    .find((item) => String(item).startsWith('Other'))
                    ?.replace(/^Other(?:\s*:)?\s?/, '') || ''
                }
                onChange={(e) => {
                  const current = Array.isArray(value) ? value : [];
                  const trimmed = e.target.value.trim();
                  const nextOther = trimmed ? `Other: ${e.target.value}` : 'Other';
                  const withoutOther = current.filter((item) => !String(item).startsWith('Other'));
                  onChange([...withoutOther, nextOther]);
                }}
                className="w-full px-4 py-3 bg-dark-grey border border-gray-700 rounded-lg text-white text-lg focus:outline-none focus:border-creative-purple transition-colors"
              />
            )}
          </div>
        );

      case 'single-select':
        return (
          <div className="space-y-3 mt-8">
            {question.options?.map((option) => {
              const isOtherOption = option === 'Other';
              const isOtherSelected = typeof value === 'string' && value.startsWith('Other');
              const isSelected = isOtherOption ? isOtherSelected : value === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onChange(option)}
                  className={`w-full text-left px-6 py-4 rounded-lg text-lg transition-all duration-200 ${
                    isSelected
                      ? 'bg-creative-purple text-black'
                      : 'bg-dark-grey text-white border border-gray-700 hover:border-creative-purple/50'
                  }`}
                >
                  {option}
                </button>
              );
            })}
            {question.options?.includes('Other') &&
              question.id === 'primary-function' &&
              typeof value === 'string' &&
              value.startsWith('Other') && (
              <input
                type="text"
                placeholder="What is the primary function?"
                value={value.replace(/^Other:\s?/, '').replace(/^Other$/, '')}
                onChange={(e) => {
                  const trimmed = e.target.value.trim();
                  onChange(trimmed ? `Other: ${e.target.value}` : 'Other');
                }}
                className="w-full px-4 py-3 bg-dark-grey border border-gray-700 rounded-lg text-white text-lg focus:outline-none focus:border-creative-purple transition-colors"
              />
            )}
          </div>
        );

      case 'secondary-functions':
        return (
          <div className="space-y-3 mt-8">
            {question.options?.map((option) => {
              const isSelected = Array.isArray(value) && value.includes(option);
              const hasOther = option === 'Other';
              const current = Array.isArray(value) ? value : [];
              const otherEntry = current.find((item) => String(item).startsWith('Other'));
              const isOtherSelected = !!otherEntry;
              const isSelectedEffective = hasOther ? isOtherSelected : isSelected;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    if (hasOther) {
                      if (isOtherSelected) {
                        onChange(current.filter((v) => !String(v).startsWith('Other')));
                      } else {
                        onChange([...current, 'Other']);
                      }
                      return;
                    }
                    if (isSelectedEffective) {
                      onChange(current.filter((v) => v !== option));
                    } else {
                      onChange([...current, option]);
                    }
                  }}
                  className={`w-full text-left px-6 py-4 rounded-lg text-lg transition-all duration-200 ${
                    isSelectedEffective
                      ? 'bg-creative-purple text-black'
                      : 'bg-dark-grey text-white border border-gray-700 hover:border-creative-purple/50'
                  }`}
                >
                  {option}
                </button>
              );
            })}
            {question.options?.includes('Other') &&
              Array.isArray(value) &&
              value.some((item) => String(item).startsWith('Other')) && (
              <input
                type="text"
                placeholder="What other functions are needed?"
                value={
                  value
                    .find((item) => String(item).startsWith('Other'))
                    ?.replace(/^Other:\s?/, '') || ''
                }
                onChange={(e) => {
                  const current = Array.isArray(value) ? value : [];
                  const trimmed = e.target.value.trim();
                  const nextOther = trimmed ? `Other: ${e.target.value}` : 'Other';
                  const withoutOther = current.filter((item) => !String(item).startsWith('Other'));
                  onChange([...withoutOther, nextOther]);
                }}
                className="w-full px-4 py-3 bg-dark-grey border border-gray-700 rounded-lg text-white text-lg focus:outline-none focus:border-creative-purple transition-colors"
              />
            )}
          </div>
        );

      case 'dimensions':
        return (
          <div className="grid grid-cols-3 gap-4 mt-8">
            {question.inputs?.map((input, index) => (
              <div key={index}>
                <label className="block text-sm text-gray-400 mb-2">{input.label}</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder={input.placeholder}
                  value={Array.isArray(value) ? value[index] || '' : ''}
                  onChange={(e) => {
                    const newValue = Array.isArray(value) ? [...value] : ['', '', ''];
                    newValue[index] = e.target.value;
                    onChange(newValue);
                  }}
                  onKeyDown={handleKeyDown}
                  className="w-full px-4 py-3 bg-dark-grey border border-gray-700 rounded-lg text-white text-lg focus:outline-none focus:border-creative-purple transition-colors"
                />
              </div>
            ))}
          </div>
        );

      case 'logistics':
        return (
          <div className="space-y-6 mt-8">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Venue Type</label>
              <div className="grid grid-cols-3 gap-3 mb-3">
                {['Indoor', 'Outdoor', 'Semi'].map((option) => {
                  const venueValue = value?.venueType;
                  const isSelected = venueValue === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => onChange({ ...value, venueType: option, venueTypeOther: '' })}
                      className={`px-4 py-3 rounded-lg text-lg transition-all duration-200 ${
                        isSelected
                          ? 'bg-creative-purple text-black'
                          : 'bg-dark-grey text-white border border-gray-700 hover:border-creative-purple/50'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              <input
                type="text"
                placeholder="Other (specify)"
                value={value?.venueTypeOther || ''}
                onChange={(e) => onChange({ ...value, venueTypeOther: e.target.value, venueType: 'Other' })}
                className="w-full px-4 py-3 bg-dark-grey border border-gray-700 rounded-lg text-white text-lg focus:outline-none focus:border-creative-purple transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Duration</label>
              <div className="grid grid-cols-3 gap-3 mb-3">
                {['1-day', '1-week', 'Permanent'].map((option) => {
                  const durationValue = value?.duration;
                  const isSelected = durationValue === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => onChange({ ...value, duration: option, durationOther: '' })}
                      className={`px-4 py-3 rounded-lg text-lg transition-all duration-200 ${
                        isSelected
                          ? 'bg-creative-purple text-black'
                          : 'bg-dark-grey text-white border border-gray-700 hover:border-creative-purple/50'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              <input
                type="text"
                placeholder="Other (specify)"
                value={value?.durationOther || ''}
                onChange={(e) => onChange({ ...value, durationOther: e.target.value, duration: 'Other' })}
                className="w-full px-4 py-3 bg-dark-grey border border-gray-700 rounded-lg text-white text-lg focus:outline-none focus:border-creative-purple transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Power Access</label>
              <div className="grid grid-cols-3 gap-3">
                {['Yes', 'No', 'Generator needed'].map((option) => {
                  const powerValue = value?.powerAccess;
                  const isSelected = powerValue === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => onChange({ ...value, powerAccess: option })}
                      className={`px-4 py-3 rounded-lg text-lg transition-all duration-200 ${
                        isSelected
                          ? 'bg-creative-purple text-black'
                          : 'bg-dark-grey text-white border border-gray-700 hover:border-creative-purple/50'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Floor Loading</label>
              <div className="grid grid-cols-3 gap-3 mb-3">
                {['Standard', 'Reinforced', 'Weight Restricted'].map((option) => {
                  const floorValue = value?.floorLoading;
                  const isSelected = floorValue === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => onChange({ ...value, floorLoading: option, floorLoadingOther: '' })}
                      className={`px-4 py-3 rounded-lg text-lg transition-all duration-200 ${
                        isSelected
                          ? 'bg-creative-purple text-black'
                          : 'bg-dark-grey text-white border border-gray-700 hover:border-creative-purple/50'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              <input
                type="text"
                placeholder="Other (specify)"
                value={value?.floorLoadingOther || ''}
                onChange={(e) => onChange({ ...value, floorLoadingOther: e.target.value, floorLoading: 'Other' })}
                className="w-full px-4 py-3 bg-dark-grey border border-gray-700 rounded-lg text-white text-lg focus:outline-none focus:border-creative-purple transition-colors"
              />
            </div>
          </div>
        );

      case 'dropdown':
        return (
          <div className="mt-8 relative">
            <select
              value={
                question.id === 'budget-range'
                  ? typeof value === 'string'
                    ? value
                    : value?.value || ''
                  : value || ''
              }
              onChange={(e) => {
                const nextValue = e.target.value;
                if (question.id === 'budget-range') {
                  onChange({
                    value: nextValue,
                    customBudget:
                      nextValue === 'Custom fixed budget'
                        ? typeof value === 'string'
                          ? ''
                          : value?.customBudget || ''
                        : '',
                  });
                } else {
                  onChange(nextValue);
                }
              }}
              onKeyDown={handleKeyDown}
              className="w-full px-6 py-4 bg-dark-grey border border-gray-700 rounded-lg text-white text-lg focus:outline-none focus:border-creative-purple transition-colors appearance-none cursor-pointer pr-12"
            >
              <option value="">Select an option</option>
              {question.options?.map((option) => (
                <option key={option} value={option} className="bg-dark-grey">
                  {option}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" size={20} />
            {question.id === 'budget-range' &&
              (typeof value === 'string' ? value === 'Custom fixed budget' : value?.value === 'Custom fixed budget') && (
              <div className="relative mt-4">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">$</span>
                <input
                  type="text"
                  placeholder="Enter your budget amount..."
                  value={typeof value === 'string' ? '' : value?.customBudget || ''}
                  onChange={(e) =>
                    onChange({
                      value: 'Custom fixed budget',
                      customBudget: e.target.value,
                    })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-dark-grey border border-gray-700 rounded-lg text-white text-lg focus:outline-none focus:border-creative-purple transition-colors"
                />
              </div>
            )}
          </div>
        );

      case 'text-input':
        return question.multiline ? (
          <div className="mt-8">
            <textarea
              placeholder={question.placeholder}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 bg-dark-grey border border-gray-700 rounded-lg text-white text-lg focus:outline-none focus:border-creative-purple transition-colors resize-none"
            />
          </div>
        ) : (
          <div className="mt-8">
            <input
              type="text"
              placeholder={question.placeholder}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-3 bg-dark-grey border border-gray-700 rounded-lg text-white text-lg focus:outline-none focus:border-creative-purple transition-colors"
            />
          </div>
        );

      case 'date-input':
        return (
          <div className="mt-8">
            <input
              type="date"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-3 bg-dark-grey border border-gray-700 rounded-lg text-white text-lg focus:outline-none focus:border-creative-purple transition-colors date-input-white"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-dark-grey/70 border border-gray-800 rounded-2xl p-8 md:p-10 shadow-2xl shadow-black/40">
        <div className="mb-4 text-sm text-gray-400 uppercase tracking-wider">
          {question.section}
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
          {question.title}
        </h2>
        {question.subtitle && (
          <p className="text-lg text-gray-400 mb-12">{question.subtitle}</p>
        )}
        {!question.subtitle && <div className="mb-12" />}

        {renderInput()}

        <div className="flex items-center justify-between mt-12">
          <div className="flex items-center gap-4">
            {canGoPrevious && (
              <button
                onClick={onPrevious}
                className="flex items-center gap-2 px-6 py-3 bg-dark-grey border border-gray-700 rounded-lg text-white hover:border-creative-purple/50 transition-colors"
              >
                <ChevronLeft size={20} />
                Previous
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            {!question.required && (
              <button
                onClick={onSkip}
                className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
              >
                Skip
              </button>
            )}
            {canGoNext && (
              <button
                onClick={onNext}
                className="flex items-center gap-2 px-8 py-3 bg-creative-purple text-black rounded-lg font-medium hover:bg-creative-purple/90 transition-colors"
              >
                Next
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
