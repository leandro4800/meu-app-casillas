
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0908] flex flex-col items-center justify-center p-8 text-center">
          <div className="size-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
            <span className="material-symbols-outlined text-red-500 text-5xl">error</span>
          </div>
          <h1 className="text-[#eab308] text-3xl font-black uppercase italic tracking-tighter mb-4">
            OPS! ALGO DEU ERRADO
          </h1>
          <p className="text-gray-400 text-sm max-w-xs mb-8 font-medium">
            Ocorreu um erro inesperado na interface. Tente recarregar o aplicativo.
          </p>
          
          <div className="bg-[#1c1e22] p-4 rounded-2xl border border-white/5 w-full max-w-sm mb-8 overflow-hidden">
            <p className="text-red-500 text-[10px] font-mono break-all text-left">
              {this.state.error?.toString()}
            </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="bg-[#eab308] text-black font-black px-8 py-4 rounded-2xl uppercase tracking-widest text-sm active:scale-95 transition-all shadow-xl"
          >
            Recarregar App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
