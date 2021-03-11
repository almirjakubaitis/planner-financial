import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Routes';

import SignIn from '../pages/Signin';
import SignUp from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import AllTransactions from '../pages/AllTransactions';
import Months from '../pages/Months';
import ListByCategory from '../pages/ListByCategory';
import ListByCategoryAndMonth from '../pages/ListByCategoryAndMonth';
import InsertTransaction from '../pages/InsertTransaction';
import EditTransaction from '../pages/EditTransaction';
import DuplicateTransaction from '../pages/DuplicateTransaction';
import Year from '../pages/Year';
import Categories from '../pages/Categories';
import CategoriesEdit from '../pages/CategoriesEdit';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />
    <Route path="/criar-conta" component={SignUp} />
    <Route path="/dashboard" component={Dashboard} isPrivate />
    <Route path="/transactions" component={AllTransactions} isPrivate />
    <Route path="/months" component={Months} isPrivate />
    <Route path="/listcategory" component={ListByCategory} isPrivate />
    <Route path="/listmonth" component={ListByCategoryAndMonth} isPrivate />
    <Route path="/insert" component={InsertTransaction} isPrivate />
    <Route path="/item/:id" component={EditTransaction} isPrivate />
    <Route path="/duplicate/:id" component={DuplicateTransaction} isPrivate />
    <Route path="/year" component={Year} isPrivate />
    <Route path="/categories" component={Categories} isPrivate />
    <Route
      path="/categoriesitem/:id/:title"
      component={CategoriesEdit}
      isPrivate
    />
  </Switch>
);

export default Routes;
