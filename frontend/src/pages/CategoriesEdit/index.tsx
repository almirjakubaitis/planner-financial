/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useCallback, useRef } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';

import getValidationErrors from '../../utils/getValidationErrors';

import Header from '../../components/Header';

import Input from '../../components/Input';

import { Container, Main, Title, Transactions, Content } from './styles';

interface InsertFormData {
  title: string;
}

interface idParams {
  id: string;
  title: string;
}

const CategoriesEdit: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const history = useHistory();

  const { params } = useRouteMatch<idParams>();


  const { user } = useAuth();
  const provider = user.id;

  const handleSubmit = useCallback(
    async (data: InsertFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          title: Yup.string().required('Categoria é obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });


        await api.put(`/categories/${params.id}/${provider}`, data, {

        });

        history.replace('/categories');

        addToast({
          type: 'success',
          title: 'Sucesso!',
          description: 'Nome da categoria foi alterado',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description: 'Categoria já existe, insira outro nome',
        });
      }
    },
    [addToast, history, params, provider],
  );

  return (
    <>
      <Header />
      <Container>
        <Main>
          <Title>Alterar Título da Categoria</Title>
          <Transactions>
            <Content>
              <Form initialData={params} ref={formRef} onSubmit={handleSubmit}>
                <Input name="title" placeholder="Nome da Categoria" />

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

export default CategoriesEdit;
