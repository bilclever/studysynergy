import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { sessionAPI } from '../services/api';
import toast from 'react-hot-toast';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const fromArray = (arr) => {
  if (!Array.isArray(arr)) return [];
  return arr.map((item, i) => {
    if (item.front && item.back) {
      return { id: item.id ?? i, front: item.front, back: item.back,
               category: item.category, explanation: item.explanation,
               difficulty: item.difficulty };
    }
    if (item.question) {
      return { id: item.id ?? i, front: item.question,
               back: item.answer || `Option ${(item.answer_index ?? 0) + 1}`,
               category: 'Quiz converti', explanation: item.explanation, difficulty: 'medium' };
    }
    if (typeof item === 'object') {
      const [k, v] = Object.entries(item)[0] ?? ['', ''];
      return { id: i, front: String(k), back: String(v) };
    }
    return { id: i, front: `Point ${i + 1}`, back: String(item) };
  });
};

const extractDeck = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return fromArray(data);

  const walk = (obj) => {
    if (!obj || typeof obj !== 'object') return [];
    if (Array.isArray(obj)) return fromArray(obj);
    const cards = [];
    if (obj.flashcards && Array.isArray(obj.flashcards)) cards.push(...fromArray(obj.flashcards));
    if (obj.content?.flashcards)                         cards.push(...fromArray(obj.content.flashcards));
    if (obj.content && Array.isArray(obj.content))       cards.push(...fromArray(obj.content));
    return cards.length ? cards : fromArray(Object.values(obj).find(Array.isArray) ?? []);
  };

  return walk(data);
};

const fromQuiz = (quizData) => {
  let qs = quizData?.questions || quizData?.content?.questions
         || (Array.isArray(quizData) ? quizData : []);
  return qs.map((q, i) => ({
    id:          i,
    front:       q.question || `Question ${i + 1}`,
    back:        q.options?.[q.answer_index] || q.answer || q.explanation || 'Voir le cours',
    explanation: q.explanation,
    category:    'Quiz converti',
    difficulty:  'medium',
  }));
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export const useFlashcards = (sessionId, externalData) => {
  const [deck,        setDeck]        = useState([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped,   setIsFlipped]   = useState(false);
  const [known,       setKnown]       = useState(new Set());
  const [difficulty,  setDifficulty]  = useState({});
  const [filter,      setFilter]      = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizPrompted, setQuizPrompted] = useState(false);

  const {
    data: artifactsData,
    isLoading: isLoadingArtifacts,
    error: artifactsError,
    refetch: refetchArtifacts,
  } = useQuery({
    queryKey: ['artifacts', sessionId],
    queryFn:  () => sessionAPI.getArtifacts(sessionId),
  });

  const generateMutation = useMutation({
    mutationFn: () => sessionAPI.generateTool(sessionId, 'flashcards'),
    onMutate:   () => setIsGenerating(true),
    onSuccess:  (data) => {
      const cards = extractDeck(data);
      if (cards.length > 0) {
        setDeck(cards);
        setKnown(new Set());
        setDifficulty({});
        setCurrentCard(0);
        toast.success(`${cards.length} flashcards générées !`);
      } else {
        toast.error('Format non reconnu');
      }
      refetchArtifacts();
    },
    onError:   (err) => toast.error(`Erreur : ${err.message}`),
    onSettled: () => setIsGenerating(false),
  });

  // ------ load deck ------
  useEffect(() => {
    if (externalData) { setDeck(extractDeck(externalData)); return; }
    if (!artifactsData) return;

    const artifacts = artifactsData.artifacts || {};
    const cards = extractDeck(artifacts.flashcards);

    if (cards.length > 0) {
      setDeck(cards);
    } else if (artifacts.quiz && !quizPrompted) {
      setQuizPrompted(true);
      // handled in component via `hasQuizFallback`
    }
  }, [externalData, artifactsData, quizPrompted]);

  // ------ filtered view ------
  const filteredDeck = deck.filter((c) => {
    const id = c.id ?? deck.indexOf(c);
    if (filter === 'known')     return known.has(id);
    if (filter === 'difficult') return difficulty[id] === 'hard';
    return true;
  });

  // ------ actions ------
  const next     = () => { setCurrentCard((i) => Math.min(i + 1, deck.length - 1)); setIsFlipped(false); };
  const previous = () => { setCurrentCard((i) => Math.max(i - 1, 0));              setIsFlipped(false); };
  const flip     = () => setIsFlipped((f) => !f);

  const shuffle = () => {
    const d = [...deck].sort(() => Math.random() - 0.5);
    setDeck(d); setCurrentCard(0);
  };

  const reset = () => {
    setCurrentCard(0); setKnown(new Set()); setDifficulty({}); setIsFlipped(false);
  };

  const toggleKnown = (index) => {
    const id = deck[index]?.id ?? index;
    setKnown((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  const toggleDifficulty = (index, level) => {
    const id = deck[index]?.id ?? index;
    setDifficulty((prev) => {
      const d = { ...prev };
      d[id] === level ? delete d[id] : (d[id] = level);
      return d;
    });
  };

  const convertQuiz = () => {
    const quiz = artifactsData?.artifacts?.quiz;
    if (!quiz) { toast.error('Aucun quiz disponible'); return; }
    const cards = fromQuiz(quiz);
    if (cards.length === 0) { toast.error('Aucune question trouvée'); return; }
    setDeck(cards); setKnown(new Set()); setDifficulty({}); setCurrentCard(0);
    toast.success(`${cards.length} flashcards créées depuis le quiz !`);
  };

  const currentCardData = deck[currentCard];
  const currentCardId   = currentCardData?.id ?? currentCard;
  const isKnown         = known.has(currentCardId);
  const isDifficult     = difficulty[currentCardId] === 'hard';
  const masteryPct      = deck.length ? Math.round((known.size / deck.length) * 100) : 0;
  const difficultCount  = Object.values(difficulty).filter((d) => d === 'hard').length;

  const speak = (text) => {
    if (!('speechSynthesis' in window)) { toast.error('Synthèse vocale non supportée'); return; }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'fr-FR'; u.rate = 0.9;
    speechSynthesis.speak(u);
  };

  return {
    // state
    deck,
    filteredDeck,
    currentCard,
    isFlipped,
    known,
    difficulty,
    filter,
    isLoading: isLoadingArtifacts || isGenerating,
    isGenerating,
    artifactsError,
    hasQuizFallback: !!(artifactsData?.artifacts?.quiz) && deck.length === 0,
    // derived
    currentCardData,
    currentCardId,
    isKnown,
    isDifficult,
    masteryPct,
    difficultCount,
    knownCount: known.size,
    // actions
    next, previous, flip,
    shuffle, reset,
    toggleKnown, toggleDifficulty,
    setFilter: (f) => { setFilter(f); setCurrentCard(0); },
    generate:  () => generateMutation.mutate(),
    convertQuiz,
    speak,
  };
};
