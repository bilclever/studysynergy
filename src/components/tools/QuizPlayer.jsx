import React from 'react';
import {
  CheckCircle, XCircle, HelpCircle, Trophy, RefreshCw,
  Clock, ChevronRight, ChevronLeft, Download, Wand2,
  AlertCircle, Loader2,
} from 'lucide-react';
import { useQuiz } from '../../hooks/useQuiz';
import toast from 'react-hot-toast';

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const OptionButton = ({ option, index, selectedAnswer, correctAnswer, onSelect }) => {
  const isSelected  = selectedAnswer === index;
  const isCorrect   = index === correctAnswer;
  const showResult  = selectedAnswer !== null;

  let cls = 'border-stone hover:border-ink';
  if (showResult && isCorrect)               cls = 'border-green-500 bg-green-50';
  else if (showResult && isSelected)         cls = 'border-red-400 bg-red-50';
  else if (isSelected)                       cls = 'border-ink bg-faint';

  let dotCls = 'border-muted text-muted';
  if (showResult && isCorrect)               dotCls = 'border-green-500 bg-green-500 text-white';
  else if (showResult && isSelected)         dotCls = 'border-red-400 bg-red-400 text-white';
  else if (isSelected)                       dotCls = 'border-ink bg-ink text-white';

  return (
    <button
      onClick={() => onSelect(index)}
      disabled={showResult}
      className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors disabled:cursor-not-allowed ${cls}`}
    >
      <span className="inline-flex items-center gap-3">
        <span className={`h-5 w-5 rounded-full border text-xs flex items-center justify-center shrink-0 font-medium ${dotCls}`}>
          {String.fromCharCode(65 + index)}
        </span>
        {option}
      </span>
    </button>
  );
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const QuizPlayer = ({ sessionId, quizData }) => {
  const quiz = useQuiz(sessionId, quizData);

  // --- export ---
  const handleDownload = () => {
    const blob = new Blob([JSON.stringify({
      session_id: sessionId,
      questions:  quiz.questions,
      user_answers: quiz.answers,
      score:      quiz.score,
      total:      quiz.questions.length,
      timestamp:  new Date().toISOString(),
    }, null, 2)], { type: 'application/json' });
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob),
      download: `quiz-${sessionId}.json`,
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('Quiz téléchargé !');
  };

  // --- loading ---
  if (quiz.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-muted">
        <Loader2 className="h-6 w-6 animate-spin" />
        <p className="text-sm">{quiz.isGenerating ? 'Génération du quiz…' : 'Chargement…'}</p>
      </div>
    );
  }

  // --- error ---
  if (quiz.artifactsError) {
    return (
      <div className="text-center py-16 px-4">
        <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-3" />
        <p className="text-sm text-muted mb-4">{quiz.artifactsError.message}</p>
        <button onClick={quiz.generate} className="btn-primary gap-2">
          <Wand2 className="h-4 w-4" />Générer un quiz
        </button>
      </div>
    );
  }

  // --- empty ---
  if (quiz.questions.length === 0) {
    return (
      <div className="text-center py-20 px-4">
        <HelpCircle className="h-10 w-10 text-muted mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-semibold text-ink mb-2">Aucun quiz disponible</h3>
        <p className="text-sm text-muted mb-6">Générez un quiz à partir de vos documents.</p>
        <button onClick={quiz.generate} disabled={quiz.isGenerating} className="btn-primary gap-2">
          {quiz.isGenerating
            ? <><Loader2 className="h-4 w-4 animate-spin" />Génération…</>
            : <><Wand2 className="h-4 w-4" />Générer un quiz</>}
        </button>
      </div>
    );
  }

  // --- results ---
  if (quiz.completed) {
    const pct = Math.round((quiz.score / quiz.questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Trophy className="h-10 w-10 text-amber-500 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-ink">Quiz terminé</h2>
          <p className="text-muted text-sm mt-1">
            {pct >= 80 ? 'Excellent travail !' : pct >= 60 ? 'Bien joué !' : 'Continuez à réviser.'}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Score',    value: `${quiz.score}/${quiz.questions.length}` },
            { label: 'Réussite', value: `${pct}%` },
            { label: 'Temps',    value: quiz.formatTime(600 - quiz.timeRemaining) },
          ].map((s) => (
            <div key={s.label} className="card p-4 text-center">
              <p className="text-2xl font-bold text-ink">{s.value}</p>
              <p className="text-xs text-muted mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Révision</p>
          <div className="space-y-2">
            {quiz.questions.map((q, i) => {
              const correct = quiz.getQuestionStatus(i) === 'correct';
              return (
                <div key={i} className={`card px-4 py-3 text-sm ${correct ? 'border-green-200' : 'border-red-200'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {correct
                      ? <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                      : <XCircle    className="h-4 w-4 text-red-400 shrink-0" />}
                    <p className="font-medium text-ink">{q.question}</p>
                  </div>
                  {!correct && q.explanation && (
                    <p className="text-xs text-muted ml-6">{q.explanation}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button onClick={quiz.restart} className="btn-primary gap-2">
            <RefreshCw className="h-4 w-4" />Recommencer
          </button>
          <button onClick={handleDownload} className="btn-secondary gap-2">
            <Download className="h-4 w-4" />Télécharger
          </button>
        </div>
      </div>
    );
  }

  // --- playing ---
  const q = quiz.currentQ;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs font-semibold text-muted uppercase tracking-wider">Quiz</p>
          <p className="text-sm text-ink font-medium mt-0.5">{quiz.questions.length} questions</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm font-mono">
            <Clock className="h-4 w-4 text-muted" />
            <span className={quiz.timeRemaining < 60 ? 'text-red-500 font-bold' : 'text-ink'}>
              {quiz.formatTime(quiz.timeRemaining)}
            </span>
          </div>
          <span className="text-sm font-medium text-ink">
            {quiz.currentScore}<span className="text-muted">/{quiz.questions.length}</span>
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="w-full bg-stone rounded-full h-1">
          <div
            className="bg-accent h-1 rounded-full transition-all duration-300"
            style={{ width: `${((quiz.currentQuestion + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted mt-1">
          <span>{quiz.currentQuestion + 1} / {quiz.questions.length}</span>
          <span>{Math.round(((quiz.currentQuestion + 1) / quiz.questions.length) * 100)}%</span>
        </div>
      </div>

      {/* Question dots */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {quiz.questions.map((_, i) => {
          const s = quiz.getQuestionStatus(i);
          return (
            <button
              key={i}
              onClick={() => quiz.goTo(i)}
              className={`h-6 w-6 rounded text-xs font-medium transition-colors ${
                i === quiz.currentQuestion ? 'bg-accent text-white'
                  : s === 'correct'   ? 'bg-green-100 text-green-700'
                  : s === 'incorrect' ? 'bg-red-100 text-red-600'
                  : 'bg-faint text-muted hover:bg-stone'
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* Question card */}
      <div className="card p-5 mb-5">
        <span className="tag bg-faint text-muted mb-3 inline-block">Question {quiz.currentQuestion + 1}</span>
        <h3 className="text-base font-semibold text-ink mb-4">{q?.question}</h3>
        <div className="space-y-2">
          {q?.options?.map((option, i) => (
            <OptionButton
              key={i}
              index={i}
              option={option}
              selectedAnswer={quiz.selectedAnswer}
              correctAnswer={q.correctAnswer}
              onSelect={quiz.selectAnswer}
            />
          ))}
        </div>
        {quiz.selectedAnswer !== null && q?.explanation && (
          <div className="mt-4 p-3 bg-faint rounded-lg border border-stone text-xs text-muted">
            <span className="font-medium text-ink">Explication : </span>{q.explanation}
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => quiz.goTo(quiz.currentQuestion - 1)}
          disabled={quiz.currentQuestion === 0}
          className="btn-secondary gap-1.5 disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />Précédent
        </button>
        <button
          onClick={() => quiz.goTo(quiz.currentQuestion + 1)}
          disabled={quiz.currentQuestion === quiz.questions.length - 1}
          className="btn-secondary gap-1.5 disabled:opacity-40"
        >
          Suivant<ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default QuizPlayer;
