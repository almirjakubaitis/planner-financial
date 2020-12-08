/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  FiArrowRight,
  FiTrash2,
  FiEdit,
  FiThumbsDown,
  FiMoreHorizontal,
} from 'react-icons/fi';

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

import {
  Container,
  Main,
  Title,
  Transactions,
  Content,
  Left,
  Right,
} from './styles';

interface InsertFormData {
  title: string;
}

interface Categories {
  id: string;
  title: string;
  iconDelete?: Record<string, unknown>;
  iconEdit?: Record<string, unknown>;
  iconConfirm?: Record<string, unknown>;
}

interface DeleteData {
  id: string;
  iconDelete?: Record<string, unknown>;
  iconEdit?: Record<string, unknown>;
}

const Categories: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const history = useHistory();

  const [categories, setCategories] = useState<Categories[]>([]);

  const [confirmToDelete, setconfirmToDelete] = useState<object>();

  const { user } = useAuth();
  const token = localStorage.getItem('@Planner:token');
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

        await api.post(`/categories`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        history.replace('/categories');

        addToast({
          type: 'success',
          title: 'Sucesso!',
          description: 'Categoria cadastrada',
        });

        formRef.current?.reset();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description:
            'Ocorreu um erro ao cadastrar a categoria, tente novamente',
        });
      }
    },
    [addToast, history, token],
  );

  const handleRowEdit = useCallback(
    (id: string, title: string) => {
      history.push(`/categoriesitem/${id}/${title}`);
    },
    [history],
  );

  const handleRowDelete = useCallback(
    async (id: string) => {
      await api.delete(`/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setconfirmToDelete(
        <button
          type="button"
          style={{
            background: 'transparent',
            marginRight: '10px',
            border: '0',
          }}
        >
          <FiMoreHorizontal color="#fff" />
        </button>,
      );

      addToast({
        type: 'success',
        title: 'A Categoria foi removida!',
        description: 'Esta operação não poderá ser desfeita',
      });

      history.replace('/categories');
    },
    [history, token, addToast],
  );

  const handleRowConfirmToDelete = useCallback(
    async (id, icon) => {
      // document.getElementById(id).style.display = 'none';

      setconfirmToDelete(
        <button
          type="button"
          onClick={() => handleRowDelete(id)}
          style={{
            background: 'transparent',
            marginRight: '10px',
            border: '0',
          }}
        >
          {icon}
        </button>,
      );

      addToast({
        type: 'error',
        title: 'Cuidado ao apagar a categoria!',
        description: 'Todas as transações dela serão apagadas',
      });
    },
    [addToast, handleRowDelete],
  );

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const responseForCategories = await api.get(`/categories/${provider}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const categoriesTotalResponse = responseForCategories.data.categories;

      const categoriesDataAndDelete = categoriesTotalResponse.map(
        (map: Categories) => ({
          ...map,
          description: 'Todas as transações dela serão apagadas',
          iconDelete: <FiTrash2 size={16} color="#e28090" />,
          iconEdit: <FiEdit size={16} />,
          iconConfirm: <FiThumbsDown color="#E83F5B" />,
        }),
      );

      setCategories(categoriesDataAndDelete);

      // console.log(response.data);
    }

    loadTransactions();
  }, [categories, token, provider]);

  return (
    <>
      <Header />
      <Container>
        <Main>
          <Left>
            <Title className="left">Lista de Categorias</Title>
            <Transactions className="left">
              <table>
                <thead className="trhead">
                  <tr>
                    <th> </th>
                    <th> </th>
                    <th> </th>
                  </tr>
                </thead>

                <tbody>
                  {categories.map((item: Categories) => (
                    <tr key={item.id}>
                      <td onClick={() => handleRowEdit(item.id, item.title)}>
                        {item.iconEdit}
                      </td>
                      <td> {item.title}</td>
                      <td
                        onClick={() =>
                          handleRowConfirmToDelete(item.id, item.iconConfirm)}
                      >
                        <span key={item.id} id={item.id}>
                          {confirmToDelete}
                        </span>
                        {item.iconDelete}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Transactions>
          </Left>
        </Main>
        <Main>
          <Right>
            <Title>Criar nova Categoria</Title>
            <Transactions>
              <Content>
                <Form ref={formRef} onSubmit={handleSubmit}>
                  <Input name="title" placeholder="Nome da Categoria" />
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
          </Right>
        </Main>
      </Container>
    </>
  );
};

export default Categories;
