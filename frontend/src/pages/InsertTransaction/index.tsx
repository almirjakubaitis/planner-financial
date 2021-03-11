import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';

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

interface Categories {
  id: string;
  title: string;
}

const InsertTransactions: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [startDate, setStartDate] = useState();

  const { user } = useAuth();

  const provider = user.id;

  const { addToast } = useToast();
  const history = useHistory();

  const [categories, setCategories] = useState<Categories[]>([]);

  const handleSubmit = useCallback(
    async (data: InsertFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          title: Yup.string().required('Título é obrigatório'),
          value: Yup.string().required('Deve conter um número'),
          type: Yup.string().required('Tipo é obrigatório'),
          category: Yup.string().required('Categoria é obrigatória'),
          date: Yup.string().required('Data é obrigatória'),
          copies: Yup.string().required('Parcela é obrigatória'),
          description: Yup.string().required('Descrição é obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post(
          '/transactions',
          {
            provider_id: data.provider_id,
            date: data.date,
            copies: data.copies,
            type: data.type,
            value: parseFloat(data.value.replace(/\s/g, '').replace(',', '.')),

            category: data.category,
            title: data.title,
            description: data.description,
          },

        );

        history.push('/dashboard');

        addToast({
          type: 'success',
          title: 'Sucesso!',
          description: 'Nova transação cadastrada.',
        });

        // console.log(data);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);



          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na inclusão',
          description: 'Ocorreu um erro ao criar a transação, tente novamente',
        });
      }
    },
    [addToast, history],
  );

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const responseForCategories = await api.get(`/categories`, {

        params: {
          provider_id: provider,
        },
      });

      const categoriesTotalResponse = responseForCategories.data.categories;

      setCategories(categoriesTotalResponse);

      setStartDate(new Date() as any);


    }

    loadTransactions();
  }, [provider]);

  return (
    <>
      <Header />
      <Container>
        <Main>
          <Title>Inserir nova transação</Title>
          <Transactions>
            <Content>
              <Form ref={formRef} onSubmit={handleSubmit}>
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
                  dateFormat="dd-MM-yyyy"
                  locale="pt-BR"
                  onChange={(date: any) => {
                    setStartDate(date);
                  }}
                />

                <Input name="description" placeholder="Descrição" />
                <Input name="copies" type="hidden" value={1} />
                <Input name="provider_id" type="hidden" value={provider} />
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

export default InsertTransactions;
