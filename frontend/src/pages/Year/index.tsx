import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import * as Yup from 'yup';

import { getYear } from 'date-fns';

import { FiArrowRight } from 'react-icons/fi';

import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/toast';

import Header from '../../components/Header';

import DatePicker from '../../components/DatePicker';

import {
  Container,
  Main,
  Title,
  Transactions,
  Content,
  DatePickerCss,
} from './styles';

interface InsertFormData {
  date: Date;
}

const Year: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const history = useHistory();

  const yearDate = localStorage.getItem('@Planner:year');

  const [startDate, setStartDate] = useState();

  const handleSubmit = useCallback(
    async (data: InsertFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          date: Yup.string().required('Data é obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { date } = data;

        const dateAsDate = new Date(date);

        const year = getYear(dateAsDate);

        localStorage.setItem('@Planner:year', JSON.stringify(year));

        history.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          // eslint-disable-next-line no-useless-return
          return;
        }
      }
    },
    [history],
  );

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      if (yearDate) {
        setStartDate(new Date(`${yearDate}-11-11`) as any);
      }
    }

    loadTransactions();
  }, [yearDate]);

  return (
    <>
      <Header />
      <Container>
        <Main>
          <Title>Alterar o ano</Title>
          <Transactions>
            <Content>
              <Form ref={formRef} onSubmit={handleSubmit}>
                <DatePickerCss>
                  <DatePicker
                    name="date"
                    selected={startDate}
                    onChange={(date: any) => {
                      setStartDate(date);
                    }}
                    showYearPicker
                    dateFormat="yyyy"
                  />
                </DatePickerCss>

                <button type="submit" className="button">
                  Enviar
                  <span>
                    <FiArrowRight size={35} />
                  </span>
                </button>
              </Form>
            </Content>
          </Transactions>
        </Main>
      </Container>
    </>
  );
};

export default Year;
