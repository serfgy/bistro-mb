import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import constants from '../constants/constants';
import { AntDesign } from 'react-web-vector-icons';

class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toMenu: false,
    };
  }

  componentDidMount() {
    const { match } = this.props;
    fetch('https://dev.epbmobile.app:8090/fnb-ws/api/openorders/' + match.params.openorderRecKey)
      .then(response => response.json())
      .then(response => {
        this.setState({
          openorderInfo: response,
        })
      });
  }

  doDeleteOpenorderItem(item) {
    const { match } = this.props;
    let url = 'https://dev.epbmobile.app:8090/fnb-ws/api/delete-openorder-item/';
    const body = {
      openorderRecKey: match.params.openorderRecKey,
      openorderItemRecKey: item.recKey,
    };
    console.log('post delete-openorder-item body', body);
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
        if (response.message) {
          this.props.handleUpdateFromOrder(response.message)
          return;
        }
        this.setState({
          openorderInfo: response,
        })
      })
      .catch(error => {
        console.log(error);
      });
  }

  doSubmitOpenorder() {
    const { match } = this.props;
    const { openorderInfo } = this.state;
    // to do 
    if (!openorderInfo.openorderItems.find(el => el.confirmFlg === 'N')) {
      return;
    }
    let url = 'https://dev.epbmobile.app:8090/fnb-ws/api/submit-openorder';
    const body = {
      openorderRecKey: match.params.openorderRecKey,
    };
    console.log('post submit-openorder body', body);
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
        if (response.message) {
          this.props.handleUpdateFromOrder(response.message)
          return;
        }
        this.setState({
          openorderInfo: response,
        })
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const { match } = this.props;
    const { openorderInfo, toMenu } = this.state;
    console.log('order', openorderInfo);

    if (toMenu === true) {
      return <Redirect to={{
        pathname: '/menu/' + match.params.openorderRecKey,
        // state: {
        //   openorderInfo: openorderInfo
        // }
      }} />
    }

    return (
      <div style={styles.container}>
        <div style={styles.backButton} onClick={() => this.setState({ toMenu: true })}>
          <div style={styles.backButtonText}>BACK</div>
        </div>
        <div style={styles.backButton} onClick={() => this.setState({ toMenu: true })}>
          <div style={styles.backButtonText}>BACK</div>
        </div>
        <div style={styles.headerContainer}>
          <div style={styles.headerColumn}>
            <div style={styles.header}>
              <div style={styles.headerFirst}>GUEST</div>
              <div style={styles.headerSecond}>{openorderInfo && openorderInfo.openorder.vipName || 'Guest'}</div>
            </div>
            <div style={styles.header}>
              <div style={styles.headerFirst}>ORDER</div>
              <div style={styles.headerSecond}>#{openorderInfo && openorderInfo.openorder.recKey}</div>
            </div>
          </div>
          <div style={styles.headerColumn}>
            <div style={styles.header}>
              <div style={styles.headerFirst}>TABLE</div>
              <div style={styles.headerSecond}>{openorderInfo && openorderInfo.openorder.tableId}</div>
            </div>
            <div style={styles.header}>
              <div style={styles.headerFirst}>TOTAL</div>
              <div style={styles.headerSecond}>${openorderInfo && openorderInfo.openorder.grandTotal.toFixed(2)}</div>
            </div>
          </div>
        </div>
        <div style={styles.subtitle}>订单</div>
        <div style={styles.title}>Your Order</div>
        <div style={styles.subsubtitle}>You have <span style={{ fontSize: 20, color: constants.paid }}>{openorderInfo && openorderInfo.openorderItems.filter(el => el.confirmFlg === 'N').length}</span> unsubmitted item(s) in your order.</div>
        <div style={styles.ordersContainer}>
          <div style={{ display: 'flex', flexDirection: 'row', margin: '0px 20px 0px 10px' }}>
            <div style={{ width: 40, height: '100%' }}></div>
            <div style={{ width: 60, textAlign: 'center', letterSpacing: 2, color: constants.grey1, fontFamily: 'nunito-semibold', fontSize: 12, }}>
              QTY
            </div>
            <div style={{ flex: 1, letterSpacing: 2, color: constants.grey1, fontFamily: 'nunito-semibold', fontSize: 12, }}>ITEM</div>
            <div style={{ width: 100, textAlign: 'right', letterSpacing: 2, color: constants.grey1, fontFamily: 'nunito-semibold', fontSize: 12 }}>TOTAL</div>
          </div>
          {
            openorderInfo && openorderInfo.openorderItems && openorderInfo.openorderItems.map(item => (
              <div style={styles.order}
                key={item.recKey}>
                {
                  item.confirmFlg === 'N' ?
                    <div style={styles.iconContainer} onClick={() => this.doDeleteOpenorderItem(item)}>
                      <AntDesign name='minuscircleo' size={16} color={constants.paid} />
                    </div>
                    :
                    <div style={styles.iconContainer}>
                      <AntDesign name='check' size={16} color={constants.grey5} />
                    </div>
                }
                <div style={styles.detailContainer}>
                  <div style={styles.detailContainerFirst}>{item.orderQty}</div>
                  <div style={styles.detailContainerSecond}>{item.menuName}</div>
                  <div style={styles.detailContainerThird}>${item.lineTotal.toFixed(2)}</div>
                </div>
              </div>
            ))
          }
        </div>
        {
          openorderInfo &&
          <div style={styles.button} className={openorderInfo.openorderItems.find(el => el.confirmFlg === 'N') ? 'bg-paid' : 'bg-grey'}
            onClick={() => this.doSubmitOpenorder()}>
            SUBMIT
          </div>
        }
      </div>
    );
  }
}

const styles = ({
  container: {
    height: '100%',
    overflow: 'scroll',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    color: 'white',
    marginTop: 10,
    height: 50,
    width: 80,
    backgroundColor: constants.paid,
    fontSize: 10,
    color: 'white',
    letterSpacing: 2,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    margin: '0px 0px 0px 20px',
  },
  headerContainer: {
    // backgroundColor: 'orange',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  headerColumn: {
    // backgroundColor: 'red',
  },
  header: {
    marginTop: 10,
    height: 50,
    width: 120,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
    // backgroundColor: constants.grey1
  },
  headerFirst: {
    fontSize: 10,
    // color: 'white',
    letterSpacing: 2,
    marginRight: 20,
  },
  headerSecond: {
    fontSize: 16,
    // color: 'white',
    marginRight: 20,
  },
  title: {
    margin: '0px 0px 0px 20px',
    fontFamily: 'nunitosans-semibold',
    fontSize: 36,
  },
  subtitle: {
    margin: '20px 0px 0px 20px',
    fontFamily: 'nunitosans-regular',
    letterSpacing: 2,
    fontSize: 16,
  },
  subsubtitle: {
    margin: '0px 0px 0px 20px',
    fontFamily: 'nunito-regular',
    fontSize: 16,
  },
  ordersContainer: {
    // backgroundColor: 'red',
    margin: '40px 0px 40px 0px',
  },
  order: {
    margin: '10px 20px 10px 10px',
    // backgroundColor: 'blue',
    display: 'flex',
  },
  iconContainer: {
    width: 40,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'orange'
  },
  detailContainer: {
    // backgroundColor: 'orange',
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  detailContainerFirst: {
    width: 60,
    textAlign: 'center',
    fontFamily: 'nunito-bold',
    fontSize: 16,
  },
  detailContainerSecond: {
    flex: 1,
    fontFamily: 'nunitosans-light',
    fontSize: 16,
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
    // backgroundColor: constants.paid,
    margin: 20,
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'varela-round',
    letterSpacing: 2,
    color: 'white',
  }
});

export default Order;
