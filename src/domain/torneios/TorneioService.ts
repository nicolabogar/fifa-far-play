import { torneioRepository } from './TorneioRepository';
import { jogadorService } from '../jogadores/JogadorService';
import { distribuirEmGrupos } from '@utils/algorithms';
import type { Torneio, Grupo, TabelaPosicao, Time } from '@config/types';

export class TorneioService {
  async listar(): Promise<Torneio[]> {
    return torneioRepository.getAllOrdered();
  }

  async getAtivos(): Promise<Torneio[]> {
    return torneioRepository.getAtivos();
  }

  async getById(id: string): Promise<Torneio | null> {
    return torneioRepository.getById(id);
  }

  async criar(
    nome: string,
    tipo: Torneio['tipo'],
    participantes: string[], // IDs de times/seleções
    numGrupos: number = 4
  ): Promise<Torneio> {
    if (!nome.trim()) {
      throw new Error('Nome do torneio é obrigatório');
    }

    if (participantes.length < numGrupos) {
      throw new Error(`Mínimo ${numGrupos} participantes`);
    }

    // Distribuir em grupos
    const gruposParticipantes = distribuirEmGrupos(participantes, numGrupos);
    const grupos: Grupo[] = gruposParticipantes.map((parts, idx) => ({
      id: `grupo-${String.fromCharCode(65 + idx)}`,
      nome: String.fromCharCode(65 + idx),
      times: parts.map((p) => ({ id: p, nome: p, jogadores: [] })),
      tabela: this.criarTabela(parts),
    }));

    const torneio: Torneio = {
      id: '',
      nome,
      tipo,
      status: 'ativo',
      fase: 'grupos',
      participantes: participantes.map((id) => ({
        id,
        nome: id,
        tipo: tipo === 'copa-do-mundo' ? 'selecao' : 'clube',
      })),
      grupos,
      criadoEm: new Date(),
    };

    const id = await torneioRepository.add(torneio as any);
    torneio.id = id;

    return torneio;
  }

  async finalizarGrupos(id: string): Promise<void> {
    await torneioRepository.update(id, { fase: 'classificatorias' } as any);
  }

  async finalizar(id: string): Promise<void> {
    await torneioRepository.update(id, { status: 'finalizado' } as any);
  }

  async deletar(id: string): Promise<void> {
    await torneioRepository.delete(id);
  }

  private criarTabela(participantes: string[]): TabelaPosicao[] {
    return participantes.map((p) => ({
      time: { id: p, nome: p, jogadores: [] },
      jogos: 0,
      vitorias: 0,
      empates: 0,
      derrotas: 0,
      gp: 0,
      gc: 0,
      pontos: 0,
    }));
  }
}

export const torneioService = new TorneioService();
