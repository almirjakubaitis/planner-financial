import React from 'react';

import { useAuth } from '../../hooks/auth';

import { Container } from './styles';

const Footer: React.FC = () => {
  const { user } = useAuth();

  return (
    <Container>
      <footer>
        <nav>
          <span> usuário: {user.id} </span>
        </nav>
        <nav> Versão 0.1.7</nav>
      </footer>
    </Container>
  );
};

export default Footer;
