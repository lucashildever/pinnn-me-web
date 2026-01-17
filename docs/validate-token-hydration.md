# Validate Token com Retorno de Dados do Usuário - Especificação Técnica

**Status:** implemented

---

## 1. Visão Geral

Endpoint `/auth/validate` (backend) para retorna dados do usuário (incluindo `activeMuralId`) quando o token é válido. Isso permite que o frontend rehidrate o estado Redux após refresh de página.

### Problema

O Redux não persiste entre refreshes. O `activeMuralId` é setado apenas no login/signup. Quando o usuário dá refresh:

1. Token ainda válido no localStorage ✅
2. Estado Redux reiniciado → `activeMuralId = ''` ❌
3. Componentes que dependem de `activeMuralId` falham

### Solução

Backend retorna dados do usuário na validação de token, frontend atualiza Redux.

---

## 2. Requisitos

### Funcionais

- **RF1:** Endpoint `/auth/validate` retorna dados do usuário quando token válido
- **RF2:** Frontend atualiza `activeMuralId` no Redux após validação bem-sucedida
- **RF3:** Manter retrocompatibilidade (resposta ainda tem campo `valid` ou equivalente)

### Não Funcionais

- Não aumentar significativamente latência da validação
- Resposta consistente com formato de login/signup

---

## 3. Decisões Técnicas

- **Reutilizar estrutura existente:** Resposta similar ao login para consistência
- **Validação centralizada:** Criar hook/provider para validação + hidratação do estado

---

## 4. Design e Arquitetura

### 4.1 Resposta do Backend

**Endpoint:** `GET /auth/validate`

**Headers:** `Authorization: Bearer <token>`

**Resposta atual:**

```json
{ "success": true }
```

**Nova resposta:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "{USER_ID}",
      "email": "{USER_EMAIL}",
      "username": "{USERNAME}",
      "activeMuralId": "{ACTIVE_MURAL_ID}"
    }
  }
}
```

### 4.2 Mudança no Frontend

**Arquivo:** `src/lib/api-client/apiClient.ts`

```typescript
// Antes
validateToken: async (): Promise<boolean> => { ... }

// Depois
validateToken: async (): Promise<FetcherResponse<{ user: AuthUser }>> => { ... }
```

---

## 5. Comportamento

### Fluxo: Refresh de Página Autenticada

1. Usuário acessa página protegida (ex: `/create/resource`)
2. Componente/Provider chama `validateToken()`
3. Backend valida token e retorna dados do usuário
4. Frontend faz dispatch de `setActiveMuralId(user.activeMuralId)`
5. Estado Redux rehidratado, componentes funcionam normalmente

### Fluxo: Token Inválido/Expirado

1. Backend retorna `{ success: false }`
2. Frontend limpa localStorage e redireciona para login

---

## 6. Trade-offs

### Retornar dados na validação vs. chamada separada

- ✅ Uma única requisição (menos latência)
- ✅ Pattern consistente com login
- ❌ Validação retorna mais dados que antes
- 🔧 Dados mínimos (apenas o essencial)

---

## 7. TODO - Implementação

**Status:** implemented

### Backend

#### 1. Modificar resposta do `/auth/validate`

- **Arquivo:** `src/auth/auth.controller.ts` ou `auth.service.ts`
- **Ação:** Modificar
- **Descrição:** Retornar dados do usuário (id, email, username, activeMuralId) quando token válido

---

### Frontend

#### 2. Atualizar tipo de retorno do `validateToken`

- **Arquivo:** `src/lib/api-client/apiClient.ts`
- **Ação:** Modificar
- **Descrição:** Mudar retorno de `Promise<boolean>` para `Promise<FetcherResponse<{ user: AuthUser }>>`

#### 3. Atualizar consumidores do `validateToken`

- **Arquivo:** `src/app/(manage)/create/resource/page.tsx`
- **Ação:** Modificar
- **Descrição:** Após validação bem-sucedida, fazer dispatch de `setActiveMuralId`

#### 4. Criar AuthProvider centralizado

- **Arquivo:** `src/providers/AuthProvider.tsx` (novo)
- **Ação:** Criar
- **Descrição:** Provider que valida token no mount e hidrata estado Redux. Remove lógica duplicada de páginas protegidas.

**Ordem de Execução:** 1 (backend) → 2 → 3 → 4 (opcional)
