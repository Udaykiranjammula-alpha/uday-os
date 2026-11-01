import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ChevronLeft,
  ArrowRightLeft,
  Clock,
  FlaskConical,
  Delete,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  DollarSign,
  HardDrive,
  Cpu,
  Layers,
  LineChart,
} from 'lucide-react';
import { sound } from '../services/sound';
import { MathNotesGrapher } from '../components/MathNotesGrapher';

interface CalculatorAppProps {
  onBack: () => void;
  onNavigate?: (route: string) => void;
}

type CalcMode = 'standard' | 'scientific' | 'grapher' | 'converter' | 'history';

interface HistoryItem {
  id: string;
  formula: string;
  result: string;
  timestamp: string;
}

export function CalculatorApp({ onBack }: CalculatorAppProps) {
  const [mode, setMode] = useState<CalcMode>('standard');
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [activeButtonKey, setActiveButtonKey] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Scientific calculator state
  const [isRad, setIsRad] = useState(false); // false = DEG, true = RAD
  const [isSecondFunction, setIsSecondFunction] = useState(false);
  const [memory, setMemory] = useState<number>(0);
  const [openParensCount, setOpenParensCount] = useState<number>(0);

  // History state
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('ios_calculator_history');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      { id: '1', formula: '1920 × 1080', result: '2073600', timestamp: 'Earlier' },
      { id: '2', formula: '3840 ÷ 60', result: '64', timestamp: 'Earlier' },
      { id: '3', formula: '2^16', result: '65536', timestamp: 'Earlier' },
    ];
  });

  const saveHistory = useCallback((formula: string, result: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      formula,
      result,
      timestamp: timeStr,
    };
    setHistory((prev) => {
      const updated = [newItem, ...prev.slice(0, 49)];
      try {
        localStorage.setItem('ios_calculator_history', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  // Converter state
  const [converterType, setConverterType] = useState<'storage' | 'latency' | 'currency' | 'salary'>('storage');
  const [convertInput, setConvertInput] = useState('16');

  // Flash button helper for tactile feedback
  const flashButton = (key: string) => {
    setActiveButtonKey(key);
    setTimeout(() => {
      setActiveButtonKey((cur) => (cur === key ? null : cur));
    }, 120);
  };

  // Format number for display with commas
  const formattedDisplay = useMemo(() => {
    if (display === 'Error' || display.includes('e') || display.includes('Infinity') || display.includes('NaN')) {
      return display;
    }
    const parts = display.split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart;
  }, [display]);

  // Copy result to clipboard
  const handleCopy = () => {
    sound.playTapSound();
    navigator.clipboard?.writeText(display);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1600);
  };

  // Digit handler
  const handleDigit = useCallback(
    (digit: string) => {
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
        if (current.replace('-', '').length >= 12) {
          return current; // limit to 12 digits
        }
        return current + digit;
      });
    },
    [waitingForOperand]
  );

  // Decimal point handler
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

  // Clear / All Clear
  const handleClear = useCallback(() => {
    sound.playTapSound();
    flashButton('clear');

    if (display !== '0' && prevValue === null) {
      setDisplay('0');
      setExpression('');
    } else {
      setDisplay('0');
      setExpression('');
      setPrevValue(null);
      setOperation(null);
      setWaitingForOperand(false);
      setOpenParensCount(0);
    }
  }, [display, prevValue]);

  // Backspace / Swipe-to-delete
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

  // Toggle positive / negative
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

  // Percent
  const handlePercent = useCallback(() => {
    sound.playTapSound();
    flashButton('%');

    setDisplay((current) => {
      if (current === 'Error') return current;
      const num = parseFloat(current);
      if (Number.isNaN(num)) return '0';

      if (prevValue !== null && operation && !waitingForOperand) {
        const pct = (prevValue * num) / 100;
        return String(Math.round(pct * 1e10) / 1e10);
      }
      const direct = num / 100;
      return String(Math.round(direct * 1e10) / 1e10);
    });
  }, [prevValue, operation, waitingForOperand]);

  // Clean rounding helper to avoid floating point artifacts
  const cleanRound = (n: number): number => {
    if (!Number.isFinite(n)) return NaN;
    return Math.round(n * 1e10) / 1e10;
  };

  // Core binary calculation
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
        if (b === 0) return { result: 0, error: 'Error' };
        res = a / b;
        break;
      case '^':
      case 'xʸ':
        res = Math.pow(a, b);
        break;
      case 'y√x':
        if (a < 0 && b % 2 === 0) return { result: 0, error: 'Error' };
        res = Math.pow(a, 1 / b);
        break;
      default:
        res = b;
    }
    const rounded = cleanRound(res);
    return { result: rounded };
  };

  // Operation button (+, -, ×, ÷, xʸ)
  const handleOperation = useCallback(
    (nextOp: string) => {
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
        setExpression(`${display} ${nextOp}`);
      } else if (operation && !waitingForOperand) {
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
        setExpression(`${result} ${nextOp}`);
      } else {
        setExpression(`${prevValue} ${nextOp}`);
      }

      setWaitingForOperand(true);
      setOperation(nextOp);
    },
    [display, prevValue, operation, waitingForOperand]
  );

  // Equals
  const handleEquals = useCallback(() => {
    sound.playTapSound();
    flashButton('=');

    if (display === 'Error') {
      setDisplay('0');
      setPrevValue(null);
      setOperation(null);
      setWaitingForOperand(false);
      setExpression('');
      return;
    }

    const inputValue = parseFloat(display);
    if (prevValue === null || operation === null) return;

    const formula = `${prevValue} ${operation} ${inputValue}`;
    const { result, error } = compute(prevValue, inputValue, operation);

    if (error) {
      setDisplay(error);
      setExpression(`${formula} = Error`);
    } else {
      const resStr = String(result);
      setDisplay(resStr);
      setExpression(`${formula} =`);
      saveHistory(formula, resStr);
    }

    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  }, [display, prevValue, operation, saveHistory]);

  // Scientific Unary Calculations (sin, cos, tan, ln, log, sqrt, square, etc.)
  const handleScientificUnary = useCallback(
    (func: string) => {
      sound.playTapSound();
      flashButton(func);

      if (display === 'Error') return;
      const val = parseFloat(display);
      if (Number.isNaN(val)) return;

      let res = val;
      let formulaLabel = `${func}(${val})`;

      const toRad = (deg: number) => (deg * Math.PI) / 180;
      const toDeg = (rad: number) => (rad * 180) / Math.PI;

      switch (func) {
        case 'sin':
          res = isRad ? Math.sin(val) : Math.sin(toRad(val));
          break;
        case 'cos':
          res = isRad ? Math.cos(val) : Math.cos(toRad(val));
          break;
        case 'tan':
          res = isRad ? Math.tan(val) : Math.tan(toRad(val));
          break;
        case 'sin⁻¹':
          if (val < -1 || val > 1) {
            setDisplay('Error');
            return;
          }
          res = isRad ? Math.asin(val) : toDeg(Math.asin(val));
          break;
        case 'cos⁻¹':
          if (val < -1 || val > 1) {
            setDisplay('Error');
            return;
          }
          res = isRad ? Math.acos(val) : toDeg(Math.acos(val));
          break;
        case 'tan⁻¹':
          res = isRad ? Math.atan(val) : toDeg(Math.atan(val));
          break;
        case 'ln':
          if (val <= 0) {
            setDisplay('Error');
            return;
          }
          res = Math.log(val);
          break;
        case 'log₁₀':
          if (val <= 0) {
            setDisplay('Error');
            return;
          }
          res = Math.log10(val);
          break;
        case 'log₂':
          if (val <= 0) {
            setDisplay('Error');
            return;
          }
          res = Math.log2(val);
          break;
        case 'eˣ':
          res = Math.exp(val);
          break;
        case '10ˣ':
          res = Math.pow(10, val);
          break;
        case '2ˣ':
          res = Math.pow(2, val);
          break;
        case 'x²':
          res = val * val;
          formulaLabel = `sqr(${val})`;
          break;
        case 'x³':
          res = val * val * val;
          formulaLabel = `cube(${val})`;
          break;
        case '√x':
          if (val < 0) {
            setDisplay('Error');
            return;
          }
          res = Math.sqrt(val);
          formulaLabel = `√(${val})`;
          break;
        case '∛x':
          res = Math.cbrt(val);
          formulaLabel = `∛(${val})`;
          break;
        case '1/x':
          if (val === 0) {
            setDisplay('Error');
            return;
          }
          res = 1 / val;
          formulaLabel = `1/(${val})`;
          break;
        case 'x!':
          if (val < 0 || !Number.isInteger(val) || val > 170) {
            setDisplay('Error');
            return;
          }
          let fact = 1;
          for (let i = 2; i <= val; i++) fact *= i;
          res = fact;
          formulaLabel = `${val}!`;
          break;
        case 'sinh':
          res = Math.sinh(val);
          break;
        case 'cosh':
          res = Math.cosh(val);
          break;
        case 'tanh':
          res = Math.tanh(val);
          break;
        default:
          break;
      }

      const rounded = cleanRound(res);
      if (Number.isNaN(rounded) || !Number.isFinite(rounded)) {
        setDisplay('Error');
        return;
      }

      const strResult = String(rounded);
      setDisplay(strResult);
      setExpression(`${formulaLabel} =`);
      saveHistory(formulaLabel, strResult);
      setWaitingForOperand(true);
    },
    [display, isRad, saveHistory]
  );

  // Constants (π, e, Rand)
  const handleConstant = useCallback(
    (name: string) => {
      sound.playTapSound();
      flashButton(name);

      let val = '0';
      if (name === 'π') val = String(cleanRound(Math.PI));
      else if (name === 'e') val = String(cleanRound(Math.E));
      else if (name === 'Rand') val = String(cleanRound(Math.random()));

      setDisplay(val);
      setWaitingForOperand(false);
    },
    []
  );

  // Memory buttons (mc, m+, m-, mr)
  const handleMemory = useCallback(
    (action: string) => {
      sound.playTapSound();
      flashButton(action);

      const val = parseFloat(display) || 0;
      switch (action) {
        case 'mc':
          setMemory(0);
          break;
        case 'm+':
          setMemory((m) => cleanRound(m + val));
          setWaitingForOperand(true);
          break;
        case 'm-':
          setMemory((m) => cleanRound(m - val));
          setWaitingForOperand(true);
          break;
        case 'mr':
          setDisplay(String(memory));
          setWaitingForOperand(true);
          break;
        default:
          break;
      }
    },
    [display, memory]
  );

  // Hardware keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
      } else if (key === '^') {
        e.preventDefault();
        handleOperation('^');
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        e.preventDefault();
        handleClear();
      } else if (key.toLowerCase() === 'p') {
        e.preventDefault();
        handleConstant('π');
      } else if (key.toLowerCase() === 'e') {
        e.preventDefault();
        handleConstant('e');
      } else if (key.toLowerCase() === 's') {
        e.preventDefault();
        handleScientificUnary('sin');
      } else if (key.toLowerCase() === 'o') {
        e.preventDefault();
        handleScientificUnary('cos');
      } else if (key.toLowerCase() === 't') {
        e.preventDefault();
        handleScientificUnary('tan');
      } else if (key.toLowerCase() === 'r') {
        e.preventDefault();
        handleScientificUnary('√x');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleDigit,
    handleDecimal,
    handleOperation,
    handlePercent,
    handleEquals,
    handleBackspace,
    handleClear,
    handleConstant,
    handleScientificUnary,
  ]);

  // Converter calculations
  const numInput = Math.max(0, parseFloat(convertInput) || 0);

  // Storage
  const storageGB = numInput;
  const storageMB = storageGB * 1024;
  const storageTB = storageGB / 1024;
  const storagePB = storageTB / 1024;

  // Latency & Frame times
  const latencyMS = numInput;
  const latencyUS = latencyMS * 1000;
  const latencySec = latencyMS / 1000;
  const latencyFPS = latencyMS > 0 ? (1000 / latencyMS).toFixed(1) : '0';

  // Currency (USD base)
  const currencyUSD = numInput;
  const currencyINR = Math.round(currencyUSD * 86.8);
  const currencyEUR = (currencyUSD * 0.92).toFixed(2);
  const currencyGBP = (currencyUSD * 0.79).toFixed(2);
  const currencyJPY = Math.round(currencyUSD * 153.2);

  // Salary / Compensation
  const hourlyUSD = numInput;
  const annualUSD = hourlyUSD * 40 * 52;
  const annualINR = Math.round(annualUSD * 86.8);
  const monthlyINR = Math.round(annualINR / 12);
  const inrLakhs = (annualINR / 100000).toFixed(2);

  return (
    <div
      className="ios-calculator-page"
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#000000',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        padding: '38px 16px 20px',
        boxSizing: 'border-box',
        userSelect: 'none',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif',
        zIndex: 20,
        overflow: 'hidden',
      }}
    >
      {/* Top Header Navigation */}
      <header
        className="calc-nav-bar"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '38px',
          marginBottom: '6px',
          zIndex: 10,
        }}
      >
        <button
          type="button"
          className="calc-nav-btn"
          onClick={() => {
            sound.playTapSound();
            onBack();
          }}
          aria-label="Back to Home Screen"
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            border: 'none',
            borderRadius: '20px',
            padding: '6px 12px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          <ChevronLeft size={18} />
          <span>Home</span>
        </button>

        {/* Apple Segmented Mode Control */}
        <div
          className="calc-mode-segmented"
          style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.12)',
            borderRadius: '18px',
            padding: '2px',
            gap: '2px',
          }}
        >
          <button
            type="button"
            className={`calc-seg-pill ${mode === 'standard' ? 'active' : ''}`}
            onClick={() => {
              sound.playTapSound();
              setMode('standard');
            }}
            title="Standard Calculator"
            style={{
              background: mode === 'standard' ? '#ff9f0a' : 'transparent',
              color: mode === 'standard' ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
              border: 'none',
              borderRadius: '16px',
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Standard
          </button>
          <button
            type="button"
            className={`calc-seg-pill ${mode === 'scientific' ? 'active' : ''}`}
            onClick={() => {
              sound.playTapSound();
              setMode('scientific');
            }}
            title="Max Cal: Scientific & Advanced Math"
            style={{
              background: mode === 'scientific' ? '#ff9f0a' : 'transparent',
              color: mode === 'scientific' ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
              border: 'none',
              borderRadius: '16px',
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              transition: 'all 0.15s ease',
            }}
          >
            <FlaskConical size={11} />
            <span>Max Cal</span>
          </button>
          <button
            type="button"
            className={`calc-seg-pill ${mode === 'grapher' ? 'active' : ''}`}
            onClick={() => {
              sound.playTapSound();
              setMode('grapher');
            }}
            title="iOS 18 Math Notes 2D Function Grapher"
            style={{
              background: mode === 'grapher' ? '#ff9f0a' : 'transparent',
              color: mode === 'grapher' ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
              border: 'none',
              borderRadius: '16px',
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              transition: 'all 0.15s ease',
            }}
          >
            <LineChart size={11} />
            <span>Graph</span>
          </button>
        </div>

        {/* Right utility buttons: Tape History & Converter */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            className={`calc-nav-btn ${mode === 'history' ? 'active' : ''}`}
            onClick={() => {
              sound.playTapSound();
              setMode(mode === 'history' ? 'standard' : 'history');
            }}
            title="Calculation History Tape"
            style={{
              background: mode === 'history' ? 'rgba(255, 159, 10, 0.35)' : 'rgba(255, 255, 255, 0.12)',
              border: mode === 'history' ? '1px solid #ff9f0a' : 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: mode === 'history' ? '#ff9f0a' : '#ffffff',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <Clock size={15} />
          </button>

          <button
            type="button"
            className={`calc-nav-btn ${mode === 'converter' ? 'active' : ''}`}
            onClick={() => {
              sound.playTapSound();
              setMode(mode === 'converter' ? 'standard' : 'converter');
            }}
            title="iOS 18 Math & Tech Converter"
            style={{
              background: mode === 'converter' ? 'rgba(255, 159, 10, 0.35)' : 'rgba(255, 255, 255, 0.12)',
              border: mode === 'converter' ? '1px solid #ff9f0a' : 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: mode === 'converter' ? '#ff9f0a' : '#ffffff',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <ArrowRightLeft size={15} />
          </button>
        </div>
      </header>

      {/* Main Display Area (Hidden in Grapher mode to give maximum viewport to canvas) */}
      {mode !== 'grapher' && (
        <div
          className="calc-display-container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            padding: '4px 8px 12px',
            minHeight: mode === 'scientific' ? '68px' : '96px',
            position: 'relative',
          }}
        >
          {/* Copy toast */}
          {isCopied && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(20px)',
                padding: '3px 12px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: '#34d399',
              }}
            >
              <Check size={12} />
              <span>Copied to Clipboard</span>
            </div>
          )}

          {/* Expression subtitle */}
          <div
            className="calc-formula-sub"
            style={{
              fontSize: '13px',
              color: 'rgba(255, 255, 255, 0.45)',
              marginBottom: '2px',
              fontWeight: 400,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {memory !== 0 && (
              <span
                style={{
                  fontSize: '10px',
                  background: 'rgba(255, 159, 10, 0.25)',
                  color: '#ff9f0a',
                  padding: '1px 5px',
                  borderRadius: '6px',
                  fontWeight: 700,
                }}
              >
                M: {memory}
              </span>
            )}
            <span>{expression}</span>
          </div>

          {/* Main Big Digits */}
          <div
            className="calc-main-digits"
            onClick={handleCopy}
            title="Click to copy result"
            style={{
              fontWeight: 300,
              color: '#ffffff',
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              wordBreak: 'break-all',
              textAlign: 'right',
              cursor: 'pointer',
              fontSize:
                mode === 'scientific'
                  ? display.length > 9
                    ? '32px'
                    : '44px'
                  : display.length > 9
                  ? '38px'
                  : display.length > 6
                  ? '50px'
                  : '64px',
              transition: 'font-size 0.15s ease',
            }}
          >
            {formattedDisplay}
          </div>
        </div>
      )}

      {/* --- STANDARD CALCULATOR VIEW --- */}
      {mode === 'standard' && (
        <div
          className="calc-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
            width: '100%',
            maxWidth: '330px',
            margin: 'auto auto 8px',
          }}
        >
          {/* Row 1 */}
          <button
            type="button"
            className={`calc-btn btn-fn ${activeButtonKey === 'clear' ? 'active' : ''}`}
            onClick={handleClear}
            style={btnFnStyle}
            aria-label="Clear"
          >
            {display !== '0' ? 'C' : 'AC'}
          </button>
          <button
            type="button"
            className={`calc-btn btn-fn ${activeButtonKey === '+/-' ? 'active' : ''}`}
            onClick={handleToggleSign}
            style={btnFnStyle}
            aria-label="Toggle Sign"
          >
            +/-
          </button>
          <button
            type="button"
            className={`calc-btn btn-fn ${activeButtonKey === '%' ? 'active' : ''}`}
            onClick={handlePercent}
            style={btnFnStyle}
            aria-label="Percentage"
          >
            %
          </button>
          <button
            type="button"
            className={`calc-btn btn-op ${operation === '÷' || activeButtonKey === '÷' ? 'active' : ''}`}
            onClick={() => handleOperation('÷')}
            style={operation === '÷' || activeButtonKey === '÷' ? btnOpActiveStyle : btnOpStyle}
            aria-label="Divide"
          >
            ÷
          </button>

          {/* Row 2 */}
          <button
            type="button"
            className={`calc-btn btn-num ${activeButtonKey === '7' ? 'active' : ''}`}
            onClick={() => handleDigit('7')}
            style={btnNumStyle}
          >
            7
          </button>
          <button
            type="button"
            className={`calc-btn btn-num ${activeButtonKey === '8' ? 'active' : ''}`}
            onClick={() => handleDigit('8')}
            style={btnNumStyle}
          >
            8
          </button>
          <button
            type="button"
            className={`calc-btn btn-num ${activeButtonKey === '9' ? 'active' : ''}`}
            onClick={() => handleDigit('9')}
            style={btnNumStyle}
          >
            9
          </button>
          <button
            type="button"
            className={`calc-btn btn-op ${operation === '×' || activeButtonKey === '×' ? 'active' : ''}`}
            onClick={() => handleOperation('×')}
            style={operation === '×' || activeButtonKey === '×' ? btnOpActiveStyle : btnOpStyle}
            aria-label="Multiply"
          >
            ×
          </button>

          {/* Row 3 */}
          <button
            type="button"
            className={`calc-btn btn-num ${activeButtonKey === '4' ? 'active' : ''}`}
            onClick={() => handleDigit('4')}
            style={btnNumStyle}
          >
            4
          </button>
          <button
            type="button"
            className={`calc-btn btn-num ${activeButtonKey === '5' ? 'active' : ''}`}
            onClick={() => handleDigit('5')}
            style={btnNumStyle}
          >
            5
          </button>
          <button
            type="button"
            className={`calc-btn btn-num ${activeButtonKey === '6' ? 'active' : ''}`}
            onClick={() => handleDigit('6')}
            style={btnNumStyle}
          >
            6
          </button>
          <button
            type="button"
            className={`calc-btn btn-op ${operation === '−' || activeButtonKey === '−' ? 'active' : ''}`}
            onClick={() => handleOperation('−')}
            style={operation === '−' || activeButtonKey === '−' ? btnOpActiveStyle : btnOpStyle}
            aria-label="Subtract"
          >
            −
          </button>

          {/* Row 4 */}
          <button
            type="button"
            className={`calc-btn btn-num ${activeButtonKey === '1' ? 'active' : ''}`}
            onClick={() => handleDigit('1')}
            style={btnNumStyle}
          >
            1
          </button>
          <button
            type="button"
            className={`calc-btn btn-num ${activeButtonKey === '2' ? 'active' : ''}`}
            onClick={() => handleDigit('2')}
            style={btnNumStyle}
          >
            2
          </button>
          <button
            type="button"
            className={`calc-btn btn-num ${activeButtonKey === '3' ? 'active' : ''}`}
            onClick={() => handleDigit('3')}
            style={btnNumStyle}
          >
            3
          </button>
          <button
            type="button"
            className={`calc-btn btn-op ${operation === '+' || activeButtonKey === '+' ? 'active' : ''}`}
            onClick={() => handleOperation('+')}
            style={operation === '+' || activeButtonKey === '+' ? btnOpActiveStyle : btnOpStyle}
            aria-label="Add"
          >
            +
          </button>

          {/* Row 5 */}
          <button
            type="button"
            className={`calc-btn btn-num btn-zero ${activeButtonKey === '0' ? 'active' : ''}`}
            onClick={() => handleDigit('0')}
            style={{
              ...btnNumStyle,
              gridColumn: 'span 2',
              aspectRatio: 'auto',
              borderRadius: '35px',
              justifyContent: 'flex-start',
              paddingLeft: '28px',
            }}
          >
            0
          </button>
          <button
            type="button"
            className={`calc-btn btn-num ${activeButtonKey === '.' ? 'active' : ''}`}
            onClick={handleDecimal}
            style={btnNumStyle}
          >
            .
          </button>
          <button
            type="button"
            className={`calc-btn btn-op ${activeButtonKey === '=' ? 'active' : ''}`}
            onClick={handleEquals}
            style={btnOpStyle}
            aria-label="Equals"
          >
            =
          </button>
        </div>
      )}

      {/* --- MAX CAL: SCIENTIFIC CALCULATOR VIEW --- */}
      {mode === 'scientific' && (
        <div
          className="calc-scientific-container"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '6px',
            margin: '0 auto 6px',
            width: '100%',
            maxWidth: '340px',
          }}
        >
          {/* Scientific Mode Sub-bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0 4px',
            }}
          >
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={() => {
                  sound.playTapSound();
                  setIsRad(!isRad);
                }}
                style={{
                  background: isRad ? '#ff9f0a' : 'rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '3px 8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {isRad ? 'RAD' : 'DEG'}
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playTapSound();
                  setIsSecondFunction(!isSecondFunction);
                }}
                style={{
                  background: isSecondFunction ? '#ff9f0a' : 'rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '3px 8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                2nd
              </button>
            </div>

            {/* Memory pills */}
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                type="button"
                onClick={() => handleMemory('mc')}
                style={sciMicroBtnStyle}
                title="Memory Clear"
              >
                mc
              </button>
              <button
                type="button"
                onClick={() => handleMemory('m+')}
                style={sciMicroBtnStyle}
                title="Memory Add"
              >
                m+
              </button>
              <button
                type="button"
                onClick={() => handleMemory('m-')}
                style={sciMicroBtnStyle}
                title="Memory Subtract"
              >
                m-
              </button>
              <button
                type="button"
                onClick={() => handleMemory('mr')}
                style={sciMicroBtnStyle}
                title="Memory Recall"
              >
                mr
              </button>
            </div>
          </div>

          {/* 6-Column Scientific Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '6px',
            }}
          >
            {/* Row 1 */}
            <button
              type="button"
              onClick={() => handleScientificUnary(isSecondFunction ? 'sin⁻¹' : 'sin')}
              style={sciFuncBtnStyle}
            >
              {isSecondFunction ? 'sin⁻¹' : 'sin'}
            </button>
            <button
              type="button"
              onClick={() => handleScientificUnary(isSecondFunction ? 'cos⁻¹' : 'cos')}
              style={sciFuncBtnStyle}
            >
              {isSecondFunction ? 'cos⁻¹' : 'cos'}
            </button>
            <button
              type="button"
              onClick={() => handleScientificUnary(isSecondFunction ? 'tan⁻¹' : 'tan')}
              style={sciFuncBtnStyle}
            >
              {isSecondFunction ? 'tan⁻¹' : 'tan'}
            </button>
            <button
              type="button"
              onClick={handleClear}
              style={{ ...sciFuncBtnStyle, background: '#a5a5a5', color: '#000000', fontWeight: 600 }}
            >
              {display !== '0' ? 'C' : 'AC'}
            </button>
            <button type="button" onClick={handleToggleSign} style={sciFuncBtnStyle}>
              +/-
            </button>
            <button
              type="button"
              onClick={() => handleOperation('÷')}
              style={{ ...sciFuncBtnStyle, background: '#ff9f0a', color: '#ffffff' }}
            >
              ÷
            </button>

            {/* Row 2 */}
            <button
              type="button"
              onClick={() => handleScientificUnary(isSecondFunction ? 'eˣ' : 'ln')}
              style={sciFuncBtnStyle}
            >
              {isSecondFunction ? 'eˣ' : 'ln'}
            </button>
            <button
              type="button"
              onClick={() => handleScientificUnary(isSecondFunction ? '10ˣ' : 'log₁₀')}
              style={sciFuncBtnStyle}
            >
              {isSecondFunction ? '10ˣ' : 'log₁₀'}
            </button>
            <button
              type="button"
              onClick={() => handleScientificUnary('x²')}
              style={sciFuncBtnStyle}
            >
              x²
            </button>
            <button type="button" onClick={() => handleDigit('7')} style={sciNumBtnStyle}>
              7
            </button>
            <button type="button" onClick={() => handleDigit('8')} style={sciNumBtnStyle}>
              8
            </button>
            <button type="button" onClick={() => handleDigit('9')} style={sciNumBtnStyle}>
              9
            </button>

            {/* Row 3 */}
            <button
              type="button"
              onClick={() => handleScientificUnary('√x')}
              style={sciFuncBtnStyle}
            >
              √x
            </button>
            <button
              type="button"
              onClick={() => handleOperation('^')}
              style={sciFuncBtnStyle}
            >
              xʸ
            </button>
            <button
              type="button"
              onClick={() => handleScientificUnary('1/x')}
              style={sciFuncBtnStyle}
            >
              1/x
            </button>
            <button type="button" onClick={() => handleDigit('4')} style={sciNumBtnStyle}>
              4
            </button>
            <button type="button" onClick={() => handleDigit('5')} style={sciNumBtnStyle}>
              5
            </button>
            <button
              type="button"
              onClick={() => handleOperation('×')}
              style={{ ...sciFuncBtnStyle, background: '#ff9f0a', color: '#ffffff' }}
            >
              ×
            </button>

            {/* Row 4 */}
            <button
              type="button"
              onClick={() => handleConstant('π')}
              style={sciFuncBtnStyle}
            >
              π
            </button>
            <button
              type="button"
              onClick={() => handleConstant('e')}
              style={sciFuncBtnStyle}
            >
              e
            </button>
            <button
              type="button"
              onClick={() => handleScientificUnary('x!')}
              style={sciFuncBtnStyle}
            >
              x!
            </button>
            <button type="button" onClick={() => handleDigit('1')} style={sciNumBtnStyle}>
              1
            </button>
            <button type="button" onClick={() => handleDigit('2')} style={sciNumBtnStyle}>
              2
            </button>
            <button
              type="button"
              onClick={() => handleOperation('−')}
              style={{ ...sciFuncBtnStyle, background: '#ff9f0a', color: '#ffffff' }}
            >
              −
            </button>

            {/* Row 5 */}
            <button
              type="button"
              onClick={() => handleConstant('Rand')}
              style={sciFuncBtnStyle}
            >
              Rand
            </button>
            <button
              type="button"
              onClick={() => handlePercent()}
              style={sciFuncBtnStyle}
            >
              %
            </button>
            <button type="button" onClick={() => handleDigit('0')} style={sciNumBtnStyle}>
              0
            </button>
            <button type="button" onClick={() => handleDigit('3')} style={sciNumBtnStyle}>
              3
            </button>
            <button type="button" onClick={handleDecimal} style={sciNumBtnStyle}>
              .
            </button>
            <button
              type="button"
              onClick={() => handleOperation('+')}
              style={{ ...sciFuncBtnStyle, background: '#ff9f0a', color: '#ffffff' }}
            >
              +
            </button>
          </div>

          {/* Full-width Equals Pill for Max Cal */}
          <button
            type="button"
            onClick={handleEquals}
            style={{
              width: '100%',
              height: '42px',
              borderRadius: '21px',
              background: '#ff9f0a',
              color: '#ffffff',
              border: 'none',
              fontSize: '22px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(255, 159, 10, 0.4)',
            }}
          >
            =
          </button>
        </div>
      )}

      {/* --- HISTORY TAPE DRAWER --- */}
      {mode === 'history' && (
        <div
          className="calc-history-view"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#1c1c1e',
            borderRadius: '16px',
            padding: '14px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              paddingBottom: '8px',
            }}
          >
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#ff9f0a' }}>
              Calculation Tape ({history.length})
            </span>
            <button
              type="button"
              onClick={() => {
                sound.playTapSound();
                setHistory([]);
                localStorage.removeItem('ios_calculator_history');
              }}
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                border: 'none',
                borderRadius: '8px',
                padding: '4px 8px',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              Clear Tape
            </button>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {history.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.4)',
                  fontSize: '13px',
                  marginTop: '40px',
                }}
              >
                No calculations recorded yet.
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    sound.playTapSound();
                    setDisplay(item.result);
                    setExpression(`${item.formula} =`);
                    setMode('standard');
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    transition: 'background 0.15s ease',
                  }}
                >
                  <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                    {item.formula}
                  </span>
                  <span style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff' }}>
                    = {item.result}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* --- IOS 18 MATH & TECH CONVERTER VIEW --- */}
      {mode === 'converter' && (
        <div
          className="calc-converter-view"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#1c1c1e',
            borderRadius: '16px',
            padding: '14px',
            overflowY: 'auto',
          }}
        >
          {/* Converter Category Tabs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '4px',
              marginBottom: '14px',
            }}
          >
            {(['storage', 'latency', 'currency', 'salary'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  sound.playTapSound();
                  setConverterType(t);
                  if (t === 'storage') setConvertInput('16');
                  if (t === 'latency') setConvertInput('16.67');
                  if (t === 'currency') setConvertInput('100');
                  if (t === 'salary') setConvertInput('75');
                }}
                style={{
                  background: converterType === t ? '#ff9f0a' : 'rgba(255, 255, 255, 0.08)',
                  color: converterType === t ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '6px 2px',
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  cursor: 'pointer',
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Numeric Input */}
          <div style={{ marginBottom: '14px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.45)',
                marginBottom: '4px',
                textTransform: 'uppercase',
              }}
            >
              Input Value ({converterType === 'storage' ? 'GB' : converterType === 'latency' ? 'ms' : converterType === 'salary' ? '$/hr' : 'USD'})
            </label>
            <input
              type="number"
              value={convertInput}
              onChange={(e) => setConvertInput(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 159, 10, 0.4)',
                borderRadius: '10px',
                padding: '8px 12px',
                color: '#ffffff',
                fontSize: '18px',
                fontWeight: 600,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Dynamic Conversions Result Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
            }}
          >
            {converterType === 'storage' && (
              <>
                <div style={convCardStyle}>
                  <span style={convLabelStyle}>Megabytes (MB)</span>
                  <span style={convValStyle}>{storageMB.toLocaleString()} MB</span>
                </div>
                <div style={convCardStyle}>
                  <span style={convLabelStyle}>Gigabytes (GB)</span>
                  <span style={convValStyle}>{storageGB} GB</span>
                </div>
                <div style={convCardStyle}>
                  <span style={convLabelStyle}>Terabytes (TB)</span>
                  <span style={convValStyle}>{storageTB.toFixed(4)} TB</span>
                </div>
                <div style={convCardStyle}>
                  <span style={convLabelStyle}>Petabytes (PB)</span>
                  <span style={convValStyle}>{storagePB.toExponential(3)} PB</span>
                </div>
              </>
            )}

            {converterType === 'latency' && (
              <>
                <div style={convCardStyle}>
                  <span style={convLabelStyle}>Microseconds (µs)</span>
                  <span style={convValStyle}>{latencyUS.toLocaleString()} µs</span>
                </div>
                <div style={convCardStyle}>
                  <span style={convLabelStyle}>Target FPS</span>
                  <span style={convValStyle}>{latencyFPS} FPS</span>
                </div>
                <div style={convCardStyle}>
                  <span style={convLabelStyle}>60Hz Frame Budget</span>
                  <span style={convValStyle}>16.67 ms</span>
                </div>
                <div style={convCardStyle}>
                  <span style={convLabelStyle}>120Hz ProMotion</span>
                  <span style={convValStyle}>8.33 ms</span>
                </div>
              </>
            )}

            {converterType === 'currency' && (
              <>
                <div style={convCardStyle}>
                  <span style={convLabelStyle}>Indian Rupee (₹)</span>
                  <span style={convValStyle}>₹{currencyINR.toLocaleString()}</span>
                </div>
                <div style={convCardStyle}>
                  <span style={convLabelStyle}>Euro (€)</span>
                  <span style={convValStyle}>€{currencyEUR}</span>
                </div>
                <div style={convCardStyle}>
                  <span style={convLabelStyle}>British Pound (£)</span>
                  <span style={convValStyle}>£{currencyGBP}</span>
                </div>
                <div style={convCardStyle}>
                  <span style={convLabelStyle}>Japanese Yen (¥)</span>
                  <span style={convValStyle}>¥{currencyJPY.toLocaleString()}</span>
                </div>
              </>
            )}

            {converterType === 'salary' && (
              <>
                <div style={convCardStyle}>
                  <span style={convLabelStyle}>Annual USD CTC</span>
                  <span style={convValStyle}>${annualUSD.toLocaleString()}</span>
                </div>
                <div style={convCardStyle}>
                  <span style={convLabelStyle}>Annual INR CTC</span>
                  <span style={convValStyle}>₹{inrLakhs} Lakhs</span>
                </div>
                <div style={convCardStyle}>
                  <span style={convLabelStyle}>Monthly INR</span>
                  <span style={convValStyle}>₹{monthlyINR.toLocaleString()}</span>
                </div>
                <div style={convCardStyle}>
                  <span style={convLabelStyle}>Hourly Rate</span>
                  <span style={convValStyle}>${hourlyUSD}/hr</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* --- IOS 18 MATH NOTES 2D FUNCTION GRAPHER VIEW --- */}
      {mode === 'grapher' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
          <MathNotesGrapher onBack={() => setMode('standard')} />
        </div>
      )}
    </div>
  );
}

// Styling Constants
const btnBaseStyle: React.CSSProperties = {
  aspectRatio: '1',
  borderRadius: '50%',
  border: 'none',
  fontSize: '24px',
  fontWeight: 400,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 0.1s ease, filter 0.15s ease',
  userSelect: 'none',
};

const btnFnStyle: React.CSSProperties = {
  ...btnBaseStyle,
  background: '#a5a5a5',
  color: '#000000',
  fontWeight: 500,
};

const btnNumStyle: React.CSSProperties = {
  ...btnBaseStyle,
  background: '#333333',
  color: '#ffffff',
};

const btnOpStyle: React.CSSProperties = {
  ...btnBaseStyle,
  background: '#ff9f0a',
  color: '#ffffff',
  fontSize: '26px',
};

const btnOpActiveStyle: React.CSSProperties = {
  ...btnBaseStyle,
  background: '#ffffff',
  color: '#ff9f0a',
  fontSize: '26px',
};

const sciFuncBtnStyle: React.CSSProperties = {
  height: '36px',
  borderRadius: '18px',
  background: '#2c2c2e',
  color: '#ffffff',
  border: 'none',
  fontSize: '12px',
  fontWeight: 500,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const sciNumBtnStyle: React.CSSProperties = {
  height: '36px',
  borderRadius: '18px',
  background: '#3a3a3c',
  color: '#ffffff',
  border: 'none',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const sciMicroBtnStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.12)',
  color: 'rgba(255, 255, 255, 0.8)',
  border: 'none',
  borderRadius: '10px',
  padding: '3px 6px',
  fontSize: '10px',
  fontWeight: 600,
  cursor: 'pointer',
};

const convCardStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '10px',
  padding: '10px',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
};

const convLabelStyle: React.CSSProperties = {
  fontSize: '11px',
  color: 'rgba(255, 255, 255, 0.5)',
};

const convValStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 600,
  color: '#ffffff',
};
