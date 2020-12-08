import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { getYear } from 'date-fns';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/balance.svg';
import add from '../../assets/add_category.svg';

import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

import formatValue from '../../utils/formatValue';
import formatAverage from '../../utils/formatAverage';

import {
  Container,
  CardContainer,
  Card,
  Add,
  Main,
  Transactions,
} from './styles';

interface Transaction {
  id: string;

  transaction: [
    {
      id: string;
      value: number;
      title: string;
      date: Date;
      copies: number;
      type: 'income' | 'outcome';
      provider_id: string;
    },
  ];

  category: [{ id: string; title: string }];
  description: string;
  formattedValue: string;
  formattedTotal: string;
  formattedAverage: string;
  formattedDate: string;
  created_at: Date;
  total: number;
  average: number;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;

  incomeAverage: string;
  outcomeAverage: string;
  totalAverage: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  const { user } = useAuth();
  const token = localStorage.getItem('@Planner:token');
  const provider = user.id;
  // const provider = 'd801f84d-1a33-460f-a82f-c624ec5b43ae';

  if (!localStorage.getItem('@Planner:year')) {
    const dateAsDate = new Date();

    const yearDate = getYear(dateAsDate);

    localStorage.setItem('@Planner:year', JSON.stringify(yearDate));
  }

  const year = localStorage.getItem('@Planner:year');

  const history = useHistory();

  const handleRowUrl = useCallback(
    (id, title) => {
      history.push(`/listcategory/${id}/${title}`);
    },
    [history],
  );

  const handleInsertUrl = useCallback(() => {
    history.push(`/insert`);
  }, [history]);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get(
        `/transactions/provider/${provider}/year/${year}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const transactionsResponse = response.data.transactions;

      const transactionsFormatted = transactionsResponse.map(
        (transaction: Transaction) => ({
          ...transaction,

          formattedTotal: formatValue(transaction.total),
          formattedAverage: formatValue(transaction.average),
        }),
      );

      const balanceResponse = response.data.balance;
      const balanceFormatted = {
        income: formatValue(balanceResponse.income),
        outcome: formatValue(balanceResponse.outcome),
        total: formatValue(balanceResponse.total),

        incomeAverage: formatAverage(balanceResponse.income),
        outcomeAverage: formatAverage(balanceResponse.outcome),
        totalAverage: formatAverage(balanceResponse.total),
      };

      setTransactions(transactionsFormatted);
      setBalance(balanceFormatted);
    }

    loadTransactions();
  }, [year, provider, token]);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card type="income">
            <header>
              <p>Entradas</p>
              <img src={income} alt="Entradas" />
            </header>
            <h1 data-testid="balance-income">{balance.income}</h1>
            <p data-testid="balance-income">{balance.incomeAverage}/mês</p>
          </Card>
          <Card type="outcome">
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Saídas" />
            </header>
            <h1 data-testid="balance-outcome">{balance.outcome}</h1>
            <p data-testid="balance-outcome">{balance.outcomeAverage}/mês</p>
          </Card>
          <Card type="total">
            <header>
              <p>Total</p>
              <img src={total} alt="Saldo" />
            </header>
            <h1 data-testid="balance-total">{balance.total}</h1>
            <p data-testid="balance-total">{balance.totalAverage}/mês</p>
          </Card>

          <Add>
            <button type="submit" onClick={handleInsertUrl}>
              <img src={add} alt="Adicionar" />
              <p>Adicionar</p>
            </button>
          </Add>
        </CardContainer>

        <Main>
          <Transactions>
            <table>
              <thead>
                {transactions.length ? (
                  <tr className="trhead">
                    <th>Categoria</th>
                    <th className="mobileNone">Média/Mensal</th>
                    <th>Total</th>
                  </tr>
                ) : (
                  <tr className="trhead">
                    {' '}
                    <th colSpan={3} style={{ textAlign: 'center' }}>
                      {' '}
                      Não há transações disponíveis
                    </th>
                  </tr>
                )}
              </thead>

              <tbody>
                {transactions.map(transaction => (
                  <tr
                    key={transaction.transaction[0].id}
                    onClick={() =>
                      handleRowUrl(
                        transaction.category[0].id,
                        transaction.category[0].title,
                      )
                    }
                  >
                    <td>{transaction.category[0].title}</td>

                    <td
                      className={
                        transaction.average < 0
                          ? 'outcome mobileNone'
                          : 'income mobileNone'
                      }
                    >
                      {/* {transaction.type === 'outcome' && ' - '} */}

                      {transaction.formattedAverage}
                    </td>

                    <td
                      className={transaction.average < 0 ? 'outcome' : 'income'}
                    >
                      {transaction.formattedTotal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Transactions>
        </Main>
      </Container>
      <Footer />
    </>
  );
};

export default Dashboard;
