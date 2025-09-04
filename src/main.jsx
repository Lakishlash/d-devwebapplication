// src/main.jsx
import 'semantic-ui-css/semantic.min.css';
import './theme.css';
import './styles/tokens.css';
import './styles/auth.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Wrap the app with AuthProvider
import { AuthProvider } from './auth/AuthProvider';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
