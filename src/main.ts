import { AuthService } from '@infrastructure/auth/AuthService';
import './styles/index.css';

/**
 * Entry point da aplicação
 * Inicializa Firebase, autenção e rota para home
 */

function setupAuth(): void {
  const loginScreen = document.getElementById('login-screen');
  const appContainer = document.getElementById('app');
  const loginBtn = document.getElementById('login-btn');

  // Monitorar mudanças de autenticação
  AuthService.onAuthStateChange((user) => {
    (window as any).__AUTH_READY = true;

    if (user) {
      // Usuário autenticado
      if (loginScreen) loginScreen.style.display = 'none';
      if (appContainer) appContainer.style.display = 'flex';
      console.log('Usuário autenticado:', user.email);
      // TODO: Inicializar router aqui
    } else {
      // Usuário não autenticado
      if (loginScreen) loginScreen.style.display = 'flex';
      if (appContainer) appContainer.style.display = 'none';
    }
  });

  // Botão de login
  if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
      try {
        await AuthService.signInWithGoogle();
      } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Erro ao fazer login. Tente novamente.');
      }
    });
  }

  // Fallback: se auth não estiver pronto em 5s, mostrar login
  setTimeout(() => {
    if (!(window as any).__AUTH_READY) {
      if (loginScreen && loginScreen.style.display === '') {
        loginScreen.style.display = 'flex';
      }
    }
  }, 5000);
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', setupAuth);

// Register service worker para PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch((err) => {
    console.log('Service Worker registration failed:', err);
  });
}
