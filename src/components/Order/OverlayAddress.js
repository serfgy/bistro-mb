import React, { Component } from 'react';
import constants from '../constants/constants';
import { AntDesign } from 'react-web-vector-icons';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

class OverlayAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'DIALOG', // 'INPUT'
      modalInputValueQty: 1,
      phone: '',
      name: '',
      postalCode: '',
      address: '',
      verify: false,
    };
  }

  componentDidMount() {
    this.targetElement = document.querySelector('#targetElement');
    disableBodyScroll(this.targetElement);
  }

  componentWillUnmount() {
    enableBodyScroll(this.targetElement);
  }

  doQtyChange(type) {
    if (type === 'PLUS') {
      this.setState((prevState, props) => ({
        modalInputValueQty: Math.floor(Number(prevState.modalInputValueQty) + 1)
      }));
    }
    else if (type === 'MINUS') {
      if (this.state.modalInputValueQty <= 1) return;
      this.setState((prevState, props) => ({
        modalInputValueQty: Math.ceil(Number(prevState.modalInputValueQty) - 1)
      }));
    }
  }

  doPressSubmit() {
    const { selectedMenu } = this.props;
    const { phone, name, postalCode, address } = this.state;

    if (!phone || !address) {
      this.setState({ verify: true });
      return;
    }
    this.props.handleUpdateFromOverlayAddress(phone, name, postalCode, address);
  }

  render() {
    const { language } = this.props;
    const { phone, name, postalCode, address, verify } = this.state;
    // console.log('render overlayaddress', selectedMenu);

    return (
      <div style={styles.overlay} className='disable-double-tap'>
        <div style={styles.overlayContent}>
          <div style={styles.overlayScroll} id='targetElement'>
            <div style={styles.headerContainer}>
              <div style={styles.header} onClick={() => this.props.handleUpdateFromOverlayAddress()}>
                <AntDesign name='left' size={16} color='white' />
              </div>
            </div>

            <div style={styles.remarksContainer}>
              {language === 'en' ? 'Please enter delivery details' : '需要外卖外送，请输入相关信息'}
            </div>
            <div style={styles.groupContainer}>
              <div style={styles.groupTitle}>{language === 'en' ? 'Phone' : '电话'}<span style={{ color: 'red', fontSize: 12 }}>  {language === 'en' ? '*Compulsory' : '*必填'}</span></div>
              <input style={styles.input} type="text" value={phone} onChange={(e) => this.setState({ phone: e.target.value })} />
              <div style={styles.groupTitle}>{language === 'en' ? 'Name' : '名称'}</div>
              <input style={styles.input} type="text" value={name} onChange={(e) => this.setState({ name: e.target.value })} />
              <div style={styles.groupTitle}>{language === 'en' ? 'Postal Code' : '邮编'}</div>
              <input style={styles.input} type="text" value={postalCode} onChange={(e) => this.setState({ postalCode: e.target.value })} />
              <div style={styles.groupTitle}>{language === 'en' ? 'Address' : '地址'}<span style={{ color: 'red', fontSize: 12 }}>  {language === 'en' ? '*Compulsory' : '*必填'}</span></div>
              <input style={styles.input} type="text" value={address} onChange={(e) => this.setState({ address: e.target.value })} />
            </div>

            <div style={{ height: 30 }}></div>
            {
              verify &&
              <div style={styles.verifyContainer}>
                {language === 'en' ? '*Please enter compulsory fields' : '*请输入必填信息'}
              </div>
            }
            <div style={styles.button} className={'bg-brand'}
              onClick={() => this.doPressSubmit()}>
              {language === 'en' ? 'CONFIRM ADDRESS' : '确认地址'}
            </div>
          </div >
        </div>
      </div >
    );
  }
}

const styles = ({
  overlay: {
    backgroundColor: 'white',
    position: 'fixed',
    zIndex: 2,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayContent: {
    width: '100%',
    height: '100%',
    // backgroundColor: 'white',
    // borderTopLeftRadius: 20,
    // borderBottomRightRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  overlayScroll: {
    overflow: 'scroll',
    // display: 'flex',
    // flex: 1,
    flexDirection: 'column',
  },
  headerContainer: {

  },
  header: {
    margin: '10px 0px 0px 10px',
    width: 50,
    height: 80,
    backgroundColor: constants.brand,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  imageContainer: {
    margin: 'auto',
    width: 192,
    height: 192,
    position: 'relative',
    zIndex: 1,
    overflow: 'hidden',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
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
  title: {
    paddingHorizontal: 20,
    textAlign: 'center',
    fontFamily: 'nunitosans-regular',
    fontSize: 24,
  },
  menuPrice: {
    textAlign: 'center',
    fontFamily: 'nunito-bold',
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    // backgroundColor: constants.paid,
    margin: '10px 10px 20px 10px',
    height: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'varela-round',
    letterSpacing: 2,
    color: 'white',
  },
  remarksContainer: {
    margin: '10px 20px 10px 20px',
    fontFamily: 'nunito-light',
    fontSize: 14,
    color: constants.grey4,
  },
  verifyContainer: {
    margin: '10px 20px 10px 20px',
    fontFamily: 'nunito-light',
    fontSize: 14,
    color: 'red',
  },
  containsContainer: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  containsRow: {
    display: 'flex',
    flexDirection: 'row',
    fontFamily: 'nunitosans-regular',
    color: constants.grey1,
  },
  modifierContainer: {

  },
  quantityContainer: {
    margin: 'auto',
    height: 80,
    width: 300,
    // backgroundColor: 'orange',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityFirst: {
    flex: 1,
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantitySecond: {
    flex: 1,
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'nunitosans-semibold',
    fontSize: 48,
  },
  quantityThird: {
    flex: 1,
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
  input: {
    margin: '0 20px 0 20px',
    width: 300,
    height: 30,
    border: `2px solid ${constants.grey5}`
  }
});

export default OverlayAddress;
