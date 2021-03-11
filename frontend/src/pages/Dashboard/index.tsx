/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { getYear, addDays } from 'date-fns';
import { FiDollarSign } from 'react-icons/fi';

import { Line } from 'react-chartjs-2';

import { useAuth } from '../../hooks/auth';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/balance.svg';

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

interface ChartDataProps {
  labels: string[];
  datasets: string[];
}

export const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);
  const [chartData, setchartData] = useState({});
  const [chartOptions, setchartOptions] = useState({});

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
      history.push(`/months?date=${id}`);
    },
    [history],
  );



  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get(`/transactions/monthly`, {


        params: {
          provider_id: provider,
          year,
        },
      });

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
          //
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



      const dataforChart = {
        labels: [
          'Jan',
          'Fev',
          'Mar',
          'Abr',
          'Mai',
          'Jun',
          'Jul',
          'Ago',
          'Set',
          'Out',
          'Nov',
          'Dez',
        ],
        datasets: [
          {
            label: 'total',
            data: transactionsResponse.map((transaction: Transaction) =>
              transaction.total.toPrecision(10),
            ),
            fill: true,
            backgroundColor: 'rgba(255, 243, 209, 0.3)',
            borderColor: 'rgba(241, 118, 16, 0.5)',
          },
          {
            label: 'Entradas',
            data: transactionsResponse.map((transaction: Transaction) =>
              transaction.income.toPrecision(10),
            ),
            fill: true,
            backgroundColor: 'rgb(85, 165, 163, 0.3)',
            borderColor: 'rgba(85, 165, 163, 0.5)',
          },
          {
            label: 'Saídas',
            data: transactionsResponse.map((transaction: Transaction) =>
              transaction.outcome.toPrecision(10),
            ),
            fill: true,
            backgroundColor: 'rgb(237, 88, 102, 0.3)',
            borderColor: 'rgba(237, 88, 102, .5)',
          },
        ],
      };

      const optionsForChart = {
        responsive: true,
        maintainAspectRatio: true,
        showScale: false,
        scales: {
          yAxes: [
            {
              type: 'linear',
              display: true,
              position: 'left',
              id: 'y-axis-1',
              gridLines: {
                drawOnArea: true,
              },
              ticks: {
                beginAtZero: true,
              },
            },
            {
              type: 'linear',
              display: false,
              position: 'right',
              id: 'y-axis-2',
              gridLines: {
                drawOnArea: true,
              },
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      };

      setchartData(dataforChart);
      setchartOptions(optionsForChart);

      //
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
        </CardContainer>
        <Main>
          <Transactions>
            <div>
              <section>
                <section className="total">
                  <p className="mobileNone">Total</p>
                  <span className="months">
                    <p className="mobileNone">Jan</p>
                    <p className="mobileNone">Fev</p>
                    <p className="mobileNone">Mar</p>
                    <p className="mobileNone">Abr</p>
                    <p className="mobileNone">Mai</p>
                    <p className="mobileNone">Jun</p>
                    <p className="mobileNone">Jul</p>
                    <p className="mobileNone">Ago</p>
                    <p className="mobileNone">Set</p>
                    <p className="mobileNone">Out</p>
                    <p className="mobileNone">Nov</p>
                    <p className="mobileNone">Dez</p>
                  </span>
                  <div>
                    {transactions.map(transaction => (
                      <button
                        type="button"
                        key={transaction.transaction_index}
                        className={
                          transaction.total >= 0 ? 'income' : 'outcome'
                        }
                        onClick={() => handleRowUrl(transaction.month)}
                      >
                        <span className="DesktopNone">
                          <FiDollarSign size={25} />
                        </span>
                        <p className="DesktopNone">
                          {transaction.formattedMonth}:
                        </p>{' '}
                        {transaction.formattedTotal}
                      </button>
                    ))}
                  </div>
                </section>

                <section className="mobileNone containerChart">
                  <div className="mobileNone ">
                    Resultado do ano de {year}
                    <span className="mobileNone chart">
                      <Line
                        data={chartData}
                        options={chartOptions}
                        height={70}
                      />
                    </span>
                  </div>
                </section>

                <div />
                <section className="mobileNone entradas">
                  <p className="mobileNone">Entradas</p>
                  <span className="months">
                    <p className="mobileNone">Jan</p>
                    <p className="mobileNone">Fev</p>
                    <p className="mobileNone">Mar</p>
                    <p className="mobileNone">Abr</p>
                    <p className="mobileNone">Mai</p>
                    <p className="mobileNone">Jun</p>
                    <p className="mobileNone">Jul</p>
                    <p className="mobileNone">Ago</p>
                    <p className="mobileNone">Set</p>
                    <p className="mobileNone">Out</p>
                    <p className="mobileNone">Nov</p>
                    <p className="mobileNone">Dez</p>
                  </span>

                  <div className="mobileNone">
                    {transactions.map(transaction => (
                      <button
                        type="button"
                        key={transaction.transaction_index}
                        className={
                          transaction.income >= 0 ? 'income' : 'outcome'
                        }
                        onClick={() => handleRowUrl(transaction.month)}
                      >
                        {transaction.formattedIncome}
                      </button>
                    ))}
                  </div>
                </section>

                <section className="mobileNone saidas">
                  <p className="mobileNone">Saídas</p>
                  <span className="months">
                    <p className="mobileNone">Jan</p>
                    <p className="mobileNone">Fev</p>
                    <p className="mobileNone">Mar</p>
                    <p className="mobileNone">Abr</p>
                    <p className="mobileNone">Mai</p>
                    <p className="mobileNone">Jun</p>
                    <p className="mobileNone">Jul</p>
                    <p className="mobileNone">Ago</p>
                    <p className="mobileNone">Set</p>
                    <p className="mobileNone">Out</p>
                    <p className="mobileNone">Nov</p>
                    <p className="mobileNone">Dez</p>
                  </span>
                  <div className="mobileNone">
                    {transactions.map(transaction => (
                      <button
                        type="button"
                        key={transaction.transaction_index}
                        className={
                          transaction.outcome > 0 ? 'outcome' : 'income'
                        }
                        onClick={() => handleRowUrl(transaction.month)}
                      >
                        {transaction.formattedOutcome}
                      </button>
                    ))}
                  </div>
                </section>
              </section>
            </div>
          </Transactions>
        </Main>
      </Container>
      <Footer />
    </>
  );
};

export default Dashboard;
