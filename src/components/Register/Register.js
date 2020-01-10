import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import constants from '../constants/constants';
// import Icon, { AntDesign, Feather } from 'react-web-vector-icons';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toMenu: false,
      tableId: props.match.params.tableId,
    };
  }

  componentDidMount() {

  }

  doCreateOpenorder() {
    let url = 'https://dev.epbmobile.app:8090/fnb-ws/api/create-openorder';
    const body = {
      shopId: 'X0201',
      tableId: 'A01',
      pax: 3,
      phone: '11111111',
    };
    fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(body),
    })
      .then(response => response.json())
      .then(response => {
        console.log('post create-openorder successful', response);
        if (response.message) {
          return;
        }
        this.setState({
          openorderInfo: response,
          toMenu: true,
        })
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const { tableId, toMenu, openorderInfo, } = this.state;
    console.log('here register');

    if (toMenu === true) {
      return <Redirect to={{
        pathname: '/menu',
        state: {
          openorderInfo: openorderInfo
        }
      }} />
    }

    return (
      <div style={styles.container}>
        <div style={styles.button}
          onClick={() => this.doCreateOpenorder()}>
          SUBMIT FOR {tableId}
        </div>
      </div>
    );
  }
}

const styles = ({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
  },
  button: {
    backgroundColor: constants.reserved,
    margin: 20,
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default Register;
