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
