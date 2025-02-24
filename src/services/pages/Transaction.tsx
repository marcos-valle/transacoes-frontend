import { useState, useEffect, useRef, FormEvent } from 'react'; // Importa hooks do React para gerenciar o estado e efeitos
import './Transaction.css'; // Importa o arquivo CSS para a página de transações
import { api } from '../api'; // Importa a API

// Definição da interface IPerson que descreve os dados de uma pessoa
interface IPerson {
  id: string;
  name: string;
  age: number;
  created_at: string;
  updated_at: string;
}

// Definição da interface ITransaction que descreve os dados de uma transação
interface ITransaction {
  id: string;
  person_id: string;
  type: string;
  description: string;
  amount: number;
  created_at: string;
  updated_at: string;
}

// Definição da interface ITotals que descreve os totais de receitas, despesas e saldo
interface ITotals {
  people_total: {
    person_id: string;
    person_name: string;
    person_income: number;
    person_expense: number;
    person_total_amount: number;
  }[];

  total_income: number;
  total_expense: number;
  total_amount: number;
}

export default function TransactionPage() {
  // Estados para armazenar dados das pessoas, transações e totais
  const [personList, setPersonList] = useState<IPerson[]>([]);
  const [transactionList, setTransactionList] = useState<ITransaction[]>([]);
  const [totalAmount, setTotalAmount] = useState<ITotals>();

  // Referências para os campos do formulário de transações
  const personRef = useRef<HTMLSelectElement | null>(null);
  const typeRef = useRef<HTMLSelectElement | null>(null);
  const descriptionRef = useRef<HTMLInputElement | null>(null);
  const amountRef = useRef<HTMLInputElement | null>(null);

  // Estado para controlar o refresh da página
  const [refresh, setRefresh] = useState(false);

  // Efeito para carregar dados de pessoas, transações e totais ao montar o componente ou quando o refresh for alterado
  useEffect(() => {
    loadPersonList();
    loadTransactionList();
    loadTotalAmount();
  }, [refresh]);

  // Função assíncrona para carregar a lista de pessoas
  async function loadPersonList() {
    const response = await api.get('/person-list');
    setPersonList(response.data);
  }

  // Função assíncrona para carregar a lista de transações
  async function loadTransactionList() {
    const response = await api.get('/transaction-list');
    setTransactionList(response.data);
  }

  // Função assíncrona para carregar os totais de receitas, despesas e saldo
  async function loadTotalAmount() {
    const response = await api.get('/totals');
    setTotalAmount(response.data);
  }

  // Função para enviar o formulário e registrar uma nova transação
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    // Verifica se todos os campos do formulário estão preenchidos
    if (!personRef.current?.value || !typeRef.current?.value || !descriptionRef.current?.value || !amountRef.current?.value) {
      alert('Preencha todos os campos');
      throw new Error('Preencha todos os campos');
    }

    // Envia os dados para a API para criar uma nova transação
    await api.post('/transaction', {
      person_id: personRef.current.value,
      type: typeRef.current.value,
      description: descriptionRef.current.value,
      amount: Number(amountRef.current.value)
    });

    // Atualiza o estado para forçar o reload da lista de transações
    setRefresh(prev => !prev);
  }

  return (
    <div className='container'>

      {/* Formulário para cadastrar uma nova transação */}
      <div>
        <h1>Nova Transação</h1>
        <form onSubmit={handleSubmit}>
          {/* Campo de seleção para escolher uma pessoa */}
          <select ref={personRef}>
            <option disabled selected hidden>Selecione uma pessoa...</option>
            {personList.map((person) => (
              <option key={person.id} value={person.id}>{person.name}</option>
            ))}
          </select>

          {/* Campo de seleção para escolher o tipo de transação */}
          <select ref={typeRef}>
            <option disabled selected hidden>Selecione um tipo de transação...</option>
            <option value="RECEITA">RECEITA</option>
            <option value="DESPESA">DESPESA</option>
          </select>

          {/* Campo para digitar o valor da transação */}
          <input type="number" placeholder='Valor' ref={amountRef} step={0.01} />

          {/* Campo para digitar a descrição da transação */}
          <input type="text" placeholder='Descrição' ref={descriptionRef} />

          {/* Botão para submeter o formulário */}
          <button>Salvar</button>
        </form>
      </div>

      {/* Resumo das transações e totais */}
      <div className='resume'>
        
        {/* Exibição de todas as transações */}
        <div className='allTransactions'>
          <h2>Todas as Transações</h2>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Descrição</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {/* Mapeia e exibe as transações */}
              {transactionList.map((transaction) => {
                const person = personList.find(
                  (p) => p.id === transaction.person_id
                );

                return (
                  <tr className="personName" key={transaction.id}>
                    <td>{person ? person.name : "pessoa não encontrada"}</td>
                    <td>{transaction.type}</td>
                    <td>{transaction.description}</td>
                    <td>{transaction.amount.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Exibição do resumo de totais por pessoa */}
        <div className='totals'>
          <h2>Resumo de Totais</h2>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Receitas</th>
                <th>Despesas</th>
                <th>Saldo</th>
              </tr>
            </thead>
            <tbody>
              {/* Mapeia e exibe os totais por pessoa */}
              {totalAmount?.people_total.map((personTotal) => (
                <tr key={personTotal.person_id}>
                  <td>{personTotal.person_name}</td>
                  <td>{personTotal.person_income.toFixed(2)}</td>
                  <td>{personTotal.person_expense.toFixed(2)}</td>
                  <td>{personTotal.person_total_amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Exibição do total geral */}
        <div className='totalGen'>
          <h2>Total Geral</h2>
          <table>
            <thead>
              <tr>
                <th>Receitas</th>
                <th>Despesas</th>
                <th>Saldo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{totalAmount?.total_income.toFixed(2)}</td>
                <td>{totalAmount?.total_expense.toFixed(2)}</td>
                <td>{totalAmount?.total_amount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      
      </div>
      
    </div>
  )
}
