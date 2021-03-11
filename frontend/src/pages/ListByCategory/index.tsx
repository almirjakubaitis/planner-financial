/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, Link, useHistory } from 'react-router-dom';


import { getYear } from 'date-fns';

import {
  FiTrash2,
  FiEdit,
  FiCopy,
  FiChevronLeft,
  FiChevronsDown,
  FiChevronsUp,
} from 'react-icons/fi';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/balance.svg';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

import formatValue from '../../utils/formatValue';
import formatAverage from '../../utils/formatAverage';

import { Container, CardContainer, Card, Main, Transactions } from './styles';

interface TransactionData {
  id: string;
  value: number;
  title: string;
  date: Date;
  copies: number;
  type: 'income' | 'outcome';
  description: string;
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
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);
  const [sortSelected, setSortselected] = useState<string>();

  const { user } = useAuth();

  const provider = user.id;



  const query = new URLSearchParams(useLocation().search);

  const categoryTitle = query.get('category_title');
  const categoryId = query.get('category_id');


  if (!localStorage.getItem('@Planner:year')) {
    const dateAsDate = new Date();

    const yearDate = getYear(dateAsDate);

    localStorage.setItem('@Planner:year', JSON.stringify(yearDate));
  }

  const year = localStorage.getItem('@Planner:year');

  const dates: string[] = [];
  dates[0] = `${year}-01-01`;
  dates[1] = `${year}-02-01`;
  dates[2] = `${year}-03-01`;
  dates[3] = `${year}-04-01`;
  dates[4] = `${year}-05-01`;
  dates[5] = `${year}-06-01`;
  dates[6] = `${year}-07-01`;
  dates[7] = `${year}-08-01`;
  dates[8] = `${year}-09-01`;
  dates[9] = `${year}-10-01`;
  dates[10] = `${year}-11-01`;
  dates[11] = `${year}-12-01`;

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

  const monthsShort = months.map(month => {
    return month.substr(0, 3);
  });

  const linkToList = `/listmonth?category_id=${categoryId}&category_title=${categoryTitle}&date=`;

  const { addToast } = useToast();
  const history = useHistory();

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


  // SORTED ACTIONS

  // Total

  const handleByLowestTotal = useCallback(() => {
    // [...transactions].map(item => item.transaction.sort(sortByLowestTotal));

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



  const loadTransactions = useCallback(() => {
    async function loadTrans(): Promise<void> {
      const response = await api.get(`/transactions/categories`, {


        params: {
          category_id: categoryId,
          provider_id: provider,
          year,
        },
      });


      const { transaction } = response.data.transactions[0];



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

        setTransactions(transaction.sort(sortByLowestTitle));
        setSortselected('upTitle');

        setBalance(balanceFormatted);
      } else {
        setTransactions([]);
      }


    }

    loadTrans();
  }, [categoryId, provider, year, sortByLowestTitle]);

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

  const handleRowDelete = useCallback(
    async (id: string) => {
      await api.delete(`/transactions/${id}/${provider}`);

      addToast({
        type: 'success',
        title: 'A Transação foi removida!',
        description: 'Esta operação não poderá ser desfeita',
      });


      loadTransactions();
    },
    [addToast, provider, loadTransactions],
  );

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
          <span>
            <Link to="/dashboard" className="mobileNone">
              <div>
                <FiChevronLeft /> Voltar
              </div>
            </Link>
            <p> {balance.categoryTitle}</p>

            <div className="mobileNone" />
          </span>

          <section className="mobileNone">
            <div className="months">
              {dates.map(monthdate => {
                return (
                  <Link
                    to={`${linkToList}${monthdate}`}
                    key={dates.indexOf(monthdate)}
                  >
                    <p>{monthsShort[dates.indexOf(monthdate)]}</p>
                  </Link>
                );
              })}
            </div>
          </section>

          <Transactions>
            <table>
              <thead>
                {transactions.length ? (
                  <tr className="trhead">
                    <th> </th>
                    <th> </th>
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

                    <th> </th>
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

export default ListByCategory;
