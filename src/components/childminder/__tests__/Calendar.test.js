import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '../../../context/ThemeContext';
import Calendar from '../Calendar';

const renderCalendar = () => {
  return render(
    <ThemeProvider>
      <Calendar />
    </ThemeProvider>
  );
};

describe('Calendar Component', () => {
  beforeEach(() => {
    // Mock current date to ensure consistent testing
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2024, 0, 1)); // January 1, 2024
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders current month and year', () => {
    renderCalendar();
    expect(screen.getByText('January 2024')).toBeInTheDocument();
  });

  test('renders weekday headers', () => {
    renderCalendar();
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    weekdays.forEach(day => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  test('renders navigation buttons', () => {
    renderCalendar();
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  test('renders time slots', () => {
    renderCalendar();
    // Check if at least one time slot is rendered
    expect(screen.getByText('09:00')).toBeInTheDocument();
  });

  test('time slots are clickable and toggle selection', () => {
    renderCalendar();
    const timeSlot = screen.getByText('09:00');
    
    // Initial state
    expect(timeSlot).not.toHaveClass('bg-blue-600');
    
    // Click to select
    fireEvent.click(timeSlot);
    expect(timeSlot).toHaveClass('bg-blue-600');
    
    // Click to deselect
    fireEvent.click(timeSlot);
    expect(timeSlot).not.toHaveClass('bg-blue-600');
  });

  test('renders weekly schedule setup', () => {
    renderCalendar();
    expect(screen.getByText('Set Weekly Schedule')).toBeInTheDocument();
    
    // Check if weekday schedule inputs are rendered
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].forEach(day => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  test('weekly schedule time selects are functional', () => {
    renderCalendar();
    const timeSelects = screen.getAllByRole('combobox');
    expect(timeSelects.length).toBeGreaterThan(0);
    
    // Test time selection
    fireEvent.change(timeSelects[0], { target: { value: '10:00' } });
    expect(timeSelects[0].value).toBe('10:00');
  });
});