import { torneioService } from '@domain/torneios/TorneioService';
import { jogadorService } from '@domain/jogadores/JogadorService';
import { Button } from '@ui/components/Button';
import { TORNEIO_META } from '@config/constants';
import type { Torneio, Jogador } from '@config/types';

export class TorneiosView {
  private static jogadoresSelecionados: Jogador[] = [];

  static async render(container: HTMLElement): Promise<void> {
    const view = document.createElement('div');
    view.style.cssText = `
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    `;

    view.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <h1 style="margin: 0; font-size: 28px;">Torneios</h1>
        <button id="btn-criar-torneio" style="
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 10px 16px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        ">+ Criar Torneio</button>
      </div>

      <div id="torneios-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px;"></div>
    `;

    container.appendChild(view);

    const btnCriar = view.querySelector('#btn-criar-torneio') as HTMLButtonElement;
    btnCriar.addEventListener('click', () => this.abrirModal()); // agora async, ok

    await this.carregarTorneios(view);
  }

  private static async carregarTorneios(container: HTMLElement): Promise<void> {
    try {
      const torneios = await torneioService.listar();
      const torneiosContainer = container.querySelector('#torneios-container') as HTMLElement;

      if (torneios.length === 0) {
        torneiosContainer.innerHTML = '<p style="grid-column: 1/-1;">Nenhum torneio criado ainda.</p>';
        return;
      }

      torneiosContainer.innerHTML = '';
      for (const torneio of torneios) {
        const card = this.criarCartaoTorneio(torneio);
        torneiosContainer.appendChild(card);
      }
    } catch (error) {
      console.error('Erro ao carregar torneios:', error);
    }
  }

  private static criarCartaoTorneio(torneio: Torneio): HTMLElement {
    const card = document.createElement('div');
    card.style.cssText = `
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    `;

    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-2px)';
      card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    });

    const header = document.createElement('div');
    header.style.cssText = `
      padding: 16px;
      background: #f8f9fa;
      border-bottom: 1px solid #ddd;
      display: flex;
      align-items: center;
      gap: 12px;
    `;

    const meta = TORNEIO_META[torneio.tipo];
    if (meta && meta.logo) {
      const logo = document.createElement('img');
      logo.src = meta.logo;
      logo.style.cssText = `
        width: 40px;
        height: 40px;
        object-fit: contain;
      `;
      header.appendChild(logo);
    }

    const headerContent = document.createElement('div');
    headerContent.style.cssText = `
      flex: 1;
    `;

    const title = document.createElement('div');
    title.style.cssText = `
      font-weight: 600;
      font-size: 14px;
    `;
    title.textContent = torneio.nome;
    headerContent.appendChild(title);

    const metaName = document.createElement('div');
    metaName.style.cssText = `
      font-size: 12px;
      color: #666;
    `;
    metaName.textContent = meta?.nome || torneio.tipo;
    headerContent.appendChild(metaName);

    header.appendChild(headerContent);

    const status = document.createElement('div');
    status.style.cssText = `
      font-size: 12px;
      font-weight: 500;
      padding: 4px 8px;
      border-radius: 4px;
      background: ${torneio.status === 'ativo' ? '#d4edda' : '#f8d7da'};
      color: ${torneio.status === 'ativo' ? '#155724' : '#721c24'};
    `;
    status.textContent = torneio.status.toUpperCase();
    header.appendChild(status);

    const content = document.createElement('div');
    content.style.cssText = `
      padding: 16px;
    `;

    const faseInfo = document.createElement('div');
    faseInfo.style.cssText = `
      margin-bottom: 16px;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 4px;
      font-size: 14px;
    `;
    faseInfo.innerHTML = `
      <strong>Fase:</strong> ${torneio.fase === 'grupos' ? 'Grupos' : 'Classificatórias'}<br/>
      <strong>Participantes:</strong> ${torneio.participantes?.length || 0}
    `;
    content.appendChild(faseInfo);

    if (torneio.grupos && torneio.grupos.length > 0) {
      const gruposInfo = document.createElement('div');
      gruposInfo.style.cssText = `
        margin-bottom: 16px;
        font-size: 12px;
      `;
      gruposInfo.innerHTML = `
        <strong>Grupos:</strong> ${torneio.grupos.length}<br/>
        ${torneio.grupos
          .map(
            (g) => `
          <div style="margin-top: 8px; padding-left: 8px; border-left: 2px solid #007bff;">
            <strong>Grupo ${g.nome}:</strong> ${g.times.map((t) => t.nome).join(', ')}
          </div>
        `
          )
          .join('')}
      `;
      content.appendChild(gruposInfo);
    }

    const buttons = document.createElement('div');
    buttons.style.cssText = `
      display: flex;
      gap: 8px;
    `;

    if (torneio.status === 'ativo' && torneio.fase === 'grupos') {
      const btnFinalizarGrupos = Button.create({
        text: 'Finalizar Grupos',
        onClick: () => this.finalizarGrupos(torneio.id),
        variant: 'primary',
        size: 'sm',
        fullWidth: true,
      });
      buttons.appendChild(btnFinalizarGrupos);
    }

    if (torneio.status === 'ativo') {
      const btnFinalizar = Button.create({
        text: 'Finalizar',
        onClick: () => this.finalizarTorneio(torneio.id),
        variant: 'success',
        size: 'sm',
        fullWidth: true,
      });
      buttons.appendChild(btnFinalizar);
    }

    const btnDeletar = Button.create({
      text: 'Deletar',
      onClick: () => this.deletarTorneio(torneio.id),
      variant: 'danger',
      size: 'sm',
      fullWidth: true,
    });
    buttons.appendChild(btnDeletar);

    content.appendChild(buttons);
    card.appendChild(header);
    card.appendChild(content);

    return card;
  }

  private static async finalizarGrupos(id: string): Promise<void> {
    try {
      await torneioService.finalizarGrupos(id);
      location.reload();
    } catch (error) {
      console.error('Erro ao finalizar grupos:', error);
      alert('Erro ao finalizar grupos');
    }
  }

  private static async finalizarTorneio(id: string): Promise<void> {
    if (!confirm('Tem certeza que deseja finalizar este torneio?')) return;

    try {
      await torneioService.finalizar(id);
      location.reload();
    } catch (error) {
      console.error('Erro ao finalizar torneio:', error);
      alert('Erro ao finalizar torneio');
    }
  }

  private static async deletarTorneio(id: string): Promise<void> {
    if (!confirm('Tem certeza que deseja deletar este torneio?')) return;

    try {
      await torneioService.deletar(id);
      location.reload();
    } catch (error) {
      console.error('Erro ao deletar torneio:', error);
      alert('Erro ao deletar torneio');
    }
  }

  private static async abrirModal(): Promise<void> {
    this.jogadoresSelecionados = [];
    let todosJogadores: Jogador[] = [];
    try { todosJogadores = await jogadorService.listar(); } catch {}

    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.5);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
      background: white; border-radius: 8px; padding: 24px;
      max-width: 520px; width: 90%; max-height: 85vh; overflow-y: auto;
    `;

    content.innerHTML = `
      <h2 style="margin-top: 0;">Criar Novo Torneio</h2>

      <div style="margin-bottom: 16px;">
        <label style="display: block; font-weight: 500; margin-bottom: 8px;">Nome:</label>
        <input type="text" id="input-nome" placeholder="Ex: Meu Torneio"
          style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; box-sizing: border-box;" />
      </div>

      <div style="margin-bottom: 16px;">
        <label style="display: block; font-weight: 500; margin-bottom: 8px;">Formato:</label>
        <select id="select-tipo" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; box-sizing: border-box;">
          <option value="champions">Champions League</option>
          <option value="libertadores">Libertadores</option>
          <option value="brasileirao">Brasileirão</option>
          <option value="paulistao">Paulistão</option>
          <option value="copa-brasil">Copa do Brasil</option>
          <option value="copa-do-mundo">Copa do Mundo</option>
        </select>
      </div>

      <div style="margin-bottom: 16px;">
        <label style="display: block; font-weight: 500; margin-bottom: 8px;">Número de Grupos:</label>
        <input type="number" id="input-grupos" value="4" min="2" max="8"
          style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; box-sizing: border-box;" />
      </div>

      <div style="margin-bottom: 16px;">
        <label style="display: block; font-weight: 500; margin-bottom: 8px;">Jogadores:</label>
        <input type="text" id="busca-jogador" placeholder="Buscar jogador..."
          style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; box-sizing: border-box; margin-bottom: 6px;" />
        <div id="dropdown-jogadores" style="
          border: 1px solid #ddd; border-radius: 4px;
          max-height: 160px; overflow-y: auto; display: none;
          background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        "></div>
        <div id="tags-jogadores" style="
          display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px;
        "></div>
      </div>

      <div style="display: flex; gap: 8px; margin-top: 8px;">
        <button id="btn-criar-modal" style="
          flex: 1; background: #007bff; color: white;
          border: none; border-radius: 4px; padding: 10px;
          cursor: pointer; font-weight: 500; font-size: 14px;">Criar</button>
        <button id="btn-cancelar-modal" style="
          flex: 1; background: #6c757d; color: white;
          border: none; border-radius: 4px; padding: 10px;
          cursor: pointer; font-weight: 500; font-size: 14px;">Cancelar</button>
      </div>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    // Lógica do dropdown pesquisável de jogadores
    const buscaInput = content.querySelector('#busca-jogador') as HTMLInputElement;
    const dropdown = content.querySelector('#dropdown-jogadores') as HTMLElement;
    const tagsContainer = content.querySelector('#tags-jogadores') as HTMLElement;

    const renderTags = () => {
      tagsContainer.innerHTML = this.jogadoresSelecionados.map(j => `
        <span style="
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 10px; background: #e7f3ff;
          border: 1px solid #007bff; border-radius: 14px; font-size: 13px;
        ">
          ${j.nome}
          <button data-id="${j.id}" style="
            background: none; border: none; cursor: pointer;
            color: #007bff; font-size: 16px; padding: 0; line-height: 1;
          ">×</button>
        </span>
      `).join('');

      tagsContainer.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
          this.jogadoresSelecionados = this.jogadoresSelecionados.filter(j => j.id !== btn.dataset.id);
          renderTags();
        });
      });
    };

    const renderDropdown = (filtro: string) => {
      const naoSelecionados = todosJogadores.filter(j =>
        j.nome.toLowerCase().includes(filtro.toLowerCase()) &&
        !this.jogadoresSelecionados.find(s => s.id === j.id)
      );
      if (!filtro || naoSelecionados.length === 0) {
        dropdown.style.display = 'none';
        return;
      }
      dropdown.style.display = 'block';
      dropdown.innerHTML = naoSelecionados.map(j => `
        <div data-id="${j.id}" data-nome="${j.nome}" style="
          padding: 10px 14px; cursor: pointer; font-size: 14px;
          border-bottom: 1px solid #f0f0f0;
        " onmouseover="this.style.background='#f0f7ff'" onmouseout="this.style.background='white'">
          ${j.nome}
        </div>
      `).join('');

      dropdown.querySelectorAll('div').forEach(item => {
        item.addEventListener('click', () => {
          const j = todosJogadores.find(x => x.id === item.dataset.id);
          if (j) { this.jogadoresSelecionados.push(j); }
          buscaInput.value = '';
          dropdown.style.display = 'none';
          renderTags();
        });
      });
    };

    buscaInput.addEventListener('input', () => renderDropdown(buscaInput.value));
    buscaInput.addEventListener('focus', () => { if (buscaInput.value) renderDropdown(buscaInput.value); });
    document.addEventListener('click', (e) => {
      if (!content.contains(e.target as Node)) dropdown.style.display = 'none';
    });

    (content.querySelector('#btn-criar-modal') as HTMLButtonElement).addEventListener('click', async () => {
      const nome = (content.querySelector('#input-nome') as HTMLInputElement).value.trim();
      const tipo = (content.querySelector('#select-tipo') as HTMLSelectElement).value;
      const numGrupos = parseInt((content.querySelector('#input-grupos') as HTMLInputElement).value);

      if (!nome) { alert('Digite o nome do torneio'); return; }
      if (this.jogadoresSelecionados.length < 2) { alert('Selecione pelo menos 2 jogadores'); return; }

      try {
        const ids = this.jogadoresSelecionados.map(j => j.id);
        await torneioService.criar(nome, tipo as any, ids, numGrupos);
        modal.remove();
        location.reload();
      } catch (error) {
        console.error('Erro ao criar torneio:', error);
        alert('Erro ao criar torneio');
      }
    });

    (content.querySelector('#btn-cancelar-modal') as HTMLButtonElement).addEventListener('click', () => modal.remove());
  }
}
