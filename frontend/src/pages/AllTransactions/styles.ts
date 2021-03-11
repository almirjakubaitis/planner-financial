import styled, { css } from 'styled-components';

const cardTypeVariations = {
  income: css`
    color: var(--color-card-income);

    @media only screen and (max-width: 1000px) {
      color: var(--color-card-primary);
      background: var(--color-card-income);
    }
  `,
  outcome: css`
    color: var(--color-card-outcome);

    @media only screen and (max-width: 1000px) {
      color: var(--color-card-primary);
      background: var(--color-card-outcome);
    }
  `,
  total: css`
    color: var(--color-card-total);

    @media only screen and (max-width: 1000px) {
      color: var(--color-card-primary);
      background: var(--color-card-total);
    }
  `,
  padrao: css`
    color: var(--color-text-in-primary);
  `,
};

interface CardProps {
  type?: 'income' | 'outcome' | 'total';
}

export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0px 0px;
  align-content: center;
  justify-content: center;
  position: relative;

  @media only screen and (max-width: 1000px) {
    max-width: 100%;
    flex-direction: row;
    flex-wrap: wrap;

    .mobileNone {
      display: none;
    }
  }
`;

export const Title = styled.h1`
  font-size: 48px;
  color: var(--color-title-in-card);
`;

export const CardContainer = styled.div`
  margin: 0 auto;

  text-align: left;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-self: center;
  position: relative;

  & div {
    margin: 10px;
  }

  & div:first-child {
    margin-left: 0;
  }

  & div:last-child {
    margin-right: 0;
  }
`;

export const Card = styled.div<CardProps>`
  background: var(--color-card-primary);
  border: solid 3px;
  flex: 1;

  margin-bottom: 10px;
  height: 130px;

  padding: 10px 20px;
  border-radius: 8px;

  @media only screen and (max-width: 1000px) {
    padding: 10px 10px;
    border-radius: 5px;

    margin: 0.5rem 0.2rem;
    border: solid 2px;
    height: 100px;
  }

  ${props => cardTypeVariations[props.type || 'padrao']}

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    p {
      font-size: 16px;
    }
  }

  h1 {
    margin-top: 0;
    font-size: 30px;
    font-weight: bolder;
    line-height: 54px;
  }

  @media only screen and (max-width: 1000px) {
    h1 {
      margin-top: 0px;
      font-size: 22px;
      font-weight: bolder;
      line-height: 25px;
    }
  }
`;

export const Main = styled.div`
  @media only screen and (max-width: 1000px) {
    flex-direction: row;
    flex-wrap: wrap;

    .mobileNone {
      display: none;
    }
  }

  width: 100%;
  min-height: 500px;
  border-radius: 4px;

  position: relative;

  padding: 30px 0;

  span {
    display: flex;

    justify-content: space-between;
    align-items: center;
    flex-direction: row;

    width: 100%;
    text-align: center;
    font-size: 28px;
    font-weight: 700;
    color: var(--color-button-text);

    padding: 0px 40px 20px;

    position: relative;
    clear: both;

    > p {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    > div {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    & > a {
      font-size: 18px;
      color: var(--color-button-text);

      text-decoration: none;

      & a:hover,
      a:link a:visited {
        text-decoration: none;
        color: var(--color-button-text);
      }
    }
  }

  > section {
    display: block;
    float: left;
    width: 100%;
    text-align: center;
    font-size: 28px;
    font-weight: 700;
    color: var(--color-button-text);
    padding: 10px 62px 10px;
    background: var(--color-text-in-primary);
    position: relative;
    clear: both;

    border-top-left-radius: 4px;
    border-top-right-radius: 4px;

    & div.months {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 0;

      text-align: center;
      align-content: center;
      justify-content: space-between;
      font-size: 20px;

      a {
        display: flex;
        width: 100%;

        text-decoration: none;
        transition: color 0.2s;
      }

      a:hover {
        opacity: 0.7;
      }

      a:visited,
      a:link {
        color: var(--color-primary-darker);
      }

      a.selected:hover,
      a.selected:visited,
      a.selected:link {
        color: var(--color-white);
      }
    }
  }

  @media only screen and (max-width: 800px) {
    background: var(--color-text-in-primary);
    max-width: 100vw;
    width: auto;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    min-height: auto;
    margin: 0 auto;
  }
`;

export const Transactions = styled.div`
  width: 100%;

  margin: 0 auto;
  padding: 0;
  align-content: center;
  justify-content: space-between;
  position: relative;
  color: var(--color-table-in-text);

  display: flex;

  table {
    border-spacing: 0 0px;
    width: 100%;

    flex-wrap: wrap;
    table-layout: auto;
    word-wrap: break-word;

    th {
      height: 40px;
      color: var(--color-table-in-title);
      font-weight: normal;
      padding: 20px 32px;
      text-align: left;
      font-size: 16px;
      background: var(--color-white);
      border-bottom: 1px solid var(--color-text-in-primary);

      div {
        display: flex;

        align-items: center;

        & button {
          background: transparent;
          border: none;
        }

        & div {
          margin-left: 10px;
        }
      }
    }

    @media only screen and (max-width: 800px) {
      th {
        display: none;
      }

      tr {
        border-radius: 8px;

        -webkit-box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.6);
        -moz-box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.6);
        box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.6);
      }
    }

    tr {
      background: var(--color-white);

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

      /* -webkit-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.4);
      -moz-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.4);
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.4); */
    }

    /* tr:nth-child(1) {
      background: var(--color-background);
    } */

    td {
      padding: 10px 32px;
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

    @media only screen and (max-width: 800px) {
      td {
        font-weight: normal;
        padding: 25px 8px;

        text-align: left;
        font-size: 16px;
        line-height: 18px;
        white-space: pre-line;
      }
    }

    td:first-child {
      cursor: pointer;


      @media only screen and (max-width: 800px) {
        border-radius: 8px 0 0 8px;
      }
    }

    td:nth-child(2) {
      cursor: pointer;
    }

    td:last-child {
      cursor: pointer;


      @media only screen and (max-width: 800px) {
        border-radius: 0 8px 8px 0;
      }
    }

    > thead > tr > th:first-child {
      border-top-left-radius: 4px;
    }

    > thead > tr > th:last-child {
      border-top-right-radius: 4px;
    }

    tr:first-child > td:last-child {
      border-bottom-right-radius: 4px;
    }

    tr:last-child > td:first-child {
      border-bottom-left-radius: 4px;
    }

    tr:last-child > td:last-child {
      border-bottom-right-radius: 4px;
    }
  }

  @media only screen and (max-width: 800px) {
    table {
      width: 95%;
      margin: 0 auto;

      border-spacing: 0px 8px;

      th {
        border-bottom: 0px solid var(--color-text-in-primary);
      }

      tr:last-child > td:last-child {
        border-bottom-right-radius: 8px;
      }

      tr:last-child > td:first-child {
        border-bottom-left-radius: 8px;
      }
    }
  }

  .trhead {
    background: var(--color-background);
    cursor: text;

    @media only screen and (max-width: 800px) {
      background: var(--color-text-in-primary);
    }
  }

  .trhead:hover {
    background: var(--color-background);
    cursor: text;


    @media only screen and (max-width: 800px) {
      background: var(--color-text-in-primary);
    }
  }
`;
