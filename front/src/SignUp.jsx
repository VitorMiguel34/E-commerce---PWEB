import {useState} from 'react'
import api from './services/api'

export default function SignUp(){
    const [signEmail, setSignEmail] = useState("")
    const [signPassword, setSignPassword] = useState("")
    const [signUname, setSignUname] = useState("")
    const [erro, setErr] = useState("")

    async function procedeSign(e) {
        e.preventDefault()
        setErr('')
        try {
            const response = await api.post('/', {name: signUname, email: signEmail, password: signPassword})

        } catch (err) {
            setErr(err.response.name?.email?.password?.erro || "Ocorreu um erro na criação de um novo usuário. Tente novamente.")
        }
        
    }
    return(
        <>
            <nav class="navbar">
            <a href="#" class="logo">MeuSite</a>
            <ul class="nav-links">
                <li><a href="#">Início</a></li>
                <li><a href="#">Sobre</a></li>
                <li><a href="#">Contato</a></li>
            </ul>
            </nav>
            <main>
                <div>
                    <div>
                        <h2>Crie uma conta</h2>
                        <p>Já possui uma conta?</p>
                        <span><a href='./LoginPage'>Log in</a></span>
                    </div>
                    <form method='POST' onSubmit={procedeSign}>
                        <div className="flex flex-col gap-2 w-full max-w-sm">
                            <label className="text-sm font-semibold text-zinc-950 dark:text-white antialiased tracking-tight">Nome</label>

                            <input value={signUname} type="text" id="full_name" name="full_name" onChange={(e) => setSignUname(e.target.value)}/>
                        </div>
                        <div className="flex flex-col gap-2 w-full max-w-sm">
                            <label 
                                className="text-sm font-semibold text-zinc-950 dark:text-white antialiased tracking-tight">Email</label>

                            <input
                                type="email"
                                required
                                placeholder='example.com@dominio'
                            />
                        </div>
                        <div className="flex flex-col gap-2 w-full max-w-sm">
                            <label  
                                className="text-sm font-semibold text-zinc-950 dark:text-white antialiased tracking-tight">Senha</label>

                            <input
                                type="text"
                                required
                                name="full_name"
                                placeholder="Escreva seu nome completo"
                            />
                            <button>Criar conta</button>
                        </div>
                    </form>

                </div>
            </main>
        </>
    )
    
}