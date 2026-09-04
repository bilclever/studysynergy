import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import Logo from '../Logo';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <Logo size="md" className="mb-10 opacity-40" />

      <p className="text-[120px] font-black text-stone leading-none mb-4 tracking-tight select-none">404</p>

      <h1 className="text-2xl font-bold text-ink mb-3">Page introuvable</h1>
      <p className="text-sm text-muted max-w-sm mx-auto mb-8 leading-relaxed">
        Cette page n'existe pas ou a été déplacée.
      </p>

      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/')} className="btn-primary">
          <ArrowRight className="h-4 w-4" />
          Retour à l'accueil
        </button>
        <button onClick={() => navigate(-1)} className="btn-secondary">
          <Compass className="h-4 w-4" />
          Page précédente
        </button>
      </div>
    </div>
  );
};

export default NotFound;
