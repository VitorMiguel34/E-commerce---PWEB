import React, { useState } from 'react'

function Corpo() {

  const produtos = [
    { nome: "Camisa1", preco: "R$ 179,90" },
    { nome: "Camisa2", preco: "R$ 199,90" },
    { nome: "Camisa3", preco: "R$ 189,90" },
    { nome: "Camisa4", preco: "R$ 219,90" },
    { nome: "Camisa5", preco: "R$ 349,90" },
    { nome: "Camisa6", preco: "R$ 349,90" }
  ]

  const [inicio, setInicio] = useState(0)

  function proximo() {
    if (inicio < produtos.length - 3) {
      setInicio(inicio + 1)
    } else {
      setInicio(0)
    }
  }

  function anterior() {
    if (inicio > 0) {
      setInicio(inicio - 1)
    } 
  }

  return (
    <main className="corpo-container">

      <div className="banner">
        <h1>As camisas mais incriveis do futebol</h1>
        <p>Estilo e paixao para todos</p>
      </div>

      <section className="sobre">
        <h2>Sobre a loja</h2>
        <p>
    feita para os verdadeiros fans de futebol 
        </p>
      </section>

      <h2 className="titulo-secao">Lancamentos</h2>

      <div className="carrossel">

        <button className="seta" onClick={anterior}>◀</button>

        <div className="grade-produtos">

          {produtos.slice(inicio, inicio + 3).map((produto, index) => (
            <div className="cartao-produto" key={index}>
              <div className="foto-produto"></div>
              <h3>{produto.nome}</h3>
              <span>{produto.preco}</span>
              <button>Ver detalhes</button>
            </div>
          ))}

        </div>

        <button className="seta" onClick={proximo}>▶</button>
      </div>

     

      <div className="vantagens-container">
        <div className="vantagem-item">Frete gratis</div>
        <div className="vantagem-item">Pague no pix</div>
        <div className="vantagem-item">Compra segura</div>
      </div>

  
    </main>
  )
}

export default Corpo