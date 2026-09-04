import React from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

/**
 * Error Boundary global.
 * Attrape les erreurs React non gérées et affiche un écran de récupération.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // En production, envoyer à un service de monitoring (Sentry, etc.)
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-faint flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="h-16 w-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
          <h1 className="text-xl font-bold text-ink mb-2">Quelque chose s'est mal passé</h1>
          <p className="text-sm text-muted mb-6 leading-relaxed">
            Une erreur inattendue s'est produite. Rechargez la page pour continuer.
          </p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre className="text-left text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl p-4 mb-6 overflow-auto max-h-40">
              {this.state.error.toString()}
            </pre>
          )}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="btn-primary gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Recharger la page
            </button>
            <button
              onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/'; }}
              className="btn-secondary"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
