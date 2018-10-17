/**
 * @desc add integer, no dot
 * @param a
 * @param b 
 */
export function addInt(a: string, b: string): string {
  let result = '';
  let n: number;
  let carry: number = 0;
  let i = 0;
  while (i < a.length || i < b.length) {
    i++;
    n = Number(a[a.length - i] || 0) + Number(b[b.length - i] || 0) + carry;
    carry = Math.floor(n / 10);
    result = (n % 10) + result;
  }
  if (carry > 0) {
    result = carry + result;
  }
  return result;
}

/**
 * @desc add floats which < 1
 * @param a 
 * @param b 
 */
export function addFloat(a: string, b: string): string {
  const a_float = a.substr(2);
  const b_float = b.substr(2);
  const max_float_len = Math.max(a_float.length, b_float.length);
  let result: string = '';
  let n: number;
  let carry: number = 0;
  let i = max_float_len;
  while (--i >= 0) {
    n = Number(a_float[i] || 0) + Number(b_float[i] || 0) + carry;
    carry = Math.floor(n / 10);
    result = (n % 10) + result;
  }
  return `${carry}.${result}`;
}

/**
 * @desc double a string format number
 * @param str
 */
export function double(str: string): string {
  let result: string = '';
  let n: number;
  let carry: number = 0;
  let i: number = str.length;
  while (--i >= 0) {
    if (str[i] === '.') {
      result = '.' + result;
    } else {
      n = carry + Number(str[i]) * 2;
      carry = Math.floor(n / 10);
      result = (n % 10) + result;
    }
  }
  if (carry > 0) {
    result = carry + result;
  }
  if (result.endsWith('.0')) {
    result = result.substr(0, -2);
  }
  return result;
}
/**
 * @desc half a string format number
 * @param str
 */
export function half(str: string): string {
  let result: string = '';
  let n: number;
  let carry: number = 0;
  let i: number = -1;
  while (++i < str.length) {
    if (str[i] === '.') {
      result += '.';
    } else {
      n = carry * 10 + Number(str[i]);
      carry = n % 2;
      result += Math.floor(n / 2);
    }
  }
  // carry === 1;
  if (carry > 0) {
    if (!result.includes('.')) {
      result += '.';
    }
    result += '5';
  }
  if (result[0] === '0' && result[1] !== '.') {
    result = result.substr(1);
  }
  return result;
}

/**
 * @desc get repeat of length
 */
export function repeat(str: string, len: number) {
  if (len <= 0) return '';
  return new Array(len).fill(str).join('');
}