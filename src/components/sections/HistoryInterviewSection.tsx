import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Mic, MicOff, Sparkles, ChevronLeft, ChevronRight, 
  Plus, Printer, ArrowRight, CheckCircle2,
  Calendar, MapPin, Image, Shuffle, Edit3
} from 'lucide-react';
import type { HistoryInterviewData, HistoryInterviewEntry, HistoryCategory } from '../../types';
import { SectionHeader } from '../common/SectionHeader';
import { GuidanceTip } from '../common/GuidanceTip';
import { 
  CURATED_HISTORY_QUESTIONS, 
  HISTORY_CHAPTERS, 
  getChapterMeta,
  type HistoryQuestionDefinition 
} from '../../data/historyQuestions';

interface HistoryInterviewSectionProps {
  interviewData?: HistoryInterviewData;
  isNotApplicable?: boolean;
  onUpdate: (updated: HistoryInterviewData) => void;
  onToggleNA: (isNA: boolean) => void;
  onOpenPrintBook?: () => void;
}

// SpeechRecognition typing
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [index: number]: { transcript: string };
    };
  };
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionLike;
}

interface IWindow extends Window {
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
  SpeechRecognition?: SpeechRecognitionConstructor;
}

function pickRandomIndex(length: number): number {
  if (length <= 0) return 0;
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] % length;
  }
  return 0;
}

export const HistoryInterviewSection: React.FC<HistoryInterviewSectionProps> = ({
  interviewData = { entries: {}, customQuestions: [] },
  isNotApplicable = false,
  onUpdate,
  onToggleNA,
  onOpenPrintBook
}) => {
  const [viewMode, setViewMode] = useState<'book' | 'interview'>('book');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  
  // Custom Question Modal
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);
  const [newCustomCategory, setNewCustomCategory] = useState<HistoryCategory>('homes');
  const [newCustomPrompt, setNewCustomPrompt] = useState('');
  const [newCustomSubtitle, setNewCustomSubtitle] = useState('');

  // Voice dictation state
  const [isListening, setIsListening] = useState(false);
  const [speechSupported] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const win = window as unknown as IWindow;
    return Boolean(win.SpeechRecognition || win.webkitSpeechRecognition);
  });
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const appendAnswerRef = useRef<(text: string) => void>(() => {});

  // Initialize Speech Recognition once
  useEffect(() => {
    const win = window as unknown as IWindow;
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (SpeechRec) {
      const recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript;
          }
        }
        if (transcript) {
          appendAnswerRef.current(transcript.trim());
        }
      };

      recognition.onerror = (event: { error: string }) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.debug('Speech recognition cleanup error:', err);
        }
      }
    };
  }, []);

  // Combine curated questions with custom questions
  const allQuestions: HistoryQuestionDefinition[] = [
    ...CURATED_HISTORY_QUESTIONS,
    ...(interviewData.customQuestions || []).map(q => ({
      id: q.id,
      category: (q.category as HistoryCategory) || 'custom',
      chapterTitle: getChapterMeta(q.category).title,
      question: q.question,
      subtitle: 'Custom story prompt added by you.',
      hints: ['Share your personal story or reflections in your own words.'],
      placeholder: 'Write your story or memories here...'
    }))
  ];

  // Filtered question set based on active chapter
  const filteredQuestions = selectedCategory === 'all'
    ? allQuestions
    : allQuestions.filter(q => q.category === selectedCategory);

  // Current active question in interview mode
  const safeIndex = Math.min(Math.max(0, currentQuestionIndex), Math.max(0, filteredQuestions.length - 1));
  const activeQuestion = filteredQuestions[safeIndex] || allQuestions[0];
  const activeEntry: HistoryInterviewEntry = (interviewData.entries && interviewData.entries[activeQuestion.id]) || {
    id: activeQuestion.id,
    category: activeQuestion.category,
    question: activeQuestion.question,
    answer: ''
  };

  // Stats calculation
  const totalQuestionsCount = allQuestions.length;
  const answeredCount = Object.values(interviewData.entries || {}).filter(e => !!e.answer?.trim()).length;

  // Toggle Voice Dictation
  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.debug('Failed to stop speech recognition:', err);
      }
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
        setIsListening(false);
      }
    }
  };

  // Update entry handler
  const handleUpdateActiveEntry = (fields: Partial<HistoryInterviewEntry>) => {
    const currentEntries = { ...(interviewData.entries || {}) };
    currentEntries[activeQuestion.id] = {
      ...activeEntry,
      ...fields,
      id: activeQuestion.id,
      category: activeQuestion.category,
      question: activeQuestion.question,
      updatedAt: new Date().toISOString()
    };
    onUpdate({
      ...interviewData,
      entries: currentEntries
    });
  };

  // Helper to append transcribed text to answer
  const handleAppendAnswer = (newText: string) => {
    const existing = activeEntry.answer || '';
    const updatedAnswer = existing ? `${existing} ${newText}` : newText;
    handleUpdateActiveEntry({ answer: updatedAnswer });
  };

  useEffect(() => {
    appendAnswerRef.current = handleAppendAnswer;
  });

  // Jump to specific question in interview mode
  const jumpToQuestion = (questionId: string) => {
    const idx = filteredQuestions.findIndex(q => q.id === questionId);
    if (idx !== -1) {
      setCurrentQuestionIndex(idx);
    } else {
      // Switch category to all if not found in current filter
      setSelectedCategory('all');
      const allIdx = allQuestions.findIndex(q => q.id === questionId);
      setCurrentQuestionIndex(allIdx !== -1 ? allIdx : 0);
    }
    setViewMode('interview');
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Random Prompt jump ("Inspire Me")
  const jumpToRandomQuestion = () => {
    const unanswered = filteredQuestions.filter(q => !interviewData.entries?.[q.id]?.answer?.trim());
    const pool = unanswered.length > 0 ? unanswered : filteredQuestions;
    const randIdx = pickRandomIndex(pool.length);
    const randomItem = pool[randIdx];
    if (randomItem) {
      const newIdx = filteredQuestions.findIndex(q => q.id === randomItem.id);
      setCurrentQuestionIndex(newIdx !== -1 ? newIdx : 0);
    }
  };

  // Create custom question
  const handleSaveCustomQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomPrompt.trim()) return;

    const newCustomEntry: HistoryInterviewEntry = {
      id: `custom_${Date.now()}`,
      category: newCustomCategory,
      question: newCustomPrompt.trim(),
      answer: '',
      isCustom: true,
      updatedAt: new Date().toISOString()
    };

    const updatedCustoms = [...(interviewData.customQuestions || []), newCustomEntry];
    onUpdate({
      ...interviewData,
      customQuestions: updatedCustoms
    });

    setNewCustomPrompt('');
    setNewCustomSubtitle('');
    setShowAddCustomModal(false);
    
    // Jump directly to the new question
    setTimeout(() => {
      jumpToQuestion(newCustomEntry.id);
    }, 100);
  };

  return (
    <div className="section-content-container history-interview-section">
      <SectionHeader
        title="Life Story & Family History Book"
        description="Preserve the places you lived, travels, favorite meals, concerts, family lore, and timeless life lessons for future generations."
        isNotApplicable={isNotApplicable}
        isComplete={answeredCount > 0}
        onToggleNotApplicable={onToggleNA}
      />

      {/* Mode Switcher & Stats Bar */}
      <div className="history-mode-bar glass-panel">
        <div className="history-segmented-control" role="tablist" aria-label="History View Mode">
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'book'}
            className={`segmented-btn ${viewMode === 'book' ? 'active' : ''}`}
            onClick={() => setViewMode('book')}
          >
            <BookOpen size={16} />
            <span>History Book View</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'interview'}
            className={`segmented-btn ${viewMode === 'interview' ? 'active' : ''}`}
            onClick={() => setViewMode('interview')}
          >
            <Sparkles size={16} />
            <span>Interview Session</span>
          </button>
        </div>

        <div className="history-stats-pill">
          <span className="history-stats-count">
            <strong>{answeredCount}</strong> of {totalQuestionsCount} memories recorded
          </span>
          {onOpenPrintBook && (
            <button
              type="button"
              className="btn btn-secondary btn-sm print-book-shortcut"
              onClick={onOpenPrintBook}
              title="Print standalone Life Story Book"
            >
              <Printer size={13} />
              <span>Print Keepsake Book</span>
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          VIEW MODE 1: INTERVIEW PROMPTER
          ========================================================================= */}
      {viewMode === 'interview' && (
        <div className="interview-prompter-container">
          <div className="interview-card glass-panel">
            {/* Top Chapter Tag & Question Navigation */}
            <div className="interview-card-header">
              <div className="interview-chapter-badge">
                <span className="chapter-kicker">{getChapterMeta(activeQuestion.category).title}</span>
                <span className="question-counter">
                  Prompt {safeIndex + 1} of {filteredQuestions.length}
                </span>
              </div>

              <div className="interview-quick-actions">
                <button
                  type="button"
                  className="icon-action-btn"
                  onClick={jumpToRandomQuestion}
                  title="Inspire me with a random prompt"
                >
                  <Shuffle size={15} />
                  <span>Inspire Me</span>
                </button>
                <button
                  type="button"
                  className="icon-action-btn"
                  onClick={() => setShowAddCustomModal(true)}
                  title="Add a custom question"
                >
                  <Plus size={15} />
                  <span>Custom Prompt</span>
                </button>
              </div>
            </div>

            {/* Main Prompt Headline */}
            <div className="interview-prompt-body">
              <h2 className="interview-question-title">{activeQuestion.question}</h2>
              {activeQuestion.subtitle && (
                <p className="interview-question-subtitle">{activeQuestion.subtitle}</p>
              )}

              {/* Memory Joggers Inspiration Callout */}
              {activeQuestion.hints && activeQuestion.hints.length > 0 && (
                <div className="memory-jogger-box">
                  <div className="memory-jogger-header">
                    <Sparkles size={14} className="sparkle-icon" />
                    <span>Memory Joggers & Reflection Prompts</span>
                  </div>
                  <ul className="memory-jogger-list">
                    {activeQuestion.hints.map((hint, hIdx) => (
                      <li key={hIdx}>{hint}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Story Answer Input with Voice Dictation */}
              <div className="interview-input-wrapper">
                <div className="interview-input-header">
                  <label className="form-label" htmlFor="interview-story-textarea">
                    Your Story & Memories
                  </label>

                  {speechSupported && (
                    <button
                      type="button"
                      className={`voice-dictate-btn ${isListening ? 'listening' : ''}`}
                      onClick={toggleListening}
                      title={isListening ? 'Stop listening' : 'Speak your story (Voice Dictation)'}
                    >
                      {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                      <span>{isListening ? 'Listening (Click to Stop)...' : 'Dictate with Voice'}</span>
                      {isListening && <span className="voice-pulse-ring" />}
                    </button>
                  )}
                </div>

                <textarea
                  id="interview-story-textarea"
                  className="form-input interview-textarea"
                  rows={8}
                  placeholder={activeQuestion.placeholder}
                  value={activeEntry.answer || ''}
                  onChange={e => handleUpdateActiveEntry({ answer: e.target.value })}
                />
              </div>

              {/* Optional Archival Context (Era, Location, Photo Pointer) */}
              <div className="archival-metadata-grid">
                <div className="form-group">
                  <label className="form-label">
                    <Calendar size={13} /> Time Period / Era
                  </label>
                  <input
                    type="text"
                    className="form-input form-input-sm"
                    placeholder="e.g. 1994–2002, Early 80s"
                    value={activeEntry.eraOrYear || ''}
                    onChange={e => handleUpdateActiveEntry({ eraOrYear: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <MapPin size={13} /> Location / City
                  </label>
                  <input
                    type="text"
                    className="form-input form-input-sm"
                    placeholder="e.g. Dayton, OH / Camden, ME"
                    value={activeEntry.location || ''}
                    onChange={e => handleUpdateActiveEntry({ location: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Image size={13} /> Photos / Keepsake Note
                  </label>
                  <input
                    type="text"
                    className="form-input form-input-sm"
                    placeholder="e.g. Blue leather album on 2nd shelf"
                    value={activeEntry.photoNote || ''}
                    onChange={e => handleUpdateActiveEntry({ photoNote: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Stepper Navigation Footer */}
            <div className="interview-stepper-footer">
              <button
                type="button"
                className="btn btn-secondary"
                disabled={safeIndex === 0}
                onClick={() => {
                  if (safeIndex > 0) setCurrentQuestionIndex(safeIndex - 1);
                }}
              >
                <ChevronLeft size={16} /> Previous Prompt
              </button>

              <div className="stepper-center-actions">
                <button
                  type="button"
                  className="btn btn-subtle"
                  onClick={() => setViewMode('book')}
                >
                  <BookOpen size={14} /> Review in History Book
                </button>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  if (safeIndex < filteredQuestions.length - 1) {
                    setCurrentQuestionIndex(safeIndex + 1);
                  } else {
                    setViewMode('book');
                  }
                }}
              >
                <span>{safeIndex < filteredQuestions.length - 1 ? 'Next Prompt' : 'Finish & Review Book'}</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Question Category Chips for Quick Jumping */}
          <div className="interview-tray-card glass-panel">
            <span className="tray-label">Jump to Chapter:</span>
            <div className="category-chip-row">
              <button
                type="button"
                className={`category-filter-chip ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategory('all');
                  setCurrentQuestionIndex(0);
                }}
              >
                All Chapters ({totalQuestionsCount})
              </button>
              {HISTORY_CHAPTERS.map(ch => {
                const countInCh = allQuestions.filter(q => q.category === ch.category).length;
                if (countInCh === 0) return null;
                const answeredInCh = allQuestions.filter(q => q.category === ch.category && !!interviewData.entries?.[q.id]?.answer?.trim()).length;
                return (
                  <button
                    key={ch.category}
                    type="button"
                    className={`category-filter-chip ${selectedCategory === ch.category ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedCategory(ch.category);
                      setCurrentQuestionIndex(0);
                    }}
                  >
                    <span>{ch.title}</span>
                    <span className="chip-count">{answeredInCh}/{countInCh}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW MODE 2: HISTORY BOOK READER & MEMOIR VIEW
          ========================================================================= */}
      {viewMode === 'book' && (
        <div className="history-book-container">
          <GuidanceTip type="calm" title="The Kept Word">
            Every story, favorite recipe, and travel adventure recorded here builds an enduring family memoir. You can step through the conversational interview whenever inspiration strikes or add stories directly below.
          </GuidanceTip>

          {/* Chapter Filter Toolbar */}
          <div className="book-toolbar-panel glass-panel">
            <div className="chapter-filter-pills" role="tablist" aria-label="Filter Stories by Chapter">
              <button
                type="button"
                className={`chapter-pill ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                All Chapters ({answeredCount})
              </button>
              {HISTORY_CHAPTERS.map(ch => {
                const answeredInCh = allQuestions.filter(q => q.category === ch.category && !!interviewData.entries?.[q.id]?.answer?.trim()).length;
                if (answeredInCh === 0 && selectedCategory !== ch.category) return null;
                return (
                  <button
                    key={ch.category}
                    type="button"
                    className={`chapter-pill ${selectedCategory === ch.category ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(ch.category)}
                  >
                    <span>{ch.title}</span>
                    <span className="pill-badge">{answeredInCh}</span>
                  </button>
                );
              })}
            </div>

            <div className="book-toolbar-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setViewMode('interview');
                  // Find first unanswered question
                  const firstUnanswered = allQuestions.findIndex(q => !interviewData.entries?.[q.id]?.answer?.trim());
                  setCurrentQuestionIndex(firstUnanswered !== -1 ? firstUnanswered : 0);
                }}
              >
                <Sparkles size={15} />
                <span>{answeredCount === 0 ? 'Start Interview Session' : 'Continue Interviewing'}</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowAddCustomModal(true)}
              >
                <Plus size={15} />
                <span>Add Custom Memory</span>
              </button>
            </div>
          </div>

          {/* Rendered Memoir Chapters */}
          <div className="memoir-chapters-flow">
            {HISTORY_CHAPTERS.map(ch => {
              if (selectedCategory !== 'all' && selectedCategory !== ch.category) return null;

              const chapterQuestions = allQuestions.filter(q => q.category === ch.category);
              const answeredStories = chapterQuestions.filter(q => !!interviewData.entries?.[q.id]?.answer?.trim());
              const unansweredQuestions = chapterQuestions.filter(q => !interviewData.entries?.[q.id]?.answer?.trim());

              if (answeredStories.length === 0 && selectedCategory !== ch.category && selectedCategory !== 'all') {
                return null;
              }

              return (
                <article key={ch.category} className="memoir-chapter-block glass-panel">
                  <header className="chapter-block-header">
                    <div className="chapter-title-group">
                      <span className="chapter-numeral">Chapter</span>
                      <h3 className="chapter-main-title">{ch.title}</h3>
                      <p className="chapter-subtitle">{ch.subtitle}</p>
                    </div>

                    <span className="chapter-recorded-badge">
                      {answeredStories.length} of {chapterQuestions.length} documented
                    </span>
                  </header>

                  {/* Stories List */}
                  {answeredStories.length > 0 ? (
                    <div className="chapter-stories-list">
                      {answeredStories.map(q => {
                        const entry = interviewData.entries[q.id];
                        return (
                          <div key={q.id} className="memoir-story-card">
                            <div className="story-card-header">
                              <h4 className="story-question-heading">{q.question}</h4>
                              <button
                                type="button"
                                className="story-edit-btn"
                                onClick={() => jumpToQuestion(q.id)}
                                title="Edit this memory in the interview prompter"
                              >
                                <Edit3 size={14} />
                                <span>Edit Story</span>
                              </button>
                            </div>

                            {/* Tags: Era & Location */}
                            {(entry.eraOrYear || entry.location) && (
                              <div className="story-meta-pills">
                                {entry.eraOrYear && (
                                  <span className="meta-pill">
                                    <Calendar size={12} /> {entry.eraOrYear}
                                  </span>
                                )}
                                {entry.location && (
                                  <span className="meta-pill">
                                    <MapPin size={12} /> {entry.location}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Story Prose */}
                            <div className="story-prose-body">
                              {entry.answer.split('\n\n').map((para, pIdx) => (
                                <p key={pIdx}>{para}</p>
                              ))}
                            </div>

                            {/* Photo / Keepsake reference note */}
                            {entry.photoNote && (
                              <div className="story-photo-reference">
                                <Image size={13} />
                                <span><strong>Photos / Keepsakes:</strong> {entry.photoNote}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="chapter-empty-state">
                      <p className="empty-state-text">No stories recorded for this chapter yet.</p>
                      {unansweredQuestions[0] && (
                        <button
                          type="button"
                          className="btn btn-subtle btn-sm"
                          onClick={() => jumpToQuestion(unansweredQuestions[0].id)}
                        >
                          <span>Prompt: "{unansweredQuestions[0].question.slice(0, 60)}..."</span>
                          <ArrowRight size={13} />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Add more stories to this chapter */}
                  {unansweredQuestions.length > 0 && answeredStories.length > 0 && (
                    <div className="chapter-footer-prompts">
                      <span className="next-prompt-kicker">Next suggested prompt in this chapter:</span>
                      <button
                        type="button"
                        className="inline-prompt-jump-btn"
                        onClick={() => jumpToQuestion(unansweredQuestions[0].id)}
                      >
                        <CheckCircle2 size={13} />
                        <span>{unansweredQuestions[0].question}</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD CUSTOM INTERVIEW QUESTION
          ========================================================================= */}
      {showAddCustomModal && (
        <div 
          className="modal-backdrop"
          onClick={e => e.target === e.currentTarget && setShowAddCustomModal(false)}
          role="presentation"
        >
          <div 
            className="modal-container glass-panel" 
            role="dialog" 
            aria-modal="true"
            aria-labelledby="custom-prompt-title"
          >
            <div className="modal-header">
              <div className="modal-title-row">
                <Sparkles className="modal-icon" size={20} />
                <h3 id="custom-prompt-title">Add Custom Interview Prompt</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowAddCustomModal(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCustomQuestion}>
              <div className="modal-body">
                <p className="modal-subtitle">
                  Create a tailored question to document unique family lore, childhood memories, special hobbies, or personal milestones.
                </p>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Chapter / Category</label>
                  <select
                    className="form-input"
                    value={newCustomCategory}
                    onChange={e => setNewCustomCategory(e.target.value as HistoryCategory)}
                  >
                    {HISTORY_CHAPTERS.filter(c => c.category !== 'custom').map(c => (
                      <option key={c.category} value={c.category}>
                        {c.title}
                      </option>
                    ))}
                    <option value="custom">Personal Memories & Stories</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Your Interview Question / Prompt</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    placeholder="e.g. What was our first sailboat trip like to Catalina Island?"
                    value={newCustomPrompt}
                    onChange={e => setNewCustomPrompt(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Context / Subtitle (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. The weather, who came along, and the dolphins we saw."
                    value={newCustomSubtitle}
                    onChange={e => setNewCustomSubtitle(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddCustomModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!newCustomPrompt.trim()}
                >
                  <Plus size={15} /> Add Prompt & Answer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
