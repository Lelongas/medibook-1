import { render } from '@testing-library/react';
import App from './App';

test('renders MediBook login screen', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  expect(screen.getByText(/medibook/i)).toBeInTheDocument();  // Checks the heading
});