import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import constants from '../constants/constants';
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

  doDeleteOpenorderItem(item) {
    let url = 'https://dev.epbmobile.app:8090/fnb-ws/api/delete-openorder-item/';
    const body = {
      openorderRecKey: '46161',
      openorderItemRecKey: item.recKey,
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
        console.log('post delete-openorder-item successful', response);
        this.setState({
          openorderInfo: response,
          openorder: response.openorder,
          openorderItems: response.openorderItems,
        })
      })
      .catch(error => {
        console.log(error);
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
    console.log('order', openorderItems);

    return (
      <div style={styles.container}>
        {/* <div style={{ marginTop: 200 }}
          onClick={() => this.doSubmitOpenorder()}>
          submit openorder
        </div> */}
        <div style={styles.subtitle}>订单</div>
        <div style={styles.title}>Your Order</div>
        <div style={styles.ordersContainer}>
          <div style={{ display: 'flex', flexDirection: 'row', margin: '0px 10px 0px 10px' }}>
            <div style={{ width: 50, height: '100%' }}></div>
            <div style={{ width: 60, textAlign: 'center', letterSpacing: 1, color: constants.grey5, fontFamily: 'varela-round' }}>
              QTY
            </div>
            <div style={{ flex: 1, letterSpacing: 1, color: constants.grey5, fontFamily: 'varela-round' }}>ITEM</div>
            <div style={{ width: 100, textAlign: 'right', letterSpacing: 1, color: constants.grey5, fontFamily: 'varela-round' }}>TOTAL</div>
          </div>
          {
            openorderItems && openorderItems.map(item => (
              <div style={styles.order}
                key={item.recKey}
                onClick={() => this.doDeleteOpenorderItem(item)}>
                <div style={styles.imageContainer}>
                  <img style={styles.menuImage} src={'https://dev.epbmobile.app:8090/gateway/epbm/api/image/stock?stkId=' + item.stkId} />
                </div>
                <div style={styles.detailContainer}>
                  <div style={styles.detailContainerFirst}>{item.orderQty}({item.confirmFlg})</div>
                  <div style={styles.detailContainerSecond}>{item.menuName}</div>
                  <div style={styles.detailContainerThird}>${item.lineTotal.toFixed(2)}</div>
                </div>
              </div>
            ))
          }
        </div>
        <div style={styles.button}
          onClick={() => this.doSubmitOpenorder()}>
          SUBMIT
        </div>
      </div>
    );
  }
}

const styles = ({
  container: {
    height: '100%',
    overflow: 'scroll',
    // position: 'relative',
  },
  title: {
    margin: '0px 0px 40px 20px',
    fontFamily: 'nunitosans-semibold',
    fontSize: 36,
  },
  subtitle: {
    margin: '40px 0px 0px 20px',
    fontFamily: 'nunitosans-regular',
    letterSpacing: 2,
    fontSize: 16,
  },
  ordersContainer: {
    // backgroundColor: 'red',
  },
  order: {
    margin: '10px 10px 10px 10px',
    // backgroundColor: 'blue',
    display: 'flex',
  },
  menuImage: {
    height: '100%',
    minWidth: '100%',
    position: 'absolute',
    zIndex: -1,
    top: '-9999px',
    bottom: '-9999px',
    left: '-9999px',
    right: '-9999px',
    margin: 'auto',
  },
  imageContainer: {
    width: 40,
    height: 40,
    position: 'relative',
    zIndex: 1,
    overflow: 'hidden',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailContainer: {
    marginLeft: 10,
    // backgroundColor: 'orange',
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  detailContainerFirst: {
    width: 60,
    textAlign: 'center',
  },
  detailContainerSecond: {
    flex: 1,
    fontFamily: 'nunitosans-light',
    fontSize: 18,
    // backgroundColor: 'purple',
  },
  detailContainerThird: {
    width: 100,
    fontFamily: 'nunito-bold',
    fontSize: 16,
    textAlign: 'right',
    // backgroundColor: 'red'
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

export default Order;
