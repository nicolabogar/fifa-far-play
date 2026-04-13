# 🚀 FIFA Feature Dev - Quick Reference

## Como Invocar a Skill

```
/fifa-feature-dev
```

Ou descrever no chat:
- "Desenvolver as features do FIFA FAR PLAY"
- "Implementar próximos items do FifaFarPlay.txt"
- "Continuar de onde parou"

## Fluxo Resumido

```
📖 Ler FifaFarPlay.txt
  ↓
🔨 Para cada [ ] pendente:
  ├─ Implementar feature em index.html
  ├─ Git commit + push
  ├─ Obter hash (7 chars)
  └─ Marcar [x] + hash no arquivo original
  ↓
✅ Todos items = [x]?
  ├─ SIM → Versionar (renomear v12→v13)
  │         Criar novo FifaFarPlay.txt vazio
  │         Commit final
  └─ NÃO → Continuar desenvolvendo

```

## Exemplo de Progresso

### Antes
```
- [ ] Implementar sliders de exclusão
- [ ] Adicionar tags de eficiência
- [ ] Sincronizar deletes
```

### Durante
```
- [x] Implementar sliders de exclusão (hash: AC3F2E1)
- [ ] Adicionar tags de eficiência
- [ ] Sincronizar deletes
```

### Depois (versionamento)
```
✅ FifaFarPlay.txt → FifaFarPlay_v13.txt
📝 Novo FifaFarPlay.txt criado (vazio)
```

## Regras de Design — Cards de Jogo

**Todos os cards de jogo devem seguir o mesmo padrão visual**, sem exceção:

- **Classe CSS**: `match-card` (background `var(--card)`, border `1px solid var(--card-border)`, border-radius `18px`, padding `14px`)
- **Layout interno**: `display:grid; grid-template-columns:1fr auto 1fr; column-gap:16px; row-gap:8px;`
- **Linha de topo**: tags (tipo do jogo, modalidade, resultado/status) usando a classe `.tag` com variantes `tag-purple`, `tag-gray`, `tag-cyan`, `tag-green`, `tag-yellow`, `tag-red`
- **Coluna dos times**: nome (16px, 900, uppercase) → ícone (`badgeTimeIcon`) → eficiência (`eficBadge`) → jogadores (11px, cyan, uppercase)
- **Coluna central** (placar): inputs `placar-input` (40px, 22px font, border-radius 8px) ou placar estático em amarelo (29px, 900)
- **Única coisa que varia**: as tags no topo (AMISTOSO / TORNEIO / CAMPEONATO, resultado, status)
- Qualquer tela de **edição de jogo** (fullscreen, modal, etc.) deve usar o mesmo `match-card` com os mesmos estilos — nunca criar um container próprio com estilos diferentes

## Checklist de Cada Feature

Antes de passar para a próxima:

- ✅ Código implementado em index.html
- ✅ Responsividade testada (mobile, tablet, desktop)
- ✅ Animações funcionando suavemente
- ✅ localStorage persistindo dados (se aplicável)
- ✅ Cards de jogo seguem o padrão `match-card` (ver seção acima)
- ✅ Git commit feito com hash válido
- ✅ Git push bem-sucedido
- ✅ FifaFarPlay.txt atualizado com [x] + hash

## Se Algo Quebrar

1. **Feature parcial**: Edite manualmente o arquivo a feature, commit separado, depois continue
2. **Hash perdido**: `git log --oneline -n 1` mostra último commit
3. **Arquivo desatualizado**: Ler novamente com `git status` antes de continuar
4. **Versionamento errado**: Renomear arquivo manualmente e criar novo via terminal

---

**Próximo passo**: Chame a skill digitando `/fifa-feature-dev` no chat! 🎯
