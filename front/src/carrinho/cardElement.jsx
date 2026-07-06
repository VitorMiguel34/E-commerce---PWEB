import { useState } from "react"

export default function CardElements(props){
    const [cartItems, setCartItems] = useState(props)
    if (cartItems.lenght === 0){
        return(
        <div>
            <h3>Pelo visto seu carrinho anda vazio...</h3>
        </div>

        )
    }
    else{
        return(
            <div>
                {cartItems.map((item) =>{
                    <div key={item.id}>
                        <img src="" alt="" />
                        <div>
                            <h5>{item.name}</h5>  {/*Nome do item*/ }
                            <p>Estoque: {item.stock}</p>
                            
                        </div>
                        <h4>R$ {item.price}</h4>
                    </div>
                })}
            </div>
        )
    }

}