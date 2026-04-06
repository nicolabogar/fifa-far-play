import { CLUBES_DEFAULT, SELECOES_DEFAULT } from '@config/constants';
import type { ClubePadrao, SelecaoPadrao } from '@config/types';

export class ClubeSelecaoSelect {
  private container: HTMLElement;
  private tipo: 'clube' | 'selecao' = 'clube';

  constructor(container: HTMLElement) {
    this.container = container;
  }

  async render(): Promise<void> {
    this.container.innerHTML = `
      <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 8px; font-weight: 600;">Tipo</label>
        <select id="tipo-selecao" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
          <option value="clube">Clube</option>
          <option value="selecao">Seleção</option>
        </select>
      </div>

      <div id="opcoes-container"></div>
    `;

    const tipoSelect = this.container.querySelector('#tipo-selecao') as HTMLSelectElement;
    tipoSelect.addEventListener('change', (e) => {
      this.tipo = (e.target as HTMLSelectElement).value as 'clube' | 'selecao';
      this.atualizarOpcoes();
    });

    this.atualizarOpcoes();
  }

  private atualizarOpcoes(): void {
    const container = this.container.querySelector('#opcoes-container') as HTMLElement;
    const dados = this.tipo === 'clube' ? CLUBES_DEFAULT : SELECOES_DEFAULT;

    container.innerHTML = `
      <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 8px; font-weight: 600;">Selecione</label>
        <input type="text"
          id="search-opcao"
          placeholder="Buscar..."
          style="
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-bottom: 8px;
          "
        />
        <div id="opcoes-dropdown" style="
          border: 1px solid #ddd;
          border-radius: 4px;
          max-height: 200px;
          overflow-y: auto;
        ">
          ${dados
            .map(
              (d) => `
            <div class="opcao-item" data-id="${d.id}" style="
              padding: 12px;
              border-bottom: 1px solid #f0f0f0;
              cursor: pointer;
              transition: background 0.2s;
            " onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='white'">
              <strong>${d.nome}</strong>
              <div style="font-size: 12px; color: #666;">${d.forca} de força</div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>

      <div id="selected-opcao" style="
        padding: 12px;
        background: #e7f3ff;
        border: 1px solid #007bff;
        border-radius: 4px;
        display: none;
      "></div>
    `;

    const searchInput = container.querySelector('#search-opcao') as HTMLInputElement;
    searchInput.addEventListener('input', (e) => {
      const query = (e.target as HTMLInputElement).value.toLowerCase();
      container.querySelectorAll('.opcao-item').forEach((item) => {
        const nome = item.textContent?.toLowerCase() || '';
        item.style.display = nome.includes(query) ? '' : 'none';
      });
    });

    container.querySelectorAll('.opcao-item').forEach((item) => {
      item.addEventListener('click', () => {
        const id = item.dataset.id;
        const nome = item.querySelector('strong')?.textContent || '';
        const selectedDiv = container.querySelector('#selected-opcao') as HTMLElement;
        selectedDiv.style.display = 'block';
        selectedDiv.innerHTML = `✓ ${nome}`;
      });
    });
  }

  getTipo(): 'clube' | 'selecao' {
    return this.tipo;
  }
}
