import { useState, useEffect, useInsertionEffect } from "react";
import api from './services/api'
import cardElements from './cardElement'

export default function Carrinho(){
    const [items, setItems] = useState("")
    const [err, setErr] = useState("")
    const [loading, setLoading] = useState(true)
    useEffect(()=>{
        async function ChamaItens(){
            try {
                const response = await api.get("/carts")
                setItems(response.data)
            } catch (error) {
                setErr('Não foi possível carregar o carrinho, Erro:' + error)
            }
            finally{
                setLoading(false)
            }
            
        }
        ChamaItens()
    }, []);

    if(loading){
        return <><p>carregando</p></>
    }
    if(err){
        return <><p>{err}</p></>
    }

    return(
        <div>
            <cardElements itens={items}/>
        </div>
    )
}