import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders app without crashing', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  // Change this to match actual text visible on your homepage
  expect(screen.getByText(/login|register|dashboard|medibook/i)).toBeInTheDocument();
});
