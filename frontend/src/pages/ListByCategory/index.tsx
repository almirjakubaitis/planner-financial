/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useEffect, useCallback } from 'react';
import { useRouteMatch, Link, useHistory } from 'react-router-dom';
import { getYear } from 'date-fns';

import { FiTrash2, FiEdit, FiCopy } from 'react-icons/fi';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/balance.svg';
import add from '../../assets/add_category.svg';

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
  transaction: [
    {
      id: string;
      value: number;
      title: string;
      date: Date;
      copies: number;
      type: 'income' | 'outcome';
      description: string;
    },
  ];

  category: [{ id: string; title: string }];

  total: number;
  average: number;
}

interface Balance {
  categoryTitle: string;
  income: string;
  outcome: string;
  total: string;

  incomeAverage: string;
  outcomeAverage: string;
  totalAverage: string;
}

interface idParams {
  id: string;
  title: string;
}

const ListByCategory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  const { user } = useAuth();
  const token = localStorage.getItem('@Planner:token');
  const provider = user.id;

  const { params } = useRouteMatch<idParams>();

  // console.log(params.id);

  if (!localStorage.getItem('@Planner:year')) {
    const dateAsDate = new Date();

    const yearDate = getYear(dateAsDate);

    localStorage.setItem('@Planner:year', JSON.stringify(yearDate));
  }

  const year = localStorage.getItem('@Planner:year');

  const { addToast } = useToast();
  const history = useHistory();

  const handleRowUrl = useCallback(
    id => {
      history.push(`/item/${id}`);
    },
    [history],
  );

  const handleDuplicateUrl = useCallback(
    id => {
      history.push(`/duplicate/${id}`);
    },
    [history],
  );

  const handleInsertUrl = useCallback(() => {
    history.push(`/insert`);
  }, [history]);

  const handleRowDelete = useCallback(
    async (id: string) => {
      await api.delete(`/transactions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      addToast({
        type: 'success',
        title: 'A Transação foi removida!',
        description: 'Esta operação não poderá ser desfeita',
      });

      history.replace(`/listcategory/${params.id}/${params.title}`);
    },
    [history, params, token, addToast],
  );

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get(
        `/transactions/categories/${params.id}/${provider}/${year}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      //
      const transactionsResponse = response.data.transactions;

      const balanceResponse = response.data.transactions[0];

      if (balanceResponse) {
        const balanceFormatted = {
          categoryTitle: balanceResponse.categoryTitle,
          income: formatValue(balanceResponse.income),
          outcome: formatValue(balanceResponse.outcome),
          total: formatValue(balanceResponse.total),

          incomeAverage: formatAverage(balanceResponse.income),
          outcomeAverage: formatAverage(balanceResponse.outcome),
          totalAverage: formatAverage(balanceResponse.total),
        };

        setTransactions(transactionsResponse);
        setBalance(balanceFormatted);
      } else {
        setTransactions([]);
      }
    }

    loadTransactions();
  }, [params, provider, token, year]);

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
          <Link to="/dashboard">
            <span>{balance.categoryTitle}</span>
          </Link>

          <Transactions>
            <table>
              <thead>
                {transactions.length ? (
                  <tr className="trhead">
                    <th> </th>
                    <th> </th>
                    <th>Título</th>
                    <th className="mobileNone">Descrição</th>

                    <th>Total</th>

                    <th> </th>
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
                {transactions.map(tr =>
                  tr.transaction.map(transaction => (
                    <tr key={transaction.id}>
                      <td onClick={() => handleRowUrl(transaction.id)}>
                        <FiEdit size={16} title="Editar transação" />
                      </td>
                      <td onClick={() => handleDuplicateUrl(transaction.id)}>
                        <FiCopy size={16} title="Duplicar transação" />
                      </td>
                      <td>{transaction.title}</td>
                      <td
                        className={
                          transaction.type === 'outcome'
                            ? 'outcome mobileNone'
                            : 'income mobileNone'
                        }
                      >
                        {transaction.description}
                      </td>

                      <td
                        className={
                          transaction.type === 'outcome' ? 'outcome' : 'income'
                        }
                      >
                        {transaction.type === 'outcome'
                          ? formatValue(-1 * transaction.value)
                          : formatValue(transaction.value)}
                      </td>

                      <td onClick={() => handleRowDelete(transaction.id)}>
                        <FiTrash2
                          size={16}
                          color="#E83F5B"
                          title="Apagar transação"
                        />
                      </td>
                    </tr>
                  )),
                )}
              </tbody>
            </table>
          </Transactions>
        </Main>
      </Container>
      <Footer />
    </>
  );
};

export default ListByCategory;
