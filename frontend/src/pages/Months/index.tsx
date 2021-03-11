import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useHistory, Link } from 'react-router-dom';

import { FiChevronLeft, FiChevronsDown, FiChevronsUp } from 'react-icons/fi';

import { parseISO } from 'date-fns';

import { useAuth } from '../../hooks/auth';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/balance.svg';

import api from '../../services/api';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, Main, Transactions } from './styles';

interface TransactionData {
  id: string;
  value: number;
  title: string;
  date: Date;
  copies: number;
  type: 'income' | 'outcome';
  description: string;
  category_id: string;
  category_title: string;
}

interface Category {
  id: string;
  title: string;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
  average: string;
}

interface idParams {
  provider_id: string;
  date: string;
}

const Categorylistmonth: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);
  const [paramsValues, setParamsValues] = useState<idParams>({} as idParams);
  const [sortSelected, setSortselected] = useState<string>();

  const { user } = useAuth();

  const provider = user.id;

  const history = useHistory();

  const handleRowUrl = useCallback(
    (category_id, date, category_title) => {
      history.push(
        `/listmonth?category_id=${category_id}&category_title=${category_title}&date=${date}`,
      );
    },
    [history],
  );


  const query = new URLSearchParams(useLocation().search);

  const date = query.get('date');


  // SORTED FUNCTIONS

  const sortByLowestTotal = useCallback((a, b) => {
    return a.value - b.value;
  }, []);

  const sortByHighestTotal = useCallback((b, a) => {
    return a.value - b.value;
  }, []);

  const sortByLowestDescription = useCallback((a, b) => {
    const aText = a.description;
    const bText = b.description;

    return aText.localeCompare(bText);
  }, []);

  const sortByHighestDescription = useCallback((b, a) => {
    const aText = a.description;
    const bText = b.description;

    return aText.localeCompare(bText);
  }, []);

  const sortByLowestTitle = useCallback((a, b) => {
    const aText = a.title;
    const bText = b.title;

    return aText.localeCompare(bText);
  }, []);

  const sortByHighestTitle = useCallback((b, a) => {
    const aText = a.title;
    const bText = b.title;

    return aText.localeCompare(bText);
  }, []);

  const sortByLowestCategory = useCallback((a, b) => {
    const aText = a.category_title;
    const bText = b.category_title;

    return aText.localeCompare(bText);
  }, []);

  const sortByHighestCategory = useCallback((b, a) => {
    const aText = a.category_title;
    const bText = b.category_title;

    return aText.localeCompare(bText);
  }, []);

  // SORTED ACTIONS

  // Total

  const handleByLowestTotal = useCallback(() => {
    setTransactions(transactions.sort(sortByLowestTotal));


    setSortselected('upTotal');
  }, [sortByLowestTotal, transactions]);

  const handleByHighestTotal = useCallback(() => {
    setTransactions(transactions.sort(sortByHighestTotal));

    setSortselected('downTotal');
  }, [sortByHighestTotal, transactions]);

  // Description

  const handleByLowestDescription = useCallback(() => {
    setTransactions(transactions.sort(sortByLowestDescription));


    setSortselected('upDescription');
  }, [sortByLowestDescription, transactions]);

  const handleByHighestDescription = useCallback(() => {
    setTransactions(transactions.sort(sortByHighestDescription));

    setSortselected('downDescription');
  }, [sortByHighestDescription, transactions]);

  // Title

  const handleByLowestTitle = useCallback(() => {
    setTransactions(transactions.sort(sortByLowestTitle));


    setSortselected('upTitle');
  }, [sortByLowestTitle, transactions]);

  const handleByHighestTitle = useCallback(() => {
    setTransactions(transactions.sort(sortByHighestTitle));


    setSortselected('downTitle');
  }, [sortByHighestTitle, transactions]);

  // Category

  const handleByLowestCategory = useCallback(() => {
    setTransactions(transactions.sort(sortByLowestCategory));


    setSortselected('upCategory');
  }, [sortByLowestCategory, transactions]);

  const handleByHighestCategory = useCallback(() => {
    setTransactions(transactions.sort(sortByHighestCategory));


    setSortselected('downCategory');
  }, [sortByHighestCategory, transactions]);

  const loadTransactions = useCallback(() => {
    async function loadTrans(): Promise<void> {
      const response = await api.get(`/transactions/months`, {

        params: {
          provider_id: provider,
          date,
        },
      });



      const { category } = response.data.transactions[0];
      const { transaction } = response.data.transactions[0];

      if (transaction) {


        const transactionsFormatted = transaction.map(
          (transactionData: TransactionData) => ({
            ...transactionData,

            category_title: category
              .map((categoryData: Category) => {
                let categoryTitle;
                if (categoryData.id === transactionData.category_id) {
                  categoryTitle = categoryData.title;

                  return categoryTitle;
                }
                return null;
              })
              .find((e: any) => e !== null),

          }),
        );


        const parsedDate = parseISO(String(date));
        const monthName = parsedDate.toLocaleString('pt-BR', {
          month: 'long',
        });

        const paramsFormatted = {
          provider_id: provider,
          date: monthName,
        };



        const balanceResponse = response.data.transactions[0];
        const balanceFormatted = {
          income: formatValue(balanceResponse.income),
          outcome: formatValue(balanceResponse.outcome),
          total: formatValue(balanceResponse.total),
          average: formatValue(balanceResponse.average),
        };

        setTransactions(transactionsFormatted.sort(sortByLowestCategory));
        setSortselected('upCategory');

        setBalance(balanceFormatted);
        setParamsValues(paramsFormatted);
      }

    }

    loadTrans();

    // console.log(transactions);
  }, [date, provider, sortByLowestCategory]);

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
        </CardContainer>
        <Main>
          <span>
            <Link to="/dashboard" className="mobileNone">
              <div>
                <FiChevronLeft /> Voltar
              </div>
            </Link>
            <p> {paramsValues.date}</p>
            <div className="mobileNone" />
          </span>
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
                    <th>
                      <div>
                        <button type="button" onClick={handleByHighestTitle}>
                          {sortSelected === 'downTitle' ? (
                            <FiChevronsUp color="#471878" />
                          ) : (
                            <FiChevronsUp color="#969CB2" />
                          )}
                        </button>

                        <button type="button" onClick={handleByLowestTitle}>
                          {sortSelected === 'upTitle' ? (
                            <FiChevronsDown color="#471878" />
                          ) : (
                            <FiChevronsDown color="#969CB2" />
                          )}
                        </button>

                        <div>Título</div>
                      </div>
                    </th>
                    <th className="mobileNone">
                      <div>
                        <button
                          type="button"
                          onClick={handleByHighestDescription}
                        >
                          {sortSelected === 'downDescription' ? (
                            <FiChevronsUp color="#471878" />
                          ) : (
                            <FiChevronsUp color="#969CB2" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={handleByLowestDescription}
                        >
                          {sortSelected === 'upDescription' ? (
                            <FiChevronsDown color="#471878" />
                          ) : (
                            <FiChevronsDown color="#969CB2" />
                          )}
                        </button>

                        <div>Descrição</div>
                      </div>
                    </th>

                    <th>
                      <div>
                        <button type="button" onClick={handleByHighestTotal}>
                          {sortSelected === 'downTotal' ? (
                            <FiChevronsUp color="#471878" />
                          ) : (
                            <FiChevronsUp color="#969CB2" />
                          )}
                        </button>

                        <button type="button" onClick={handleByLowestTotal}>
                          {sortSelected === 'upTotal' ? (
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
                    key={transaction.id}
                    onClick={() =>
                      handleRowUrl(
                        transaction.category_id,
                        date,
                        transaction.category_title,
                      )
                    }
                  >
                    <td>{transaction.category_title}</td>
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

export default Categorylistmonth;
