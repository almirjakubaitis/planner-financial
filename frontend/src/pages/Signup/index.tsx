import React, { useCallback, useRef } from 'react';
import { useHistory, Link } from 'react-router-dom';

import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { FiArrowRight, FiUser, FiMail, FiLock } from 'react-icons/fi';
import api from '../../services/api';

import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';

import logoImg from '../../assets/logo.svg';
import back from '../../assets/back.svg';

import { Container, Content } from './styles';

interface InsertFormData {
  email: string;
  name: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const history = useHistory();

  const buttonKeyValue = 'submitSignValue-2020';

  const handleSubmit = useCallback(
    async (data: InsertFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail é obrigatório')
            .email('Digite um e-mail válido'),
          name: Yup.string().required('Nome é obrigatório'),
          password: Yup.string().required('Senha é obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });



        await api.post('/users', data);


        history.push('/');

        addToast({
          type: 'success',
          title: 'Cadastro realizado!',
          description: 'Você já pode fazer seu logon na aplicação',
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
          description: 'Ocorreu um erro ao fazer cadastro, tente novamente',
        });
      }
    },
    [addToast, history],
  );

  return (
    <Container>
      <Content>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <Link to="dashboard">
            <img src={logoImg} alt="Planner" />
          </Link>
          <h1>Registre-se agora</h1>

          <Input
            name="name"
            placeholder="Insira seu nome completo"
            className="input"
            icon={FiUser}
          />
          <Input
            name="email"
            placeholder="Insira seu E-mail"
            className="input"
            icon={FiMail}
          />
          <Input
            name="password"
            type="password"
            placeholder="Sua senha secreta"
            className="input"
            icon={FiLock}
          />

          <button type="submit" key={buttonKeyValue}>
            Cadastrar
            <span>
              <FiArrowRight />
            </span>
          </button>
        </Form>
        <Link to="/">
          <img src={back} width="16px" alt="Voltar para Logon" />
          Voltar para o Logon
        </Link>
      </Content>
    </Container>
  );
};
export default SignUp;
