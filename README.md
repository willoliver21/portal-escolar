# Portal Escolar - Plataforma de Gestão Acadêmica

![Banner do Portal Escolar](https://placehold.co/1200x400/06b6d4/FFFFFF?text=Portal+Escolar)

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite">
  <img src="https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=3ECF8E" alt="Supabase">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
</p>

## 📌 Sobre o Projeto

O **Portal Escolar** é uma plataforma web moderna e responsiva, desenhada para digitalizar e otimizar a gestão acadêmica. Com uma interface de utilizador elegante, que utiliza um fundo em gradiente e elementos com efeito de "vidro" (Glassmorphism), o sistema oferece uma experiência visualmente apelativa e intuitiva.

A plataforma centraliza o registo de notas e frequência, permitindo que professores, administradores, e responsáveis acedam a informações cruciais de forma segura e segmentada através de painéis de controlo dedicados.

---

## 📸 Capturas de Ecrã

*(Sugestão: Adicione aqui as novas capturas de ecrã do projeto para mostrar o design atualizado!)*

| Tela de Login | Dashboard do Administrador |
| :-----------: | :------------------------: |
| *(imagem)* | *(imagem)* |

| Lançamento de Notas | Registo de Frequência |
| :-----------: | :------------------------: |
| *(imagem)* | *(imagem)* |


---

## ✨ Funcionalidades Implementadas

*   **Autenticação Segura:** Ecrã de login moderno com validação de utilizador via Supabase.
*   **Interface Unificada:** Todas as telas partilham uma identidade visual coesa, com fundo em gradiente e componentes com efeito de "vidro".
*   **Controlo de Acesso por Perfil (RLS):**
    *   **Administrador:** Acesso a um dashboard com estatísticas chave da escola (total de alunos, turmas) e um gráfico de percentual de presença geral.
    *   **Professor:** Acesso a painéis dedicados para o lançamento de notas e o registo de frequência dos alunos nas suas turmas.
    *   **Responsável / Aluno:** Acesso a um painel de controlo que exibe a média geral, o total de faltas, e as listas das últimas notas e presenças do aluno.
*   **Gestão de Frequência:** Interface intuitiva para professores marcarem a presença dos alunos por data, com um *toggle switch* moderno.
*   **Lançamento de Notas:** Formulário dedicado para que professores possam lançar notas por matéria, aluno e data.

---

## 🚀 Tecnologias Utilizadas

| Tecnologia | Função no Projeto |
| :--- | :--- |
| **React** | Biblioteca principal para a construção da interface de utilizador reativa. |
| **Vite** | Ferramenta de build extremamente rápida para o desenvolvimento do frontend. |
| **TypeScript** | Garante a segurança e a previsibilidade do código através da tipagem estática. |
| **Supabase** | Backend-as-a-Service que oferece banco de dados PostgreSQL, autenticação e APIs. |
| **PostgreSQL** | Banco de dados relacional poderoso, utilizado pelo Supabase. |
| **Tailwind CSS** | Framework de eleição para a criação de uma interface de utilizador moderna e responsiva, com suporte para o efeito de *glassmorphism*. |
| **Recharts** | Biblioteca para a criação de gráficos e dashboards interativos. |
| **Lucide React** | Biblioteca de ícones leve e customizável para uma UI mais limpa. |

---

## ⚙️ Como Executar o Projeto Localmente

Para executar o projeto no seu ambiente de desenvolvimento, siga os passos abaixo.

### Pré-requisitos
* [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
* [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/portal-escolar.git](https://github.com/seu-usuario/portal-escolar.git)
    cd portal-escolar
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    * Crie um ficheiro chamado `.env` na raiz do projeto.
    * Adicione as suas chaves do projeto Supabase a este ficheiro:
        ```env
        VITE_SUPABASE_URL="[https://sua-url-do-projeto.supabase.co](https://sua-url-do-projeto.supabase.co)"
        VITE_SUPABASE_ANON_KEY="sua-chave-anon-publica-aqui"
        ```

4.  **Execute o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

A aplicação estará disponível em `http://localhost:5173` (ou na porta que o Vite indicar).

---

## 🗃️ Estrutura do Banco de Dados (Supabase)

A estrutura atual do banco de dados está organizada da seguinte forma:

* `profiles`: Armazena dados adicionais dos utilizadores (nome, perfil/role).
* `alunos`: Lista de todos os alunos.
* `turmas`: Registo das turmas da escola (ex: "9º Ano A").
* `notas`: Registo das notas dos alunos, associadas a uma matéria.
* `frequencias`: Registo de presença/ausência dos alunos.
* `matriculas`: Tabela de associação que liga `alunos` a `turmas`.
* `turmas_professores`: Tabela de associação que liga `profiles` (de professores) a `turmas`.

---

## 🔮 Próximos Passos

O projeto está em desenvolvimento ativo. As próximas funcionalidades planeadas são:

-   [x] **Desenvolver a Área do Responsável:** Permitir que pais e responsáveis visualizem as notas e frequências dos seus filhos.
-   [x] **Modernizar a Interface do Utilizador:** Implementar um design coeso em toda a aplicação.
-   [ ] **Melhorar os Dashboards:** Adicionar mais métricas e gráficos para a gestão (ex: média de notas por turma, evolução do aluno).
-   [ ] **Notificações Automáticas:** Criar alertas para responsáveis quando um aluno atingir um determinado número de faltas ou notas baixas.
-   [ ] **Refatorar para Componentes Reutilizáveis:** Otimizar o código, criando componentes genéricos para tabelas, cartões e inputs.
-   [ ] **Testes Automatizados:** Implementar testes unitários e de integração para garantir a estabilidade do código.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o ficheiro `LICENSE` para mais detalhes.

