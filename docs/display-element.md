# DisplayElement - Especificação Técnica

**Versão:** 1.0.0 | **Data:** 15/01/2026 | **Status:** Rascunho

---

## 1. Visão Geral

### Descrição

O `DisplayElement` é um componente de apresentação base (`dumb component`) responsável por renderizar a estrutura visual fundamental dos elementos interativos do sistema (Clickables). Ele padroniza a composição "Ícone + Texto" utilizada em diversos contextos da aplicação.

### Objetivos

- Centralizar a lógica de apresentação visual dos elementos clicáveis.
- Eliminar duplicação de código entre componentes como `CallToAction`, `MuralOptions`, `CollectionTab`, etc.
- Garantir consistência visual (alinhamento, espaçamento entre ícone e texto) em toda a aplicação.
- Servir como bloco de construção para componentes mais complexos (Wrappers).

### Escopo

- **Incluído:** Renderização de ícone (via `IconRenderer`) e texto/label. Suporte a estilização via classes CSS.
- **Não Incluído:** Lógica de negócios, manipulação de eventos complexos (além de `onClick` básico se necessário, embora idealmente seja gerido pelo pai), ou variações de layout drásticas que fujam do padrão Ícone+Texto.

---

## 2. Requisitos

### Funcionais

- **RF1:** O componente deve aceitar uma configuração de ícone (`IconConfig`) e renderizá-lo.
- **RF2:** O componente deve aceitar um conteúdo de texto (`content`/`label`) e renderizá-lo.
- **RF3:** O componente deve permitir a injeção de classes CSS (`className`) para customização por componentes pai.
- **RF4:** O componente deve suportar estados visuais (ex: ativo/inativo) se passados via props ou classes.

### Não Funcionais

- **Desacoplamento:** O `DisplayElement` não deve saber sobre "CollectionTab" ou "MuralOptions". Ele apenas sabe exibir um ícone e um texto.

---

## 3. Design e Arquitetura

### Conceito

O `DisplayElement` atua como o "núcleo visual". Os componentes existentes (`CallToAction`, `CollectionTab`, etc.) passarão a ser _Wrappers_ ou _Controllers_ que definem o comportamento e o estilo específico, mas delegam a renderização interna para o `DisplayElement`.

### Estrutura Sugerida

```tsx
// Exemplo conceitual de uso nos componentes pai

// src/components/shared/clickable/call-to-action/CallToAction.tsx
export function CallToAction({ payload, config }: Props) {
  // Lógica de click, navegação etc
  return (
    <div className={styles.ctaWrapper} onClick={handleClick}>
      <DisplayElement
        icon={payload.iconConfig}
        label={payload.content}
        className={styles.displayContent}
      />
    </div>
  );
}
```

### Interface (Props)

```typescript
import { IconConfig } from '@/components/shared/icon-renderer/icon/types/app-icon';

export interface DisplayElementProps {
  /**
   * Configuração do ícone a ser renderizado.
   */
  iconConfig: IconConfig;

  /**
   * Texto ou conteúdo a ser exibido ao lado do ícone.
   * Pode ser opcional dependendo do design (ex: botão só ícone).
   */
  label?: string;

  /**
   * Classe CSS para estilização customizada pelo componente pai.
   */
  className?: string;

  /**
   * Estilo inline opcional.
   */
  style?: React.CSSProperties;
}
```

---

## 4. Casos de Uso

### Caso 1: Collection Selector

Drop down que combina o `DisplayElement` com outro ícone ao lado (chevronDown adicionado pelo wrapper -> `CollectionSelector`) e, ao clicar, exibe um modal que permite selecionar entre outros `DisplayElement`s.

---

## 5. Benefícios (Trade-offs)

- **Consistência:** Alterar o espaçamento entre ícone e texto no `DisplayElement` reflete em todo o app.
- **Simplicidade:** Componentes como `CallToAction` ficam mais limpos, focados apenas na lógica de ação (link, modal, etc).
- **Abstração Backend:** Como o backend retorna `DisplayElement` como conceito de classe, o frontend reflete isso diretamente na estrutura de componentes.
