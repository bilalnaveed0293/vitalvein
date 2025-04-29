import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext'; // Verify this path

const mockAuthContext = {
  user: null,
  login: jest.fn(),
  logout: jest.fn(),
};

jest.mock('./context/AuthContext', () => ({
  AuthProvider: ({ children }) => (
    <div>{children}</div>
  ),
  useAuth: () => mockAuthContext,
}));

describe('App Component', () => {
  test('renders Login component on "/" route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );
    // Adjust based on actual content of Login component
    expect(screen.getByText(/welcome to login/i)).toBeInTheDocument(); // Example
  });

  test('renders Register component on "/register" route', () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );
    // Adjust based on actual content of Register component
    expect(screen.getByText(/sign up/i)).toBeInTheDocument(); // Example
  });

  test('redirects to login when accessing protected route without authentication', () => {
    mockAuthContext.user = null;
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByText(/welcome to login/i)).toBeInTheDocument(); // Example
  });

  test('renders Dashboard component when user is authenticated', () => {
    mockAuthContext.user = { id: 1, name: 'Test User' };
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );
    // Adjust based on actual content of Dashboard component
    expect(screen.getByText(/your dashboard/i)).toBeInTheDocument(); // Example
  });

  test('renders DonorProfile component on "/donor-profile" route when authenticated', () => {
    mockAuthContext.user = { id: 1, name: 'Test User' };
    render(
      <MemoryRouter initialEntries={['/donor-profile']}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );
    // Adjust based on actual content of DonorProfile component
    expect(screen.getByText(/donor profile/i)).toBeInTheDocument(); // Example
  });

  test('renders NotFound component for invalid route', () => {
    render(
      <MemoryRouter initialEntries={['/invalid-route']}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );
    // Adjust based on actual content of NotFound component
    expect(screen.getByText(/page not found/i)).toBeInTheDocument(); // Example
  });
});