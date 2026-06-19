# Projeto de PWEB - E-commerce

**Equipe:**
* Bruno Gabriel Silva de Sena
* Fabio Junio
* Gian Leandro Lopes
* Luiz Davi dos Santos Silva
* Pedro Marques dos Santos Lima
* Victor Miguel da Silva Bezerra

---

## Como rodar o projeto

### Backend (dentro da pasta `/server`)

1. Instale as dependências executando:

```bash
npm install
```

2. Crie um arquivo `.env` na raiz da pasta `server`, baseando-se no arquivo `.env.example` já existente.

3. Execute as migrations e gere o client do banco de dados:

```bash
npx prisma migrate dev
npx prisma generate
```

4. Inicie o servidor executando:

```bash
npm run dev
```

### Frontend (dentro da pasta `/front`)

1. Crie um arquivo `.env` na raiz da pasta `front`, baseando-se no arquivo `.env.example` já existente.

2. Instale as dependências executando:

```bash
npm install
```

3. Inicie a aplicação executando:

```bash
npm run dev
```
