import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { getYear } from 'date-fns';

import { FiChevronsDown, FiChevronsUp } from 'react-icons/fi';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/balance.svg';

import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

import formatValue from '../../utils/formatValue';
import formatAverage from '../../utils/formatAverage';

import { Container, CardContainer, Card, Main, Transactions } from './styles';

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

const AllTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);
  const [sortSelected, setSortselected] = useState<string>('upCategory');

  const { user } = useAuth();


  const provider = user.id;


  if (!localStorage.getItem('@Planner:year')) {
    const dateAsDate = new Date();

    const yearDate = getYear(dateAsDate);

    localStorage.setItem('@Planner:year', JSON.stringify(yearDate));
  }

  const year = localStorage.getItem('@Planner:year');

  const history = useHistory();

  const handleRowUrl = useCallback(
    (id, title) => {
      history.push(`/listcategory?category_id=${id}&category_title=${title}`);
    },
    [history],
  );

  // SORTED FUNCTIONS

  const sortByLowestTotal = useCallback((a, b) => {
    return a.total - b.total;
  }, []);

  const sortByHighestTotal = useCallback((b, a) => {
    return a.total - b.total;
  }, []);

  const sortByLowestAverage = useCallback((a, b) => {
    return a.average - b.average;
  }, []);

  const sortByHighestAverage = useCallback((b, a) => {
    return a.average - b.average;
  }, []);

  const sortByLowestCategory = useCallback((a: Transaction, b: Transaction) => {
    const aText = a.category[0].title;
    const bText = b.category[0].title;

    return aText.localeCompare(bText);

  }, []);

  const sortByHighestCategory = useCallback(
    (b: Transaction, a: Transaction) => {
      const aText = a.category[0].title;
      const bText = b.category[0].title;

      return aText.localeCompare(bText);


    },
    [],
  );



  const loadTransactions = useCallback(() => {
    async function loadTrans(): Promise<void> {
      const response = await api.get(`/transactions`, {

        params: {
          provider_id: provider,
          year,
        },
      });

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

      setTransactions(transactionsFormatted.sort(sortByLowestCategory));


      setBalance(balanceFormatted);

    }

    loadTrans();
  }, [provider, year, sortByLowestCategory]);

  // SORTED ACTIONS

  // Total

  const handleByLowestTotal = useCallback(() => {
    setTransactions([...transactions].sort(sortByLowestTotal));
    setSortselected('upTotal');
  }, [sortByLowestTotal, transactions]);

  const handleByHighestTotal = useCallback(() => {
    setTransactions([...transactions].sort(sortByHighestTotal));
    setSortselected('downTotal');
  }, [sortByHighestTotal, transactions]);

  // Average

  const handleByLowestAverage = useCallback(() => {
    setTransactions([...transactions].sort(sortByLowestAverage));
    setSortselected('upAverage');
  }, [sortByLowestAverage, transactions]);

  const handleByHighestAverage = useCallback(() => {
    setTransactions([...transactions].sort(sortByHighestAverage));
    setSortselected('downAverage');
  }, [sortByHighestAverage, transactions]);

  // Category

  const handleByLowestCategory = useCallback(() => {
    setTransactions([...transactions].sort(sortByLowestCategory));
    setSortselected('upCategory');
  }, [sortByLowestCategory, transactions]);

  const handleByHighestCategory = useCallback(() => {
    setTransactions([...transactions].sort(sortByHighestCategory));
    setSortselected('downCategory');
  }, [sortByHighestCategory, transactions]);



  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

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
            <h1>{balance.income}</h1>
            <p>{balance.incomeAverage}/mês</p>
          </Card>
          <Card type="outcome">
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Saídas" />
            </header>
            <h1>{balance.outcome}</h1>
            <p>{balance.outcomeAverage}/mês</p>
          </Card>
          <Card type="total">
            <header>
              <p>Total</p>
              <img src={total} alt="Saldo" />
            </header>
            <h1>{balance.total}</h1>
            <p>{balance.totalAverage}/mês</p>
          </Card>
        </CardContainer>

        <Main>
          <Transactions>
            <table>
              <thead>
                {transactions.length ? (
                  <tr className="trhead">
                    <th>
                      <div>
                        <button type="button" onClick={handleByHighestCategory}>
                          {sortSelected === 'downCategory' ? (
                            <FiChevronsUp color="#471878" />
                          ) : (
                            <FiChevronsUp color="#969CB2" />
                          )}
                        </button>

                        <button type="button" onClick={handleByLowestCategory}>
                          {sortSelected === 'upCategory' ? (
                            <FiChevronsDown color="#471878" />
                          ) : (
                            <FiChevronsDown color="#969CB2" />
                          )}
                        </button>

                        <div>Categoria</div>
                      </div>
                    </th>
                    <th className="mobileNone">
                      <div>
                        <button type="button" onClick={handleByLowestAverage}>
                          {sortSelected === 'upAverage' ? (
                            <FiChevronsUp color="#471878" />
                          ) : (
                            <FiChevronsUp color="#969CB2" />
                          )}
                        </button>
                        <button type="button" onClick={handleByHighestAverage}>
                          {sortSelected === 'downAverage' ? (
                            <FiChevronsDown color="#471878" />
                          ) : (
                            <FiChevronsDown color="#969CB2" />
                          )}
                        </button>
                        <div>Média/Mensal</div>
                      </div>
                    </th>
                    <th>
                      <div>
                        <button type="button" onClick={handleByLowestTotal}>
                          {sortSelected === 'upTotal' ? (
                            <FiChevronsUp color="#471878" />
                          ) : (
                            <FiChevronsUp color="#969CB2" />
                          )}
                        </button>
                        <button type="button" onClick={handleByHighestTotal}>
                          {sortSelected === 'downTotal' ? (
                            <FiChevronsDown color="#471878" />
                          ) : (
                            <FiChevronsDown color="#969CB2" />
                          )}
                        </button>

                        <div>Total</div>
                      </div>
                    </th>
                  </tr>
                ) : (
                  <tr className="trhead">
                    <th colSpan={3} style={{ textAlign: 'center' }}>
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

export default AllTransactions;
