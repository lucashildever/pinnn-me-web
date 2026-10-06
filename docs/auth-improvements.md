# Melhorias na Autenticação (Frontend) - Especificação Técnica

**Status:** implemented

---

## 1. Visão Geral

Este documento detalha as mudanças necessárias no **frontend** (`pinnn-me-web`) para suportar a autenticação segura com **Refresh Tokens** e melhorar a experiência do usuário com redirecionamentos automáticos e proteção de rotas (`AuthGuard`). O objetivo é remover a lógica manual e repetitiva de `localStorage` dos componentes e centralizá-la.

## 2. Requisitos

- **Auth Context:** Gerenciamento global de estado de autenticação (`user`, `token`, `isAuthenticated`).
- **Persistência Segura:** Armazenamento seguro de tokens (preferencialmente em memória para access tokens + cookie httpOnly para refresh, ou armazenamento local com rotação rápida se cookies não forem viáveis na arquitetura atual).
  - _Nota:_ Assumiremos `localStorage` para refresh token por enquanto (devido à simplicidade do setup atual e API stateless), mas com rotação.
- **AuthGuard:** Componente/HOC para proteger rotas privadas (Dashboard, Settings, etc) e redirecionar não-autenticados para `/login`.
- **Interceptadores de API:**
  - Injeção automática do token em requisições.
  - Tratamento global de erros `401 Unauthorized` -> Tentar refresh transparente -> Se falhar, logout.

## 3. Decisões Técnicas

- **State Management:** React Context API (`AuthProvider`).
- **Routing:** Next.js App Router.
  - Proteção via Middleware (ideal) ou Component Wrapper (`AuthGuard.tsx`) em layouts protegidos.
- **API Client:** Melhoria no wrapper atual `fetcher` (em `src/lib/api-client/helpers/request.ts`) para suportar interceptação e retentativa (retry logic) para o refresh token.

## 4. Design e Arquitetura

### AuthContext (`src/providers/auth-provider.tsx`)

Estado global acessível via hook `useAuth()`:

```typescript
interface AuthContextType {
  user: User | null;
  SignIn: (credentials) => Promise<void>;
  SignOut: () => void;
  isLoading: boolean;
}
```

### AuthGuard Flow (`src/components/auth-guard.tsx`)

Wrapper para páginas protegidas:

```tsx
// Exemplo de uso no layout.tsx do dashboard
export default function DashboardLayout({ children }) {
  return <AuthGuard>{children}</AuthGuard>;
}
```

Lógica:

1.  Verifica se `isLoading`. Se sim, renderiza Loading Spinner.
2.  Verifica se `!user`. Se sim, router.push('/login').
3.  Se `user`, renderiza `children`.

### API Client Interceptor Logic

Na função `fetcher` atual:

1.  Fazer request normal.
2.  Se resposta for `401`:
    - Verificar se temos um refresh token.
    - Se sim, chamar endpoint `/auth/refresh`.
    - Se sucesso, salvar novo token e refazer a request original com o novo token.
    - Se falha (refresh expirado), limpar estado e redirecionar para login.

## 5. TODO - Implementação

**Status:** implemented

~~**1. Contexto de Autenticação**~~ ✅

- ~~Arquivo: `src/components/providers/auth-provider/AuthProvider.tsx` [MODIFY]~~
- ~~Descrição: Reescrito completamente para gerenciar estado de autenticação global com métodos SignIn/SignOut e refresh automático.~~
- ~~Arquivo: `src/components/providers/providers.tsx` [MODIFY]~~
- ~~Descrição: AuthProvider integrado na árvore de providers.~~

~~**2. Componente AuthGuard**~~ ✅

- ~~Arquivo: `src/components/auth-guard.tsx` [NEW]~~
- ~~Descrição: Componente criado para proteção de rotas com loading state e redirect.~~
- ~~Arquivo: `src/app/dashboard/layout.tsx` [NEW]~~
- ~~Descrição: Layout criado com AuthGuard aplicado para proteger todas as rotas do dashboard.~~

~~**3. Atualizar API Client**~~ ✅

- ~~Arquivo: `src/lib/api-client/helpers/request.ts` [MODIFY]~~
- ~~Descrição: Implementado interceptor automático com:~~
  - ~~Injeção automática de token~~
  - ~~Detecção de 401 e tentativa de refresh~~
  - ~~Retry da requisição original com novo token~~
  - ~~Prevenção de loops de refresh~~
- ~~Arquivo: `src/lib/api-client/types/auth.ts` [MODIFY]~~
- ~~Descrição: Adicionado suporte para refresh_token nos tipos.~~
- ~~Arquivo: `src/lib/api-client/apiClient.ts` [MODIFY]~~
- ~~Descrição: Adicionados endpoints `refresh` e `logout`.~~

~~**4. Página de Login/Register**~~ ✅

- ~~Arquivo: `src/components/auth-form/AuthForm.tsx` [MODIFY]~~
- ~~Descrição: Refatorado para usar `useAuth().SignIn`, removendo chamadas manuais de localStorage e Redux dispatch.~~
