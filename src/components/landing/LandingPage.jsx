import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, Zap, Brain, BookOpen, ChevronRight, CheckCircle } from 'lucide-react';
import Logo from '../Logo';

const LandingPage = () => {
  const navigate = useNavigate();
  const token    = localStorage.getItem('access_token');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleStart = () => navigate(token ? '/dashboard' : '/login');

  return (
    <div className="min-h-screen bg-white text-ink">

      {/* ── NAV ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled ? 'bg-white/95 backdrop-blur-md border-b border-stone' : 'bg-transparent'
      }`}>
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="font-semibold text-sm">StudySynergy</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#features" className="hidden md:block text-sm text-muted hover:text-ink transition-colors">
              Fonctionnalités
            </a>
            <a href="#how" className="hidden md:block text-sm text-muted hover:text-ink transition-colors">
              Comment ça marche
            </a>
            <button onClick={handleStart} className="btn-primary text-sm">
              {token ? 'Dashboard' : 'Commencer'}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-100 text-xs text-accent font-medium mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Propulsé par Gemini 1.5 Pro
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-ink leading-[1.08] tracking-[-0.025em] mb-5">
            Transformez vos cours<br />
            en outils de révision.
          </h1>

          <p className="text-base md:text-lg text-muted max-w-lg mx-auto mb-10 leading-relaxed">
            Importez n'importe quel fichier, PDF, audio ou vidéo,
            et obtenez <span className="text-ink font-medium">résumé, quiz et flashcards</span> en quelques secondes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <button onClick={handleStart} className="btn-primary px-7 py-2.5 text-sm font-semibold">
              {token ? 'Accéder à mon dashboard' : 'Créer mon compte gratuitement'}
              <ArrowRight className="h-4 w-4" />
            </button>
            <a href="#how" className="btn-ghost text-sm px-5 py-2.5">
              Voir comment ça marche
              <ChevronRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="flex items-center justify-center gap-5 text-xs text-muted">
            {['Gratuit', 'Sans carte bancaire', '3 sessions incluses'].map((t, i) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-accent shrink-0" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── MOCKUP ── */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl overflow-hidden border border-stone shadow-float bg-white">

            {/* Browser bar */}
            <div className="flex items-center gap-3 px-4 py-3 bg-faint border-b border-stone">
              <div className="flex gap-1.5 shrink-0">
                <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <div className="h-3 w-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-white border border-stone rounded-md px-4 py-1 text-xs text-muted w-full max-w-sm text-center">
                  studysynergy.app/session/intro-au-droit
                </div>
              </div>
            </div>

            {/* App UI */}
            <div className="p-6">
              {/* Top bar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-violet-50 border border-violet-100 rounded-lg flex items-center justify-center">
                    <Brain className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <div className="h-3 w-36 bg-ink rounded-full mb-1.5" />
                    <div className="h-2 w-20 bg-stone rounded-full" />
                  </div>
                </div>
                <div className="flex gap-2">
                  {[
                    { label: 'Résumé', active: true },
                    { label: 'Quiz', active: false },
                    { label: 'Flashcards', active: false },
                  ].map(t => (
                    <div key={t.label} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      t.active
                        ? 'bg-accent text-white border-accent'
                        : 'bg-white text-muted border-stone'
                    }`}>
                      {t.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Content skeleton */}
              <div className="space-y-2 mb-6">
                <div className="h-2.5 bg-stone rounded-full w-full" />
                <div className="h-2.5 bg-faint rounded-full w-[88%]" />
                <div className="h-2.5 bg-stone rounded-full w-[75%]" />
                <div className="h-2.5 bg-faint rounded-full w-[92%]" />
                <div className="h-2.5 bg-stone rounded-full w-[62%]" />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Résumé',     val: 'Generé',       hi: true  },
                  { label: 'Quiz',       val: '12 questions', hi: false },
                  { label: 'Flashcards', val: '24 cartes',    hi: false },
                ].map(s => (
                  <div key={s.label} className={`rounded-xl p-3 border ${
                    s.hi ? 'bg-violet-50 border-violet-100' : 'bg-faint border-stone'
                  }`}>
                    <p className="text-xs text-muted mb-0.5">{s.label}</p>
                    <p className={`text-sm font-semibold ${s.hi ? 'text-accent' : 'text-ink'}`}>{s.val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="px-6 py-24 border-t border-stone">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-16">
            <p className="label-section mb-3">Fonctionnalités</p>
            <h2 className="text-3xl md:text-4xl font-bold text-ink tracking-tight">
              Tout ce dont vous avez besoin
            </h2>
          </div>

          {/* Feature list — alternating layout */}
          <div className="space-y-3">

            {/* Row 1 — large card */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div className="md:col-span-3 rounded-2xl border border-stone bg-white p-8 flex flex-col justify-between min-h-[200px] hover:bg-faint transition-colors group">
                <div className="h-10 w-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center mb-6">
                  <Brain className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink text-base mb-2">Résumé intelligent</h3>
                  <p className="text-sm text-muted leading-relaxed max-w-xs">
                    L'IA structure vos documents en une synthèse claire, organisée par thèmes.
                  </p>
                </div>
              </div>

              <div className="md:col-span-2 rounded-2xl border border-stone bg-faint p-8 flex flex-col justify-between min-h-[200px] hover:bg-white transition-colors group">
                <div className="h-10 w-10 rounded-xl bg-white border border-stone flex items-center justify-center mb-6">
                  <Zap className="h-5 w-5 text-muted group-hover:text-accent transition-colors" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink text-base mb-2">Quiz automatique</h3>
                  <p className="text-sm text-muted leading-relaxed">
                    Chronomètre, score et corrections à la fin.
                  </p>
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div className="md:col-span-2 rounded-2xl border border-stone bg-faint p-8 flex flex-col justify-between min-h-[180px] hover:bg-white transition-colors group">
                <div className="h-10 w-10 rounded-xl bg-white border border-stone flex items-center justify-center mb-6">
                  <BookOpen className="h-5 w-5 text-muted group-hover:text-accent transition-colors" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink text-base mb-2">Flashcards</h3>
                  <p className="text-sm text-muted leading-relaxed">
                    Cartes recto/verso. Marquez celles maîtrisées, révisez les difficiles.
                  </p>
                </div>
              </div>

              <div className="md:col-span-3 rounded-2xl border border-stone bg-white p-8 flex flex-col justify-between min-h-[180px] hover:bg-faint transition-colors group">
                <div className="h-10 w-10 rounded-xl bg-faint border border-stone flex items-center justify-center mb-6">
                  <FileText className="h-5 w-5 text-muted group-hover:text-accent transition-colors" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink text-base mb-2">Tous les formats</h3>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {['PDF', 'Word', 'Images', 'Audio', 'Vidéo', 'Markdown'].map(f => (
                      <span key={f} className="px-2.5 py-1 bg-faint border border-stone rounded-lg text-xs text-muted font-medium">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="px-6 py-24 border-t border-stone bg-faint">
        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-16">
            <p className="label-section mb-3">Comment ça marche</p>
            <h2 className="text-3xl md:text-4xl font-bold text-ink tracking-tight">
              Trois étapes, c'est tout.
            </h2>
          </div>

          <div className="relative">
            {/* Connecting line — desktop only */}
            <div className="hidden md:block absolute top-5 left-[calc(16.666%+12px)] right-[calc(16.666%+12px)] h-px bg-stone" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  num: '01',
                  title: 'Importez vos fichiers',
                  desc: 'Glissez-déposez vos cours. PDF, audio, vidéo, images — tout est accepté.',
                  icon: FileText,
                },
                {
                  num: '02',
                  title: "L'IA analyse tout",
                  desc: 'Gemini 1.5 Pro lit, comprend et structure votre contenu en quelques secondes.',
                  icon: Brain,
                },
                {
                  num: '03',
                  title: 'Révisez efficacement',
                  desc: 'Résumé, quiz et flashcards générés automatiquement, prêts à l\'emploi.',
                  icon: Zap,
                },
              ].map((s, i) => (
                <div key={s.num} className="flex flex-col items-center text-center">
                  {/* Step indicator */}
                  <div className={`relative h-10 w-10 rounded-full flex items-center justify-center mb-6 border-2 z-10 ${
                    i === 0
                      ? 'bg-accent border-accent text-white'
                      : 'bg-white border-stone text-muted'
                  }`}>
                    <span className="text-xs font-bold">{s.num}</span>
                  </div>

                  <h3 className="font-semibold text-ink mb-2 text-base">{s.title}</h3>
                  <p className="text-sm text-muted leading-relaxed max-w-[220px]">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-24 border-t border-stone">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-ink mb-3 tracking-tight">
            Prêt à réviser intelligemment ?
          </h2>
          <p className="text-muted mb-8 text-sm leading-relaxed">
            Importez vos premiers fichiers et laissez l'IA faire le travail.
          </p>
          <button
            onClick={handleStart}
            className="btn-primary px-8 py-3 text-sm font-semibold"
          >
            {token ? 'Accéder au dashboard' : 'Créer mon compte gratuitement'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-6 py-6 border-t border-stone">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="font-medium text-sm">StudySynergy</span>
          </div>
          <p className="text-xs text-muted">© 2026 StudySynergy · Propulsé par Gemini AI</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
