import { addInt, addFloat, half, double, repeat } from './utils';

export function number2Memory(num: number | string) {
  num = typeof num === 'number' ? String(num) : num;
  let sign: string = '0';
  if (num[0] === '-') {
    sign = '1';
    num = num.slice(1);
  }

  const num_splits = num.split('.');

  // calc binary int.float
  let b_int: string = '';
  let b_float: string = '';

  let int: string = num_splits[0];
  let int_n: string;
  while(int !== '0') {
    int_n = half(int);
    const splits = int_n.split('.');
    b_int = (splits[1] ? '1' : '0') + b_int;
    int = splits[0];
  }

  if (b_int.length > 53) {
    // int 52-bit carry
    if (b_int[53] === '0') {
      b_int = `${b_int.slice(0, 53)}${repeat('0', b_int.length - 53)}`;
    } else {
      let i = 53;
      while(--i >= 0) {
        if (b_int[i] === '0') {
          b_int = `${b_int.slice(0, i)}1${repeat('0', b_int.length - i - 1)}`;
          break;
        } else {
          b_int = `${b_int.slice(0, i)}${repeat('0', b_int.length - i)}`;
        }
      }
    }
  } else { // ignore float when int is 52-bit enough
    let float: string = num_splits[1];
    let float_eff_existed: boolean = Boolean(b_int);
    // max effective length 52
    let float_eff_len: number = float_eff_existed ? b_int.length - 1 : 0;
    // 53 position carry
    let float_carry: string = '0';
    let n: string;
    let t: string;
    while(float) {
      n = double(`0.${float}`);
      const splits = n.split('.');
      if (float_eff_len >= 52) {
        float_carry = splits[0];
        break;
      } else {
        t = splits[0];
        b_float += t;
        float = splits[1];
        if (float_eff_existed) {
          float_eff_len++;
        } else if (t === '1') {
          float_eff_existed = true;
        }
      }
    }
  
    // calc 53 position carry
    if (float_carry === '1') {
      let i = b_float.length;
      while(--i >= 0) {
        if (b_float[i] === '0') {
          b_float = `${b_float.slice(0, i)}1${b_float.slice(i + 1)}`;
          break;
        } else {
          b_float = `${b_float.slice(0, i)}0${b_float.slice(i + 1)}`;
        }
      }
    }
  }

  let exp: number;
  let mant: string;
  if (b_int) {
    exp = b_int.length - 1;
    mant = `${b_int.slice(1)}${b_float}`;
  } else {
    exp = -1;
    while(true) {
      if (b_float[0] === '1' || !b_float) {
        break;
      }
      exp -= 1;
      b_float = b_float.slice(1);
    }
    mant = b_float.slice(1);
  }

  // exp to binary
  exp = Math.min(exp + 1024, 2047);
  let b_exp: string = '';
  while(exp > 0) {
    b_exp = (exp % 2) + b_exp;
    exp = Math.floor(exp / 2);
  }

  // repeat 11 exp
  if (b_exp.length < 11) {
    b_exp = `${repeat('0', 11 - b_exp.length)}${b_exp}`;
  }

  // repeat 52 mant
  if (mant.length < 52) {
    mant = `${mant}${repeat('0', 52 - mant.length)}`;
  } else if (mant.length > 52) {
    mant = mant.slice(0, 52);
  }

  return `${sign}${b_exp}${mant}`;
}

export function memory2Number(mem: string) {
  const mem_sign = mem.slice(0, 1);
  const mem_exp = mem.slice(1, 12);
  const mem_mant = mem.slice(12);

  const sign = mem_sign === '1' ? '-' : '';

  const exp = parseInt(mem_exp, 2) - 1024;
  let b_int: string;
  let b_float: string;
  if (exp > 0) {
    if (exp > mem_mant.length) {
      b_int = `1${mem_mant}${repeat('0', exp - mem_mant.length)}`;
      b_float = '0';
    } else {
      b_int = `1${mem_mant.slice(0, exp)}`;
      b_float = mem_mant.slice(exp);
    }
  } else if (exp < 0) {
    b_int = '0';
    b_float = `${repeat('0', -exp - 1)}1${mem_mant}`;
  } else {
    b_int = '1';
    b_float = mem_mant;
  }

  // calc positive exponent
  let int: string = '0';
  let int_i = b_int.length;
  let positive = '1';
  while (--int_i >= 0) {
    if (b_int[int_i] !== '0') {
      int = addInt(int, positive);
    }
    positive = double(positive);
  }

  // calc negative exponent
  let float: string = '0';
  let float_i = -1;
  let negative = '0.5';
  while (++float_i < b_float.length) {
    if (b_float[float_i] !== '0') {
      float = addFloat(float, negative);
    }
    negative = half(negative);
  }
  float = float.slice(2);
  if (float) {
    return `${sign}${int}.${float}`;
  }
  return `${sign}${int}`;
}
