# FutManager 2.0

Gerencie torneios e amistosos com seus amigos!

## 🏗️ Arquitetura Refatorada

- **TypeScript + Vite**: Build rápido com type safety
- **Feature Folders**: Cada feature em sua pasta (jogadores, amistosos, torneios)
- **Clean Architecture**: UI → Domain → Infrastructure → Firebase
- **Service Pattern**: Lógica de negócio isolada e testável
- **Repository Pattern**: Abstração do Firebase

## 📁 Estrutura do Projeto

```
src/
├── config/              # Firebase + Types + Constants
├── domain/              # Lógica de negócio (Services + Repos)
│   ├── jogadores/
│   ├── amistosos/
│   ├── torneios/
│   └── ranking/
├── infrastructure/      # Firebase, Auth, Storage
├── ui/                  # Views e Components
├── utils/               # Algoritmos e helpers
└── styles/              # CSS modularizado
```

## 🚀 Setup

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Rodar testes
npm run test
```

## 📦 Dependências Principais

- **firebase**: Firestore + Auth + Storage
- **typescript**: Type safety
- **vite**: Build tool rápido
- **vitest**: Unit testing

## 🔑 Variáveis de Ambiente

Copie `.env.example` para `.env.local` e preencha com suas chaves do Firebase:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## 📚 Padrões de Código

### Services (Lógica de Negócio)

```typescript
export const jogadorService = new JogadorService();

const jogadores = await jogadorService.listar();
const novoJogador = await jogadorService.criar('João');
```

### Repositories (Firestore CRUD)

```typescript
const repo = new FirestoreRepository<T>('collectionName');
await repo.add(data);
await repo.update(id, data);
await repo.delete(id);
```

## 🧪 Testing

```bash
npm run test                # Rodar testes
npm run test:ui            # UI para testes
npm run type-check         # Verificar tipos
```

## 📝 Próximos Passos

1. Implementar todas as Views com renderização completa
2. Adicionar Pacote de Melhorias (14 itens)
3. Testes E2E e integração
4. Deploy em produção

---

**Atualizado em**: 2026-04-06
**Versão**: 2.0.0 (Refactored TypeScript + Vite)
