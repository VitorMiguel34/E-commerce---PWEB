import './App.css'
import api from './services/api'
import {useState} from 'react'
import Link from 'react-router-dom'

export default function LoginPage() {
    const [logEmail, setEmail] = useState("")
    const [logPassword, setPassword] = useState("")
    const [error, setError] = useState('');
    
    async function procedeLogin(e) {
        e.preventDefault() 
        setError('')
        try{
            const response = await api.post('/login', {email: logEmail, password: logPassword}, {withCredentials:true})
            console.log('Login efetuado com sucesso!', response.data)
        }
        catch(err){
            setError(err.response?.data?.erro || "Ocorreu um erro interno no servidor.")
        }
    }


  return (
    <>
        <nav>
            <div>
                <a href="">Era pra ser um logo</a>
            </div>
        </nav>
        <main className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6">
        <div className="w-full max-w-sm flex flex-col gap-8">
            
            <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
                Entre na sua conta
            </h2>
            </div>


            <form onSubmit={procedeLogin} method="POST" className="flex flex-col gap-6">
            
            
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-zinc-950 dark:text-white">Email</label>
                <input 
                type="email" 
                name="email" 
                value={logEmail}
                onChange={(e)=> setEmail(e.target.value)}
                required    
                className="w-full rounded-lg border border-zinc-950/10 px-3 py-2 text-sm bg-white dark:bg-white/5 dark:border-white/10 text-zinc-950 dark:text-white focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-950 dark:focus:outline-white"
                />
            </div>

            
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-zinc-950 dark:text-white">
                Senha
                </label>
                <input 
                type="password" 
                name="password" 
                value={logPassword}
                onChange={(e)=> setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-zinc-950/10 px-3 py-2 text-sm bg-white dark:bg-white/5 dark:border-white/10 text-zinc-950 dark:text-white focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-950 dark:focus:outline-white"
                />
            </div>

            {/* Opções adicionais (Remember me & Forgot password) */}
            <div className="flex items-center justify-end">
                
                <a href="#" className="text-sm font-semibold text-zinc-950 dark:text-white hover:underline">
                Esqueci minha senha
                </a>
            </div>

            {/* Botão de Submit Nativo */}
            <button 
                type="submit" 
                className="w-full rounded-lg bg-zinc-950 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
            >
                Login
            </button>
            </form>

            {/* Rodapé do Login */}
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Não tem uma conta?{' '}
            <Link to='/signUp'>Crie uma</Link>
            </p>

        </div>
        </main>
    </>
  )
}