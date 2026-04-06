export class CacheService {
  static set(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Erro ao salvar em cache: ${key}`, error);
    }
  }

  static get<T = any>(key: string, defaultValue: T | null = null): T | null {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
      console.error(`Erro ao ler do cache: ${key}`, error);
      return defaultValue;
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Erro ao remover do cache: ${key}`, error);
    }
  }

  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Erro ao limpar cache', error);
    }
  }

  static exists(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}
