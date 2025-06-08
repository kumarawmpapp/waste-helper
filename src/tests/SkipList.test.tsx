import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SkipList from '../components/SkipList';

// Mock fetch
global.fetch = jest.fn();

const mockSkipData = [
  {
    id: '1',
    size: '6 Yard',
    hire_period_days: 7,
    price_before_vat: 100,
    vat: 20,
    description: 'Small skip for household waste',
    availability: 'Available'
  },
  {
    id: '2',
    size: '8 Yard',
    hire_period_days: 14,
    price_before_vat: 150,
    vat: 30,
    description: 'Medium skip for garden waste',
    availability: 'Available'
  }
];

describe('SkipList Component', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  test('renders loading state initially', () => {
    (fetch as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<SkipList />);
    
    expect(screen.getByText('Skip Hire - Lowestoft (NR32)')).toBeInTheDocument();
    expect(screen.getAllByTestId('loading-skeleton')).toHaveLength(6);
  });

  test('displays skip data after successful fetch', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSkipData,
    });

    render(<SkipList />);

    await waitFor(() => {
      expect(screen.getByText('6 Yard Skip')).toBeInTheDocument();
      expect(screen.getByText('8 Yard Skip')).toBeInTheDocument();
    });

    expect(screen.getByText('£120.00')).toBeInTheDocument(); // 100 + 20
    expect(screen.getByText('£180.00')).toBeInTheDocument(); // 150 + 30
  });

  test('handles API error gracefully', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<SkipList />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load skip data')).toBeInTheDocument();
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  test('filters skips based on search input', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSkipData,
    });

    render(<SkipList />);

    await waitFor(() => {
      expect(screen.getByText('6 Yard Skip')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search skips by size or description...');
    fireEvent.change(searchInput, { target: { value: '8 Yard' } });

    expect(screen.queryByText('6 Yard Skip')).not.toBeInTheDocument();
    expect(screen.getByText('8 Yard Skip')).toBeInTheDocument();
  });

  test('calculates correct total price including VAT', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [{ ...mockSkipData[0] }],
    });

    render(<SkipList />);

    await waitFor(() => {
      expect(screen.getByText('£120.00')).toBeInTheDocument();
      expect(screen.getByText('£100.00')).toBeInTheDocument(); // Before VAT
      expect(screen.getByText('VAT: £20.00')).toBeInTheDocument();
    });
  });

  test('refresh button triggers new API call', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockSkipData,
    });

    render(<SkipList />);

    await waitFor(() => {
      expect(screen.getByText('6 Yard Skip')).toBeInTheDocument();
    });

    const refreshButton = screen.getByText('Refresh');
    fireEvent.click(refreshButton);

    expect(fetch).toHaveBeenCalledTimes(2);
  });

  test('displays correct hire period and availability', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSkipData,
    });

    render(<SkipList />);

    await waitFor(() => {
      expect(screen.getByText('7 days')).toBeInTheDocument();
      expect(screen.getByText('14 days')).toBeInTheDocument();
      expect(screen.getAllByText('Available')).toHaveLength(2);
    });
  });
});