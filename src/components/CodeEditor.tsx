import React, { useMemo, useState } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: 'python' | 'javascript';
  readOnly?: boolean;
}

export function CodeEditor({ value, onChange, language, readOnly = false }: CodeEditorProps) {
  const [activeLine, setActiveLine] = useState<number>(1);

  const lines = useMemo(() => value.split('\n'), [value]);

  // Bracket matching validation
  const bracketStatus = useMemo(() => {
    const openPairs: Record<string, string> = { '(': ')', '{': '}', '[': ']' };
    const closePairs: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
    const stack: string[] = [];

    for (const char of value) {
      if (openPairs[char]) stack.push(char);
      else if (closePairs[char]) {
        if (stack.pop() !== closePairs[char]) {
          return { isBalanced: false, count: stack.length + 1 };
        }
      }
    }
    return { isBalanced: stack.length === 0, count: stack.length };
  }, [value]);

  // Authentic Xcode syntax highlighter
  const renderHighlightedLine = (lineText: string) => {
    if (!lineText) return <span>&nbsp;</span>;

    // Check for comment
    const commentPrefix = language === 'python' ? '#' : '//';
    const commentIdx = lineText.indexOf(commentPrefix);
    let codePart = lineText;
    let commentPart = '';

    if (commentIdx !== -1) {
      codePart = lineText.slice(0, commentIdx);
      commentPart = lineText.slice(commentIdx);
    }

    const pyKeywords = new Set([
      'def', 'return', 'class', 'in', 'for', 'if', 'else', 'elif',
      'import', 'from', 'as', 'while', 'try', 'except', 'with', 'lambda',
      'None', 'True', 'False', 'not', 'and', 'or', 'is', 'pass', 'break',
    ]);

    const jsKeywords = new Set([
      'const', 'let', 'var', 'function', 'return', 'new', 'Map', 'Set',
      'for', 'of', 'if', 'else', 'while', 'class', 'import', 'export',
      'from', 'null', 'undefined', 'true', 'false', 'async', 'await',
      'typeof', 'instanceof', 'try', 'catch', 'finally', 'throw',
    ]);

    const keywords = language === 'python' ? pyKeywords : jsKeywords;

    // Tokenize line
    const tokenRegex = /(\b[a-zA-Z_]\w*\b|"[^"]*"|'[^']*'|\d+|[{}()[\];,]|=>|\S)/g;
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = tokenRegex.exec(codePart)) !== null) {
      // Add whitespace before token
      if (match.index > lastIndex) {
        elements.push(codePart.slice(lastIndex, match.index));
      }

      const token = match[0];
      let tokenClass = 'editor-token-default';

      if (keywords.has(token)) {
        tokenClass = 'editor-token-keyword';
      } else if (token.startsWith('"') || token.startsWith("'")) {
        tokenClass = 'editor-token-string';
      } else if (/^\d+$/.test(token)) {
        tokenClass = 'editor-token-number';
      } else if (['Map', 'Set', 'Array', 'String', 'Number', 'dict', 'list', 'set', 'int', 'str', 'len', 'enumerate', 'range', 'print', 'console'].includes(token)) {
        tokenClass = 'editor-token-builtin';
      } else if (['{', '}', '(', ')', '[', ']'].includes(token)) {
        tokenClass = 'editor-token-bracket';
      }

      elements.push(
        <span key={`${match.index}-${token}`} className={tokenClass}>
          {token}
        </span>
      );

      lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < codePart.length) {
      elements.push(codePart.slice(lastIndex));
    }

    if (commentPart) {
      elements.push(
        <span key="comment" className="editor-token-comment">
          {commentPart}
        </span>
      );
    }

    return elements;
  };

  const handleCursorChange = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const cursorPos = textarea.selectionStart;
    const textBefore = value.slice(0, cursorPos);
    const lineNum = textBefore.split('\n').length;
    setActiveLine(lineNum);
  };

  return (
    <div className="xcode-editor-container">
      {/* Editor Sub-Header Bar */}
      <div className="xcode-editor-meta-bar">
        <div className="xcode-editor-tabs">
          <span className="xcode-tab active">
            <span className="xcode-tab-dot" />
            {language === 'python' ? 'solution.py' : 'solution.js'}
          </span>
        </div>
        <div className="xcode-editor-telemetry">
          <span className={`xcode-bracket-pill ${bracketStatus.isBalanced ? 'balanced' : 'unbalanced'}`}>
            {bracketStatus.isBalanced ? '✓ Brackets Balanced' : '⚠ Bracket Mismatch'}
          </span>
          <span className="xcode-line-count-pill">{lines.length} lines</span>
        </div>
      </div>

      {/* Editor Main Canvas with Synchronized Line Numbers */}
      <div
        className="xcode-editor-body"
        style={{
          fontFamily: '"SF Mono", Menlo, Monaco, Consolas, "Courier New", monospace',
          fontSize: '13px',
          lineHeight: 1.6,
        }}
      >
        {/* Sequential 1-Indexed Line Numbers */}
        <div className="xcode-gutter" aria-hidden="true">
          {lines.map((_, idx) => {
            const lineNum = idx + 1;
            const isCurrent = lineNum === activeLine;
            return (
              <div
                key={lineNum}
                className={`xcode-gutter-line ${isCurrent ? 'active' : ''}`}
              >
                {lineNum}
              </div>
            );
          })}
        </div>

        {/* Code Content & Transparent Textarea Layer */}
        <div className="xcode-code-pane">
          {/* Syntax Highlighted Mirror Layer */}
          <div className="xcode-syntax-layer" aria-hidden="true">
            {lines.map((line, idx) => {
              const lineNum = idx + 1;
              const isCurrent = lineNum === activeLine;
              return (
                <div
                  key={lineNum}
                  className={`xcode-code-line ${isCurrent ? 'active-line-bg' : ''}`}
                >
                  {renderHighlightedLine(line)}
                </div>
              );
            })}
          </div>

          {/* Interactive Textarea Layer */}
          <textarea
            className="xcode-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyUp={handleCursorChange}
            onClick={handleCursorChange}
            readOnly={readOnly}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            aria-label="Code Editor Source Input"
          />
        </div>
      </div>
    </div>
  );
}
