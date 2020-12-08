import React from 'react';

import { useAuth } from '../../hooks/auth';

import signoutbutton from '../../assets/signout.svg';

import { Container } from './styles';

const FooterHome: React.FC = () => {
  const { signOut, user } = useAuth();

  // console.log(user);

  return (
    <Container>
      <footer>
        <nav />
        <nav>
          <span> Bem-vindo ao Planner, {user.name} </span>
          <button type="button" onClick={signOut}>
            <img src={signoutbutton} width="16px" alt="Sign Out" />
            Sair da Platarforma
          </button>
        </nav>
      </footer>
    </Container>
  );
};

export default FooterHome;
