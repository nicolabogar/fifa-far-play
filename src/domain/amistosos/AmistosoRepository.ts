import { orderBy } from 'firebase/firestore';
import { FirestoreRepository } from '@infrastructure/firestore/FirestoreRepository';
import type { Amistoso } from '@config/types';

export class AmistosoRepository extends FirestoreRepository<Amistoso> {
  constructor() {
    super('amistosos');
  }

  async getAllOrdered(): Promise<Amistoso[]> {
    return this.getAll([orderBy('criadoEm', 'desc')]);
  }

  async getAtivos(): Promise<Amistoso[]> {
    const todos = await this.getAllOrdered();
    return todos.filter((a) => a.status !== 'finalizado');
  }
}

export const amistosoRepository = new AmistosoRepository();
