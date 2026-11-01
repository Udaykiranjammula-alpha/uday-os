import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ArrowRightLeft,
  X,
  DollarSign,
  HardDrive,
  Cpu,
  Delete,
} from 'lucide-react';
import { sound } from '../services/sound';

interface CalculatorAppProps {
  onBack: () => void;
  onNavigate?: (route: string) => void;
}

export function CalculatorApp({ onBack }: CalculatorAppProps) {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [showConverter, setShowConverter] = useState(false);
  const [activeButtonKey, setActiveButtonKey] = useState<string | null>(null);

  // Converter state
  const [converterType, setConverterType] = useState<'storage' | 'latency' | 'salary'>('storage');
  const [convertInput, setConvertInput] = useState('16');

  // Flash button helper for keyboard interaction
  const flashButton = (key: string) => {
    setActiveButtonKey(key);
    setTimeout(() => {
      setActiveButtonKey((cur) => (cur === key ? null : cur));
    }, 140);
  };

  const handleDigit = useCallback((digit: string) => {
    sound.playTapSound();
    flashButton(digit);

    setDisplay((current) => {
      if (current === 'Error' || waitingForOperand) {
        setWaitingForOperand(false);
        return digit;
      }
      if (current === '0') {
        return digit;
      }
      if (current.replace('-', '').length >= 10) {
        return current; // Max digits limit
      }
      return current + digit;
    });
  }, [waitingForOperand]);

  const handleDecimal = useCallback(() => {
    sound.playTapSound();
    flashButton('.');

    setDisplay((current) => {
      if (current === 'Error' || waitingForOperand) {
        setWaitingForOperand(false);
        return '0.';
      }
      if (!current.includes('.')) {
        return current + '.';
      }
      return current;
    });
  }, [waitingForOperand]);

  const handleClear = useCallback(() => {
    sound.playTapSound();
    flashButton('clear');

    if (display !== '0' && prevValue === null) {
      setDisplay('0');
    } else {
      setDisplay('0');
      setPrevValue(null);
      setOperation(null);
      setWaitingForOperand(false);
    }
  }, [display, prevValue]);

  const handleBackspace = useCallback(() => {
    sound.playTapSound();
    flashButton('backspace');

    setDisplay((current) => {
      if (current === 'Error' || waitingForOperand) {
        setWaitingForOperand(false);
        return '0';
      }
      if (current.length === 1 || (current.length === 2 && current.startsWith('-'))) {
        return '0';
      }
      return current.slice(0, -1);
    });
  }, [waitingForOperand]);

  const handleToggleSign = useCallback(() => {
    sound.playTapSound();
    flashButton('+/-');

    setDisplay((current) => {
      if (current === '0' || current === 'Error') return current;
      if (current.startsWith('-')) {
        return current.slice(1);
      }
      return '-' + current;
    });
  }, []);

  const handlePercent = useCallback(() => {
    sound.playTapSound();
    flashButton('%');

    setDisplay((current) => {
      if (current === 'Error') return current;
      const num = parseFloat(current);
      if (Number.isNaN(num)) return '0';

      if (prevValue !== null && operation && !waitingForOperand) {
        // Percentage relative to first operand (iOS style e.g. 200 + 10% = 20)
        const pct = (prevValue * num) / 100;
        return String(Math.round(pct * 1e8) / 1e8);
      }
      const directPct = num / 100;
      return String(Math.round(directPct * 1e8) / 1e8);
    });
  }, [prevValue, operation, waitingForOperand]);

  const compute = (a: number, b: number, op: string): { result: number; error?: string } => {
    let res = 0;
    switch (op) {
      case '+':
        res = a + b;
        break;
      case '−':
      case '-':
        res = a - b;
        break;
      case '×':
      case '*':
        res = a * b;
        break;
      case '÷':
      case '/':
        if (b === 0) {
          return { result: 0, error: 'Error' };
        }
        res = a / b;
        break;
      default:
        res = b;
    }
    // Clean round to avoid 0.1 + 0.2 floating point inaccuracies
    const rounded = Math.round(res * 1e10) / 1e10;
    return { result: rounded };
  };

  const handleOperation = useCallback((nextOp: string) => {
    sound.playTapSound();
    flashButton(nextOp);

    if (display === 'Error') {
      setDisplay('0');
      setPrevValue(null);
      setOperation(null);
      setWaitingForOperand(false);
      return;
    }

    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operation && !waitingForOperand) {
      // Calculate intermediate result
      const { result, error } = compute(prevValue, inputValue, operation);
      if (error) {
        setDisplay(error);
        setPrevValue(null);
        setOperation(null);
        setWaitingForOperand(true);
        return;
      }
      setPrevValue(result);
      setDisplay(String(result));
    }

    setWaitingForOperand(true);
    setOperation(nextOp);
  }, [display, prevValue, operation, waitingForOperand]);

  const handleEquals = useCallback(() => {
    sound.playTapSound();
    flashButton('=');

    if (display === 'Error') {
      setDisplay('0');
      setPrevValue(null);
      setOperation(null);
      setWaitingForOperand(false);
      return;
    }

    const inputValue = parseFloat(display);
    if (prevValue === null || operation === null) return;

    const { result, error } = compute(prevValue, inputValue, operation);
    if (error) {
      setDisplay(error);
    } else {
      setDisplay(String(result));
    }

    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  }, [display, prevValue, operation]);

  // Hardware keyboard event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keystrokes when user is typing inside an input field (like converter input)
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      const key = e.key;

      if (key >= '0' && key <= '9') {
        e.preventDefault();
        handleDigit(key);
      } else if (key === '.' || key === ',') {
        e.preventDefault();
        handleDecimal();
      } else if (key === '+') {
        e.preventDefault();
        handleOperation('+');
      } else if (key === '-') {
        e.preventDefault();
        handleOperation('−');
      } else if (key === '*') {
        e.preventDefault();
        handleOperation('×');
      } else if (key === '/') {
        e.preventDefault();
        handleOperation('÷');
      } else if (key === '%') {
        e.preventDefault();
        handlePercent();
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleDecimal, handleOperation, handlePercent, handleEquals, handleBackspace, handleClear]);

  // Converter calculations
  const numInput = Math.max(0, parseFloat(convertInput) || 0);

  // Storage units
  const storageGB = numInput;
  const storageMB = storageGB * 1024;
  const storageTB = storageGB / 1024;
  const storagePB = storageTB / 1024;

  // Latency units
  const latencyMS = numInput;
  const latencyUS = latencyMS * 1000;
  const latencySec = latencyMS / 1000;
  const latencyNS = latencyUS * 1000;

  // Comp units
  const hourlyUSD = numInput;
  const annualUSD = hourlyUSD * 40 * 52;
  const annualINR = Math.round(annualUSD * 86.5);
  const monthlyINR = Math.round(annualINR / 12);

  return (
    <div className="ios-calculator-page">
      {/* Top Header */}
      <header className="calc-nav-bar">
        <button
          type="button"
          className="calc-nav-btn"
          onClick={() => {
            sound.playTapSound();
            onBack();
          }}
          aria-label="Back to Home Screen"
        >
          <ChevronLeft size={18} />
          <span>Home</span>
        </button>

        <span className="calc-page-title">Calculator</span>

        <button
          type="button"
          className={`calc-nav-btn calc-converter-pill ${showConverter ? 'active' : ''}`}
          onClick={() => {
            sound.playTapSound();
            setShowConverter(!showConverter);
          }}
          title="iOS 18 Math & Tech Converter"
        >
          <ArrowRightLeft size={16} />
        </button>
      </header>

      {/* Main Display Area */}
      <div className="calc-display-container">
        <div className="calc-formula-sub">
          {prevValue !== null && operation ? `${prevValue} ${operation}` : ''}
        </div>
        <div
          className={`calc-main-digits ${
            display.length > 9 ? 'shrink-sm' : display.length > 6 ? 'shrink' : ''
          }`}
          style={{
            fontSize: display.length > 9 ? '42px' : display.length > 6 ? '54px' : '72px',
          }}
        >
          {display}
        </div>
      </div>

      {/* Authentic iOS Circular Keypad Grid */}
      <div className="calc-grid">
        {/* Row 1 */}
        <button
          type="button"
          className={`calc-btn btn-fn ${activeButtonKey === 'clear' ? 'active' : ''}`}
          onClick={handleClear}
          aria-label="Clear"
        >
          {display !== '0' ? 'C' : 'AC'}
        </button>
        <button
          type="button"
          className={`calc-btn btn-fn ${activeButtonKey === '+/-' ? 'active' : ''}`}
          onClick={handleToggleSign}
          aria-label="Toggle Sign"
        >
          +/-
        </button>
        <button
          type="button"
          className={`calc-btn btn-fn ${activeButtonKey === '%' ? 'active' : ''}`}
          onClick={handlePercent}
          aria-label="Percentage"
        >
          %
        </button>
        <button
          type="button"
          className={`calc-btn btn-op ${operation === '÷' || activeButtonKey === '÷' ? 'active' : ''}`}
          onClick={() => handleOperation('÷')}
          aria-label="Divide"
        >
          ÷
        </button>

        {/* Row 2 */}
        <button
          type="button"
          className={`calc-btn btn-num ${activeButtonKey === '7' ? 'active' : ''}`}
          onClick={() => handleDigit('7')}
        >
          7
        </button>
        <button
          type="button"
          className={`calc-btn btn-num ${activeButtonKey === '8' ? 'active' : ''}`}
          onClick={() => handleDigit('8')}
        >
          8
        </button>
        <button
          type="button"
          className={`calc-btn btn-num ${activeButtonKey === '9' ? 'active' : ''}`}
          onClick={() => handleDigit('9')}
        >
          9
        </button>
        <button
          type="button"
          className={`calc-btn btn-op ${operation === '×' || activeButtonKey === '×' ? 'active' : ''}`}
          onClick={() => handleOperation('×')}
          aria-label="Multiply"
        >
          ×
        </button>

        {/* Row 3 */}
        <button
          type="button"
          className={`calc-btn btn-num ${activeButtonKey === '4' ? 'active' : ''}`}
          onClick={() => handleDigit('4')}
        >
          4
        </button>
        <button
          type="button"
          className={`calc-btn btn-num ${activeButtonKey === '5' ? 'active' : ''}`}
          onClick={() => handleDigit('5')}
        >
          5
        </button>
        <button
          type="button"
          className={`calc-btn btn-num ${activeButtonKey === '6' ? 'active' : ''}`}
          onClick={() => handleDigit('6')}
        >
          6
        </button>
        <button
          type="button"
          className={`calc-btn btn-op ${operation === '−' || activeButtonKey === '−' ? 'active' : ''}`}
          onClick={() => handleOperation('−')}
          aria-label="Subtract"
        >
          −
        </button>

        {/* Row 4 */}
        <button
          type="button"
          className={`calc-btn btn-num ${activeButtonKey === '1' ? 'active' : ''}`}
          onClick={() => handleDigit('1')}
        >
          1
        </button>
        <button
          type="button"
          className={`calc-btn btn-num ${activeButtonKey === '2' ? 'active' : ''}`}
          onClick={() => handleDigit('2')}
        >
          2
        </button>
        <button
          type="button"
          className={`calc-btn btn-num ${activeButtonKey === '3' ? 'active' : ''}`}
          onClick={() => handleDigit('3')}
        >
          3
        </button>
        <button
          type="button"
          className={`calc-btn btn-op ${operation === '+' || activeButtonKey === '+' ? 'active' : ''}`}
          onClick={() => handleOperation('+')}
          aria-label="Add"
        >
          +
        </button>

        {/* Row 5 */}
        <button
          type="button"
          className={`calc-btn btn-num btn-zero ${activeButtonKey === '0' ? 'active' : ''}`}
          onClick={() => handleDigit('0')}
        >
          0
        </button>
        <button
          type="button"
          className={`calc-btn btn-num ${activeButtonKey === '.' ? 'active' : ''}`}
          onClick={handleDecimal}
        >
          .
        </button>
        <button
          type="button"
          className={`calc-btn btn-op ${activeButtonKey === '=' ? 'active' : ''}`}
          onClick={handleEquals}
          aria-label="Equals"
        >
          =
        </button>
      </div>

      {/* iOS 18 Math & Tech Converter Drawer */}
      {showConverter && (
        <div className="calc-drawer-overlay" onClick={() => setShowConverter(false)}>
          <div className="calc-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-drag-handle" />

            <div className="calc-drawer-header">
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>
                Math & Tech Converter
              </span>
              <button
                type="button"
                className="conv-close-btn"
                onClick={() => {
                  sound.playTapSound();
                  setShowConverter(false);
                }}
                aria-label="Close Converter"
              >
                <X size={16} />
              </button>
            </div>

            {/* Converter Tabs */}
            <div className="calc-drawer-tabs">
              <button
                type="button"
                className={`calc-tab-btn ${converterType === 'storage' ? 'active' : ''}`}
                onClick={() => {
                  sound.playTapSound();
                  setConverterType('storage');
                }}
              >
                <HardDrive size={13} style={{ marginRight: 4, verticalAlign: -2 }} />
                <span>Data</span>
              </button>
              <button
                type="button"
                className={`calc-tab-btn ${converterType === 'latency' ? 'active' : ''}`}
                onClick={() => {
                  sound.playTapSound();
                  setConverterType('latency');
                }}
              >
                <Cpu size={13} style={{ marginRight: 4, verticalAlign: -2 }} />
                <span>Speed</span>
              </button>
              <button
                type="button"
                className={`calc-tab-btn ${converterType === 'salary' ? 'active' : ''}`}
                onClick={() => {
                  sound.playTapSound();
                  setConverterType('salary');
                }}
              >
                <DollarSign size={13} style={{ marginRight: 4, verticalAlign: -2 }} />
                <span>Comp</span>
              </button>
            </div>

            {/* Input Value */}
            <div className="calc-converter-input-wrap">
              <span className="calc-conv-label">
                {converterType === 'storage'
                  ? 'BASE VALUE (GIGABYTES / GB)'
                  : converterType === 'latency'
                  ? 'BASE VALUE (MILLISECONDS / MS)'
                  : 'HOURLY RATE (USD / HR)'}
              </span>
              <input
                type="number"
                value={convertInput}
                onChange={(e) => setConvertInput(e.target.value)}
                className="calc-conv-input"
                placeholder="0"
                min="0"
                step="any"
              />
            </div>

            {/* Quick Presets */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
              {converterType === 'storage' &&
                [16, 64, 256, 1024].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      sound.playTapSound();
                      setConvertInput(String(val));
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '0.5px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      color: '#ddd',
                      fontSize: '11px',
                      padding: '4px 8px',
                      cursor: 'pointer',
                    }}
                  >
                    {val >= 1024 ? '1 TB' : `${val} GB`}
                  </button>
                ))}

              {converterType === 'latency' &&
                [1, 16.6, 100, 1000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      sound.playTapSound();
                      setConvertInput(String(val));
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '0.5px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      color: '#ddd',
                      fontSize: '11px',
                      padding: '4px 8px',
                      cursor: 'pointer',
                    }}
                  >
                    {val === 16.6 ? '16.6ms (60fps)' : `${val}ms`}
                  </button>
                ))}

              {converterType === 'salary' &&
                [50, 75, 100, 150].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      sound.playTapSound();
                      setConvertInput(String(val));
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '0.5px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      color: '#ddd',
                      fontSize: '11px',
                      padding: '4px 8px',
                      cursor: 'pointer',
                    }}
                  >
                    ${val}/hr
                  </button>
                ))}
            </div>

            {/* Results Grid */}
            <div className="calc-conv-results">
              {converterType === 'storage' && (
                <>
                  <div className="calc-conv-card">
                    <small>Megabytes (MB)</small>
                    <strong>{storageMB.toLocaleString(undefined, { maximumFractionDigits: 1 })} MB</strong>
                  </div>
                  <div className="calc-conv-card highlight">
                    <small>Gigabytes (GB)</small>
                    <strong>{storageGB.toLocaleString(undefined, { maximumFractionDigits: 2 })} GB</strong>
                  </div>
                  <div className="calc-conv-card">
                    <small>Terabytes (TB)</small>
                    <strong>{storageTB.toFixed(3)} TB</strong>
                  </div>
                </>
              )}

              {converterType === 'latency' && (
                <>
                  <div className="calc-conv-card">
                    <small>Microseconds (µs)</small>
                    <strong>{latencyUS.toLocaleString(undefined, { maximumFractionDigits: 1 })} µs</strong>
                  </div>
                  <div className="calc-conv-card highlight">
                    <small>Milliseconds (ms)</small>
                    <strong>{latencyMS.toLocaleString(undefined, { maximumFractionDigits: 2 })} ms</strong>
                  </div>
                  <div className="calc-conv-card">
                    <small>Seconds (s)</small>
                    <strong>{latencySec.toFixed(3)} s</strong>
                  </div>
                </>
              )}

              {converterType === 'salary' && (
                <>
                  <div className="calc-conv-card">
                    <small>Hourly Rate</small>
                    <strong>${hourlyUSD} / hr</strong>
                  </div>
                  <div className="calc-conv-card highlight">
                    <small>Annual CTC (USD)</small>
                    <strong>${annualUSD.toLocaleString()} / yr</strong>
                  </div>
                  <div className="calc-conv-card">
                    <small>Annual CTC (INR)</small>
                    <strong>₹{annualINR.toLocaleString()}</strong>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}