import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
// import Icon, { AntDesign, Feather } from 'react-web-vector-icons';

class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    fetch('https://dev.epbmobile.app:8090/fnb-ws/api/openorders/46161')
      .then(response => response.json())
      .then(response => {
        this.setState({
          openorderInfo: response,
          openorder: response.openorder,
          openorderItems: response.openorderItems,
        })
      });
  }

  doSubmitOpenorder() {
    console.log('submit')
    const { openorder, openorderItems } = this.state;
    if (!openorder) {
      return;
    }
    let url = 'https://dev.epbmobile.app:8090/fnb-ws/api/submit-openorder';
    const body = {
      openorderRecKey: '46161',
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
        console.log('post submit-openorder successful', response);
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const { openorderInfo, openorder, openorderItems } = this.state;
    console.log('order', openorderInfo, openorder, openorderItems);
    const imageArray = [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqNdtXK-n6cTgV4yGng1ZwVWPXnjdFesMNxflpYCg-sq5ZTUVA&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxr371J0hm5MzBU-_bFxnhy2PkOZ7p9wtHyQwHoMpvE6Wqc6m5-w&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD-rah58B_evIlY83P2-c-mtXyceUbUu-GHvSuVxHI9xKMh5tbtw&s',
      ''
    ];

    return (
      <div style={styles.container}>
        <div style={{ marginTop: 200 }}
          onClick={() => this.doSubmitOpenorder()}>
          submit openorder
        </div>
      </div>
    );
  }
}

const styles = ({
  container: {
    height: window.innerHeight,
    width: '100%',
    display: 'flex',
    // backgroundColor: 'red',
  },
});

export default Order;
