import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import constants from '../constants/constants';
import OverlayAddress from './OverlayAddress';
import { AntDesign } from 'react-web-vector-icons';

class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: props.location.state.language,
      toMenu: false,
      overlayAddressVisible: false,
      delivery: true,
    };
  }

  componentDidMount() {
    const { match } = this.props;
    fetch('http://203.208.248.200:9090/fnb-ws-epbsg/api/openorders/' + match.params.openorderRecKey)
      .then(response => response.json())
      .then(response => {
        this.setState({
          openorderInfo: response,
        })
      });
  }

  doDeleteOpenorderItem(item) {
    const { match } = this.props;
    let url = 'http://203.208.248.200:9090/fnb-ws-epbsg/api/delete-openorder-item/';
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

  doPressSubmit() {
    const { match } = this.props;
    const { openorderInfo, delivery } = this.state;
    // no items to submit
    if (!openorderInfo.openorderItems.find(el => el.confirmFlg === 'N')) {
      return;
    }
    // still processing
    if (!openorderInfo.openorder.statusFlg === 'P') {
      return;
    }


    if (delivery && openorderInfo.openorder.homeDelivery === 'Y') {
      this.setState({
        overlayAddressVisible: true,
      })
    } else {
      this.doSubmitOpenorder();
    }
  }

  doSubmitOpenorder(phone, name, postalCode, address) {
    const { match } = this.props;
    const { openorderInfo, delivery } = this.state;
    let url = 'http://203.208.248.200:9090/fnb-ws-epbsg/api/submit-openorder';
    const body = {
      openorderRecKey: match.params.openorderRecKey,
      postalCode: postalCode || '',
      addr1: address || '',
      addr3: name || '',
      addr4: phone || '',
      deliveryFlg: address ? 'Y' : 'N',
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

  doToggleLanguage() {
    const { language } = this.state;
    if (language === 'en') {
      this.setState({
        language: 'zh',
      })
    } else {
      this.setState({
        language: 'en',
      })
    }
  }

  doCalculateTotalItems() {
    const { openorderInfo } = this.state;
    return openorderInfo.openorderItems.filter(el => !el.refRecKey).reduce((a, b) => a + b.orderQty, 0);
  }

  handleUpdateFromOverlayAddress = (phone, name, postalCode, address) => {

    this.setState({ overlayAddressVisible: false })

    if (!phone) {
      return;
    }

    this.doSubmitOpenorder(phone, name, postalCode, address);
  }

  render() {
    const { match, location } = this.props;
    const { language, openorderInfo, toMenu,
      overlayAddressVisible, delivery } = this.state;
    console.log('render order', openorderInfo);

    if (toMenu === true) {
      return <Redirect to={{
        pathname: '/menu/' + match.params.openorderRecKey,
        state: {
          language: language,
          masters: location.state.masters,
        }
      }} />
    }

    return openorderInfo ? (
      <div style={styles.container}>
        {
          overlayAddressVisible &&
          <OverlayAddress
            language={language}
            // selectedMenu={selectedMenu}
            handleUpdateFromOverlayAddress={this.handleUpdateFromOverlayAddress} />
        }
        <div style={styles.headerContainer}>
          <div style={styles.headerAbsolute} onClick={() => this.setState({ toMenu: true })}>
            <AntDesign name='left' size={16} color='white' />
          </div>
          <div style={styles.headerReverse}
            onClick={() => this.doToOrder()}>
            <div style={styles.headerFirstReverse}>{openorderInfo.openorder.vipName || 'GUEST'}</div>
            <div style={styles.headerSecondReverse}>${openorderInfo.openorder.grandTotal.toFixed(2)}</div>
          </div>
          {
            openorderInfo.openorder.tableId &&
            <div style={styles.header} className='bg-dark'>
              <div style={styles.headerFirst}>{language === 'en' ? 'TABLE' : '桌号'}</div>
              <div style={styles.headerSecond}>{openorderInfo.openorder.tableId.split('-')[0]}</div>
            </div>
          }
          <div style={styles.header} className='bg-brand'>
            <div style={styles.headerFirst}>{language === 'en' ? 'ITEMS' : '项目'}</div>
            <div style={styles.headerSecond}>{this.doCalculateTotalItems()}</div>
            <div style={styles.alertCircle} className={`${(openorderInfo.openorderItems.length > 0 && openorderInfo.openorderItems.find(el => el.confirmFlg === 'N' && !el.refRecKey)) ? 'bg-paid' : 'bg-none'}`}></div>
          </div>
        </div>
        <div style={styles.title}>{language === 'en' ? 'Order' : '点单'} #{openorderInfo.openorder.recKey}</div>
        {
          openorderInfo.openorder.statusFlg === 'P' ?
            <div style={styles.subsubtitle}>
              {
                language === 'en' ?
                  <span>Processing</span>
                  :
                  <span>处理中</span>
              }
            </div>
            :
            <div style={styles.subsubtitle}>
              {
                language === 'en' ?
                  <span>You have <span style={{ color: constants.paid }}>{openorderInfo && openorderInfo.openorderItems.filter(el => el.confirmFlg === 'N' && !el.refRecKey).length}</span> unsubmitted item(s) in your order.</span>
                  :
                  <span>你有 <span style={{ color: constants.paid }}>{openorderInfo && openorderInfo.openorderItems.filter(el => el.confirmFlg === 'N' && !el.refRecKey).length}</span> 件未确认项目。</span>
              }
            </div>
        }
        <div style={styles.ordersContainer}>
          <div style={{ display: 'flex', flexDirection: 'row', margin: '0px 20px 0px 10px' }}>
            <div style={{ width: 40, height: '100%' }}></div>
            <div style={{ width: 60, textAlign: 'center', letterSpacing: 2, color: constants.brand, fontFamily: 'nunito-semibold', fontSize: 12, }}>
              {language === 'en' ? 'QTY' : '数量'}
            </div>
            <div style={{ flex: 1, letterSpacing: 2, color: constants.brand, fontFamily: 'nunito-semibold', fontSize: 12, }}>{language === 'en' ? 'ITEM' : '项目'}</div>
            <div style={{ width: 100, textAlign: 'right', letterSpacing: 2, color: constants.brand, fontFamily: 'nunito-semibold', fontSize: 12 }}>{language === 'en' ? 'TOTAL' : '小计'}</div>
          </div>
          {
            openorderInfo && openorderInfo.openorderItems && openorderInfo.openorderItems.map(item => {
              if (item.refRecKey) {
                return (
                  <div style={styles.order}
                    key={item.recKey}>
                    <div style={styles.iconContainer}></div>
                    <div style={styles.detailContainer}>
                      <div style={styles.detailContainerFirst}></div>
                      <div style={styles.detailContainerSecond}>- {language === 'en' ? item.menuName : item.menuNameLang}</div>
                      <div style={styles.detailContainerThird}>${item.lineTotal.toFixed(2)}</div>
                    </div>
                  </div>
                )
              }
              return (
                <div style={styles.order}
                  key={item.recKey}>
                  {
                    openorderInfo.openorder.statusFlg === 'P' ?
                      <div style={styles.iconContainer}>
                        <AntDesign name='clockcircleo' size={16} color={constants.grey5} />
                      </div>
                      : item.confirmFlg === 'N' ?
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
                    <div style={styles.detailContainerSecond}>{language === 'en' ? item.menuName : item.menuNameLang}</div>
                    <div style={styles.detailContainerThird}>${item.lineTotal.toFixed(2)}</div>
                  </div>
                </div>
              )
            })
          }
        </div>
        <div style={styles.summaryRow}>
          <div style={styles.summaryTitle}>{language === 'en' ? 'Subtotal' : '小计'}</div>
          <div style={styles.detailContainerThird}>${openorderInfo.openorder.beforeDisc.toFixed(2)}</div>
        </div>
        <div style={styles.summaryRow}>
          <div style={styles.summaryTitle}>{language === 'en' ? 'Service' : '服务费'}</div>
          <div style={styles.detailContainerThird}>${openorderInfo.openorder.serviceCharge.toFixed(2)}</div>
        </div>
        <div style={styles.summaryRow}>
          <div style={styles.summaryTitle}>{language === 'en' ? 'GST' : '消费税'}</div>
          <div style={styles.detailContainerThird}>${openorderInfo.openorder.totalTax.toFixed(2)}</div>
        </div>
        <div style={styles.summaryRow}>
          <div style={styles.summaryTitle}>{language === 'en' ? 'Grand Total' : '总计'}</div>
          <div style={styles.detailContainerThird}>${openorderInfo.openorder.grandTotal.toFixed(2)}</div>
        </div>
        {
          openorderInfo.openorder.homeDelivery === 'Y' &&
          <div style={styles.groupContainer}>
            <div style={styles.groupItems}>
              <div style={styles.groupItem} onClick={() => this.setState({ delivery: !delivery })}>
                <div style={styles.groupItemLeft} className={`${delivery ? 'bg-brand' : 'bg-none'}`}>

                </div>
                <div style={styles.groupItemRight}>
                  {language === 'en' ? 'Require delivery service' : '需要外送服务'}
                </div>
              </div>
            </div>
          </div>
        }

        {
          openorderInfo &&
          <div style={styles.button} className={(openorderInfo.openorderItems.find(el => el.confirmFlg === 'N') && openorderInfo.openorder.statusFlg !== 'P') ? 'bg-brand' : 'bg-grey'}
            onClick={() => this.doPressSubmit()}>
            {language === 'en' ? 'CONFIRM ORDER' : '确认点单'}
          </div>
        }
      </div>
    ) : null;
  }
}

const styles = ({
  container: {
    height: '100%',
    overflow: 'scroll',
    position: 'relative',
  },
  alertCircle: {
    position: 'absolute',
    top: -4,
    right: -4,
    height: 10,
    width: 10,
    borderRadius: 5,
  },
  headerContainer: {
    display: 'flex',
    margin: '10px 10px 0px 10px',
    height: 80,
    justifyContent: 'flex-end',
  },
  header: {
    marginLeft: 10,
    width: 50,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  headerAbsolute: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 50,
    height: 80,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: constants.brand,
  },
  headerAbsolute2: {
    position: 'absolute',
    top: 10,
    left: 70,
    width: 50,
    height: 80,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerFirst: {
    fontSize: 10,
    color: 'white',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  headerSecond: {
    fontSize: 16,
    color: 'white',
  },
  headerReverse: {
    marginLeft: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  headerFirstReverse: {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  headerSecondReverse: {
    fontSize: 16,
  },
  title: {
    margin: '40px 0px 0px 20px',
    fontFamily: 'nunitosans-semibold',
    fontSize: 36,
  },
  // subtitle: {
  //   margin: '40px 0px 0px 20px',
  //   fontFamily: 'nunito-regular',
  //   fontSize: 16,
  // },
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
  summaryRow: {
    // backgroundColor: 'red',
    display: 'flex',
    flexDirection: 'row',
    margin: '0px 20px 10px 0px',
    justifyContent: 'flex-end',
  },
  summaryTitle: {
    fontFamily: 'nunito-bold',
    fontSize: 16,
    color: constants.brand
  },
  button: {
    // backgroundColor: constants.paid,
    margin: '40px 10px 20px 10px',
    height: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'varela-round',
    letterSpacing: 2,
    color: 'white',
  },
  groupContainer: {
    margin: '20px 0px 20px 0px',
    // backgroundColor: 'pink',
    // height: 400,
  },
  groupTitle: {
    margin: '20px 0px 0px 20px',
    fontFamily: 'nunitosans-light',
    fontSize: 18,
    color: constants.brand,
  },
  groupItems: {
    // backgroundColor: 'orange',
    margin: '0px 20px 0px 20px',
  },
  groupItem: {
    display: 'flex',
    flexDirection: 'row',
    // backgroundColor: 'purple',
    margin: '10px 0px 10px 0px',
    alignItems: 'center',
  },
  groupItemLeft: {
    height: 16,
    width: 16,
    marginLeft: 10,
    marginRight: 10,
    border: `1px solid ${constants.brand}`,
  },
  groupItemLeftNonFixed: {
    height: 16,
    width: 16,
    marginLeft: 40,
    marginRight: 10,
    border: `1px solid ${constants.brand}`,
  },
  groupItemLeftFixed: {
    backgroundColor: constants.brand,
    height: 16,
    width: 16,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 16,
    border: `1px solid ${constants.brand}`,
  },
  groupItemRight: {
    fontFamily: 'nunito-regular',
    fontWeight: 'normal',
  },
});

export default Order;
