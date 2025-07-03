# Sidebar do Portal Escolar

Este documento explica como usar a Sidebar do shadcn/ui implementada no portal escolar.

## Componentes Criados

### 1. AppSidebar (`src/components/app-sidebar.tsx`)
Componente principal da sidebar customizado para o portal escolar. Suporta diferentes tipos de usuário:
- **admin**: Dashboard, gerenciamento de usuários, turmas, professores e relatórios
- **professor**: Dashboard, turmas, frequência, notas e disciplinas  
- **secretaria**: Dashboard, alunos, matrículas e relatórios
- **responsavel**: Dashboard, calendário, boletim e frequência

### 2. LayoutWithSidebar (`src/components/layout-with-sidebar.tsx`)
Layout completo que inclui a sidebar, header com breadcrumbs e área de conteúdo.

### 3. Exemplos (`src/components/sidebar-examples.tsx`)
Diferentes variações da sidebar:
- Sidebar básica com grupos
- Sidebar floating 
- Sidebar inset

## Como Usar

### Uso Básico

```tsx
import { LayoutWithSidebar } from '@/components/layout-with-sidebar'

export function MinhaPageComSidebar() {
  const breadcrumbs = [
    { title: "Dashboard", url: "/dashboard" },
    { title: "Minha Página" }
  ]

  return (
    <LayoutWithSidebar 
      userType="admin" 
      currentPath="/minha-pagina"
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-6">
        <h1>Conteúdo da minha página</h1>
        {/* Seu conteúdo aqui */}
      </div>
    </LayoutWithSidebar>
  )
}
```

### Propriedades

#### LayoutWithSidebar
- `userType`: Tipo de usuário ('admin' | 'professor' | 'secretaria' | 'responsavel')
- `currentPath`: Caminho atual para destacar o item ativo (opcional)
- `breadcrumbs`: Array de breadcrumbs para navegação (opcional)
- `children`: Conteúdo da página

#### AppSidebar
- `userType`: Tipo de usuário
- `currentPath`: Caminho atual (opcional)

## Funcionalidades

### 1. Responsivo
- **Desktop**: Sidebar recolhível com ícones
- **Mobile**: Sidebar como sheet/drawer lateral

### 2. Estados da Sidebar
- **Expanded**: Sidebar completa com textos
- **Collapsed**: Apenas ícones com tooltips
- **Hidden**: Completamente oculta (mobile)

### 3. Variantes Disponíveis
- **sidebar**: Padrão, fixada na lateral
- **floating**: Com sombra e bordas arredondadas
- **inset**: Com margem interna

### 4. Atalhos de Teclado
- **Ctrl/Cmd + B**: Alternar sidebar

## Personalização

### Modificar Menus por Tipo de Usuário

Edite o objeto `menuData` em `src/components/app-sidebar.tsx`:

```tsx
const menuData = {
  admin: [
    {
      title: "Novo Item",
      url: "/novo-item",
      icon: NovoIcon,
    },
    {
      title: "Grupo com Submenu",
      icon: GrupoIcon,
      items: [
        {
          title: "Subitem",
          url: "/subitem",
          icon: SubIcon,
        }
      ]
    }
  ],
  // ... outros tipos
}
```

### Personalizar Estilos

A sidebar usa as variáveis CSS do sistema de design. Para personalizar cores:

```css
:root {
  --sidebar-background: hsl(var(--background));
  --sidebar-foreground: hsl(var(--foreground));
  --sidebar-primary: hsl(var(--primary));
  --sidebar-primary-foreground: hsl(var(--primary-foreground));
  --sidebar-accent: hsl(var(--accent));
  --sidebar-accent-foreground: hsl(var(--accent-foreground));
  --sidebar-border: hsl(var(--border));
  --sidebar-ring: hsl(var(--ring));
}
```

## Exemplo Completo

Veja `src/components/admin-dashboard-with-sidebar.tsx` para um exemplo completo de como integrar uma página existente com a sidebar.

## Componentes do shadcn/ui Utilizados

- `Sidebar` e todos os subcomponentes
- `Breadcrumb` para navegação
- `Separator` para divisores
- `Button` para triggers
- `Sheet` para versão mobile
- `Tooltip` para dicas em modo collapsed
- `DropdownMenu` para menus contextuais

## Migração de Páginas Existentes

Para migrar uma página existente:

1. Importe o `LayoutWithSidebar`
2. Envolva seu conteúdo com o layout
3. Defina o `userType` apropriado
4. Configure os `breadcrumbs` se necessário
5. Ajuste as classes CSS se usar dark theme customizado

```tsx
// Antes
export function MinhaPage() {
  return (
    <div className="bg-black/20 min-h-screen">
      {/* conteúdo */}
    </div>
  )
}

// Depois  
export function MinhaPage() {
  return (
    <LayoutWithSidebar userType="admin" currentPath="/minha-page">
      <div className="space-y-6">
        {/* conteúdo */}
      </div>
    </LayoutWithSidebar>
  )
}
```
