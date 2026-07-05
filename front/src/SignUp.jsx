import {useState} from 'react'
import api from './services/api'

export default function SignUp(){
    const [signEmail, setSignEmail] = useState("")
    const [signPassword, setSignPassword] = useState("")
    const [signUname, setSignUname] = useState("")
    const [err, setErr] = useState("")

    async function procedeSign(e) {
        e.preventDefault()
        setErr('')
        try {
            const response = await api.post('/', {name: signUname, email: signEmail, password: signPassword})

        } catch (err) {
            setErr(err.response.name?.email?.password || "Ocorreu um erro na criação de um novo usuário. Tente novamente.")
        }
        
    }
    return(
        <div>
            <div>
                <h2>Crie uma conta</h2>
                <p>Já possui uma conta?</p>
                <span><a>Log in</a></span>
            </div>
            <form action=""method='POST' onSubmit={procedeSign(e)}>
                <div className="flex flex-col gap-2 w-full max-w-sm">
                    <label className="text-sm font-semibold text-zinc-950 dark:text-white antialiased tracking-tight">Nome</label>

                    <input
                        value={signUname}
                        type="text"
                        id="full_name"
                        name="full_name"
                        className="w-full rounded-lg border border-zinc-950/10 dark:border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-950 dark:text-white shadow-xs focus:outline-sm focus:outline-offset-0 focus:outline-zinc-950 dark:focus:outline-white transition-all"
                        placeholder="Escreva seu nome completo"
                        onChange={(e) => setSignUname(e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-2 w-full max-w-sm">
                    <label 
                        className="text-sm font-semibold text-zinc-950 dark:text-white antialiased tracking-tight">Nome</label>

                    <input
                        type="text"
                        id="full_name"
                        name="full_name"
                        className="w-full rounded-lg border border-zinc-950/10 dark:border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-950 dark:text-white shadow-xs focus:outline-sm focus:outline-offset-0 focus:outline-zinc-950 dark:focus:outline-white transition-all"
                        placeholder="Escreva seu nome completo"
                    />
                </div>
                                <div className="flex flex-col gap-2 w-full max-w-sm">
                    <label 
                        htmlFor="full_name" 
                        className="text-sm font-semibold text-zinc-950 dark:text-white antialiased tracking-tight"
                    >
                        Nome
                    </label>

                    <input
                        type="text"
                        id="full_name"
                        name="full_name"
                        className="w-full rounded-lg border border-zinc-950/10 dark:border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-950 dark:text-white shadow-xs focus:outline-sm focus:outline-offset-0 focus:outline-zinc-950 dark:focus:outline-white transition-all"
                        placeholder="Escreva seu nome completo"
                    />
                    <button></button>
                </div>
            </form>

        </div>
    )
    
}