import { jogadorRepository } from './JogadorRepository';
import { StorageService } from '@infrastructure/storage/StorageService';
import type { Jogador } from '@config/types';

export class JogadorService {
  async listar(): Promise<Jogador[]> {
    return jogadorRepository.getAllOrdered();
  }

  async getById(id: string): Promise<Jogador | null> {
    return jogadorRepository.getById(id);
  }

  async criar(nome: string, email?: string, master?: boolean, fotoUrl?: string): Promise<Jogador> {
    if (!nome.trim()) {
      throw new Error('Nome do jogador é obrigatório');
    }

    const id = await jogadorRepository.add({
      nome: nome.trim(),
      email: email || '',
      master: master ?? false,
      fotoUrl: fotoUrl || '',
      criadoEm: new Date(),
    } as any);

    return { id, nome, email, master: master ?? false, fotoUrl };
  }

  async deletar(id: string): Promise<void> {
    await jogadorRepository.delete(id);
  }

  async atualizarFoto(id: string, fotoUrl: string): Promise<void> {
    await jogadorRepository.update(id, { fotoUrl } as any);
  }

  async marcarMaster(id: string, master: boolean): Promise<void> {
    await jogadorRepository.update(id, { master } as any);
  }

  async uploadFoto(id: string, arquivo: File): Promise<string> {
    const fotoUrl = await StorageService.uploadFoto(id, arquivo);
    await this.atualizarFoto(id, fotoUrl);
    return fotoUrl;
  }

  async getMasters(): Promise<Jogador[]> {
    return jogadorRepository.getMasters();
  }
}

export const jogadorService = new JogadorService();
