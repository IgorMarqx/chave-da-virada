
# Sistema de Estudos para Concursos – Escopo Técnico

## Visão Geral
Sistema focado em estudos para concursos públicos com:
- Organização por concurso, disciplina e tópico
- Upload de PDFs, Excel e outros arquivos
- Histórico completo de estudos e revisões
- Fluxo de revisão com repetição espaçada
- Inteligência Artificial (Gemini) para resumos, revisões e quizzes
- Arquitetura 100% Laravel-friendly

---

## Principais Funcionalidades
- Cadastro de concursos, disciplinas e tópicos
- Upload e gerenciamento de arquivos de estudo
- Sessões de estudo com controle de tempo
- Revisões automáticas (D+1, D+7, D+30, adaptativas)
- Histórico detalhado de revisões
- Geração automática de resumos via IA (Gemini)
- Geração de quizzes/simulados
- Score de domínio por tópico
- Dashboard de risco de esquecimento

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
2. Faz upload de PDFs/Excels
3. Sistema extrai o conteúdo em background
4. Usuário estuda (sessão registrada)
5. Revisões são criadas automaticamente
6. IA gera resumo de revisão
7. Usuário revisa e dá feedback
8. Sistema ajusta próximas revisões

---

## Fluxo de Revisão (Spaced Repetition)
- Revisões possuem data prevista
- Status: pendente, concluída, atrasada
- Feedback do usuário influencia próximos intervalos
- Histórico de revisões é armazenado

---

## Inteligência Artificial (Gemini)
### Usos da IA
- Resumo automático de PDFs, anotações e estudos
- Revisão guiada antes da prova
- Geração de quizzes por tópico
- Explicação de erros em simulados

### Estratégia Técnica
- Processamento assíncrono (Queues)
- Cache por hash de conteúdo
- Registro de prompts e respostas
- Controle de tokens e custos

---

## Escalabilidade
- IA desacoplada via Jobs
- Possibilidade de microserviço futuro
- Cache de resumos e extrações
- Índices focados em consultas críticas

---

## Futuras Evoluções
- IA adaptando cronograma completo de estudos
- Sugestão automática de prioridades
- Comparação de desempenho por concurso
- Exportação de relatórios

---

## Conclusão
Este escopo define um sistema robusto, escalável e pronto para produção,
com foco em performance, experiência do usuário e inteligência aplicada ao estudo.
