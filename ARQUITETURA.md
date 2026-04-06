# FutManager - Arquitetura & Tecnologias

## 📱 Stack Tecnológico

### **Frontend**
- **HTML5 + CSS3 + JavaScript (Vanilla)**
  - SPA (Single Page Application) sem framework
  - Web API moderna (Fetch, localStorage, Service Worker)
  - Design responsivo com CSS Grid/Flexbox

### **Backend**
- **Firebase** (BaaS - Backend as a Service)
  - **Firestore**: Database NoSQL em tempo real
  - **Authentication**: Google OAuth 2.0
  - **Storage**: Hospedagem de imagens/assets

### **Infra & PWA**
- **Service Worker** (Offline support + caching)
- **Progressive Web App (PWA)**
  - Installável em mobile/desktop
  - Funciona offline com cache inteligente
  - Manifest.json configurado

### **APIs Externas**
- **Flag API**: Bandeiras de países (flagcdn.com)
- **Google Auth**: Autenticação via conta Google

---

## 🏗️ Arquitetura da Aplicação

### **Estrutura de Arquivos**
```
fut-manager/
├── index.html          # HTML + CSS + JavaScript (tudo integrado - 2191 linhas)
├── manifest.json       # Configuração PWA
├── sw.js               # Service Worker (cache inteligente)
├── icon-192.png        # Ícone PWA (192x192)
├── icon-512.png        # Ícone PWA (512x512)
└── ARQUITETURA.md      # Este documento
```

### **Padrão Arquitetural: SPA + MVC Simplificado**

```
┌─────────────────────────────────────────────────────────┐
│                    UI Layer (HTML/CSS)                   │
│  - 5 Views: Home, Jogadores, Amistosos, Campeonatos,    │
│            Ranking, Times (hidden)                       │
│  - Navigation bar (bottom)                               │
│  - Modal system para forms                               │
└─────────────────────────────────────────────────────────┘
                          ↓ (onclick handlers)
┌─────────────────────────────────────────────────────────┐
│              Controller Layer (JavaScript)               │
│  - irPara(view)         // Navegação entre views        │
│  - abrirModal(tipo)     // Abrir modais de ação         │
│  - salvar*()            // Salvar dados (jogadores, etc) │
│  - deletar*()           // Deletar registros             │
│  - sortear*()           // Lógica de sorteios/times      │
└─────────────────────────────────────────────────────────┘
                          ↓ (Fetch API)
┌─────────────────────────────────────────────────────────┐
│          Data Access Layer (Firebase SDK)                │
│  - Firestore: getDocs, addDoc, deleteDoc, updateDoc     │
│  - Auth: signInWithPopup, signOut, onAuthStateChanged   │
│  - Storage: uploadBytes, getDownloadURL                 │
└─────────────────────────────────────────────────────────┘
                          ↓ (HTTPS/WebSocket)
┌─────────────────────────────────────────────────────────┐
│              Backend (Firebase Cloud)                    │
│  - Firestore Database (Collections: jogadores,          │
│    amistosos, campeonatos, times)                       │
│  - Real-time sync & Authentication                      │
│  - Cloud Storage para imagens                           │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Banco de Dados (Firestore Collections)

### **Collections Principais**

#### 1. **jogadores**
```
{
  id: string (auto-generated)
  nome: string
  email?: string
  master: boolean (admin user)
  fotoUrl?: string
  criadoEm: timestamp
}
```

#### 2. **amistosos**
```
{
  id: string
  time1: { nome, jogadores: [...] }
  time2: { nome, jogadores: [...] }
  placar: { time1: number, time2: number }
  status: "sorteando" | "confirmado" | "finalizado"
  criadoEm: timestamp
}
```

#### 3. **campeonatos**
```
{
  id: string
  nome: string
  tipo: "championsLeague" | "brasileirao" | etc
  status: "ativo" | "finalizado"
  fase: "grupos" | "classificatorias"
  participantes: [...]
  grupos: [
    {
      nome: string
      times: [...]
      tabela: [{time, jogos, vitórias, ...}]
    }
  ]
  criadoEm: timestamp
}
```

#### 4. **times**
```
{
  id: string
  nome: string
  escudo?: url
  jogadores: [...]
}
```

---

## 🎯 Principais Funcionalidades

### **Home Dashboard**
- **Stats Cards**: Conta de jogadores, partidas, campeonatos, finalizadas
- **Em Andamento**: Amistosos/campeonatos ativos
- **Top Ranking**: Jogadores com melhor desempenho

### **Jogadores**
- Adicionar/deletar jogadores
- Upload de foto (Firebase Storage)
- Marcar como "Master" (admin)

### **Amistosos**
- Criar sorteios aleatórios de times
- 2 times automáticos com distribuição equilibrada
- Sorteio de seleções (Brasil, Argentina, etc)
- Possibilidade de editar times e marcar placar

### **Campeonatos**
- Tipos: Champions, Brasileirão, Paulistão, Copa do Brasil, Libertadores, Copa do Mundo
- **Fase de Grupos**: Grupos com tabela de classificação
- **Fase Classificatória**: Mata-mata
- Sorteio automático de grupos
- Cálculo automático de tabelas

### **Ranking**
- Histórico de vitórias/derrotas
- Top 10 jogadores por desempenho
- Estatísticas completas

---

## 🔄 Fluxo de Offline & Cache

### **Service Worker Strategy**

```
Firebase/Google APIs
  ↓ (Network-Only)
  └─→ Passa direto (nunca cache)

HTML/Navigation
  ↓ (Network-First)
  └─→ Tenta buscar, fallback para cache

Assets Estáticos
  ↓ (Cache-First)
  └─→ Carrega do cache, fallback network

Arquivos cacheados: index.html, manifest.json
```

**Comportamento**:
- Quando online: Dados do Firebase em tempo real
- Quando offline: Dados locais no cache, UI congelada
- Reabre app: Service Worker restaura última versão conhecida

---

## 🔐 Autenticação & Segurança

### **Fluxo de Auth**
```
1. Usuário clica "Entrar com Google"
2. signInWithPopup() ou signInWithRedirect()
3. Google OAuth retorna token
4. Firebase valida e cria sessão
5. onAuthStateChanged() dispara renderização
6. Redirect para home ou login fallback após 5s
```

### **Dados Sensíveis**
- Fotos: Armazenadas no Firebase Storage (URLs públicas)
- Emails: Salvos opcionalmente no Firestore
- Tokens: Gerenciados pelo Firebase (httpOnly)

---

## 📈 Performance & UX

### **Otimizações Aplicadas**
- ✅ CSS inlined (sem requests externas)
- ✅ JavaScript modular inline (2191 linhas gerenciáveis)
- ✅ Images lazy-loaded (quando necessário)
- ✅ Service Worker para offline
- ✅ PWA installável
- ✅ Dark theme nativo (GPU-friendly)
- ✅ Hardware acceleration (CSS transforms)

### **Tema & Design**
- **Dark theme**: Fundo `#08080F` (OLED-friendly)
- **Gradientes**: Purple → Cyan
- **Cores de ação**: Verde (sucesso), Vermelho (erro), Amarelo (aviso)
- **Glassmorphism**: Cards com backdrop blur

---

## 🚀 Deploy & Ciência

- **Host**: Firebase Hosting (automático com Firestore)
- **Domínio**: Configurável no Firebase Console
- **HTTPS**: Automático (obrigatório para PWA)
- **CDN**: Global (Firebase CDN)

---

## 📋 Requisições Firebase Típicas

### **Listar Jogadores**
```javascript
const snap = await getDocs(
  query(collection(db, 'jogadores'), orderBy('nome'))
);
```

### **Criar Amistoso**
```javascript
await addDoc(collection(db, 'amistosos'), {
  time1, time2, placar, status, criadoEm: serverTimestamp()
});
```

### **Deletar Jogador**
```javascript
await deleteDoc(doc(db, 'jogadores', id));
```

### **Upload de Foto**
```javascript
const ref = storageRef(storage, `fotos/${id}`);
await uploadBytes(ref, arquivo);
const url = await getDownloadURL(ref);
```

---

## 🔄 Fluxo Completo: Criar um Sorteio

```
Usuário clica "+ Criar" (amistosos)
    ↓
Modal abre → seleciona jogadores → clica "Sortear"
    ↓
JS calcula dois times balanceados
    ↓
Sorteio de seleção (Brasil, Argentina, etc)
    ↓
addDoc() → Firestore salva amistoso
    ↓
onAuthStateChanged() dispara re-render
    ↓
Home Dashboard atualiza contadores
    ↓
Service Worker cache a resposta
    ↓
✅ Pronto (online ou offline com última versão)
```

---

## 💡 Decisões Arquiteturais

| Decisão | Razão |
|---------|-------|
| **Vanilla JS** | Sem dependencies, bundle pequeno, offline-friendly |
| **Firebase** | BaaS elimina backend, auth integrado, real-time |
| **Firestore** | NoSQL flexível para campeonatos com grupos dinâmicos |
| **Service Worker** | Funciona offline, PWA installável, cache controle fino |
| **Single HTML** | Deploy simples, cache eficiente, sem build step |
| **Dark Theme** | OLED-friendly, reduz bateria em mobiles, moderno |

---

## 🎮 Tecnologias por Camada

```
┌─────────────────────────────────────────┐
│ UI/UX          │ HTML5 + CSS3 (Vanilla) │
├─────────────────────────────────────────┤
│ JavaScript     │ ES6+ (Vanilla)         │
├─────────────────────────────────────────┤
│ State Mgmt     │ localStorage + Memory   │
├─────────────────────────────────────────┤
│ API Client     │ Firebase SDK (JS)      │
├─────────────────────────────────────────┤
│ Offline        │ Service Worker + Cache │
├─────────────────────────────────────────┤
│ Database       │ Firestore (NoSQL)      │
├─────────────────────────────────────────┤
│ Auth           │ Google OAuth 2.0       │
├─────────────────────────────────────────┤
│ Storage        │ Firebase Storage       │
├─────────────────────────────────────────┤
│ Deploy         │ Firebase Hosting       │
├─────────────────────────────────────────┤
│ PWA            │ Manifest + Service W.  │
└─────────────────────────────────────────┘
```

---

## 🔄 Ciclo de Desenvolvimento

```
1. Editar index.html (tudo em um arquivo)
2. Service Worker detecta mudanças
3. Cache versão nova (data no CACHE name)
4. Usuário atualiza página
5. SW serve versão mais recente
6. Git commit automático ✅
```

---

**Atualizado em**: 2026-04-06
**Versão FutManager**: MVP com todas funcionalidades principais
