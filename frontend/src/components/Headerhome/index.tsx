import React from 'react';

import { Link } from 'react-router-dom';

import logo from '../../assets/logo.svg';
// import back from '../../assets/back.svg';
import signoutbutton from '../../assets/signout.svg';

import { useAuth } from '../../hooks/auth';

import { Container } from './styles';

const Header: React.FC = () => {
  const year = localStorage.getItem('@Planner:year');
  const { signOut, user } = useAuth();

  const firstName = user.name.split(' ');

  return (
    <Container>
      <header>
        <nav>
          <Link to="/dashboard">
            <img src={logo} alt="Planner" width="180px" />
          </Link>
        </nav>

        <nav>
          <span> Seja bem-vindo(a), {firstName[0]} </span>
        </nav>

        <nav>
          <Link to="/dashboard">Por Categoria</Link>

          <Link to="/monthly">Por Mês</Link>
          <Link to="/categories">Categorias</Link>
          <Link to="/year">Ano atual: {year}</Link>
          {/* <Link to="/options">Opções</Link> */}

          <button type="button" onClick={signOut}>
            <img src={signoutbutton} width="16px" alt="Sign Out" />
            Sair
          </button>
        </nav>
      </header>
    </Container>
  );
};

export default Header;
