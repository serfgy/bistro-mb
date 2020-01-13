import React, { Component } from 'react';
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
    console.log('app receive register')
    this.setState({ bannerVisible: true })
  }

  handleUpdateFromMenu = (item) => {
    console.log('app receive menu')
    this.setState({ bannerVisible: true, bannerContent: item })
  }

  handleUpdateFromOrder = (item) => {
    console.log('app receive order')
    this.setState({ bannerVisible: true, bannerContent: item })
  }

  handleUpdateFromBanner = () => {
    console.log('yep app receive order')
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
                <Menu {...routeProps} handleUpdateFromMenu={this.handleUpdateFromMenu} />
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
