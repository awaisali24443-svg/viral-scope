import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
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

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      let errorMessage = "An unexpected error occurred.";
      let isFirestoreError = false;

      try {
        if (this.state.error?.message) {
          const parsedError = JSON.parse(this.state.error.message);
          if (parsedError.operationType) {
            isFirestoreError = true;
            errorMessage = "A database error occurred. Please check your permissions or try again later.";
          }
        }
      } catch (e) {
        // Not a JSON error, use default message or error message
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen bg-[#030303] flex items-center justify-center p-4">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-rose-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
            <p className="text-slate-400 mb-8">
              {errorMessage}
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center justify-center gap-2 bg-white text-[#030303] px-6 py-3 rounded-full font-bold hover:bg-slate-200 transition-colors w-full"
            >
              <RefreshCw className="w-5 h-5" />
              Return Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
