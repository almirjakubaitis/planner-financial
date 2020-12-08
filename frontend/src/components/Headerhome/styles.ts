import styled from 'styled-components';

export const Container = styled.div`
  padding: 30px 0;

  header {
    width: 100vw;
    max-width: 1200px;

    margin: 0 auto;

    padding: 0;
    display: flex;
    align-items: center;
    align-content: center;

    justify-content: space-between;
    font-weight: normal;
  }

  nav {
    display: flex;
    align-items: center;
    align-content: center;

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

      &:hover {
        background: var(--color-button-quaternary);
      }

      & img {
        margin-right: 10px;
      }
    }
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
