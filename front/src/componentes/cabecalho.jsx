import React from 'react'
import logo from "../assets/logo.png"
import icone2login from '../assets/icone2login.png'
import icone1carrinho from "../assets/icone1carrinho.png"

function Cabecalho() {
  return (
    <header className='cabecalho'>
      
      
        <div className="conteinePesquisa">
          <input type="text" placeholder="buscar produtos" ></input>
           <button className="pesquisa">Buscar</button>
          <select>
            <option>Todas as selecoes</option> <option value="europa">Europa</option> <option value="america-sul">America do sul</option> <option value="asia">Asia</option><option value="africa">africa</option> 
            <option value="america-norte">America do norte</option>
          </select>
          
        


</div>
          <div className="logo"><img src={logo} alt="logo ne" />
            <h2>F-Copa</h2>

            <div className='lala'>
            <h3>O seu manto está aqui.</h3>
            </div>
            </div>

     

       
      <div className='acoeslegais'>
        <div className="icone-img" title="Fazer Login">
          <img src={icone2login} alt="Login" />
       
        </div>
        <div className="icone-img" title="Ver Carrinho">
          <img src={icone1carrinho} alt="Carrinho" />
    
        </div>
      </div>
    
    </header>
  )
}

export default Cabecalho