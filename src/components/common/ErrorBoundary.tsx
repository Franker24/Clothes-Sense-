import React, { Component, ErrorInfo, ReactNode } from 'react';

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
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      // Clear potentially corrupted store keys
      localStorage.removeItem('sense_products_v1');
      localStorage.removeItem('sense_brands_v1');
      localStorage.removeItem('sense_promos_v1');
      localStorage.removeItem('sense_cart_v1');
      localStorage.removeItem('sense_orders_v1');
      localStorage.removeItem('sense_user_v1');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#111111] text-white flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="max-w-md bg-[#1a1a1a] p-8 rounded-lg border border-white/10 shadow-2xl">
            <h1 className="font-display font-extrabold text-3xl tracking-widest uppercase text-white mb-2">
              SENSE
            </h1>
            <div className="w-10 h-0.5 bg-yellow-400 mx-auto my-4" />
            <h2 className="text-lg font-bold text-neutral-200 mb-2">
              Reiniciando la experiencia
            </h2>
            <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
              Ocurrió un error temporal al cargar la vista. Hacé clic en el botón de abajo para restablecer el catálogo y continuar navegando.
            </p>
            <button
              onClick={this.handleReset}
              className="px-6 py-3 bg-white hover:bg-neutral-200 text-[#111111] font-bold text-xs uppercase tracking-widest rounded transition-all cursor-pointer"
            >
              Restablecer y Recargar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
