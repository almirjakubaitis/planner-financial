/* eslint-disable radix */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';

import { FiArrowRight } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { useAuth } from '../../hooks/auth';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

import Header from '../../components/Header';

import Input from '../../components/Input';

import DatePicker from '../../components/DatePicker';

import { Container, Main, Title, Transactions, Content } from './styles';

interface InsertFormData {
  provider_id: string;
  date: string;
  copies: number;
  type: string;
  value: string;
  category: string;
  title: string;
  description: string;
}

interface TransactionDTO {
  id: string;
  value: string;
  title: string;
  date: string;
  copies: number;
  type: 'income' | 'outcome';
  description: string;
  category_id: string;
  category: string;
}

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
  formattedValue: string;
  formattedTotal: string;
  formattedAverage: string;
  formattedDate: string;
  created_at: Date;
  total: number;
  average: number;
}

interface idParams {
  id: string;
}

interface Categories {
  id: string;
  title: string;
}

const EditTransactions: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [startDate, setStartDate] = useState();

  const { user } = useAuth();
  const token = localStorage.getItem('@Planner:token');
  const provider = user.id;

  const { addToast } = useToast();
  const history = useHistory();

  const [transaction, setTransaction] = useState<TransactionDTO>(
    {} as TransactionDTO,
  );

  const [categories, setCategories] = useState<Categories[]>([]);

  const { params } = useRouteMatch<idParams>();

  const handleSubmit = useCallback(
    async (data: InsertFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          title: Yup.string().required('Título é obrigatório'),
          value: Yup.string().required('Deve conter um número'),
          type: Yup.string().required('Tipo é obrigatório'),
          category: Yup.string().required('Categoria é obrigatória'),
          // date: Yup.string().required('Data é obrigatória'),
          copies: Yup.string().required(
            'Parcela é obrigatória e inferior a 12',
          ),
          description: Yup.string().required('Descrição é obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.put(
          `/transactions/${params.id}`,
          {
            provider_id: data.provider_id,
            date: data.date,
            copies: data.copies,
            type: data.type,
            value: parseFloat(data.value.replace(/\s/g, '').replace(',', '.')), // convert comma to dot

            category: data.category,
            title: data.title,
            description: data.description,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        addToast({
          type: 'success',
          title: 'Sucesso',
          description: 'A transação foi alterada',
        });

        history.push(
          `/listcategory/${transaction.category_id}/${data.category}`,
        );
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na alteração',
          description:
            'Ocorreu um erro ao alterar a transação, tente novamente',
        });
      }
    },
    [addToast, history, params, token, transaction],
  );

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get(`/transactions/provider/${provider}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const responseForCategories = await api.get(`/categories/${provider}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const transactionsResponse = response.data.transactions;

      const categoriesResponse = response.data.transactions;
      const categoriesTotalResponse = responseForCategories.data.categories;

      const transactionResponse: any = transactionsResponse
        .map((map: Transaction) =>
          map.transaction.find(param => param.id === params.id),
        )
        .filter((tr: TransactionDTO) => tr !== undefined)
        .map((values: any) => ({
          ...values,
          date: values.date.slice(0, 10),
          value: String(values.value).replace('.', ','), // convert dot to comma
        }));

      const categoriesMap: any = categoriesResponse.map((map: Transaction) =>
        map.category.find(param => param),
      );

      const categoryFilter: any = categoriesMap.filter(
        (map: any) => map.id === transactionResponse[0].category_id,
      );

      const category = categoryFilter[0];

      const transactionCategoryTitle = transactionResponse.map(
        (values: any) => ({
          ...values,
          category: category.title,
        }),
      );

      const transactionResponseFilter = transactionCategoryTitle[0];

      setTransaction(transactionResponseFilter);
      setCategories(categoriesTotalResponse);

      setStartDate(new Date(transactionResponseFilter.date) as any);
    }

    loadTransactions();
  }, [params, provider, token]);

  return (
    <>
      <Header />
      <Container>
        <Main>
          <Title>Alterar transação</Title>
          <Transactions>
            <Content>
              <Form
                initialData={transaction}
                ref={formRef}
                onSubmit={handleSubmit}
              >
                <Input name="title" placeholder="Título" />
                <Input name="value" placeholder="Valor" />
                <div className="divMargin">
                  <Input
                    type="text"
                    name="type"
                    list="typeList"
                    placeholder="Tipo"
                  />
                  <datalist id="typeList">
                    <option label="Entrada" value="income" />
                    <option label="Saída" value="outcome" />
                  </datalist>
                </div>
                <div className="divMargin">
                  <Input
                    type="text"
                    name="category"
                    list="categoryList"
                    placeholder="Categorias"
                    className="datalist"
                  />
                  <datalist id="categoryList">
                    {categories.map((item: Categories) => (
                      <option
                        key={item.title}
                        value={item.title}
                        label={item.title}
                      />
                    ))}
                  </datalist>
                </div>

                <DatePicker
                  name="date"
                  selected={startDate}
                  dateFormat="yyyy-MM-dd"
                  locale="pt-BR"
                  onChange={(date: any) => {
                    setStartDate(date);
                  }}
                />

                <Input name="description" placeholder="Descrição" />

                <Input name="copies" type="hidden" value={1} />
                <Input name="provider_id" type="hidden" value={provider} />
                <button type="submit" className="button">
                  Alterar
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

export default EditTransactions;
