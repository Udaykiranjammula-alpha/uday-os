import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle, Home, Sparkles } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackRoute?: string;
  onResetRoute?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class IosErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('UDAY OS Component Exception caught by IosErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onResetRoute) {
      this.props.onResetRoute();
    } else {
      window.location.hash = '#home';
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          className="ios-error-boundary-screen"
          style={{
            flex: 1,
            width: '100%',
            height: '100%',
            backgroundColor: '#000000',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px 20px',
            boxSizing: 'border-box',
            textAlign: 'center',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            zIndex: 9999,
          }}
        >
          {/* iOS Amber Triangle Badge */}
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 159, 10, 0.15)',
              border: '1px solid rgba(255, 159, 10, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              boxShadow: '0 0 20px rgba(255, 159, 10, 0.25)',
            }}
          >
            <AlertTriangle size={32} color="#ff9f0a" />
          </div>

          <h2
            style={{
              fontSize: '18px',
              fontWeight: 700,
              margin: '0 0 6px 0',
              letterSpacing: '-0.3px',
            }}
          >
            UDAY OS Safe Recovery
          </h2>

          <p
            style={{
              fontSize: '12.5px',
              color: 'rgba(255, 255, 255, 0.65)',
              margin: '0 0 22px 0',
              lineHeight: 1.45,
              maxWidth: '280px',
            }}
          >
            A transient display issue occurred in this view. The system isolated the fault to preserve your state.
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '240px' }}>
            <button
              type="button"
              onClick={this.handleReset}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#007aff',
                color: '#ffffff',
                border: 'none',
                borderRadius: '14px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(0, 122, 255, 0.35)',
              }}
            >
              <Home size={15} />
              <span>Return to Home Screen</span>
            </button>

            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                width: '100%',
                padding: '11px 16px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '14px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <RotateCcw size={14} />
              <span>Restart UDAY OS</span>
            </button>
          </div>

          {/* Error Details (compact) */}
          {this.state.error && (
            <div
              style={{
                marginTop: '20px',
                padding: '8px 12px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                borderRadius: '8px',
                fontSize: '10.5px',
                color: 'rgba(255, 255, 255, 0.4)',
                fontFamily: 'monospace',
                maxWidth: '280px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {this.state.error.message}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
