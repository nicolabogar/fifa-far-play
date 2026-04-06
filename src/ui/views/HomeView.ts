import { amistosoService } from '@domain/amistosos/AmistosoService';
import { torneioService } from '@domain/torneios/TorneioService';
import { rankingService } from '@domain/ranking/RankingService';
import { jogadorService } from '@domain/jogadores/JogadorService';

export class HomeView {
  static async render(container: HTMLElement): Promise<void> {
    const view = document.createElement('div');
    view.style.cssText = `
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    `;

    view.innerHTML = `
      <div style="margin-bottom: 32px;">
        <h1 style="margin-top: 0; font-size: 32px;">FutManager</h1>
        <p style="color: #666; margin-top: 8px;">Gerencie torneios e amistosos com seus amigos</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin-bottom: 32px;">
        <div id="card-amistosos" class="dashboard-card" style="
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 24px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        ">
          <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Amistosos</div>
          <div id="amistosos-count" style="font-size: 32px; font-weight: 700; color: #007bff; margin-bottom: 8px;">0</div>
          <div style="font-size: 12px; color: #666;">Clique para gerenciar</div>
        </div>

        <div id="card-torneios" class="dashboard-card" style="
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 24px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        ">
          <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Torneios</div>
          <div id="torneios-count" style="font-size: 32px; font-weight: 700; color: #ffc107; margin-bottom: 8px;">0</div>
          <div style="font-size: 12px; color: #666;">Clique para gerenciar</div>
        </div>

        <div id="card-jogadores" class="dashboard-card" style="
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 24px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        ">
          <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Jogadores</div>
          <div id="jogadores-count" style="font-size: 32px; font-weight: 700; color: #28a745; margin-bottom: 8px;">0</div>
          <div style="font-size: 12px; color: #666;">Clique para gerenciar</div>
        </div>

        <div id="card-ranking" class="dashboard-card" style="
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 24px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        ">
          <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Ranking</div>
          <div id="ranking-count" style="font-size: 32px; font-weight: 700; color: #dc3545; margin-bottom: 8px;">0</div>
          <div style="font-size: 12px; color: #666;">Clique para visualizar</div>
        </div>
      </div>

      <div style="background: white; border: 1px solid #ddd; border-radius: 8px; padding: 24px;">
        <h2 style="margin-top: 0;">Top 5 do Ranking</h2>
        <div id="top-ranking-list" style="display: flex; flex-direction: column; gap: 12px;"></div>
      </div>
    `;

    container.appendChild(view);

    // Add hover effects
    document.querySelectorAll('.dashboard-card').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        (card as HTMLElement).style.transform = 'translateY(-4px)';
        (card as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      });
      card.addEventListener('mouseleave', () => {
        (card as HTMLElement).style.transform = 'translateY(0)';
        (card as HTMLElement).style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      });
    });

    // Load data
    await this.carregarDados(view);
  }

  private static async carregarDados(container: HTMLElement): Promise<void> {
    try {
      // Carregar contagens
      const amistosos = await amistosoService.listar();
      const torneios = await torneioService.listar();
      const jogadores = await jogadorService.listar();
      const ranking = await rankingService.getTodos();

      const amistososCount = container.querySelector('#amistosos-count') as HTMLElement;
      amistososCount.textContent = String(amistosos.length);

      const torneiosCount = container.querySelector('#torneios-count') as HTMLElement;
      torneiosCount.textContent = String(torneios.length);

      const jogadoresCount = container.querySelector('#jogadores-count') as HTMLElement;
      jogadoresCount.textContent = String(jogadores.length);

      const rankingCount = container.querySelector('#ranking-count') as HTMLElement;
      rankingCount.textContent = String(ranking.length);

      // Top 5 ranking
      const topRankingList = container.querySelector('#top-ranking-list') as HTMLElement;
      const top5 = ranking.slice(0, 5);

      if (top5.length === 0) {
        topRankingList.innerHTML = '<p style="text-align: center; color: #666;">Nenhum jogador no ranking ainda.</p>';
      } else {
        topRankingList.innerHTML = top5
          .map(
            (est, idx) => `
          <div style="
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            background: #f8f9fa;
            border-radius: 4px;
          ">
            <div style="
              font-weight: 700;
              font-size: 18px;
              color: ${idx === 0 ? '#ffc107' : idx === 1 ? '#c0c0c0' : idx === 2 ? '#cd7f32' : '#999'};
              min-width: 30px;
              text-align: center;
            ">
              ${idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
            </div>
            <div style="flex: 1;">
              <div style="font-weight: 600;">${est.nome}</div>
              <div style="font-size: 12px; color: #666;">
                ${est.vitorias}V ${est.empates}E ${est.derrotas}D
              </div>
            </div>
            <div style="font-weight: 700; font-size: 16px; color: #007bff;">
              ${est.pontos} pts
            </div>
          </div>
        `
          )
          .join('');
      }

      // Add click handlers
      const cardAmistosos = container.querySelector('#card-amistosos') as HTMLElement;
      cardAmistosos.addEventListener('click', () => {
        const event = new CustomEvent('navigate', { detail: 'amistosos' });
        window.dispatchEvent(event);
      });

      const cardTorneios = container.querySelector('#card-torneios') as HTMLElement;
      cardTorneios.addEventListener('click', () => {
        const event = new CustomEvent('navigate', { detail: 'torneios' });
        window.dispatchEvent(event);
      });

      const cardJogadores = container.querySelector('#card-jogadores') as HTMLElement;
      cardJogadores.addEventListener('click', () => {
        const event = new CustomEvent('navigate', { detail: 'jogadores' });
        window.dispatchEvent(event);
      });

      const cardRanking = container.querySelector('#card-ranking') as HTMLElement;
      cardRanking.addEventListener('click', () => {
        const event = new CustomEvent('navigate', { detail: 'ranking' });
        window.dispatchEvent(event);
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  }
}
