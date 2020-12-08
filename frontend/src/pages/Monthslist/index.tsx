import React, { useState, useEffect, useCallback } from 'react';
import { useRouteMatch, useHistory, Link } from 'react-router-dom';
import { parseISO } from 'date-fns';

import { useAuth } from '../../hooks/auth';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/balance.svg';
import add from '../../assets/add_category.svg';

import api from '../../services/api';

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
      category_id: string;
    },
  ];

  categoryTitle: [{ id: string; title: string }];

  category: [{ id: string; title: string }];

  total: number;
  average: number;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
  average: string;
}

interface idParams {
  id: string;
  month: string;
}

interface Category {
  id: string;
  title: string;
}

const Categorylistmonth: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);
  const [paramsValues, setParamsValues] = useState<idParams>({} as idParams);
  const [categoryTitles, setcategoryTitles] = useState<Category[]>([]);

  const { user } = useAuth();
  const token = localStorage.getItem('@Planner:token');
  const provider = user.id;

  const history = useHistory();

  const handleRowUrl = useCallback(
    (category_id, month) => {
      history.push(`/listmonth/${category_id}/${month}`);
    },
    [history],
  );

  const handleInsertUrl = useCallback(() => {
    history.push(`/insert`);
  }, [history]);

  const { params } = useRouteMatch<idParams>();

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get(
        `/transactions/months/${params.month}/${provider}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const transactionsResponse = response.data.transactions;

      if (transactionsResponse.length) {
        const { category } = response.data.transactions[0];

        const categoryResponse = category;

        const transactionsFormatted = transactionsResponse.map(
          (transaction: Transaction) => ({
            ...transaction,

            categoryTitle: categoryResponse,
          }),
        );

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
        const balanceFormatted = {
          income: formatValue(balanceResponse.income),
          outcome: formatValue(balanceResponse.outcome),
          total: formatValue(balanceResponse.total),
          average: formatValue(balanceResponse.average),
        };

        setTransactions(transactionsFormatted);
        setBalance(balanceFormatted);
        setParamsValues(paramsFormatted);
        setcategoryTitles(categoryResponse);
      }
    }

    loadTransactions();
  }, [params, categoryTitles, provider, token, transactions.length]);

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
          <Link to="/monthly">
            <span>{paramsValues.month}</span>
          </Link>
          <Transactions>
            <table>
              <thead>
                {transactions.length ? (
                  <tr className="trhead">
                    <th>Categoria</th>
                    <th>Título</th>
                    <th className="mobileNone">Descrição</th>

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
                {transactions.map(tr =>
                  tr.transaction.map(transaction => (
                    <tr
                      key={transaction.id}
                      onClick={() =>
                        handleRowUrl(transaction.category_id, params.month)}
                    >
                      <td>
                        {tr.categoryTitle
                          .filter(tra => tra.id === transaction.category_id)
                          .map(tre => tre.title)}
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

export default Categorylistmonth;
