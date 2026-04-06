import { amistosoService } from '@domain/amistosos/AmistosoService';
import { jogadorService } from '@domain/jogadores/JogadorService';
import { Button } from '@ui/components/Button';
import { SearchableSelect } from '@ui/components/SearchableSelect';
import { PlayerTag } from '@ui/components/PlayerTag';
import { CLUBES_DEFAULT, SELECOES_DEFAULT } from '@config/constants';
import type { Amistoso, Jogador } from '@config/types';

export class AmistososView {
  private static selectedJogadores: string[] = [];
  private static selectedTipoSelecao: 'clube' | 'selecao' = 'clube';
  private static emModoDupla: boolean = false;

  static async render(container: HTMLElement): Promise<void> {
    const view = document.createElement('div');
    view.style.cssText = `
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    `;

    view.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <h1 style="margin: 0; font-size: 28px;">Amistosos</h1>
        <button id="btn-criar-amistoso" style="
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 10px 16px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        ">+ Criar</button>
      </div>

      <div id="amistosos-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px;"></div>
    `;

    container.appendChild(view);

    const btnCriar = view.querySelector('#btn-criar-amistoso') as HTMLButtonElement;
    btnCriar.addEventListener('click', () => this.abrirModal());

    await this.carregarAmistosos(view);
  }

  private static async carregarAmistosos(container: HTMLElement): Promise<void> {
    try {
      const amistosos = await amistosoService.listar();
      const amistososContainer = container.querySelector('#amistosos-container') as HTMLElement;

      if (amistosos.length === 0) {
        amistososContainer.innerHTML = '<p style="grid-column: 1/-1;">Nenhum amistoso criado ainda.</p>';
        return;
      }

      amistososContainer.innerHTML = '';
      for (const amistoso of amistosos) {
        const card = this.criarCartaoAmistoso(amistoso);
        amistososContainer.appendChild(card);
      }
    } catch (error) {
      console.error('Erro ao carregar amistosos:', error);
    }
  }

  private static criarCartaoAmistoso(amistoso: Amistoso): HTMLElement {
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
    `;

    const status = document.createElement('div');
    status.style.cssText = `
      font-size: 12px;
      font-weight: 500;
      color: ${this.getStatusColor(amistoso.status)};
      margin-bottom: 8px;
    `;
    status.textContent = amistoso.status.toUpperCase();
    header.appendChild(status);

    const content = document.createElement('div');
    content.style.cssText = `
      padding: 16px;
    `;

    const matchInfo = document.createElement('div');
    matchInfo.style.cssText = `
      text-align: center;
      margin-bottom: 16px;
    `;

    const time1 = document.createElement('div');
    time1.style.cssText = `
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 8px;
    `;
    time1.innerHTML = `
      ${amistoso.time1.clube?.logo || amistoso.time1.selecao?.bandeira || ''}
      ${amistoso.time1.nome}
    `;
    matchInfo.appendChild(time1);

    if (amistoso.placar) {
      const placar = document.createElement('div');
      placar.style.cssText = `
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 8px;
      `;
      placar.textContent = `${amistoso.placar.time1} - ${amistoso.placar.time2}`;
      matchInfo.appendChild(placar);
    } else {
      const vsText = document.createElement('div');
      vsText.style.cssText = `
        font-size: 12px;
        color: #666;
        margin-bottom: 8px;
      `;
      vsText.textContent = 'vs';
      matchInfo.appendChild(vsText);
    }

    const time2 = document.createElement('div');
    time2.style.cssText = `
      font-size: 14px;
      font-weight: 600;
    `;
    time2.innerHTML = `
      ${amistoso.time2.clube?.logo || amistoso.time2.selecao?.bandeira || ''}
      ${amistoso.time2.nome}
    `;
    matchInfo.appendChild(time2);

    content.appendChild(matchInfo);

    const jogadoresInfo = document.createElement('div');
    jogadoresInfo.style.cssText = `
      font-size: 12px;
      color: #666;
      margin-bottom: 16px;
    `;
    jogadoresInfo.innerHTML = `
      <div style="margin-bottom: 8px;">
        <strong>Time 1:</strong> ${amistoso.time1.jogadores.map((j) => j.nome).join(', ')}
      </div>
      <div>
        <strong>Time 2:</strong> ${amistoso.time2.jogadores.map((j) => j.nome).join(', ')}
      </div>
    `;
    content.appendChild(jogadoresInfo);

    if (amistoso.emModoDupla) {
      const duplaInfo = document.createElement('div');
      duplaInfo.style.cssText = `
        background: #e7f3ff;
        padding: 8px;
        border-radius: 4px;
        font-size: 12px;
        margin-bottom: 16px;
        color: #0056b3;
      `;
      duplaInfo.textContent = 'Modo Dupla Ativado';
      content.appendChild(duplaInfo);
    }

    const buttons = document.createElement('div');
    buttons.style.cssText = `
      display: flex;
      gap: 8px;
    `;

    if (amistoso.status === 'sorteando') {
      const btnConfirmar = Button.create({
        text: 'Confirmar',
        onClick: () => this.confirmarAmistoso(amistoso.id),
        variant: 'success',
        size: 'sm',
        fullWidth: true,
      });
      buttons.appendChild(btnConfirmar);
    }

    if (amistoso.status === 'confirmado') {
      const btnFinalizar = Button.create({
        text: 'Finalizar Placar',
        onClick: () => this.finalizarAmistoso(amistoso.id),
        variant: 'primary',
        size: 'sm',
        fullWidth: true,
      });
      buttons.appendChild(btnFinalizar);
    }

    const btnDeletar = Button.create({
      text: 'Deletar',
      onClick: () => this.deletarAmistoso(amistoso.id),
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

  private static getStatusColor(status: string): string {
    switch (status) {
      case 'sorteando':
        return '#ffc107';
      case 'confirmado':
        return '#17a2b8';
      case 'finalizado':
        return '#28a745';
      default:
        return '#6c757d';
    }
  }

  private static async confirmarAmistoso(id: string): Promise<void> {
    try {
      await amistosoService.confirmar(id);
      location.reload();
    } catch (error) {
      console.error('Erro ao confirmar amistoso:', error);
      alert('Erro ao confirmar amistoso');
    }
  }

  private static async finalizarAmistoso(id: string): Promise<void> {
    const placar1 = prompt('Gols do Time 1:');
    if (placar1 === null) return;

    const placar2 = prompt('Gols do Time 2:');
    if (placar2 === null) return;

    try {
      await amistosoService.finalizarComPlacar(id, parseInt(placar1), parseInt(placar2));
      location.reload();
    } catch (error) {
      console.error('Erro ao finalizar amistoso:', error);
      alert('Erro ao finalizar amistoso');
    }
  }

  private static async deletarAmistoso(id: string): Promise<void> {
    if (!confirm('Tem certeza que deseja deletar este amistoso?')) return;

    try {
      await amistosoService.deletar(id);
      location.reload();
    } catch (error) {
      console.error('Erro ao deletar amistoso:', error);
      alert('Erro ao deletar amistoso');
    }
  }

  private static abrirModal(): void {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
      background: white;
      border-radius: 8px;
      padding: 24px;
      max-width: 500px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    `;

    content.innerHTML = `
      <h2 style="margin-top: 0;">Criar Novo Amistoso</h2>

      <div style="margin-bottom: 16px;">
        <label style="display: block; font-weight: 500; margin-bottom: 8px;">Tipo de Seleção:</label>
        <div style="display: flex; gap: 12px;">
          <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
            <input type="radio" name="tipoSelecao" value="clube" checked style="cursor: pointer;" />
            Clubes
          </label>
          <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
            <input type="radio" name="tipoSelecao" value="selecao" style="cursor: pointer;" />
            Seleções
          </label>
        </div>
      </div>

      <div style="margin-bottom: 16px;">
        <label style="display: block; font-weight: 500; margin-bottom: 8px;">
          <input type="checkbox" id="chk-modo-dupla" style="cursor: pointer;" />
          Modo Dupla
        </label>
      </div>

      <div style="margin-bottom: 16px;">
        <label style="display: block; font-weight: 500; margin-bottom: 8px;">Selecione Jogadores:</label>
        <div id="searchable-select-container"></div>
      </div>

      <div style="display: flex; gap: 8px;">
        <button id="btn-criar-modal" style="
          flex: 1;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 10px;
          cursor: pointer;
          font-weight: 500;
        ">Criar</button>
        <button id="btn-cancelar-modal" style="
          flex: 1;
          background: #6c757d;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 10px;
          cursor: pointer;
          font-weight: 500;
        ">Cancelar</button>
      </div>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    const radioButtons = content.querySelectorAll('input[name="tipoSelecao"]');
    radioButtons.forEach((radio) => {
      radio.addEventListener('change', (e) => {
        this.selectedTipoSelecao = (e.target as HTMLInputElement).value as 'clube' | 'selecao';
        this.atualizarSearchableSelect(content);
      });
    });

    const chkDupla = content.querySelector('#chk-modo-dupla') as HTMLInputElement;
    chkDupla.addEventListener('change', (e) => {
      this.emModoDupla = (e.target as HTMLInputElement).checked;
    });

    this.atualizarSearchableSelect(content);

    const btnCriar = content.querySelector('#btn-criar-modal') as HTMLButtonElement;
    btnCriar.addEventListener('click', async () => {
      try {
        if (this.selectedJogadores.length < 2 && !this.emModoDupla) {
          alert('Selecione pelo menos 2 jogadores');
          return;
        }

        const tipoSelecionado = (content.querySelector('input[name="tipoSelecao"]:checked') as HTMLInputElement).value;
        await amistosoService.sortearTimes(
          this.selectedJogadores,
          tipoSelecionado as 'clube' | 'selecao',
          this.emModoDupla
        );

        modal.remove();
        location.reload();
      } catch (error) {
        console.error('Erro ao criar amistoso:', error);
        alert('Erro ao criar amistoso');
      }
    });

    const btnCancelar = content.querySelector('#btn-cancelar-modal') as HTMLButtonElement;
    btnCancelar.addEventListener('click', () => {
      modal.remove();
    });
  }

  private static async atualizarSearchableSelect(container: HTMLElement): Promise<void> {
    const searchContainer = container.querySelector('#searchable-select-container') as HTMLElement;
    searchContainer.innerHTML = '';

    try {
      const jogadores = await jogadorService.listar();
      const options = jogadores.map((j) => ({
        id: j.id,
        nome: j.nome,
        icon: j.master ? '👑' : undefined,
      }));

      new SearchableSelect(searchContainer, options, {
        multiple: true,
        onSelectionChange: (ids) => {
          this.selectedJogadores = ids;
        },
      });
    } catch (error) {
      console.error('Erro ao carregar jogadores:', error);
    }
  }
}
