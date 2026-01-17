# Active Mural ID in Global State - Especificação Técnica

**Status:** implemented

---

## 1. Visão Geral

Suporte ao `activeMuralId` no frontend, capturando-o na resposta de autenticação (login/signup) e armazenando no estado global via Redux.

### Contexto

- Um usuário pode ter **múltiplos murais**
- O backend já implementa o conceito de **"mural ativo"** — cada usuário tem 1 mural ativo por vez
- Na resposta de login/signup, o backend retorna `activeMuralId` dentro do objeto `user`
- O frontend precisa capturar este ID e armazená-lo no estado global para:
  - Determinar contexto de edição (ver como editor vs visitante)
  - Usar em requisições que dependem do mural ativo (ex: criar recursos, listar coleções)

### Formato da Resposta do Backend

```json
{
  "success": true,
  "data": {
    "access_token": "{ACCESS_TOKEN}",
    "user": {
      "id": "{USER_ID}",
      "email": "{USER_EMAIL}",
      "username": "{USERNAME}",
      "activeMuralId": "{ACTIVE_MURAL_ID}"
    }
  }
}
```

---

## 2. Requisitos

### Funcionais

- **RF1:** Capturar `activeMuralId` da resposta de login
- **RF2:** Capturar `activeMuralId` da resposta de signup
- **RF3:** Armazenar `activeMuralId` no estado global (Redux)
- **RF4:** Disponibilizar seletor para acessar `activeMuralId` em qualquer componente

### Não Funcionais

- Manter compatibilidade com consumidores existentes de `muralSlice`
- Nomenclatura clara e semântica (`activeMuralId` vs `id`)

---

## 3. Decisões Técnicas

- **Renomeação:** `id` → `activeMuralId`, `setMuralId` → `setActiveMuralId`, `selectMuralId` → `selectActiveMuralId`
- **Justificativa:** Maior clareza semântica sobre o propósito do estado

---

## 4. Estruturas de Dados

### AuthUser (atualizado)

```typescript
export interface AuthUser {
  id: string;
  email: string;
  username: string;
  activeMuralId: string; // NOVO
}
```

### MuralState (atualizado)

```typescript
export interface MuralState {
  activeMuralId: string; // renomeado de 'id'
}
```

---

## 5. Comportamento

### Fluxo: Login/Signup com Active Mural

1. Usuário submete formulário de login ou signup
2. Backend processa autenticação e retorna dados incluindo `activeMuralId`
3. `AuthForm` recebe resposta de sucesso
4. Dispatch de `setActiveMuralId(result.data.user.activeMuralId)` para Redux
5. Estado global atualizado, disponível via `selectActiveMuralId`
6. Redirecionamento para `/dashboard`

---

## 6. Trade-offs

### Renomear `id` → `activeMuralId`

- ✅ Maior clareza semântica
- ❌ Requer migração nos consumidores existentes
- 🔧 Mitigação: Busca global por `selectMuralId` e `setMuralId`

---

## 7. TODO - Implementação

**Status:** implemented

Todas as tarefas foram concluídas ✅

### ~~1. Adicionar `activeMuralId` ao tipo `AuthUser`~~ ✅

- **Arquivo:** `src/lib/api-client/types/auth.ts`
- **Ação:** Modificar
- **Descrição:** Adicionada propriedade `activeMuralId: string` à interface `AuthUser`

### ~~2. Renomear estado/actions no `muralSlice`~~ ✅

- **Arquivo:** `src/lib/state/slices/muralSlice.ts`
- **Ação:** Modificar
- **Descrição:** Renomeado `muralState` → `MuralState`, `id` → `activeMuralId`, `setMuralId` → `setActiveMuralId`, `selectMuralId` → `selectActiveMuralId`

### ~~3. Despachar `setActiveMuralId` no AuthForm~~ ✅

- **Arquivo:** `src/components/auth-form/AuthForm.tsx`
- **Ação:** Modificar
- **Descrição:** Adicionado import de `setActiveMuralId` e dispatch nos callbacks `onSuccess` de login e signup

### ~~4. Migrar consumidores existentes~~ ✅

- **Arquivos:** `ShareHistory.tsx`, `page.tsx`, `MuralContainer.tsx`
- **Ação:** Migrar
- **Descrição:** Atualizados imports e referências para usar nova nomenclatura

**Implementação concluída em:** 2026-01-17
