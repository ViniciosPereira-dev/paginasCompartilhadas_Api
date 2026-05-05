# 📚 Paginas Compartilhadas API

## 🎯 Contexto e Problema
O acesso à leitura ainda é limitado para muitas pessoas, seja por questões financeiras ou pela falta de disponibilidade de livros em determinadas regiões.  
Ao mesmo tempo, muitos leitores possuem livros parados em casa que poderiam ser reutilizados.  

O problema que buscamos resolver é justamente essa **desconexão entre quem tem livros para doar e quem deseja recebê-los**.

---

## 👥 Público-Alvo
- Estudantes que precisam de livros para apoiar seus estudos.  
- Leitores que desejam ampliar seu acervo sem custo.  
- Pessoas que possuem livros em casa e querem doar para dar continuidade ao ciclo de leitura.  

---

## 💡 Solução Desenvolvida
Criamos uma plataforma web que:  
- Permite que usuários se cadastrem e disponibilizem livros para doação.  
- Facilita a solicitação de livros por outros usuários.  
- Garante organização e transparência por meio de um fluxo de requisição com status (PENDING, ACCEPTED, REJECTED, FINALIZED).  
- Utiliza o WhatsApp como canal externo de comunicação para combinar a entrega.  
- Inclui um **microserviço de recomendação**, que sugere livros disponíveis de forma aleatória ou filtrada por gênero, tornando a experiência mais dinâmica. 

## 🏗️ Arquitetura da Solução

A aplicação foi desenvolvida em **Node.js** com **Express** e utiliza o **Prisma ORM** para comunicação com o banco de dados.  
O sistema é composto por três entidades principais:

- **Usuário (User)** → ponto central da aplicação, responsável por cadastrar e solicitar livros.  
- **Livro (Book)** → recurso disponibilizado para doação.  
- **Requisição (Request)** → conecta usuário e livro, controlando o fluxo da doação.  

### 🔗 Diagrama Simplificado
## 🏗️ Arquitetura da Solução

![Diagrama da Arquitetura](./public/diagramasimplificado.svg)



Fluxo: **Usuário cria conta → cadastra livro → outro usuário solicita → requisição conecta os dois → status controla o processo.**

---

## ⚙️ Microsserviço de Recomendação

O sistema conta com um **microsserviço independente**, responsável por recomendar livros disponíveis, podendo filtrar por gênero.  
Ele roda em outra porta e consulta a API principal para buscar os livros cadastrados.

- **Entrada**: requisição para `/recommendation?genre=...`  
- **Processo**: consulta a API principal, filtra livros com status `AVAILABLE` e seleciona um aleatório.  
- **Saída**: retorna dados do livro recomendado e informações do dono (nome e telefone).  

📂 Repositório do Microsserviço: [PaginasCompartilhadas-Recommendation](https://github.com/ViniciosPereira-dev/recommendationsService)
  

### 🎯 Justificativa da Arquitetura
A escolha por microsserviço foi feita para:
- Garantir **modularidade**: recomendação funciona separada da API principal.  
- Facilitar **escalabilidade**: pode ser expandido ou substituído sem impactar o núcleo da aplicação.  
- Demonstrar **boas práticas** de arquitetura distribuída.  

## 🔌 Demonstração da API

A seguir, alguns exemplos de requisições realizadas via **Postman**, evidenciando o funcionamento da aplicação.  
Foram escolhidos três endpoints principais para demonstrar o fluxo do sistema:

### 1. Criar Usuário – `POST /users`
Entrada:
<img width="1471" height="553" alt="Captura de tela 2026-05-05 100429" src="https://github.com/user-attachments/assets/86564065-e1c4-442f-b4cc-49d3287b0b42" />
Saida: 
<img width="1472" height="730" alt="Captura de tela 2026-05-05 100445" src="https://github.com/user-attachments/assets/f0b3c607-5b4d-4adf-99e2-a101f82e7820" />

### 2. Listar Livros – `GET /books`
Saida:
<img width="1463" height="744" alt="Captura de tela 2026-05-05 101334" src="https://github.com/user-attachments/assets/8b321aad-c912-4bba-b824-48a23aff183b" />

### 3. Solicitar Livros – `POST /requests`
Entrada: 
<img width="1468" height="600" alt="Captura de tela 2026-05-05 101655" src="https://github.com/user-attachments/assets/1217ff94-d86d-42a6-b51d-91f24dcc0c3e" />
Saida:
<img width="1462" height="737" alt="Captura de tela 2026-05-05 101835" src="https://github.com/user-attachments/assets/df6e6b64-dbfb-45ea-916c-323e14e87616" />

## 📋 Gestão do Projeto com Jira

A organização do desenvolvimento foi feita utilizando o **Jira**, com backlog, tarefas e sprints.  
Cada integrante ficou responsável por atividades específicas, e o quadro foi usado para acompanhar o progresso em tempo real.

🔗 [Acesse o Board do Jira]([https://link-do-seu-jira](https://gabrielgimenesvot.atlassian.net/jira/software/projects/SCRUM/boards/1)

---

## 📑 Documentação com Confluence

Toda a documentação do projeto está estruturada no **Confluence**, incluindo:  
- Descrição do projeto  
- Arquitetura da solução  
- Documentação da API  
- Regras de negócio  

Essa documentação apoia o entendimento e a manutenção futura do sistema.

🔗 [Acesse a Documentação no Confluence]([https://link-do-seu-confluence](https://gabrielgimenesvot.atlassian.net/wiki/spaces/PC/pages/25919489/ndice)

---

## ✅ Encerramento

O projeto entregou uma plataforma funcional de doação de livros, com API robusta, microsserviço de recomendação e gestão ágil.  
Como próximos passos, pensamos em evoluir para notificações automáticas e integração com outros canais, ampliando o acesso à leitura e fortalecendo a comunidade de leitores.













