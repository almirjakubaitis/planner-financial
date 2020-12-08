/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useEffect, useCallback } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { parseISO } from 'date-fns';
import { FiTrash2, FiEdit } from 'react-icons/fi';

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
  average: string;
}

interface idParams {
  id: string;
  month: string;
}

const ListByCategoryAndMonth: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);
  const [paramsValues, setParamsValues] = useState<idParams>({} as idParams);

  const { user } = useAuth();
  const token = localStorage.getItem('@Planner:token');
  const provider = user.id;

  const { addToast } = useToast();
  const history = useHistory();

  const { params } = useRouteMatch<idParams>();

  const handleRowUrl = useCallback(
    id => {
      history.push(`/item/${id}`);
    },
    [history],
  );

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

      history.replace(`/listmonth/${params.id}/${params.month}`);
    },
    [history, params, token, addToast],
  );

  const handleInsertUrl = useCallback(() => {
    history.push(`/insert`);
  }, [history]);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get(
        `/transactions/months/${params.month}/categories/${params.id}/${provider}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const transactionsResponse = response.data.transactions;

      const { month } = params;
      const parsedMonth = parseISO(month);
      const monthName = parsedMonth.toLocaleString('pt-BR', {
        month: 'long',
      });

      const paramsFormatted = {
        id: params.id,
        month: monthName,
      };

      const balanceResponse = response.data.transactions[0];

      if (balanceResponse) {
        const balanceFormatted = {
          categoryTitle: balanceResponse.categoryTitle,
          income: formatValue(balanceResponse.income),
          outcome: formatValue(balanceResponse.outcome),
          total: formatValue(balanceResponse.total),
          average: formatValue(balanceResponse.average),
        };

        setTransactions(transactionsResponse);
        setBalance(balanceFormatted);
      } else {
        setTransactions([]);
      }

      setParamsValues(paramsFormatted);
    }

    loadTransactions();
  }, [params, provider, token]);

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
          </Card>
          <Card type="outcome">
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Saídas" />
            </header>
            <h1 data-testid="balance-outcome">{balance.outcome}</h1>
          </Card>
          <Card type="total">
            <header>
              <p>Total</p>
              <img src={total} alt="Saldo" />
            </header>
            <h1 data-testid="balance-total">{balance.total}</h1>
          </Card>
          <Add>
            <button type="submit" onClick={handleInsertUrl}>
              <img src={add} alt="Adicionar" />
              <p>Adicionar</p>
            </button>
          </Add>
        </CardContainer>
        <Main>
          <span>
            {paramsValues.month} / {balance.categoryTitle}
          </span>
          <Transactions>
            <table>
              <thead>
                {transactions.length ? (
                  <tr className="trhead">
                    <th> </th>
                    <th>Título</th>
                    <th>Descrição</th>

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
                        <FiEdit size={16} />
                      </td>
                      <td>{transaction.title}</td>
                      <td
                        className={
                          transaction.type === 'outcome' ? 'outcome' : 'income'
                        }
                      >
                        {transaction.description}
                      </td>

                      <td
                        className={
                          transaction.type === 'outcome' ? 'outcome' : 'income'
                        }
                      >
                        {formatValue(transaction.value)}
                      </td>

                      <td onClick={() => handleRowDelete(transaction.id)}>
                        <FiTrash2 size={16} color="#E83F5B" />
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

export default ListByCategoryAndMonth;
