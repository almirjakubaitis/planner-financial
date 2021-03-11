import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

// import SignIn from './pages/Signin';
import GlobalStyle from './styles/global';

import AppProvider from './hooks';

import Routes from './routes';

const App: React.FC = () => (
  <>
    {/* <SignIn /> */}

    <Router basename="/planner">
      {/* <Router> */}
      <AppProvider>
        <Routes />
      </AppProvider>
      <GlobalStyle />
    </Router>
  </>
);

export default App;
