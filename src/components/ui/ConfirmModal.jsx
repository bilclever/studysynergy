import React, { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * Modal de confirmation réutilisable.
 *
 * Props:
 *  - isOpen      : boolean
 *  - onConfirm   : () => void
 *  - onCancel    : () => void
 *  - title       : string
 *  - message     : string
 *  - confirmLabel: string  (default "Confirmer")
 *  - danger      : boolean (default false) - rouge vs neutre
 */
const ConfirmModal = ({
  isOpen,
  onConfirm,
  onCancel,
  title = 'Confirmer l\'action',
  message,
  confirmLabel = 'Confirmer',
  danger = false,
}) => {
  // Fermer avec Escape
  useEffect(() => {
    if (!isOpen) return;
    const handle = (e) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="confirm-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl border border-stone shadow-float w-full max-w-sm p-6 animate-fade-in">
        <div className="flex items-start gap-4">
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
            danger ? 'bg-red-50' : 'bg-faint'
          }`}>
            <AlertTriangle className={`h-5 w-5 ${danger ? 'text-red-500' : 'text-muted'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 id="confirm-title" className="text-base font-semibold text-ink mb-1">
              {title}
            </h2>
            {message && (
              <p className="text-sm text-muted leading-relaxed">{message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="btn-secondary text-sm px-4 py-2"
            autoFocus
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className={`btn text-sm px-4 py-2 text-white active:scale-[0.98] ${
              danger
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-ink hover:bg-ink/80'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
