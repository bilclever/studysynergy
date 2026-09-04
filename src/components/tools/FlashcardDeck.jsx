import React from 'react';
import {
  ChevronLeft, ChevronRight, RotateCw, Shuffle,
  BookOpen, CheckCircle, XCircle, Download, Volume2,
  Wand2, AlertCircle, Zap, Loader2,
} from 'lucide-react';
import { useFlashcards } from '../../hooks/useFlashcards';
import toast from 'react-hot-toast';

// ---------------------------------------------------------------------------
// FlashcardDeck
// ---------------------------------------------------------------------------

const FlashcardDeck = ({ sessionId, flashcardsData }) => {
  const fc = useFlashcards(sessionId, flashcardsData);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify({
      session_id: sessionId,
      deck: fc.deck,
      stats: {
        known: Array.from(fc.known),
        difficulty: fc.difficulty,
        total: fc.deck.length,
        known_count: fc.knownCount,
      },
      exported_at: new Date().toISOString(),
    }, null, 2)], { type: 'application/json' });
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob),
      download: `flashcards-${sessionId}.json`,
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('Flashcards exportées !');
  };

  // --- loading ---
  if (fc.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-muted">
        <Loader2 className="h-6 w-6 animate-spin" />
        <p className="text-sm">{fc.isGenerating ? 'Génération des flashcards…' : 'Chargement…'}</p>
      </div>
    );
  }

  // --- error ---
  if (fc.artifactsError) {
    return (
      <div className="text-center py-16 px-4">
        <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-3" />
        <p className="text-sm text-muted mb-4">{fc.artifactsError.message}</p>
        <button onClick={fc.generate} className="btn-primary gap-2">
          <Wand2 className="h-4 w-4" />Générer des flashcards
        </button>
      </div>
    );
  }

  // --- empty ---
  if (fc.deck.length === 0) {
    return (
      <div className="text-center py-20 px-4">
        <BookOpen className="h-10 w-10 text-muted mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-semibold text-ink mb-2">Aucune flashcard disponible</h3>
        <p className="text-sm text-muted mb-6 max-w-sm mx-auto">
          {fc.hasQuizFallback
            ? 'Un quiz est disponible. Convertissez-le ou générez de nouvelles flashcards.'
            : 'Générez des flashcards pour commencer à réviser.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={fc.generate} disabled={fc.isGenerating} className="btn-primary gap-2">
            {fc.isGenerating
              ? <><Loader2 className="h-4 w-4 animate-spin" />Génération…</>
              : <><Wand2 className="h-4 w-4" />Générer des flashcards</>}
          </button>
          {fc.hasQuizFallback && (
            <button onClick={fc.convertQuiz} className="btn-secondary gap-2">
              <Zap className="h-4 w-4" />Convertir le quiz
            </button>
          )}
        </div>
      </div>
    );
  }

  // --- deck ---
  const card = fc.currentCardData;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-semibold text-muted uppercase tracking-wider">Flashcards</p>
          <p className="text-sm text-ink mt-0.5">
            {fc.deck.length} cartes · {fc.knownCount} connues · {fc.masteryPct}% maîtrisé
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={fc.filter}
            onChange={(e) => fc.setFilter(e.target.value)}
            className="h-8 px-2.5 text-xs bg-white border border-stone rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-ink/10 focus:border-ink transition-colors"
          >
            <option value="all">Toutes</option>
            <option value="known">Connues</option>
            <option value="difficult">Difficiles</option>
          </select>
          <button onClick={fc.shuffle}  className="p-1.5 text-muted hover:text-ink transition-colors" title="Mélanger">
            <Shuffle  className="h-4 w-4" />
          </button>
          <button onClick={fc.reset}    className="p-1.5 text-muted hover:text-ink transition-colors" title="Réinitialiser">
            <RotateCw className="h-4 w-4" />
          </button>
          <button onClick={handleExport} className="p-1.5 text-muted hover:text-ink transition-colors" title="Exporter">
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center justify-between text-xs text-muted mb-4">
        <span>Carte {fc.currentCard + 1} sur {fc.filteredDeck.length || fc.deck.length}</span>
        <span className="font-medium">{fc.isFlipped ? 'Verso' : 'Recto'}</span>
      </div>

      {/* Card */}
      <div
        className="card mb-5 cursor-pointer select-none min-h-[260px] flex flex-col items-center justify-center p-8 text-center transition-all hover:shadow-md"
        onClick={fc.flip}
      >
        {!fc.isFlipped ? (
          <div className="w-full">
            <span className="tag bg-faint text-muted mb-4 inline-block">Recto · cliquez pour retourner</span>
            <h3 className="text-xl font-semibold text-ink whitespace-pre-wrap">{card?.front}</h3>
            {card?.category && (
              <span className="tag bg-faint text-muted mt-4 inline-block">{card.category}</span>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); fc.speak(card?.front ?? ''); }}
              className="mt-4 p-1.5 text-muted hover:text-ink transition-colors"
            >
              <Volume2 className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="w-full">
            <span className="tag bg-faint text-muted mb-4 inline-block">Verso · cliquez pour retourner</span>
            <p className="text-base text-ink whitespace-pre-wrap">
              {typeof card?.back === 'string' ? card.back : JSON.stringify(card?.back, null, 2)}
            </p>
            {card?.explanation && (
              <p className="text-xs text-muted mt-4 border-t border-stone pt-3">{card.explanation}</p>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); fc.speak(typeof card?.back === 'string' ? card.back : ''); }}
              className="mt-4 p-1.5 text-muted hover:text-ink transition-colors"
            >
              <Volume2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button onClick={fc.previous} disabled={fc.currentCard === 0} className="btn-secondary gap-1.5 disabled:opacity-40">
            <ChevronLeft className="h-4 w-4" />Préc.
          </button>
          <button onClick={fc.next} disabled={fc.currentCard >= fc.deck.length - 1} className="btn-secondary gap-1.5 disabled:opacity-40">
            Suiv.<ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fc.toggleKnown(fc.currentCard)}
            className={`btn gap-1.5 text-sm border transition-colors ${
              fc.isKnown
                ? 'border-green-300 bg-green-50 text-green-700'
                : 'border-stone bg-white text-muted hover:text-ink'
            }`}
          >
            <CheckCircle className="h-4 w-4" />
            {fc.isKnown ? 'Connue' : 'Je connais'}
          </button>
          <button
            onClick={() => fc.toggleDifficulty(fc.currentCard, 'hard')}
            className={`p-2 rounded-lg border transition-colors ${
              fc.isDifficult
                ? 'border-red-300 bg-red-50 text-red-600'
                : 'border-stone text-muted hover:text-ink'
            }`}
            title="Difficile"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card p-4">
          <p className="text-xs text-muted mb-1">Maîtrisées</p>
          <p className="text-2xl font-bold text-ink">{fc.knownCount}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-muted mb-1">Difficiles</p>
          <p className="text-2xl font-bold text-ink">{fc.difficultCount}</p>
        </div>
      </div>

      {/* Regen */}
      <div className="mt-6 pt-5 border-t border-stone flex items-center justify-between">
        <p className="text-sm text-muted">Besoin d'autres flashcards ?</p>
        <button onClick={fc.generate} disabled={fc.isGenerating} className="btn-secondary gap-2 text-xs">
          {fc.isGenerating
            ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Génération…</>
            : <><Wand2 className="h-3.5 w-3.5" />Générer</>}
        </button>
      </div>
    </div>
  );
};

export default FlashcardDeck;
