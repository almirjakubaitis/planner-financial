import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`

:root {
  --color-background: #d9ddfd;
  --color-dashboard-background: #702AA7;
  --color-primary: #8257E5;
  --color-primary-dark: #7736AB;
  --color-primary-darker: #6842C2;
  --color-card-primary: #FFFFFF;
  --color-card-income: #2A9FA7;
  --color-card-outcome: #E83F5B;
  --color-card-total: #FF872C;
  --color-card-add: #702AA7;
  --color-title-in-primary: #FFFFFF;
  --color-title-in-card: #333333;
  --color-text-in-primary: #D4C2FF;
  --color-text-in-secundary: #BA87E1;
  --color-text-in-hover: #B0D9CD;
  --color-nav-user: #FFC090;
  --color-nav-user-two: #ffe1cc;
  --color-nav-menu: #FFFFFF;
  --color-input-background: #fff;
  --color-input-background-income: #E8F6EE;
  --color-input-background-outcome: #FDECEF;
  --color-input-text: #333333;
  --color-input-border: #ddd;
  --color-input-placeholder: #969CB2;
  --color-button-principal: #CEA9EA;
  --color-button-secundary: #BA87E1;
  --color-button-terciary: #2A9FA7;
  --color-button-quaternary: #471878;
  --color-button-text: #FFFFFF;
  --color-table-in-title: #434B58;
  --color-table-in-text: #5B6279;




  font-size: 100%;

  @media only screen and (max-width: 800px) {
    font-size: 120%;
  }
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  outline: 0;
}

body {
  background: var(--color-dashboard-background);
  color: var(--color-text-in-primary);
  -webkit-font-smoothing: antialiased;
}

body , input, button {
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
}

h1, h2, h3, h4, h5, h6, strong {
  font-weight: 700;


}



button {
    cursor: pointer;

  }


`;
