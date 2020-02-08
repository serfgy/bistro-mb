import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { LOCALE } from './locale';
import './App.css';
import Register from './components/Register/Register';
import Menu from './components/Menu/Menu';
import Order from './components/Order/Order';
import Banner from './components/Banner/Banner';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bannerVisible: false,
      bannerContent: '',
    };
  }

  componentDidMount() { }

  handleUpdateFromRegister = () => {
    this.setState({ bannerVisible: true })
  }

  handleUpdateFromMenu = (item) => {
    this.setState({ bannerVisible: true, bannerContent: item })
  }

  handleUpdateFromOrder = (item) => {
    this.setState({ bannerVisible: true, bannerContent: item })
  }

  handleUpdateFromBanner = () => {
    this.setState({ bannerVisible: false, bannerContent: '', })
  }

  render() {
    const { bannerVisible, bannerContent } = this.state;

    return (
      <div>
        {
          bannerVisible &&
          <Banner
            content={bannerContent}
            handleUpdateFromBanner={this.handleUpdateFromBanner} />
        }
        <Router>
          <Switch>
            <Route path='/register/:tableId'
              render={(routeProps) => (
                <Register {...routeProps} handleUpdateFromRegister={this.handleUpdateFromRegister} />
              )} />
            <Route path='/menu/:openorderRecKey'
              render={(routeProps) => (
                <Menu {...routeProps} handleUpdateFromMenu={this.handleUpdateFromMenu} language={LOCALE()} />
              )} />
            <Route path='/order/:openorderRecKey'
              render={(routeProps) => (
                <Order {...routeProps} handleUpdateFromOrder={this.handleUpdateFromOrder} />
              )} />
          </Switch>
        </Router>
      </div>
    );
  }

}

export default App;
