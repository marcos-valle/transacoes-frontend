import { useState, useEffect, useRef, FormEvent } from 'react'; 
import { api } from '../api'; // Importa a API
import "./Person.css"; // Importa o CSS da página

// Interface para representar os dados de uma pessoa
interface IPerson {
  id: string;
  name: string;
  age: number;
  created_at: string;
  updated_at: string;
}

export default function PersonPage () {
  // useState para armazenar a lista de pessoas
  const [personList, setPersonList] = useState<IPerson[]>([]);

  // Referências para acessar os campos de input de nome e idade no cadastro
  const personRef = useRef<HTMLInputElement | null>(null);
  const ageRef = useRef<HTMLInputElement | null>(null);

  // useEffect para carregar a lista de pessoas
  useEffect(() => {
    loadPersonList();
  }, []); // O array vazio garante que a função seja chamada apenas uma vez

  // Função assíncrona para carregar a lista de pessoas da API
  async function loadPersonList() {
    const response = await api.get('/person-list'); // Faz a requisição GET para buscar as pessoas
    setPersonList(response.data); // Atualiza o estado com os dados recebidos da API
  }

  // Função para excluir uma pessoa da lista
  async function deletePerson(id: string) {
    try {
      // Faz a requisição DELETE para excluir a pessoa pelo ID
      await api.delete("person", {
        params: { id: id },
      });
      
      // Recarrega a lista de pessoas após a exclusão
      loadPersonList();
    } catch (error) {
      console.log(error); // Exibe erros no console caso algo dê errado na requisição
    }
  }

  // Função para lidar com o envio do formulário de cadastro de pessoa
  async function handleSubmit(event: FormEvent) {
    event.preventDefault(); // Previne o comportamento padrão de recarregar a página

    // Verifica se os campos de nome e idade foram preenchidos
    if (!personRef.current?.value || !ageRef.current?.value) {
      alert('Preencha todos os campos'); // Exibe um alerta se algum campo estiver vazio
      throw new Error('Preencha todos os campos'); // Lança um erro
    }

    // Faz a requisição POST para cadastrar uma nova pessoa
    await api.post('/person', {
      name: personRef.current.value,
      age: Number(ageRef.current.value), // Converte a idade para número
    });

    // Recarrega a lista de pessoas após o cadastro
    loadPersonList();
  }

  return (
    <div className="personPage">

        {/* Formulário para cadastrar uma nova pessoa */}
        <div>
            <h1>Cadastrar Pessoa</h1>
            <form onSubmit={handleSubmit}>
                {/* Campo de entrada para o nome da pessoa */}
                <input type="text" placeholder='Nome' ref={personRef} />

                {/* Campo de entrada para a idade da pessoa */}
                <input type="number" placeholder='Idade' ref={ageRef} />
                
                {/* Botão para submeter o formulário */}
                <button>Salvar</button>
            </form>
        </div>
        
        {/* Exibição da lista de pessoas cadastradas */}
        <div className='personList'>
            <h2>Lista de Pessoas</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Idade</th>
                        <th>Data de Criação</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Mapeia a lista de pessoas e exibe os dados em uma tabela */}
                    {personList.map((person) => (
                        <tr key={person.id}>
                            <td>{person.name}</td>
                            <td>{person.age}</td>
                            {/* Formata a data de criação para um formato legível */}
                            <td>{new Date(person.created_at).toLocaleDateString()}</td>
                            {/* Botão para excluir a pessoa, chama a função deletePerson */}
                            <button onClick={ () => deletePerson(person.id) }>X</button>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};
