import { Component } from 'react';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <span className="text-3xl">⚠️</span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Ops! Qualcosa è andato storto
            </h1>

            <p className="text-gray-600 mb-6">
              Si è verificato un errore inaspettato. Prova a ricaricare la pagina.
            </p>

            {this.state.error && (
              <div className="mb-6 p-4 bg-gray-100 rounded-lg text-left">
                <p className="text-xs text-gray-700 font-mono break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={this.handleReload}
                className="flex-1 px-4 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition"
              >
                Ricarica Pagina
              </button>
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
              >
                Riprova
              </button>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              Se il problema persiste, prova a fare logout e login di nuovo
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
