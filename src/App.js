import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import './App.css';
import Register from './components/Register/Register';
import Menu from './components/Menu/Menu';
import Order from './components/Order/Order';


function App() {
  return (
    <Router>
      <Switch>
        <Route path="/menu" component={Menu} />
        <Route path="/order" component={Order} />
        {/* <Route path="/" component={Menu} /> */}
        <Route path='/register/:tableId' component={Register} />
      </Switch>
    </Router>
  );
}

function Home() {
  return <h2>Home</h2>;
}

export default App;
