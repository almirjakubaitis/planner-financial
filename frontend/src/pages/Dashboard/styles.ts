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
  /* max-width: 1120px; */
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
  }
`;

export const Card = styled.div<CardProps>`
  background: var(--color-card-primary);
  border: solid 3px;
  flex: 1;

  height: 130px;

  padding: 10px 20px;
  margin: 0 10px;
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
  /* background: var(--color-nav-user); */
  width: 100%;
  min-height: 500px;

  position: relative;

  padding: 0;

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
  margin: 0 auto 30px;
  display: flex;
  flex-direction: column;

  padding: 0px 0px;
  align-content: center;
  justify-content: space-between;
  position: relative;
  color: var(--color-table-in-text);

  @media only screen and (max-width: 800px) {
    width: 100vw;
    max-width: 100vw;
    padding: 0;
  }

  > div {
    border-spacing: 0 8px;
    width: 100%;

    display: flex;
    flex-direction: column;
  }

  section {
    margin: 0 10px;

    section.total {
      width: 100%;
      margin: 0 auto;

      margin-top: 20px;
      line-height: 35px;

      background: var(--color-card-total);

      color: var(--color-white);

      opacity: 1;
      cursor: text;
      border-radius: 4px;

      text-align: center;

      flex-direction: column;

      > header {
        margin: 0;

        background: var(--color-white);
      }

      @media only screen and (max-width: 1000px) {
        background: transparent !important;

        div {
          display: grid;
          margin: 0;
          gap: 6px;
          grid-template-columns: repeat(2, 1fr);
          flex-direction: row;
          flex-wrap: nowrap;

          /* display: flex; */
          text-align: center;
          align-content: center;
          justify-content: space-between;

          background: var(--white) !important;
        }

        button {
          min-width: 90%;
          padding: 10px;
          height: 85px;

          display: inline-block;
          text-align: left;

          background: var(--color-white) !important;
          border-radius: 4px;

          > span {
            display: block;
          }
        }
      }
    }

    > p {
      background: var(--color-card-total);
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }

    > span {
      margin: 0;
      background: var(--color-white);
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }

    div {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 1px;
      background: var(--color-white);
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;

      text-align: center;
      align-content: center;
      justify-content: space-between;

      button {
        height: 45px;
        margin: 0;
        border: none;
        background: var(--color-white);
        font-size: 15px;

        text-align: center;
        align-items: center;
        color: var(--color-table-in-text);
        border-radius: 4px;
      }

      button:hover {
        color: var(--color-table-in-text);
      }

      .title {
        color: var(--color-table-in-title);
      }

      .income {
        color: var(--color-card-income);
      }

      .outcome {
        color: var(--color-card-outcome);
      }
    }

    section.entradas {
      width: 100%;
      margin: 0 auto;
      display: flex;
      flex-direction: column;

      margin-top: 20px;
      line-height: 35px;

      background: var(--color-card-income);
      color: var(--color-title-in-primary);

      opacity: 1;
      cursor: text;
      border-radius: 4px;

      text-align: center;

      > p {
        background: var(--color-card-income);
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
      }

      > span {
        margin: 0;
        background: var(--color-white);
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
      }

      > div {
        margin: 0;
        background: var(--color-white);
        padding-bottom: 10px;
      }

      button {
        height: 45px;
        margin: 0 5px;
        border: none;
        background: transparent;
        font-size: 15px;

        text-align: center;
        align-items: center;
        color: var(--color-table-in-text);
      }

      button:hover {
        color: var(--color-table-in-text);
      }

      .title {
        color: var(--color-table-in-title);
      }

      .income {
        color: var(--color-card-income);
      }

      .outcome {
        color: var(--color-card-outcome);
      }
    }

    section.saidas {
      width: 100%;
      margin: 0 auto;
      display: flex;
      flex-direction: column;

      margin-top: -10px;

      line-height: 35px;

      opacity: 1;
      cursor: text;

      background: var(--color-card-outcome);
      color: var(--color-title-in-primary);

      border-top-left-radius: 4px;
      border-top-right-radius: 4px;

      text-align: center;

      > p {
        background: var(--color-card-outcome);
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
      }

      > span {
        margin: 0;
        background: var(--color-white);
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
      }

      > div {
        margin: 0;

        background: var(--color-white);
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
      }

      button {
        height: 45px;
        margin: 0 5px;
        border: none;
        background: transparent;
        font-size: 15px;

        text-align: center;
        align-items: center;
        color: var(--color-table-in-text);
      }

      button:hover {
        color: var(--color-table-in-text);
      }

      .title {
        color: var(--color-table-in-title);
      }

      .income {
        color: var(--color-card-income);
      }

      .outcome {
        color: var(--color-card-outcome);
      }
    }

    section.containerChart {
      width: 100%;
      margin: 0 auto;
      display: flex;
      flex-direction: column;

      margin-top: 20px;
      line-height: 35px;

      background: var(--color-white);
      color: var(--color-title-in-primary);

      opacity: 1;
      cursor: text;
      border-radius: 4px;

      text-align: center;

      div {
        display: flex;
        flex-direction: column;
        background: var(--color-button-secundary);
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
      }

      & span {
        margin: 0 auto;

        background: var(--color-white);
        border-radius: 4px;
      }
    }

    .chart {
      width: 100%;
      margin: 0 auto;
      background: var(--color-white);
      padding: 20px 30px;
      border-radius: 4px;

      flex: 1;
    }

    /* .chart > canvas {
      height: 300px !important;
    } */
  }

  .months {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 1px !important;

    color: #333 !important;

    text-align: center;
    align-content: center;
    justify-content: space-between;
  }
`;
