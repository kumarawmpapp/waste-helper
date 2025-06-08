describe('Skip Price Calculation Utils', () => {
  const formatPrice = (priceBeforeVat: number, vat: number): string => {
    const total = priceBeforeVat + vat;
    return total.toFixed(2);
  };

  test('calculates correct total price with VAT', () => {
    expect(formatPrice(100, 20)).toBe('120.00');
    expect(formatPrice(150.50, 30.10)).toBe('180.60');
    expect(formatPrice(0, 0)).toBe('0.00');
  });

  test('handles decimal places correctly', () => {
    expect(formatPrice(99.99, 19.998)).toBe('119.99');
    expect(formatPrice(50.1, 10.05)).toBe('60.15');
  });

  test('handles large numbers', () => {
    expect(formatPrice(1000, 200)).toBe('1200.00');
    expect(formatPrice(9999.99, 1999.998)).toBe('11999.99');
  });
});

describe('Skip Size Classification', () => {
  const getSizeColor = (size: string): string => {
    const sizeNum = parseInt(size);
    if (sizeNum <= 4) return 'bg-green-500';
    if (sizeNum <= 8) return 'bg-yellow-500';
    if (sizeNum <= 12) return 'bg-orange-500';
    return 'bg-red-500';
  };

  test('returns correct color for small skips', () => {
    expect(getSizeColor('2')).toBe('bg-green-500');
    expect(getSizeColor('4')).toBe('bg-green-500');
  });

  test('returns correct color for medium skips', () => {
    expect(getSizeColor('6')).toBe('bg-yellow-500');
    expect(getSizeColor('8')).toBe('bg-yellow-500');
  });

  test('returns correct color for large skips', () => {
    expect(getSizeColor('10')).toBe('bg-orange-500');
    expect(getSizeColor('12')).toBe('bg-orange-500');
  });

  test('returns correct color for extra large skips', () => {
    expect(getSizeColor('14')).toBe('bg-red-500');
    expect(getSizeColor('20')).toBe('bg-red-500');
  });

  test('handles non-numeric sizes gracefully', () => {
    expect(getSizeColor('Small')).toBe('bg-green-500'); // parseInt returns NaN, treated as 0
    expect(getSizeColor('Medium')).toBe('bg-green-500');
  });
});