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
  max-width: 1120px;
  text-align: left;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-self: center;
  position: relative;

  @media only screen and (max-width: 1000px) {
    max-width: 97vw;
    flex-direction: row;
    flex-wrap: wrap;

    .mobileNone {
      display: none;
    }
  }
`;

export const Card = styled.div<CardProps>`
  background: var(--color-card-primary);
  border: solid 3px;
  flex: 1;
  margin-right: 2rem;
  height: 130px;

  padding: 10px 20px;
  border-radius: 15px;

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

export const Add = styled.div`
  width: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 130px;

  padding: 0;
  border-radius: 15px;

  @media only screen and (max-width: 1000px) {
    display: none;
  }

  button {
    width: 100%;
    height: 100%;
    background: var(--color-button-terciary);
    border: none;
    color: #ffffff;

    border-radius: 15px;

    transition: background-color 0.2s;

    &:hover {
      background: var(--color-text-in-secundary);
    }

    p {
      font-size: 18px;
      font-weight: normal;
      line-height: 54px;
      text-align: center;
      color: '#fff';
    }
  }
`;

export const Main = styled.div`
  background: var(--color-nav-user);
  width: 100%;
  min-height: 500px;

  position: relative;
  top: -60px;
  padding: 80px 0;

  @media only screen and (max-width: 800px) {
    background: var(--color-dashboard-background);
    max-width: 100vw;
    width: auto;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    min-height: auto;
    margin: 0 auto;
  }

  @media only screen and (min-width: 1000px) {
    .DesktopNone {
      display: none;
    }
  }
`;

export const Transactions = styled.div`
  width: 100%;
  max-width: 1170px;
  margin: 0 auto;
  padding: 0px 30px;
  align-content: center;
  justify-content: space-between;
  position: relative;
  color: var(--color-table-in-text);

  display: flex;

  @media only screen and (max-width: 800px) {
    width: 100vw;
    max-width: 100vw;
    padding: 0;
  }

  table {
    border-spacing: 0 8px;
    width: 100%;

    @media only screen and (max-width: 800px) {
      flex: 1;

      thead {
        display: none;
      }

      tbody {
        display: table-row;

        background: var(--color-dashboard-background);
      }

      tr {
        display: flex;
        flex-direction: row;

        flex-wrap: wrap !important;
        align-self: space-between;
        justify-content: space-between;
        margin: 0 0;

        background: var(--color-dashboard-background) !important;
        border-radius: 0;

        margin: 0 0.6rem;
      }

      th {
        /* display: none; */
        background: var(--color-dashboard-background);
      }

      td {
        min-width: 49%;

        display: flex;
        flex-direction: column;

        font-weight: normal;
        padding: 25px 25px;

        text-align: left;
        font-size: 18px !important;
        line-height: 25px;

        margin: 5px 0px;

        background: var(--color-card-primary);

        border-radius: 5px;
      }

      td {
        -webkit-box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.6);
        -moz-box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.6);
        box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.6);
      }
    }

    flex-wrap: wrap;

    th {
      color: var(--color-title-in-primary);
      font-weight: normal;
      padding: 20px 0 20px 10px;
      text-align: left;
      font-size: 16px;
      line-height: 24px;
    }

    tr {
      background: var(--color-card-primary);

      a {
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
      background: var(--color-input-background);
      cursor: pointer;

      -webkit-box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.4);
      -moz-box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.4);
      box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.4);

      border-radius: 8px 8px 8px 8px;
    }

    /* tr:nth-child(1) {
      background: var(--color-background);
    } */

    td {
      padding: 20px 0 20px 10px;
      border: 0;
      font-size: 15px;
      font-weight: normal;

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

    td:hover {
      background: var(--color-nav-user-two);
    }

    td:first-child {
      border-radius: 8px 0 0 8px;

      @media only screen and (max-width: 800px) {
        border-radius: 5px;
      }
    }

    /* td:nth-child(0) {
      border-radius: 8px 0 0 8px;
    } */

    td:last-child {
      border-radius: 0 8px 8px 0;

      @media only screen and (max-width: 800px) {
        border-radius: 5px;
      }
    }
  }

  .trhead {
    background: var(--color-nav-user);
    color: var(--color-title-in-primary);
    cursor: text;
  }

  .trhead:hover {
    background: var(--color-nav-user);
    cursor: text;

    -webkit-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0);
    -moz-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0);
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0);
  }

  .trentradas {
    background: var(--color-card-income);
    color: var(--color-title-in-primary);
    opacity: 0.8;
    cursor: text;
    border-radius: 8px 8px 8px 8px !important;

    text-align: center;
  }

  .trentradas:hover {
    background: var(--color-card-income);
    color: var(--color-title-in-primary);
    cursor: text;
  }

  .trsaidas {
    background: var(--color-card-outcome);
    color: var(--color-title-in-primary);
    opacity: 0.8;
    cursor: text;
    border-radius: 8px 8px 8px 8px !important;

    text-align: center;
  }

  .trsaidas:hover {
    background: var(--color-card-outcome);
    color: var(--color-title-in-primary);
    cursor: text;
    border-radius: 8px 8px 8px 8px;
  }

  .adjustcenter {
    padding-right: 10%;
  }
`;
