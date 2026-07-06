import { useState } from 'react'
import Corpo from './componentes/corpo'
import Cabecalho from './componentes/cabecalho'
import Rodape from './componentes/rodape'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
<div>
   
    <div>
      <header>
    <Cabecalho />
    </header>
     </div>

     <div>
<Corpo/>
     </div>

<footer>
     <div><Rodape/></div>
     </footer>


   </div>
  ) 
  }

export default App
