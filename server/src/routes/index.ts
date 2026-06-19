import { Router } from 'express';
import prisma from '../prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const router = Router();
const chaveJWT = process.env.CHAVE
// Users
router.get('/users', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.post('/criar', async (req, res, next) => {
    const {nome, email, senha} = req.body
    let e=0
    try {
      let h = await bcrypt.hash(senha, 10)
      e++
      if (nome.length > 50 || nome.length === 0 || email.length === 0 || email.length > 256) {
        return res.status(422).send("Dados formatados incorretamente.")
      }
      const u = await prisma.user.create({
        data: {
          name: nome,
          email: email,
          senha: h
        }
      })
      res.cookie("sessaotoken", jwt.sign({id:u.id},chaveJWT), {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 60*60*24*3
      })
      return res.send("Usuário criado com sucesso.")
    } catch(err) {
      if (e===0) {
        return res.status(500).json({erro:'Não foi possível salvar a senha com segurança.'})
      }
      return res.status(500).json({erro:'Não foi possível registrar usuário; erro interno do servidor.'})
    }
})

router.post('/login', async(req, res, next) => {
    const {email, senha} = req.body
    try {
      const u = await prisma.user.findUnique({
        where: {email: email}
      })
      if (!u) {
        return res.status(404).json({erro: "Usuário não encontrado."})
      }
      const s = await bcrypt.compare(senha, u.senha)
      if (!s) {
        return res.status(401).json({erro: "Credenciais incorretas."})
      }
      res.cookie("sessaotoken", jwt.sign({id:u.id},chaveJWT), {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 60*60*24*3
      })
      return res.send("Usuário logado com sucesso.")
    } catch(err) {
      return res.status(500).json({erro: "Erro interno do servidor."})
    }
})

// Products
router.get('/products', async (req, res, next) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (err) {
    next(err);
  }
});

export default router;
