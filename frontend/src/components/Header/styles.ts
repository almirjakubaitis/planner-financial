import styled from 'styled-components';

export const Container = styled.div`
  padding: 30px 0;

  header {
    width: 100vw;
    max-width: 1150px;

    margin: 0 auto;

    padding: 0;
    display: flex;
    align-items: center;
    align-content: center;

    justify-content: space-between;
    font-weight: normal;

    & p {
      display: block;

      & span {
        margin-left: 61px;
      }
    }
  }

  @media only screen and (max-width: 1150px) {
    header {
      width: 90vw;
      max-width: 95vw;
      flex-direction: column;
    }
  }

  nav {
    display: flex;
    align-items: center;
    align-content: center;

    & svg {
      margin-right: 6px;
    }

    button {
      background: transparent;
      border: 0;
      color: var(--color-nav-menu);
      align-items: center;
      align-content: center;
      justify-content: center;
      margin-left: 22px;
      padding: 0 10px;
      height: 32px;
      border-radius: 8px;
      font-weight: bold;

      @media only screen and (max-width: 1000px) {
        margin-top: 20px;
        height: 42px;
        width: 42px;
        padding: 0 10px;

        & img {
          width: 25px;
          height: 25px;
        }
      }

      &:hover {
        background: var(--color-button-quaternary);
      }

      & img {
        margin-right: 6px;
      }

      & p {
        float: right;
      }
    }
  }

  @media only screen and (max-width: 1100px) {
    .mobileNone {
      display: none;
    }
  }

  @media only screen and (max-width: 1000px) {
    .mobileNone {
      display: none;
    }

    .mobileMoreHeight {
      height: 28px;
      width: 28px;
      margin-top: 20px;
    }

    /* nav {
      display: none;
    } */
  }

  img {
    align-items: center;
    align-content: center;
  }

  span {
    color: var(--color-nav-menu);
  }

  a {
    text-decoration: none;

    font-size: 16px;
    transition: opacity 0.3s;
    color: var(--color-nav-menu);
    display: flex;
    align-items: center;
    align-content: center;
    font-weight: bold;

    & img {
      margin-right: 6px;
    }

    & + a {
      margin-left: 32px;
    }

    &:hover {
      color: var(--color-nav-menu);
      opacity: 0.5;
      position: relative;

      /* &::before {
        display: inline-block;
        content: '';
        width: 100%;
        margin: 0;
        opacity: 1;

        position: absolute;
        border: solid 1px var(--color-card-total);
        top: 30px;
      } */
    }
  }
`;
