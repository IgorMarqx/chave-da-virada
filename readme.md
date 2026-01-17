# Sistema de Estudos para Concursos – Escopo Técnico

## Como Iniciar o Projeto

### Pré-requisitos
Antes de começar, certifique-se de ter instalado em sua máquina:
- **PHP** >= 8.1
- **Composer** (gerenciador de dependências PHP)
- **Node.js** >= 16.x e **npm** (para assets front-end)
- **MySQL** >= 8.0 ou **PostgreSQL** >= 13
- **Git**

### Passo 1: Clonar o Repositório
```bash
git clone https://github.com/IgorMarqx/chave-da-virada.git
cd chave-da-virada
```

### Passo 2: Criar o Projeto Laravel
Como este repositório contém apenas o escopo técnico, você precisa inicializar um projeto Laravel.

**Opção A: Inicializar Laravel no diretório atual**
```bash
# Mover o readme temporariamente
mv readme.md readme.md.backup

# Instalar Laravel via Composer
composer create-project laravel/laravel temp-laravel

# Mover arquivos do Laravel para o diretório atual (incluindo arquivos ocultos)
shopt -s dotglob
mv temp-laravel/* . 2>/dev/null || true
shopt -u dotglob
rmdir temp-laravel

# Restaurar o readme
rm readme.md
mv readme.md.backup readme.md
```

**Opção B: Criar um novo diretório para o projeto**
```bash
cd ..
composer create-project laravel/laravel chave-da-virada-app "10.*"
cd chave-da-virada-app
# Copie o readme.md do repositório clonado para referência
```

### Passo 3: Configurar Variáveis de Ambiente
Copie o arquivo `.env.example` para `.env` e configure:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
APP_NAME="Sistema de Estudos para Concursos"
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=chave_da_virada
DB_USERNAME=seu_usuario_aqui
DB_PASSWORD=sua_senha_aqui

# Configuração do Gemini AI (Google)
GEMINI_API_KEY=sua_chave_api_gemini

# Configuração de Filas (recomendado: redis ou database)
QUEUE_CONNECTION=database

# Configuração de Storage (local ou s3)
FILESYSTEM_DISK=local
```

### Passo 4: Instalar Dependências

```bash
# Instalar dependências PHP
composer install

# Instalar dependências JavaScript
npm install
```

### Passo 5: Gerar Chave da Aplicação

```bash
php artisan key:generate
```

### Passo 6: Criar e Configurar o Banco de Dados

1. Crie o banco de dados manualmente:
```sql
CREATE DATABASE chave_da_virada CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Execute as migrations (após criar as migrations baseadas no escopo):
```bash
php artisan migrate
```

3. (Opcional) Popular com dados de exemplo:
```bash
php artisan db:seed
```

### Passo 7: Configurar Storage

```bash
# Criar link simbólico para storage público
php artisan storage:link
```

### Passo 8: Compilar Assets

```bash
# Desenvolvimento (com watch)
npm run dev

# Ou para produção
npm run build
```

### Passo 9: Iniciar o Servidor

```bash
# Iniciar servidor de desenvolvimento
php artisan serve
```

Acesse a aplicação em: `http://localhost:8000`

### Passo 10: Configurar Filas (Background Jobs)

Em outro terminal, inicie o worker de filas para processar jobs de IA e extrações:

```bash
php artisan queue:work
```

### Comandos Úteis

```bash
# Limpar cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Executar testes
php artisan test

# Verificar status do sistema
php artisan about
```

### Integração com Gemini AI

Para utilizar a inteligência artificial, você precisa:

1. Criar uma conta no [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Gerar uma API Key do Gemini
3. Adicionar a chave no arquivo `.env`:
```env
GEMINI_API_KEY=sua_chave_aqui
```

4. Instalar o pacote do Gemini:
```bash
composer require google/generative-ai-php
```

### Estrutura de Desenvolvimento

Após a instalação, você deverá implementar:

1. **Models** - Com base nas entidades listadas no escopo
2. **Migrations** - Criar tabelas do banco de dados
3. **Controllers** - Lógica de negócio
4. **Jobs** - Processamento assíncrono (IA e extrações)
5. **Policies** - Controle de acesso
6. **Seeders** - Dados iniciais

### Troubleshooting

**Erro de permissão no storage:**
```bash
chmod -R 775 storage bootstrap/cache

# Para Ubuntu/Debian:
chown -R www-data:www-data storage bootstrap/cache

# Para CentOS/RHEL:
# chown -R apache:apache storage bootstrap/cache

# Para macOS (desenvolvimento local):
# chown -R $(whoami):staff storage bootstrap/cache
```

**Erro de conexão com banco de dados:**
- Verifique se o MySQL/PostgreSQL está rodando
- Confirme as credenciais no arquivo `.env`
- Teste a conexão: `php artisan migrate:status`

**Erro ao processar filas:**
- Verifique se o worker está rodando: `php artisan queue:work`
- Confira os logs em `storage/logs/laravel.log`

**Problemas com Node/NPM:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Visão Geral
Sistema focado em estudos para concursos públicos com:
- Organização por concurso, disciplina e tópico
- Upload de PDFs, Excel e outros arquivos
- Histórico completo de estudos e revisões
- Fluxo de revisão com repetição espaçada
- Metas diárias de estudo
- Inteligência Artificial (Gemini) para resumos, revisões e quizzes
- Arquitetura 100% Laravel-friendly

---

## Principais Funcionalidades
- Cadastro de concursos, disciplinas e tópicos
- Upload e gerenciamento de arquivos de estudo
- Sessões de estudo com controle de tempo
- Revisões automáticas (D+1, D+7, D+30, adaptativas)
- Histórico detalhado de revisões
- Metas diárias personalizáveis
- Geração automática de resumos via IA (Gemini)
- Geração de quizzes/simulados
- Score de domínio por tópico
- Dashboard de risco de esquecimento
- Acompanhamento de metas e consistência (streak)

---

## Modelagem do Banco de Dados
O banco foi modelado para funcionar tanto em MySQL quanto em PostgreSQL,
utilizando padrões compatíveis com Laravel Eloquent.

### Entidades Principais
- users
- concursos
- disciplinas
- topicos
- arquivos
- anotacoes
- estudos
- revisoes
- historico_revisoes
- metas
- metas_diarias
- topico_progresso
- risco_esquecimento
- arquivo_extracoes
- ia_resumos
- ia_interacoes
- quizzes
- quiz_questoes
- quiz_tentativas

Todas as tabelas possuem:
- id BIGINT
- created_at / updated_at
- Foreign Keys explícitas
- Índices nos principais filtros

---

## Fluxo de Estudo
1. Usuário cadastra concurso, disciplina e tópico
2. Define metas diárias (ex: minutos, revisões ou tópicos)
3. Faz upload de PDFs/Excels
4. Sistema extrai o conteúdo em background
5. Usuário estuda (sessão registrada)
6. Revisões são criadas automaticamente
7. IA gera resumo de revisão
8. Usuário revisa e dá feedback
9. Sistema ajusta próximas revisões e atualiza metas do dia

---

## Fluxo de Revisão (Spaced Repetition)
- Revisões possuem data prevista
- Status: pendente, concluída, atrasada
- Feedback do usuário influencia próximos intervalos
- Histórico de revisões é armazenado
- Revisões impactam o score de domínio do tópico

---

## Metas Diárias
O sistema permite que o usuário crie metas recorrentes de estudo, com acompanhamento diário.

### Tipos de Metas
- Tempo de estudo (ex: 120 minutos/dia)
- Quantidade de tópicos estudados
- Quantidade de revisões realizadas
- Quantidade de quizzes/simulados

### Características
- Metas podem ser gerais ou focadas (por concurso, disciplina ou tópico)
- Cada meta gera um registro diário de progresso
- O sistema identifica automaticamente se a meta foi concluída
- Metas alimentam indicadores de consistência (streak)

### Benefícios
- Incentivo à disciplina diária
- Visualização clara de progresso
- Base para recomendações da IA
- Feedback imediato ao usuário

---

## Inteligência Artificial (Gemini)
### Usos da IA
- Resumo automático de PDFs, anotações e estudos
- Revisão guiada antes da prova
- Geração de quizzes por tópico
- Explicação de erros em simulados
- Apoio à priorização de estudos com base em metas e desempenho

### Estratégia Técnica
- Processamento assíncrono (Queues)
- Cache por hash de conteúdo
- Registro de prompts e respostas
- Controle de tokens e custos
- Integração desacoplada (provider Gemini)

---

## Escalabilidade
- IA desacoplada via Jobs
- Possibilidade de microserviço futuro
- Cache de resumos e extrações
- Índices focados em consultas críticas
- Estrutura preparada para grande volume de usuários

---

## Futuras Evoluções
- IA adaptando cronograma completo de estudos
- Sugestão automática de prioridades diárias
- Comparação de desempenho por concurso
- Relatórios avançados de estudo e metas
- Gamificação (badges, níveis, rankings pessoais)

---

## Conclusão
Este escopo define um sistema robusto, escalável e pronto para produção,
com foco em performance, consistência diária, experiência do usuário
e inteligência aplicada ao estudo.
