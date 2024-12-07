import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../context/ThemeContext';
import ChildminderDashboard from '../ChildminderDashboard';

// Mock child components
jest.mock('../../components/common/WelcomeBanner', () => {
  return function MockWelcomeBanner(props) {
    return <div data-testid="welcome-banner">Welcome {props.userName}</div>;
  };
});

jest.mock('../childminder/OverviewPage', () => () => <div>Overview Page</div>);
jest.mock('../childminder/AvailabilityPage', () => () => <div>Availability Page</div>);
jest.mock('../childminder/MessagesPage', () => () => <div>Messages Page</div>);
jest.mock('../childminder/BookingsPage', () => () => <div>Bookings Page</div>);
jest.mock('../childminder/ReviewsPage', () => () => <div>Reviews Page</div>);
jest.mock('../childminder/ProfilePage', () => () => <div>Profile Page</div>);

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        {component}
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('ChildminderDashboard', () => {
  test('renders welcome banner', () => {
    renderWithRouter(<ChildminderDashboard />);
    expect(screen.getByTestId('welcome-banner')).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    renderWithRouter(<ChildminderDashboard />);
    expect(screen.getByText('Dashboard Overview')).toBeInTheDocument();
    expect(screen.getByText('Availability Calendar')).toBeInTheDocument();
    expect(screen.getByText('Bookings')).toBeInTheDocument();
    expect(screen.getByText('Messages')).toBeInTheDocument();
    expect(screen.getByText('Reviews & Ratings')).toBeInTheDocument();
    expect(screen.getByText('Profile Settings')).toBeInTheDocument();
  });

  test('navigation links are clickable and change content', () => {
    renderWithRouter(<ChildminderDashboard />);
    
    // Click Availability Calendar link
    fireEvent.click(screen.getByText('Availability Calendar'));
    expect(screen.getByText('Availability Page')).toBeInTheDocument();
    
    // Click Messages link
    fireEvent.click(screen.getByText('Messages'));
    expect(screen.getByText('Messages Page')).toBeInTheDocument();
  });
});