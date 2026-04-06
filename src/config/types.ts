// ===== TYPES GLOBAIS =====

export interface Jogador {
  id: string;
  nome: string;
  email?: string;
  master: boolean;
  fotoUrl?: string;
  criadoEm: any;
}

export interface Time {
  id: string;
  nome: string;
  escudo?: string;
  jogadores: string[]; // IDs
}

export interface ClubePadrao {
  id: string;
  nome: string;
  forca: number;
  bandeira: string;
  liga: string;
  logo: string;
}

export interface SelecaoPadrao {
  id: string;
  nome: string;
  forca: number;
  bandeira: string;
}

export interface Amistoso {
  id: string;
  time1: { nome: string; jogadores: Jogador[]; duplas?: Dupla[] };
  time2: { nome: string; jogadores: Jogador[]; duplas?: Dupla[] };
  placar?: { time1: number; time2: number };
  status: 'sorteando' | 'confirmado' | 'finalizado';
  resultado?: { vencedor: string; placar: { time1: number; time2: number } };
  emodoDupla?: boolean;
  criadoEm: any;
}

export interface Dupla {
  id: string;
  jogador1Id: string;
  jogador2Id: string;
}

export interface Torneio {
  id: string;
  nome: string;
  tipo: 'champions' | 'brasileirao' | 'libertadores' | 'paulistao' | 'copa-brasil' | 'copa-do-mundo';
  status: 'ativo' | 'finalizado';
  fase: 'grupos' | 'classificatorias';
  participantes: Participante[];
  grupos?: Grupo[];
  criadoEm: any;
}

export interface Grupo {
  id: string;
  nome: string;
  times: Time[];
  tabela: TabelaPosicao[];
  partidas?: Partida[];
}

export interface Partida {
  id: string;
  time1Id: string;
  time2Id: string;
  placar: { time1: number; time2: number };
  data: any;
}

export interface TabelaPosicao {
  time: Time;
  jogos: number;
  vitorias: number;
  empates: number;
  derrotas: number;
  gp: number;
  gc: number;
  pontos: number;
}

export interface Participante {
  id: string;
  nome: string;
  tipo: 'clube' | 'selecao';
}

export interface Estatistica {
  jogadorId: string;
  nome: string;
  time?: Time;
  vitorias: number;
  empates: number;
  derrotas: number;
  gp: number;
  gc: number;
  pontos: number;
}

export interface TorneioMeta {
  nome: string;
  tipo: 'clubes' | 'selecoes';
  logo: string;
}

export interface DadosTime {
  abrev: string;
  fundo: string;
  cor: string;
  pais: string;
  paisNome: string;
  crest: string;
}
