# Portal Escolar - Plataforma de Gestão Acadêmica

![Banner do Portal Escolar](https://placehold.co/1200x400/646cff/FFFFFF?text=Portal+Escolar)

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite">
  <img src="https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=3ECF8E" alt="Supabase">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
</p>

## 📌 Sobre o Projeto

O **Portal Escolar** é uma plataforma web moderna desenhada para digitalizar e otimizar a gestão acadêmica de instituições de ensino. O sistema centraliza o registo de notas e frequência, oferecendo dashboards intuitivos para análise de desempenho e permitindo que professores, administradores, alunos e responsáveis acedam a informações cruciais de forma segura e segmentada.

O projeto foi construído com uma stack de tecnologias modernas, focada em performance, escalabilidade e uma excelente experiência de utilizador.

---

## ✨ Funcionalidades Implementadas

Atualmente, a plataforma conta com as seguintes funcionalidades:

* **Autenticação Segura:** Sistema de login por email e senha.
* **Controlo de Acesso por Perfil (RLS):**
    * **Professor:** Acesso restrito às suas próprias turmas.
    * **Admin:** Acesso total aos dados da escola.
    * **Responsável / Aluno:** (Em desenvolvimento) Acesso apenas aos seus próprios dados.
* **Gestão de Frequência:** Professores podem selecionar uma turma e registar a presença ou ausência dos alunos para uma data específica.
* **Lançamento de Notas:** Professores podem selecionar uma turma, um aluno e lançar notas por matéria e data.
* **Dashboard de Desempenho:** Visualização de gráficos com dados agregados (atualmente, percentual de presença por aluno).

---

## 🚀 Tecnologias Utilizadas

A arquitetura do projeto foi pensada para ser robusta, rápida e escalável, utilizando as seguintes tecnologias:

| Tecnologia | Função no Projeto |
| :--- | :--- |
| **React** | Biblioteca principal para a construção da interface de utilizador reativa. |
| **Vite** | Ferramenta de build extremamente rápida para o desenvolvimento do frontend. |
| **TypeScript** | Garante a segurança e a previsibilidade do código através da tipagem estática. |
| **Supabase** | Backend-as-a-Service que oferece banco de dados PostgreSQL, autenticação e APIs. |
| **PostgreSQL** | Banco de dados relacional poderoso, utilizado pelo Supabase. |
| **Recharts** | Biblioteca para a criação de gráficos e dashboards interativos. |

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
    * Crie um ficheiro chamado `.env.local` na raiz do projeto.
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

-   [ ] **Desenvolver a Área do Responsável:** Permitir que pais e responsáveis visualizem as notas e frequências dos seus filhos.
-   [ ] **Melhorar os Dashboards:** Adicionar mais métricas e gráficos para a gestão.
-   [ ] **Integração com IA:** Utilizar o ChatGPT para gerar relatórios automáticos de desempenho para os pais.
-   [ ] **Notificações Automáticas:** Criar alertas para responsáveis quando um aluno atingir um determinado número de faltas ou notas baixas.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o ficheiro `LICENSE` para mais detalhes.

