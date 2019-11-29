describe('sum test', () => {
  function sum(a, b) {
    return a + b;
  }
  test('sum add', () => {
    expect(sum(1, 2)).toBe(3);
    expect(sum(4, 2)).toBe(6);
  })
})
