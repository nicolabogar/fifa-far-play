import { orderBy } from 'firebase/firestore';
import { FirestoreRepository } from '@infrastructure/firestore/FirestoreRepository';
import type { Jogador } from '@config/types';

export class JogadorRepository extends FirestoreRepository<Jogador> {
  constructor() {
    super('jogadores');
  }

  async getAllOrdered(): Promise<Jogador[]> {
    return this.getAll([orderBy('nome')]);
  }

  async getMasters(): Promise<Jogador[]> {
    const todos = await this.getAllOrdered();
    return todos.filter((j) => j.master);
  }
}

export const jogadorRepository = new JogadorRepository();
