import { amistosoRepository } from './AmistosoRepository';
import { jogadorService } from '../jogadores/JogadorService';
import { sortearBalanceado, shuffle } from '@utils/algorithms';
import { CLUBES_DEFAULT, SELECOES_DEFAULT } from '@config/constants';
import type { Amistoso, Jogador, ClubePadrao, SelecaoPadrao } from '@config/types';
// Import lazy para evitar dependência circular
let _rankingService: any = null;
const getRankingService = async () => {
  if (!_rankingService) {
    const mod = await import('../ranking/RankingService');
    _rankingService = mod.rankingService;
  }
  return _rankingService;
};

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
    tipoSelecionado: 'clube' | 'selecao' = 'clube',
    emDupla: boolean = false,
    duplaIds?: string[]
  ): Promise<Amistoso> {
    if (jogadorIds.length < 2 && !emDupla) {
      throw new Error('Mínimo 2 jogadores para sortear');
    }

    // Buscar jogadores completos
    const jogadores = await Promise.all(
      jogadorIds.map((id) => jogadorService.getById(id))
    );
    const jogadoresValidos = jogadores.filter(Boolean) as Jogador[];

    // Sortear times balanceados
    let time1Jog: Jogador[] = [];
    let time2Jog: Jogador[] = [];

    if (!emDupla && jogadoresValidos.length > 0) {
      [time1Jog, time2Jog] = sortearBalanceado(
        jogadoresValidos,
        (j: Jogador) => 50
      );
    }

    // Sortear clubes/seleções
    const times = tipoSelecionado === 'clube' ? CLUBES_DEFAULT : SELECOES_DEFAULT;
    const temposSelecionados = shuffle([...times]).slice(0, 2);

    const amistoso: Amistoso = {
      id: '',
      time1: {
        nome: temposSelecionados[0].nome,
        jogadores: time1Jog,
        duplas: emDupla ? [] : undefined,
        ...(tipoSelecionado === 'clube'
          ? { clube: temposSelecionados[0] as ClubePadrao }
          : { selecao: temposSelecionados[0] as SelecaoPadrao }),
      },
      time2: {
        nome: temposSelecionados[1].nome,
        jogadores: time2Jog,
        duplas: emDupla ? [] : undefined,
        ...(tipoSelecionado === 'clube'
          ? { clube: temposSelecionados[1] as ClubePadrao }
          : { selecao: temposSelecionados[1] as SelecaoPadrao }),
      },
      status: 'sorteando',
      emModoDupla: emDupla,
      tipoSelecionado,
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
    const amistoso = await amistosoRepository.getById(id);
    const vencedor = placarTime1 > placarTime2 ? 'time1' : placarTime1 < placarTime2 ? 'time2' : 'empate';

    await amistosoRepository.update(id, {
      status: 'finalizado',
      placar: { time1: placarTime1, time2: placarTime2 },
      resultado: {
        vencedor,
        placar: { time1: placarTime1, time2: placarTime2 },
      },
    } as any);

    // Registrar resultado no ranking para cada jogador
    if (amistoso) {
      const ranking = await getRankingService();
      const tipo = amistoso.emModoDupla ? 'dupla' : 'amistoso';

      const time1Jogadores = amistoso.time1.jogadores ?? [];
      const time2Jogadores = amistoso.time2.jogadores ?? [];

      const resultadoTime1 = vencedor === 'time1' ? 'vitoria' : vencedor === 'time2' ? 'derrota' : 'empate';
      const resultadoTime2 = vencedor === 'time2' ? 'vitoria' : vencedor === 'time1' ? 'derrota' : 'empate';

      const adversarioTime1 = time2Jogadores.map((j: any) => j.nome).join(' & ') || amistoso.time2.nome;
      const adversarioTime2 = time1Jogadores.map((j: any) => j.nome).join(' & ') || amistoso.time1.nome;

      if (time1Jogadores.length > 0) {
        await ranking.registrarResultado({
          jogadorIds: time1Jogadores.map((j: any) => j.id),
          nomes: time1Jogadores.map((j: any) => j.nome),
          resultado: resultadoTime1,
          tipo,
          adversarioNome: adversarioTime1,
          gp: placarTime1,
          gc: placarTime2,
          placarTime1,
          placarTime2,
          emDupla: amistoso.emModoDupla,
        });
      }

      if (time2Jogadores.length > 0) {
        await ranking.registrarResultado({
          jogadorIds: time2Jogadores.map((j: any) => j.id),
          nomes: time2Jogadores.map((j: any) => j.nome),
          resultado: resultadoTime2,
          tipo,
          adversarioNome: adversarioTime2,
          gp: placarTime2,
          gc: placarTime1,
          placarTime1,
          placarTime2,
          emDupla: amistoso.emModoDupla,
        });
      }
    }
  }

  async deletar(id: string): Promise<void> {
    await amistosoRepository.delete(id);
  }
}

export const amistosoService = new AmistosoService();
