import * as validation from '../utils/validation';

describe('integer validation tests', () => {
  it('0 is an integer', () => expect(validation.isInteger("0")).toBe(true));
  it('undefined is an integer', () => expect(validation.isInteger(undefined)).toBe(false));
  it('1 is an integer', () => expect(validation.isInteger("1")).toBe(true));
  it('-1 is an integer', () => expect(validation.isInteger("-1")).toBe(true));
  it('10 000 000 000 is an integer', () => expect(validation.isInteger("10000000000")).toBe(false));
  it('1.1 is an integer', () => expect(validation.isInteger("1.1")).toBe(false));
  it('toto is an integer', () => expect(validation.isInteger("toto")).toBe(false));
  it('01 is an integer', () => expect(validation.isInteger("01")).toBe(false));
});

describe('long validation tests', () => {
  it('0 is an long', () => expect(validation.isLong("0")).toBe(true));
  it('undefined is an long', () => expect(validation.isLong(undefined)).toBe(false));
  it('1 is an long', () => expect(validation.isLong("1")).toBe(true));
  it('-1 is an long', () => expect(validation.isLong("-1")).toBe(true));
  it('10 000 000 000 is an long', () => expect(validation.isLong("10000000000")).toBe(true));
  it('1.1 is an long', () => expect(validation.isLong("1.1")).toBe(false));
  it('toto is an long', () => expect(validation.isLong("toto")).toBe(false));
  it('01 is an long', () => expect(validation.isLong("01")).toBe(false));
});

describe('double validation tests', () => {
  it('0 is an double', () => expect(validation.isDouble("0")).toBe(true));
  it('undefined is an double', () => expect(validation.isDouble(undefined)).toBe(false));
  it('1 is an double', () => expect(validation.isDouble("1")).toBe(true));
  it('-1 is an double', () => expect(validation.isDouble("-1")).toBe(true));
  it('10 000 000 000 is an double', () => expect(validation.isDouble("10000000000")).toBe(false));
  it('1.1 is an double', () => expect(validation.isDouble("1.1")).toBe(true));
  it('toto is an double', () => expect(validation.isDouble("toto")).toBe(false));
  it('01 is an double', () => expect(validation.isDouble("01")).toBe(false));

  it('1e8 is an double', () => expect(validation.isDouble("1e8")).toBe(true));
  it('-1e8 is an double', () => expect(validation.isDouble("-1e8")).toBe(true));
  it('1e-8 is an double', () => expect(validation.isDouble("1e-8")).toBe(true));
  it('-1e8 is an double', () => expect(validation.isDouble("1e-8")).toBe(true));
});