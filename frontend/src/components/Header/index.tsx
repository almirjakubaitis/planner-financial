import React from 'react';

import { Link } from 'react-router-dom';

import {
  FiCalendar,
  FiFilePlus,
  FiDollarSign,
  FiEdit,
  FiClock,
} from 'react-icons/fi';

import logo from '../../assets/logo.svg';
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
        <p>
          <Link to="/dashboard">
            <img src={logo} alt="Planner" width="180px" />
          </Link>

          {/* <Link to="/dashboard">
            <img src={back} width="16px" alt="Voltar a Dashboard" /> Voltar
          </Link> */}
        </p>

        <nav className="mobileNone">
          <span> Seja bem-vindo(a), {firstName[0]} </span>
        </nav>

        <nav>
          <Link to="/insert">
            {' '}
            <FiFilePlus className="mobileMoreHeight" />{' '}
            <span className="mobileNone">Adicionar</span>
          </Link>
          <Link to="/dashboard">
            <FiDollarSign className="mobileMoreHeight" />{' '}
            <span className="mobileNone">Transações</span>
          </Link>
          <Link to="/monthly">
            <FiCalendar className="mobileMoreHeight" />
            <span className="mobileNone">Mês</span>
          </Link>
          <Link to="/categories">
            {' '}
            <FiEdit className="mobileMoreHeight" />
            <span className="mobileNone">Categorias</span>
          </Link>
          <Link to="/year">
            <FiClock className="mobileMoreHeight" />
            <span className="mobileMoreHeight"> {year}</span>
          </Link>
          {/* <Link to="/options">Opções</Link> */}

          <button type="button" onClick={signOut}>
            <img src={signoutbutton} alt="Sign Out" />
            <p className="mobileNone">Sair</p>
          </button>
        </nav>
      </header>
    </Container>
  );
};

export default Header;
