# 🧾 UniGestor – Sistema de Gestão para Lojas Alimentícias

**UniGestor** é um sistema completo de gestão voltado para lojas do ramo alimentício, como açaíterias, lanchonetes, sorveterias e pequenos comércios. Desenvolvido no modelo **SaaS (Software como Serviço)**, o sistema permite que lojistas controlem seus pedidos, estoques, finanças, usuários e fluxo de caixa em um único painel simples e intuitivo.

---

## 🚀 Tecnologias Utilizadas

Frontend com React, Vite, Tailwind CSS, React Router DOM e Axios (com configuração JWT).  
Backend com Node.js, Express, PostgreSQL, Sequelize ORM, autenticação com JWT e uso de variáveis de ambiente via Dotenv.

---

## ⚙️ Funcionalidades

Autenticação com JWT, com login por tipo de usuário (admin, caixa, estoquista, entregador) e redirecionamento automático com base no perfil.  
Módulo de Estoque com cadastro de produtos com unidade e custo, baixa manual por uso ou perda e controle de quem fez cada movimentação.  
Módulo de Pedidos com criação e visualização por lojistas, acompanhamento por entregadores, campo de descrição e valor do pedido.  
Módulo Financeiro com controle de entradas e saídas, saldo total e lançamentos.  
Módulo de Caixa com abertura e fechamento de caixa, e registro de movimentações por dia.  
Dashboard com cards de acesso rápido aos módulos, layout responsivo e moderno com modo escuro/claro.  
Gestão de Usuários com cadastro de contas com permissões e controle por função.

---

## 📸 Screenshots (em breve)

> Adicione aqui capturas de tela da interface (login, pedidos, estoque etc.)

---

## 🧑‍💻 Como Executar o Projeto Localmente

Para executar o UniGestor localmente, é necessário ter o Node.js (v18+), PostgreSQL e Git instalados.

Clone o repositório com o comando:

```bash
git clone https://github.com/wesleysilvaalves/ProjetoSistemaDeLoja.git
```

Acesse a pasta:

```bash
cd ProjetoSistemaDeLoja
```

Dentro da pasta raiz, acesse o backend com:

```bash
cd backend
```

Instale as dependências com:

```bash
npm install
```

Crie um arquivo `.env` com o seguinte conteúdo:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=seu_usuario_postgres
DB_PASS=sua_senha
DB_NAME=unigestor
JWT_SECRET=chave_secreta_segura
```

Depois disso, execute as migrations com:

```bash
npx sequelize db:migrate
```

E então inicie o servidor com:

```bash
npm run dev
```

Com o backend rodando, volte à pasta principal com:

```bash
cd ../frontend
```

Instale as dependências do frontend:

```bash
npm install
```

E inicie o projeto com:

```bash
npm run dev
```

Acesse o sistema no navegador pelo endereço:  
[http://localhost:5173](http://localhost:5173)

---

## 🛣️ Futuras Melhorias

- Integração com WhatsApp
- Gráficos de desempenho (dashboard analítico)
- Exportação de relatórios em PDF/Excel
- Multiunidade (gestão de várias lojas)
- Controle de promoções e cupons
- Logs de auditoria e ações por usuário
- Upload de imagens dos produtos

---

## 👤 Autor

**Wesley Silva**  

