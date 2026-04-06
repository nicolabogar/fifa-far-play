import { orderBy } from 'firebase/firestore';
import { FirestoreRepository } from '@infrastructure/firestore/FirestoreRepository';
import type { Torneio } from '@config/types';

export class TorneioRepository extends FirestoreRepository<Torneio> {
  constructor() {
    super('torneios');
  }

  async getAllOrdered(): Promise<Torneio[]> {
    return this.getAll([orderBy('criadoEm', 'desc')]);
  }

  async getAtivos(): Promise<Torneio[]> {
    const todos = await this.getAllOrdered();
    return todos.filter((t) => t.status === 'ativo');
  }
}

export const torneioRepository = new TorneioRepository();
