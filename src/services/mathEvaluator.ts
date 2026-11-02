export interface MathResult {
  expression: string;
  result: string;
}

export interface ConversionResult {
  title: string;
  result: string;
  unit: string;
}

export interface ActionShortcutResult {
  id: string;
  type: 'action';
  title: string;
  subtitle: string;
  route?: string;
  actionPayload?: string;
}

export class MathEvaluator {
  public evaluateMath(expr: string): MathResult | null {
    if (!expr) return null;
    const trimmed = expr.trim();
    if (!trimmed) return null;

    // 1. Percentage expressions: e.g. 15% of 80, 20% of 250
    const pctMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*%\s*of\s*(\d+(?:\.\d+)?)$/i);
    if (pctMatch) {
      const pct = parseFloat(pctMatch[1]);
      const base = parseFloat(pctMatch[2]);
      const res = (pct / 100) * base;
      return {
        expression: trimmed,
        result: Number.isInteger(res) ? res.toString() : res.toFixed(2),
      };
    }

    // 2. Square root: e.g. sqrt(256), sqrt(144)
    const sqrtMatch = trimmed.match(/^sqrt\s*\(\s*(-?\d+(?:\.\d+)?)\s*\)$/i);
    if (sqrtMatch) {
      const val = parseFloat(sqrtMatch[1]);
      if (val < 0) return null; // Disallow imaginary numbers
      const res = Math.sqrt(val);
      return {
        expression: trimmed,
        result: Number.isInteger(res) ? res.toString() : res.toFixed(4),
      };
    }

    // 3. Exponentiation / Power: e.g. 2^16, 2^8
    const powMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*\^\s*(\d+(?:\.\d+)?)$/);
    if (powMatch) {
      const base = parseFloat(powMatch[1]);
      const exp = parseFloat(powMatch[2]);
      const res = Math.pow(base, exp);
      return {
        expression: trimmed,
        result: res.toLocaleString(),
      };
    }

    // 4. Basic arithmetic: 128 * 64, 45 + 55, 1000 / 8, 250 - 42
    if (/^[0-9+\-*/. ()]+$/.test(trimmed) && /[+\-*/]/.test(trimmed)) {
      // Disallow consecutive operators like + *
      if (/[+\-*/]{2,}/.test(trimmed.replace(/\s+/g, ''))) {
        return null;
      }

      try {
        const sanitized = trimmed.replace(/[^0-9+\-*/. ()]/g, '');
        const evalVal = Function(`"use strict"; return (${sanitized})`)();
        if (typeof evalVal === 'number' && !isNaN(evalVal) && isFinite(evalVal)) {
          return {
            expression: trimmed,
            result: Number.isInteger(evalVal) ? evalVal.toLocaleString() : evalVal.toFixed(2),
          };
        }
      } catch {
        return null;
      }
    }

    return null;
  }

  public evaluateConversion(query: string): ConversionResult | null {
    if (!query) return null;
    const q = query.toLowerCase().trim();
    if (!q) return null;

    // 1. Storage conversions: e.g. 16 gb in mb, 1 tb in gb
    const storageMatch = q.match(/^(\d+(?:\.\d+)?)\s*(gb|tb|mb|kb)\s+in\s+(mb|gb|kb|b)$/);
    if (storageMatch) {
      const val = parseFloat(storageMatch[1]);
      const from = storageMatch[2];
      const to = storageMatch[3];
      const bytesPerUnit: Record<string, number> = {
        b: 1,
        kb: 1024,
        mb: 1024 ** 2,
        gb: 1024 ** 3,
        tb: 1024 ** 4,
      };
      const totalBytes = val * bytesPerUnit[from];
      const converted = totalBytes / bytesPerUnit[to];
      return {
        title: `${val} ${from.toUpperCase()} to ${to.toUpperCase()}`,
        result: `${converted.toLocaleString()} ${to.toUpperCase()}`,
        unit: to.toUpperCase(),
      };
    }

    // 2. Latency to Target FPS: e.g. 16.67 ms in fps, 100 ms in fps
    const fpsMatch = q.match(/^(\d+(?:\.\d+)?)\s*ms\s+in\s+fps$/);
    if (fpsMatch) {
      const ms = parseFloat(fpsMatch[1]);
      const fps = ms > 0 ? Math.round(1000 / ms) : 0;
      return {
        title: `${ms}ms Frame Latency`,
        result: `${fps} FPS`,
        unit: 'FPS',
      };
    }

    // 3. Compensation Benchmark: e.g. salary 150k
    const salaryMatch = q.match(/^salary\s+(\d+(?:\.\d+)?)\s*k$/);
    if (salaryMatch) {
      const thousands = parseFloat(salaryMatch[1]);
      const usdAnnual = thousands * 1000;
      const inrPeg = Math.round(usdAnnual * 83.5);
      return {
        title: `Compensation Benchmark: $${thousands}k/yr`,
        result: `₹${(inrPeg / 100000).toFixed(1)} Lakhs INR / $${(usdAnnual / 12).toFixed(0)}/mo`,
        unit: 'USD/INR',
      };
    }

    // 4. Currency conversion: 100 usd in inr
    const currMatch = q.match(/^(\d+(?:\.\d+)?)\s*usd\s+in\s+inr$/);
    if (currMatch) {
      const usd = parseFloat(currMatch[1]);
      const inr = Math.round(usd * 83.5);
      return {
        title: `$${usd} USD to INR`,
        result: `₹${inr.toLocaleString()} INR`,
        unit: 'INR',
      };
    }

    return null;
  }

  public evaluateActionShortcuts(query: string): ActionShortcutResult | null {
    if (!query) return null;
    const q = query.toLowerCase().trim();

    if (q === 'take photo' || q === 'camera' || q === 'photo') {
      return {
        id: 'act-camera',
        type: 'action',
        title: 'Open Camera',
        subtitle: 'Launch authentic 48MP Fusion Camera',
        route: 'camera',
      };
    }
    if (q === 'hire' || q === 'email' || q === 'contact') {
      return {
        id: 'act-mail',
        type: 'action',
        title: 'Email Uday Kiran',
        subtitle: 'Compose pre-filled recruiter inquiry',
        route: 'contact',
      };
    }
    if (q === 'dark' || q === 'black' || q === 'finish black') {
      return {
        id: 'act-dark',
        type: 'action',
        title: 'Switch Chassis: Titanium Black',
        subtitle: 'Apply Black Titanium PVD finish',
        actionPayload: 'titanium-black',
      };
    }
    if (q === 'orange' || q === 'desert' || q === 'finish desert') {
      return {
        id: 'act-desert',
        type: 'action',
        title: 'Switch Chassis: Desert Titanium',
        subtitle: 'Apply Desert Titanium gold finish',
        actionPayload: 'titanium-desert',
      };
    }
    if (q === 'torch' || q === 'flashlight') {
      return {
        id: 'act-torch',
        type: 'action',
        title: 'Toggle Flashlight',
        subtitle: 'Trigger Dynamic Island LED torch pulse',
        actionPayload: 'toggle-torch',
      };
    }
    if (q === 'music' || q === 'play music') {
      return {
        id: 'act-music',
        type: 'action',
        title: 'Play Ambient Audio',
        subtitle: 'Stream Cupertino Lo-Fi audio',
        route: 'music',
      };
    }
    return null;
  }
}

export const mathEvaluator = new MathEvaluator();
