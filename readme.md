# Sistema de Estudos para Concursos – Escopo Técnico

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
