import React, { useCallback, useRef } from 'react';
import { useHistory, Link } from 'react-router-dom';

import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { FiLogIn, FiUser, FiLock } from 'react-icons/fi';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';

import logoImg from '../../assets/logo.svg';

import { Container, Content } from './styles';

interface InsertFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { signIn } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();

  const buttonKeyValue = 'submitSignValue-2020';

  const handleSubmit = useCallback(
    async (data: InsertFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().required('Senha obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await signIn({
          email: data.email,
          password: data.password,
        });

        history.push('/dashboard');

        addToast({
          type: 'success',
          title: 'Login efetuado com sucesso!',
          description: 'Bem-vindo ao Dashboard',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na autenticação',
          description:
            'Ocorreu um erro ao fazer login, verifique as credenciais',
        });
      }
    },
    [addToast, signIn, history],
  );

  return (
    <Container>
      <Content>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <Link to="dashboard">
            <img src={logoImg} alt="Planner" />
          </Link>
          <h1>Bem-vindo de volta!</h1>

          <Input
            name="email"
            placeholder="E-mail"
            className="input"
            icon={FiUser}
          />
          <Input
            name="password"
            type="password"
            placeholder="Senha"
            className="input"
            icon={FiLock}
          />
          <Link to="forgot">Esqueceu sua senha?</Link>
          <button type="submit" key={buttonKeyValue}>
            <span>
              <FiLogIn />
            </span>
            Entrar
          </button>
        </Form>

        <Link to="criar-conta">
          Precisa de uma conta? |<p> Registre-se</p>
        </Link>
      </Content>
    </Container>
  );
};
export default SignIn;
