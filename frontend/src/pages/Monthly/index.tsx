/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { getYear, addDays } from 'date-fns';
import { FiDollarSign } from 'react-icons/fi';

import { useAuth } from '../../hooks/auth';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/balance.svg';
import add from '../../assets/add_category.svg';

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
    },
  ];

  category: [{ id: string; title: string }];
  description: string;
  formattedTotal: string;
  formattedIncome: string;
  formattedOutcome: string;
  created_at: Date;
  total: number;
  income: number;
  outcome: number;
  transaction_index: number;
  month: string;
  formattedMonth: string;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;

  incomeAverage: string;
  outcomeAverage: string;
  totalAverage: string;
}

const Monthslist: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  const { user } = useAuth();
  const token = localStorage.getItem('@Planner:token');
  const provider = user.id;

  if (!localStorage.getItem('@Planner:year')) {
    const dateAsDate = new Date();

    const yearDate = getYear(dateAsDate);

    localStorage.setItem('@Planner:year', JSON.stringify(yearDate));
  }

  const year = localStorage.getItem('@Planner:year');

  const history = useHistory();

  const handleRowUrl = useCallback(
    id => {
      history.push(`/months/${id}`);
    },
    [history],
  );

  const handleInsertUrl = useCallback(() => {
    history.push(`/insert`);
  }, [history]);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get(
        `/transactions/monthly/${provider}/${year}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const months: string[] = [];
      months[0] = 'Janeiro';
      months[1] = 'Fevereiro';
      months[2] = 'Março';
      months[3] = 'Abril';
      months[4] = 'Maio';
      months[5] = 'Junho';
      months[6] = 'Julho';
      months[7] = 'Agosto';
      months[8] = 'Setembro';
      months[9] = 'Outubro';
      months[10] = 'Novembro';
      months[11] = 'Dezembro';

      const transactionsResponse = response.data.transactions;
      const transactionsFormatted = transactionsResponse.map(
        (transaction: Transaction) => ({
          ...transaction,
          formattedTotal: formatValue(transaction.total),
          formattedIncome: formatValue(transaction.income),
          formattedOutcome: formatValue(transaction.outcome),

          formattedMonth:
            months[
              new Date(addDays(new Date(transaction.month), 5)).getMonth()
            ],
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
  }, [provider, token, year]);

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
                <tr className="trhead">
                  <th>Jan</th>
                  <th>Fev</th>
                  <th>Mar</th>
                  <th>Abr</th>
                  <th>Mai</th>
                  <th>Jun</th>
                  <th>Jul</th>
                  <th>Ago</th>
                  <th>Set</th>
                  <th>Out</th>
                  <th>Nov</th>
                  <th>Dez</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  {transactions.map(transaction => (
                    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                    <td
                      key={transaction.transaction_index}
                      className={transaction.total >= 0 ? 'income' : 'outcome'}
                      onClick={() => handleRowUrl(transaction.month)}
                    >
                      <span className="DesktopNone">
                        <FiDollarSign size={25} />
                      </span>
                      <span className="DesktopNone">
                        {transaction.formattedMonth}:
                      </span>{' '}
                      {transaction.formattedTotal}
                    </td>
                  ))}
                </tr>
                <tr className="mobileNone">
                  <td colSpan={12} className="adjustcenter trentradas">
                    entradas
                  </td>
                </tr>

                <tr className="mobileNone">
                  {transactions.map(transaction => (
                    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                    <td
                      key={transaction.transaction_index}
                      className={transaction.income >= 0 ? 'income' : 'outcome'}
                      onClick={() => handleRowUrl(transaction.month)}
                    >
                      {transaction.formattedIncome}
                    </td>
                  ))}
                </tr>

                <tr className="mobileNone">
                  <td colSpan={12} className="adjustcenter trsaidas">
                    saídas
                  </td>
                </tr>

                <tr className="mobileNone">
                  {transactions.map(transaction => (
                    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                    <td
                      key={transaction.transaction_index}
                      className={transaction.outcome > 0 ? 'outcome' : 'income'}
                      onClick={() => handleRowUrl(transaction.month)}
                    >
                      {transaction.formattedOutcome}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </Transactions>
        </Main>
      </Container>
      <Footer />
    </>
  );
};

export default Monthslist;
