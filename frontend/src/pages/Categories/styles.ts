import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  /* max-width: 1200px; */
  margin: 0 auto;
  padding: 0px 0px;
  align-content: center;
  justify-content: center;
  position: relative;
  flex-direction: row;
  display: flex;

  @media only screen and (max-width: 800px) {
    flex-direction: column-reverse;
  }
`;

export const Main = styled.div`
  background: var(--color-background);
  width: 100%;
  min-height: 89vh;

  position: relative;
  top: 0px;
  padding: 20px 0;

  @media only screen and (max-width: 800px) {
    min-height: auto;
  }
`;

export const Left = styled.div`
  padding-left: 25%;

  @media only screen and (max-width: 800px) {
    padding-left: 0;
  }
`;

export const Right = styled.div`
  padding-right: 25%;

  @media only screen and (max-width: 800px) {
    padding-right: 0;
  }
`;

export const Title = styled.h1`
  font-size: 35px;
  color: var(--color-title-in-card);
  text-align: center;
  padding: 20px 0;
`;

export const Transactions = styled.div`
  width: 100%;
  max-width: 750px;
  margin: 0 auto;
  padding: 0px 10%;
  align-content: center;
  justify-content: space-between;
  position: relative;
  color: var(--color-table-in-text);
  top: 0px;

  display: flex;

  table {
    border-spacing: 0 0;
    width: 100%;

    th {
    }

    tr {
      background: var(--color-card-primary);

      a {
        display: flex;
        width: 100%;

        text-decoration: none;
        transition: color 0.2s;
      }

      a:hover,
      a:visited,
      a:link {
        color: var(--color-table-in-text);
      }
    }

    tr:hover {
      background: var(--color-background-td-hover);
      cursor: text;
    }

    /* tr:nth-child(1) {
      background: var(--color-background);
    } */

    td {
      padding: 15px 32px;
      border: 0;
      font-size: 16px;
      font-weight: normal;
      border-bottom: 1px solid var(--color-text-in-primary);

      &.title {
        color: var(--color-table-in-title);
      }

      &.income {
        color: var(--color-card-income);
      }

      &.outcome {
        color: var(--color-card-outcome);
      }
    }

    td:first-child {
      /* border-radius: 8px 0 0 8px; */
      cursor: pointer;
    }

    td:last-child {
      /* border-radius: 0 8px 8px 0; */
      cursor: pointer;
    }

    tr:first-child td:first-child {
      border-top-left-radius: 4px;
    }

    tr:first-child td:last-child {
      border-top-right-radius: 4px;
    }

    tr:last-child td:first-child {
      border-bottom-left-radius: 4px;
    }

    tr:last-child td:last-child {
      border-bottom-right-radius: 4px;
    }
  }

  .trhead {
    display: none;
  }

  .trhead:hover {
    background: var(--color-background);
    cursor: text;
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
      border: 0px solid var(--color-input-background);
      padding: 16px;
      width: 100%;
      color: var(--color-input-text);
      /* height: 45px; */

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
      font-weight: 00;
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

  .confirmToDelete {
    background: transparent;
    color: #111;
    margin-left: 10px;
  }
`;
