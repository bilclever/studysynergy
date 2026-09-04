import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { sessionAPI } from '../services/api';
import toast from 'react-hot-toast';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const normalizeQuestions = (raw) => {
  if (!raw) return [];

  let list = [];
  if (raw?.content?.questions) list = raw.content.questions;
  else if (raw?.questions)      list = raw.questions;
  else if (Array.isArray(raw?.content)) list = raw.content;
  else if (Array.isArray(raw))  list = raw;

  return list.map((q, i) => {
    const keys = ['answer_index', 'answerIndex', 'correct_answer', 'correctAnswer', 'correct'];
    let correctAnswer = 0;
    for (const k of keys) {
      if (q[k] !== undefined) { correctAnswer = parseInt(q[k]); break; }
    }
    if (isNaN(correctAnswer)) correctAnswer = 0;
    if (q.options && (correctAnswer < 0 || correctAnswer >= q.options.length)) correctAnswer = 0;

    return {
      id:            q.id ?? i,
      question:      q.question || q.text || `Question ${i + 1}`,
      options:       q.options || q.choices || q.answers || [],
      correctAnswer,
      explanation:   q.explanation || q.reason || '',
    };
  });
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export const useQuiz = (sessionId, externalData) => {
  const QUIZ_DURATION = 600; // seconds

  const [questions,       setQuestions]       = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer,  setSelectedAnswer]  = useState(null);
  const [answers,         setAnswers]         = useState([]);
  const [score,           setScore]           = useState(0);
  const [completed,       setCompleted]       = useState(false);
  const [timeRemaining,   setTimeRemaining]   = useState(QUIZ_DURATION);
  const [timerActive,     setTimerActive]     = useState(true);
  const [isGenerating,    setIsGenerating]    = useState(false);

  // ------ remote data ------
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
    mutationFn: () => sessionAPI.generateTool(sessionId, 'quiz'),
    onMutate:   () => setIsGenerating(true),
    onSuccess:  (data) => {
      const qs = normalizeQuestions(data);
      if (qs.length > 0) {
        setQuestions(qs);
        setAnswers(new Array(qs.length).fill(null));
        toast.success(`${qs.length} questions générées !`);
      } else {
        toast.error('Format de réponse non reconnu');
      }
      refetchArtifacts();
    },
    onError:   (err) => toast.error(`Erreur : ${err.message}`),
    onSettled: () => setIsGenerating(false),
  });

  // ------ load questions ------
  useEffect(() => {
    const src = externalData || artifactsData?.artifacts?.quiz;
    const qs  = normalizeQuestions(src);
    if (qs.length > 0) {
      setQuestions(qs);
      setAnswers(new Array(qs.length).fill(null));
    }
  }, [externalData, artifactsData]);

  // ------ timer ------
  const finish = useCallback(() => {
    setTimerActive(false);
    setCompleted(true);
    const correct = questions.reduce(
      (acc, q, i) => acc + (answers[i] === q.correctAnswer ? 1 : 0), 0
    );
    setScore(correct);
    const pct = Math.round((correct / questions.length) * 100);
    if (pct >= 80) toast.success(`Excellent ! ${pct}%`);
    else if (pct >= 60) toast.success(`Bien joué ! ${pct}%`);
    else toast.error(`Continuez à réviser ! ${pct}%`);
  }, [questions, answers]);

  useEffect(() => {
    if (!timerActive || completed || questions.length === 0) return;
    const id = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) { finish(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timerActive, completed, finish, questions.length]);

  // ------ actions ------
  const selectAnswer = (answerIndex) => {
    if (answers[currentQuestion] !== null || completed) return;
    setSelectedAnswer(answerIndex);
    const next = [...answers];
    next[currentQuestion] = answerIndex;
    setAnswers(next);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((q) => q + 1);
        setSelectedAnswer(next[currentQuestion + 1]);
      } else {
        finish();
      }
    }, 1400);
  };

  const goTo = (index) => {
    setCurrentQuestion(index);
    setSelectedAnswer(answers[index]);
  };

  const restart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers(new Array(questions.length).fill(null));
    setScore(0);
    setCompleted(false);
    setTimeRemaining(QUIZ_DURATION);
    setTimerActive(true);
  };

  const getQuestionStatus = (i) => {
    if (answers[i] === null) return 'unanswered';
    return answers[i] === questions[i]?.correctAnswer ? 'correct' : 'incorrect';
  };

  const currentScore = answers.reduce(
    (acc, a, i) => acc + (a === questions[i]?.correctAnswer ? 1 : 0), 0
  );

  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return {
    // state
    questions,
    currentQuestion,
    selectedAnswer,
    answers,
    score,
    completed,
    timeRemaining,
    currentScore,
    isLoading: isLoadingArtifacts || isGenerating,
    isGenerating,
    artifactsError,
    // derived
    currentQ: questions[currentQuestion],
    getQuestionStatus,
    formatTime,
    // actions
    selectAnswer,
    goTo,
    restart,
    generate: () => generateMutation.mutate(),
  };
};
