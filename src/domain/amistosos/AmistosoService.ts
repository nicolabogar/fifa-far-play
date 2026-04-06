import { amistosoRepository } from './AmistosoRepository';
import { jogadorService } from '../jogadores/JogadorService';
import { sortearBalanceado, shuffle } from '@utils/algorithms';
import { CLUBES_DEFAULT, SELECOES_DEFAULT } from '@config/constants';
import type { Amistoso, Jogador } from '@config/types';

export class AmistosoService {
  async listar(): Promise<Amistoso[]> {
    return amistosoRepository.getAllOrdered();
  }

  async getAtivos(): Promise<Amistoso[]> {
    return amistosoRepository.getAtivos();
  }

  async getById(id: string): Promise<Amistoso | null> {
    return amistosoRepository.getById(id);
  }

  async sortearTimes(
    jogadorIds: string[],
    usarClubes: boolean = true,
    emDupla: boolean = false
  ): Promise<Amistoso> {
    if (jogadorIds.length < 2) {
      throw new Error('Mínimo 2 jogadores para sortear');
    }

    // Buscar jogadores completos
    const jogadores = await Promise.all(
      jogadorIds.map((id) => jogadorService.getById(id))
    );
    const jogadoresValidos = jogadores.filter(Boolean) as Jogador[];

    // Sortear times balanceados
    const [time1Jog, time2Jog] = sortearBalanceado(
      jogadoresValidos,
      (j: Jogador) => 50 // força padrão se não tiver
    );

    // Sortear clubes/seleções
    const times = usarClubes ? CLUBES_DEFAULT : SELECOES_DEFAULT;
    const temposClubes = shuffle([...times]).slice(0, 2);

    const amistoso: Amistoso = {
      id: '',
      time1: {
        nome: temposClubes[0].nome,
        jogadores: time1Jog,
        duplas: emDupla ? [] : undefined,
      },
      time2: {
        nome: temposClubes[1].nome,
        jogadores: time2Jog,
        duplas: emDupla ? [] : undefined,
      },
      status: 'sorteando',
      emodoDupla: emDupla,
      criadoEm: new Date(),
    };

    // Salvar no Firestore
    const id = await amistosoRepository.add(amistoso as any);
    amistoso.id = id;

    return amistoso;
  }

  async confirmar(id: string): Promise<void> {
    await amistosoRepository.update(id, { status: 'confirmado' } as any);
  }

  async finalizarComPlacar(
    id: string,
    placarTime1: number,
    placarTime2: number
  ): Promise<void> {
    const vencedor = placarTime1 > placarTime2 ? 'time1' : placarTime1 < placarTime2 ? 'time2' : 'empate';

    await amistosoRepository.update(id, {
      status: 'finalizado',
      placar: { time1: placarTime1, time2: placarTime2 },
      resultado: {
        vencedor,
        placar: { time1: placarTime1, time2: placarTime2 },
      },
    } as any);
  }

  async deletar(id: string): Promise<void> {
    await amistosoRepository.delete(id);
  }
}

export const amistosoService = new AmistosoService();
