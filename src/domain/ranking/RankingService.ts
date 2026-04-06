import { rankingRepository } from './RankingRepository';
import type { Estatistica, Jogador } from '@config/types';

export class RankingService {
  async getTop(n: number = 10): Promise<Estatistica[]> {
    return rankingRepository.getTopN(n);
  }

  async getEstatisticas(jogadorId: string): Promise<Estatistica | null> {
    return rankingRepository.getByJogadorId(jogadorId);
  }

  async getTodos(): Promise<Estatistica[]> {
    const todos = await rankingRepository.getAll();
    return todos.sort((a, b) => b.pontos - a.pontos);
  }

  async registrarVitoria(
    jogadorId: string,
    jogadorNome: string,
    golsContra: number = 0,
    golsPro: number = 0
  ): Promise<void> {
    const existente = await rankingRepository.getByJogadorId(jogadorId);

    if (existente) {
      await rankingRepository.update(jogadorId, {
        vitorias: existente.vitorias + 1,
        gp: existente.gp + golsPro,
        gc: existente.gc + golsContra,
        pontos: existente.pontos + 3,
      } as any);
    } else {
      await rankingRepository.add({
        jogadorId,
        nome: jogadorNome,
        vitorias: 1,
        empates: 0,
        derrotas: 0,
        gp: golsPro,
        gc: golsContra,
        pontos: 3,
      } as any);
    }
  }

  async registrarEmpate(
    jogadorId: string,
    jogadorNome: string,
    golsContra: number = 0,
    golsPro: number = 0
  ): Promise<void> {
    const existente = await rankingRepository.getByJogadorId(jogadorId);

    if (existente) {
      await rankingRepository.update(jogadorId, {
        empates: existente.empates + 1,
        gp: existente.gp + golsPro,
        gc: existente.gc + golsContra,
        pontos: existente.pontos + 1,
      } as any);
    } else {
      await rankingRepository.add({
        jogadorId,
        nome: jogadorNome,
        vitorias: 0,
        empates: 1,
        derrotas: 0,
        gp: golsPro,
        gc: golsContra,
        pontos: 1,
      } as any);
    }
  }

  async registrarDerrota(
    jogadorId: string,
    jogadorNome: string,
    golsContra: number = 0,
    golsPro: number = 0
  ): Promise<void> {
    const existente = await rankingRepository.getByJogadorId(jogadorId);

    if (existente) {
      await rankingRepository.update(jogadorId, {
        derrotas: existente.derrotas + 1,
        gp: existente.gp + golsPro,
        gc: existente.gc + golsContra,
      } as any);
    } else {
      await rankingRepository.add({
        jogadorId,
        nome: jogadorNome,
        vitorias: 0,
        empates: 0,
        derrotas: 1,
        gp: golsPro,
        gc: golsContra,
        pontos: 0,
      } as any);
    }
  }
}

export const rankingService = new RankingService();
