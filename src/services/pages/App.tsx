import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; // Importação de componentes do react-router-dom para navegação entre páginas
import PersonPage from './person.tsx'; // Importa o componente PersonPage
import TransactionPage from './Transaction.tsx'; // Importa o componente TransactionPage

export default function App() {

  return (
    <div>
      {/* Configura o roteamento utilizando o Router */}
      <Router>

        {/* Cabeçalho com links de navegação */}
        <header>
            <ul className='topBar_list'>
              <li>
                {/* Link para a página inicial (home) */}
                <Link to="/#">Home</Link>
                {/* Link para a página de pessoas */}
                <Link to="/person">Pessoas</Link>
                {/* Link para a página de transações */}
                <Link to="/transaction">Transações</Link>
              </li>
            </ul>
        </header>
      
        {/* Conteúdo principal da página */}
        <main>  

          {/* Definição das rotas do aplicativo */}
          <Routes>
              {/* Carrega a página inicial como a página de pessoas */}
              <Route path="/" element={<PersonPage />} />
              {/* Rota para a página de pessoas */}
              <Route path="/person" element={<PersonPage />} />
              {/* Rota para a página de transações */}
              <Route path="/transaction" element={<TransactionPage />} />
          </Routes>  

        </main>
      </Router>
    </div>
  )
}
