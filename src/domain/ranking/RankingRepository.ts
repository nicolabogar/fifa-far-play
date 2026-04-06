import { FirestoreRepository } from '@infrastructure/firestore/FirestoreRepository';
import type { Estatistica } from '@config/types';

export class RankingRepository extends FirestoreRepository<Estatistica> {
  constructor() {
    super('estatisticas');
  }

  async getByJogadorId(jogadorId: string): Promise<Estatistica | null> {
    const todos = await this.getAll();
    return todos.find((e) => e.jogadorId === jogadorId) || null;
  }

  async getTopN(n: number = 10): Promise<Estatistica[]> {
    const todos = await this.getAll();
    return todos
      .sort((a, b) => b.pontos - a.pontos)
      .slice(0, n);
  }
}

export const rankingRepository = new RankingRepository();
