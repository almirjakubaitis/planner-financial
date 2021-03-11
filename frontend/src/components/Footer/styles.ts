import styled from 'styled-components';

export const Container = styled.div`
  padding: 0px 0;

  position: relative;
  margin: 0px 0px 20px;

  footer {
    width: 1120px;
    margin: 0 auto;
    padding: 0;
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: space-between;
    font-weight: normal;
  }

  @media only screen and (max-width: 1000px) {
    footer {
      font-size: 15px;
      width: 98vw;
      flex-direction: row;
      align-items: left;
      align-content: left;
    }
  }

  nav {
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: center;
    opacity: 0.8;

    button {
      background: transparent;
      border: 0;
      color: var(--color-nav-menu);
      align-items: center;
      align-content: center;
      justify-content: center;
      font-weight: normal;
    }
  }

  img {
    margin-right: 10px;
    align-items: center;
    align-content: center;
  }

  span {
    margin-right: 32px;
  }

  a {
    text-decoration: none;
    margin-left: 32px;
    font-size: 16px;
    transition: opacity 0.3s;
    color: var(--color-nav-menu);
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: center;

    img {
      margin-right: 6px;
    }

    & + a {
    }

    &:hover {
      color: var(--color-nav-menu);
      opacity: 0.5;
      position: relative;

      &::before {
        display: inline-block;
        content: '';
        width: 100%;
        margin: 0;
        opacity: 1;

        position: absolute;
        border: solid 1px var(--color-card-total);
        top: 30px;
      }
    }
  }
`;
