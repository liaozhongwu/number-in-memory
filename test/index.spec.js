const { number2Memory, memory2Number } = require('../dist/index');
const assert = require('assert');

describe('number2Memory', () => {
  it('should work with double', () => {
    assert.equal(number2Memory(0.1), '0011111111001001100110011001100110011001100110011001100110011010');
    assert.equal(number2Memory(0.3), '0011111111100011001100110011001100110011001100110011001100110011');
    assert.equal(number2Memory(0.5), '0011111111110000000000000000000000000000000000000000000000000000');
    assert.equal(number2Memory(1), '0100000000000000000000000000000000000000000000000000000000000000');
  });

  it('should work with big integer', () => {
    assert.equal(number2Memory(9007199254740991), '0100001101001111111111111111111111111111111111111111111111111111');
    assert.equal(number2Memory(9007199254740992), '0100001101010000000000000000000000000000000000000000000000000000');
    assert.equal(number2Memory('9007199254740993'), '0100001101010000000000000000000000000000000000000000000000000001');
    assert.equal(number2Memory('9007199254740994'), '0100001101010000000000000000000000000000000000000000000000000001');
    assert.equal(number2Memory('9007199254740995'), '0100001101010000000000000000000000000000000000000000000000000010');
  });

  it('should work with negative number', () => {
    assert.equal(number2Memory(-0.1), '1011111111001001100110011001100110011001100110011001100110011010');
  })
});

describe('memory2Number', () => {
  it('should work with value which created by number2Memory', () => {
    assert.equal(memory2Number(number2Memory(0.1)), '0.1000000000000000055511151231257827021181583404541015625');
    assert.equal(memory2Number(number2Memory(0.3)), '0.299999999999999988897769753748434595763683319091796875');
    assert.equal(memory2Number(number2Memory(0.5)), '0.5');
    assert.equal(memory2Number(number2Memory(1)), '1');
  });

  it('should work with big integer', () => {
    assert.equal(memory2Number(number2Memory(9007199254740991)), '9007199254740991');
    assert.equal(memory2Number(number2Memory(9007199254740992)), '9007199254740992');
    assert.equal(memory2Number(number2Memory('9007199254740993')), '9007199254740994');
    assert.equal(memory2Number(number2Memory('9007199254740994')), '9007199254740994');
  });

  it('should work with negative number', () => {
    assert.equal(memory2Number(number2Memory(-0.1)), '-0.1000000000000000055511151231257827021181583404541015625');
  })
})