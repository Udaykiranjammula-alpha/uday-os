import React, { useState } from 'react';
import {
  ChevronLeft,
  ArrowRightLeft,
  Delete,
  X,
  Sparkles,
  DollarSign,
  HardDrive,
  Cpu,
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

  // Converter state
  const [converterType, setConverterType] = useState<'storage' | 'latency' | 'salary'>('storage');
  const [convertInput, setConvertInput] = useState('16');

  const handleDigit = (digit: string) => {
    sound.playTapSound();
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const handleDecimal = () => {
    sound.playTapSound();
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleClear = () => {
    sound.playTapSound();
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const handleToggleSign = () => {
    sound.playTapSound();
    const val = parseFloat(display);
    setDisplay((val * -1).toString());
  };

  const handlePercent = () => {
    sound.playTapSound();
    const val = parseFloat(display);
    setDisplay((val / 100).toString());
  };

  const handleOperation = (nextOp: string) => {
    sound.playTapSound();
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operation) {
      const currentValue = prevValue || 0;
      let newValue = currentValue;

      switch (operation) {
        case '+':
          newValue = currentValue + inputValue;
          break;
        case '−':
          newValue = currentValue - inputValue;
          break;
        case '×':
          newValue = currentValue * inputValue;
          break;
        case '÷':
          newValue = inputValue !== 0 ? currentValue / inputValue : 0;
          break;
        default:
          break;
      }

      setPrevValue(newValue);
      setDisplay(newValue.toString());
    }

    setWaitingForOperand(true);
    setOperation(nextOp);
  };

  const handleEquals = () => {
    sound.playTapSound();
    const inputValue = parseFloat(display);
    if (prevValue === null || operation === null) return;

    let newValue = prevValue;
    switch (operation) {
      case '+':
        newValue = prevValue + inputValue;
        break;
      case '−':
        newValue = prevValue - inputValue;
        break;
      case '×':
        newValue = prevValue * inputValue;
        break;
      case '÷':
        newValue = inputValue !== 0 ? prevValue / inputValue : 0;
        break;
      default:
        break;
    }

    setDisplay(newValue.toString());
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  // Conversions calculator helpers
  const numInput = parseFloat(convertInput) || 0;
  const storageGB = numInput;
  const storageMB = storageGB * 1024;
  const storageTB = storageGB / 1024;

  const latencyMS = numInput;
  const latencyUS = latencyMS * 1000;
  const latencySec = latencyMS / 1000;

  const hourlyUSD = numInput;
  const annualUSD = hourlyUSD * 40 * 52;
  const annualINR = Math.round(annualUSD * 86.5);

  return (
    <div className="ios-calculator-page">
      {/* Top Header */}
      <header className="calc-header">
        <button
          type="button"
          className="mail-nav-back-pill"
          onClick={onBack}
          aria-label="Back to Home"
        >
          <ChevronLeft size={18} />
          <span>Home</span>
        </button>

        <span className="calc-page-title">Calculator</span>

        <button
          type="button"
          className={`calc-converter-pill ${showConverter ? 'active' : ''}`}
          onClick={() => setShowConverter(!showConverter)}
          title="iOS 18 Math & Tech Converter"
        >
          <ArrowRightLeft size={16} />
        </button>
      </header>

      {/* Main Calculator Screen */}
      <div className="calc-main-body">
        {/* Dynamic Display Area */}
        <div className="calc-display-wrap">
          <div className="calc-prev-calc">
            {prevValue !== null && operation ? `${prevValue} ${operation}` : ''}
          </div>
          <div className={`calc-display-digits ${display.length > 8 ? 'shrink' : ''}`}>
            {display}
          </div>
        </div>

        {/* Circular Keypad Grid matching authentic Apple iOS */}
        <div className="calc-keypad-grid">
          {/* Row 1 */}
          <button
            type="button"
            className="calc-btn gray-top"
            onClick={handleClear}
          >
            {display !== '0' ? 'C' : 'AC'}
          </button>
          <button
            type="button"
            className="calc-btn gray-top"
            onClick={handleToggleSign}
          >
            +/-
          </button>
          <button
            type="button"
            className="calc-btn gray-top"
            onClick={handlePercent}
          >
            %
          </button>
          <button
            type="button"
            className={`calc-btn orange-op ${operation === '÷' ? 'active' : ''}`}
            onClick={() => handleOperation('÷')}
          >
            ÷
          </button>

          {/* Row 2 */}
          <button type="button" className="calc-btn dark-num" onClick={() => handleDigit('7')}>
            7
          </button>
          <button type="button" className="calc-btn dark-num" onClick={() => handleDigit('8')}>
            8
          </button>
          <button type="button" className="calc-btn dark-num" onClick={() => handleDigit('9')}>
            9
          </button>
          <button
            type="button"
            className={`calc-btn orange-op ${operation === '×' ? 'active' : ''}`}
            onClick={() => handleOperation('×')}
          >
            ×
          </button>

          {/* Row 3 */}
          <button type="button" className="calc-btn dark-num" onClick={() => handleDigit('4')}>
            4
          </button>
          <button type="button" className="calc-btn dark-num" onClick={() => handleDigit('5')}>
            5
          </button>
          <button type="button" className="calc-btn dark-num" onClick={() => handleDigit('6')}>
            6
          </button>
          <button
            type="button"
            className={`calc-btn orange-op ${operation === '−' ? 'active' : ''}`}
            onClick={() => handleOperation('−')}
          >
            −
          </button>

          {/* Row 4 */}
          <button type="button" className="calc-btn dark-num" onClick={() => handleDigit('1')}>
            1
          </button>
          <button type="button" className="calc-btn dark-num" onClick={() => handleDigit('2')}>
            2
          </button>
          <button type="button" className="calc-btn dark-num" onClick={() => handleDigit('3')}>
            3
          </button>
          <button
            type="button"
            className={`calc-btn orange-op ${operation === '+' ? 'active' : ''}`}
            onClick={() => handleOperation('+')}
          >
            +
          </button>

          {/* Row 5 */}
          <button
            type="button"
            className="calc-btn dark-num wide-zero"
            onClick={() => handleDigit('0')}
          >
            0
          </button>
          <button type="button" className="calc-btn dark-num" onClick={handleDecimal}>
            .
          </button>
          <button type="button" className="calc-btn orange-op" onClick={handleEquals}>
            =
          </button>
        </div>
      </div>

      {/* iOS 18 Math & Tech Converter Drawer */}
      {showConverter && (
        <div className="calc-converter-sheet">
          <div className="sheet-drag-handle" />
          <div className="converter-header-row">
            <div className="converter-tabs-pill">
              <button
                type="button"
                className={`conv-tab ${converterType === 'storage' ? 'active' : ''}`}
                onClick={() => setConverterType('storage')}
              >
                <HardDrive size={13} />
                <span>Data</span>
              </button>
              <button
                type="button"
                className={`conv-tab ${converterType === 'latency' ? 'active' : ''}`}
                onClick={() => setConverterType('latency')}
              >
                <Cpu size={13} />
                <span>Speed</span>
              </button>
              <button
                type="button"
                className={`conv-tab ${converterType === 'salary' ? 'active' : ''}`}
                onClick={() => setConverterType('salary')}
              >
                <DollarSign size={13} />
                <span>Comp</span>
              </button>
            </div>

            <button
              type="button"
              className="conv-close-btn"
              onClick={() => setShowConverter(false)}
            >
              <X size={15} />
            </button>
          </div>

          <div className="converter-input-wrap">
            <span className="conv-input-label">INPUT VALUE</span>
            <input
              type="number"
              value={convertInput}
              onChange={(e) => setConvertInput(e.target.value)}
              className="conv-text-input"
            />
          </div>

          <div className="converter-results-grid">
            {converterType === 'storage' && (
              <>
                <div className="conv-card">
                  <small>Megabytes (MB)</small>
                  <strong>{storageMB.toLocaleString()} MB</strong>
                </div>
                <div className="conv-card highlight">
                  <small>Gigabytes (GB)</small>
                  <strong>{storageGB.toLocaleString()} GB</strong>
                </div>
                <div className="conv-card">
                  <small>Terabytes (TB)</small>
                  <strong>{storageTB.toFixed(3)} TB</strong>
                </div>
              </>
            )}

            {converterType === 'latency' && (
              <>
                <div className="conv-card">
                  <small>Microseconds (µs)</small>
                  <strong>{latencyUS.toLocaleString()} µs</strong>
                </div>
                <div className="conv-card highlight">
                  <small>Milliseconds (ms)</small>
                  <strong>{latencyMS.toLocaleString()} ms</strong>
                </div>
                <div className="conv-card">
                  <small>Seconds (s)</small>
                  <strong>{latencySec.toFixed(3)} s</strong>
                </div>
              </>
            )}

            {converterType === 'salary' && (
              <>
                <div className="conv-card">
                  <small>Hourly Rate</small>
                  <strong>${hourlyUSD} / hr</strong>
                </div>
                <div className="conv-card highlight">
                  <small>Annual CTC (USD)</small>
                  <strong>${annualUSD.toLocaleString()} / yr</strong>
                </div>
                <div className="conv-card">
                  <small>Annual CTC (INR)</small>
                  <strong>₹{annualINR.toLocaleString()}</strong>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
