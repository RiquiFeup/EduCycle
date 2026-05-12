import { sortListingsData } from '../../../src/utils/sorting';

describe('Pure Unit Tests: sortListingsData', () => {
  const mockData = [
    { id: '1', title: 'Calculus', price: '20' },
    { id: '2', title: 'Algebra', price: '10' },
    { id: '3', title: 'Physics', price: null }, // Empty field
  ];

  it('sorts alphabetically by Title (Ascending)', () => {
    const result = sortListingsData(mockData, 'Title', 'asc');
    expect(result[0].title).toBe('Algebra');
    expect(result[1].title).toBe('Calculus');
    expect(result[2].title).toBe('Physics');
  });

  it('sorts numerically by Price (Descending)', () => {
    const result = sortListingsData(mockData, 'Price', 'desc');
    expect(result[0].price).toBe('20');
    expect(result[1].price).toBe('10');
    expect(result[2].price).toBeNull(); // Empty field pushed to bottom
  });

  it('pushes empty prices to the bottom regardless of direction', () => {
    const result = sortListingsData(mockData, 'Price', 'asc');
    expect(result[0].price).toBe('10');
    expect(result[1].price).toBe('20');
    expect(result[2].title).toBe('Physics'); // The one with no price is last
  });
});