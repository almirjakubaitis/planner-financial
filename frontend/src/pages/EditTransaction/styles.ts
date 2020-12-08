import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 0;
  align-content: center;
  justify-content: center;
  position: relative;
`;

export const Title = styled.h1`
  font-size: 35px;
  color: var(--color-title-in-card);
  text-align: center;
  padding: 20px 0;
`;

export const Main = styled.div`
  background: var(--color-background);
  width: 100%;
  min-height: 89vh;

  position: relative;
  top: 0px;
  padding: 20px 0;
`;

export const Transactions = styled.div`
  width: 50%;
  max-width: 750px;

  margin: 0 auto;
  padding: 0px 30px;
  position: relative;
  color: var(--color-table-in-text);
  background: var(--color-card-primary);
  border-radius: 8px;

  align-content: center;
  justify-content: center;
  display: flex;

  @media only screen and (max-width: 750px) {
    background: none;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  justify-content: center;
  width: 100%;

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

    input {
      background: var(--color-card-primary);
      border-radius: 10px;
      border: 0;
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

    .button {
      display: flex;
      align-items: center;
      justify-content: center;

      background: var(--color-card-total);
      border-radius: 10px;
      border: 0;
      padding: 0;
      color: var(--color-button-text);
      width: 100%;
      height: 56px;
      margin-top: 16px;
      font-weight: normal;
      transition: background-color 0.2s;
      padding-left: 20%;

      &:hover {
        background: var(--color-nav-user);
      }

      span {
        width: 56px;
        height: 56px;
        border-radius: 10px;
        opacity: 0.5;
        align-items: center;
        justify-content: center;
        display: flex;
        margin-left: 1%;
      }

      svg {
        margin-right: 15px;
        margin-left: 20px;
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

  .divMargin {
    padding-bottom: 8px;
  }
`;
