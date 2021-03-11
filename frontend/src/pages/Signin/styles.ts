import styled, { keyframes } from 'styled-components';
// import { shade } from 'polished';

import SignInBackgroundImg from '../../assets/background.png';

const appearFromLeft = keyframes`

from {
  opacity: 0;
  transform: translateX(-50px);
}
to {

  opacity: 1;
  transform: translateX(0);
}
`;

const FromLeft = keyframes`

0% {
  opacity: 1;
  transform: translateX(0);
}
50% {

  opacity: 1;
  transform: translateX(+20px);
}

60% {
  opacity: 1;
  transform: translateX(0);
}

75% {

opacity: 1;
transform: translateX(+20px);
}

90% {
  opacity: 1;
  transform: translateX(+10px);
}

95% {
  opacity: 1;
  transform: translateX(0);
}


100% {
  opacity: 1;
  transform: translateX(0);
}
`;

export const Container = styled.div`
  background: url(${SignInBackgroundImg}) no-repeat center;
  background-size: cover;

  height: 100vh;

  display: flex;
  align-items: stretch;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  justify-content: center;
  width: 90%;
  margin: 5%;

  animation: ${appearFromLeft} 1s;

  img {
    width: 300px;
    margin-bottom: 20px;
  }

  form {
    margin: 30px 0;
    width: 340px;
    text-align: left;

    h1 {
      margin-bottom: 24px;
    }

    .input {
      background: var(--color-input-background);
      border-radius: 10px;
      border: 2px solid var(--color-input-background);
      padding: 16px;
      width: 100%;
      color: var(--color-input-text);

      &::placeholder {
        color: var(--color-input-placeholder);
      }

      & + input {
        margin-top: 8px;
      }
    }

    button {
      width: 100%;
      height: 56px;

      display: flex;
      align-items: center;
      justify-content: flex-end;

      background: var(--color-button-terciary);
      border-radius: 10px;
      border: 0;
      padding: 0;
      color: var(--color-button-text);

      margin-top: 16px;
      transition: background-color 0.2s;

      &:hover {
        background: var(--color-button-principal);
        animation: ${FromLeft} 0.45s;
      }

      span {
        background: var(--color-primary-dark);
        width: 56px;
        height: 56px;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        opacity: 0.5;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 25%;
      }
    }

    a {
      color: var(--color-text-complement);
      display: block;
      font-weight: bold;
      margin-top: 24px;
      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: var(--color-text-in-hover);
      }
    }
  }

  > a {
    color: var(--color-title-in-primary);
    display: block;
    margin-top: 24px;
    text-decoration: none;
    transition: color 0.2s;
    display: flex;
    align-items: center;

    p {
      margin-left: 5px;
      font-weight: bold;
    }

    &:hover {
      color: var(--color-text-in-hover);
    }
  }
`;
