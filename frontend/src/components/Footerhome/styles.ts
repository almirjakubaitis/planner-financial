import styled from 'styled-components';

export const Container = styled.div`
  padding: 0px 0;
  top: -50px;
  position: relative;

  footer {
    width: 1120px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    align-items: center;
    align-content: center;

    justify-content: space-between;
    font-weight: bold;
  }

  nav {
    display: flex;
    align-items: center;
    align-content: center;
  }

  img {
    height: 28px;
    align-items: center;
    align-content: center;
  }

  span {
    margin-left: 0px;
    color: var(--color-card-total);
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
