import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  User
} from 'firebase/auth';
import { auth } from '@config/firebase';

export class AuthService {
  private static provider = new GoogleAuthProvider();

  static async signInWithGoogle(): Promise<User | null> {
    try {
      const result = await signInWithPopup(auth, this.provider);
      return result.user;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  }

  static async signOutUser(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  }

  static onAuthStateChange(callback: (user: User | null) => void): (() => void) {
    return onAuthStateChanged(auth, callback);
  }

  static getCurrentUser(): User | null {
    return auth.currentUser;
  }

  static isAuthenticated(): boolean {
    return auth.currentUser !== null;
  }

  static getUserEmail(): string {
    return auth.currentUser?.email || '';
  }

  static getUserId(): string {
    return auth.currentUser?.uid || '';
  }
}
