// App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('App Routing', () => {
  test('renders Home page on default route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/home/i)).toBeInTheDocument(); // Update this text based on your actual Home page
  });

  test('renders Login page on /login route', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/login/i)).toBeInTheDocument(); // Update based on actual content
  });

  test('renders NotFound page on unknown route', () => {
    render(
      <MemoryRouter initialEntries={['/some-random-route']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/not found/i)).toBeInTheDocument(); // Update as per your NotFound content
  });
});
