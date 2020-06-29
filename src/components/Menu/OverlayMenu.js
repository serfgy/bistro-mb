import React, { Component } from 'react';
import constants from '../constants/constants';
import { AntDesign } from 'react-web-vector-icons';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import BEEF from '../images/beef.png';
import PORK from '../images/pork.png';
import VEGAN from '../images/vegan.png';
import SPICY1 from '../images/spicy1.png';
import SPICY2 from '../images/spicy2.png';
import SPICY3 from '../images/spicy3.png';

class OverlayMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalInputValueQty: 1,
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

  doTranslateImage(item) {
    if (item === 'BEEF') {
      return BEEF;
    } else if (item === 'PORK') {
      return PORK;
    } else if (item === 'VEGAN') {
      return VEGAN;
    } else if (item === '1') {
      return SPICY1;
    } else if (item === '2') {
      return SPICY2;
    } else if (item === '3') {
      return SPICY3;
    }
  }

  doTranslateImageText(item) {
    const { language } = this.props;
    if (language !== 'en') {
      if (item === 'BEEF') {
        return '含有牛肉';
      } else if (item === 'PORK') {
        return '含有猪肉';
      } else if (item === 'VEGAN') {
        return '素食';
      } else if (item === '1') {
        return '微辣';
      } else if (item === '2') {
        return '中辣';
      } else if (item === '3') {
        return '特辣';
      }
    } else {
      if (item === 'BEEF') {
        return 'Contains Beef';
      } else if (item === 'PORK') {
        return 'Contains Pork';;
      } else if (item === 'VEGAN') {
        return 'Vegetarian';;
      } else if (item === '1') {
        return 'Mild Spicy';
      } else if (item === '2') {
        return 'Medium Spicy';
      } else if (item === '3') {
        return 'Very Spicy';
      }
    }
  }

  doPressOrder() {
    const { selectedMenu } = this.props;
    const { modalInputValueQty } = this.state;
    if (selectedMenu.statusFlg === 'B') {
      return;
    }
    this.props.handleUpdateFromOverlayMenu(modalInputValueQty)
  }

  render() {
    const { language, selectedMenu } = this.props;
    const { modalInputValueQty } = this.state;
    console.log('render overlaymenu', selectedMenu);

    return (
      <div style={styles.overlay} className='disable-double-tap'>
        <div style={styles.overlayContent}>
          <div style={styles.overlayScroll} id='targetElement'>
            <div style={styles.headerContainer}>
              <div style={styles.header} onClick={() => this.props.handleUpdateFromOverlayMenu()}>
                <AntDesign name='left' size={16} color='white' />
              </div>
            </div>

            <div style={styles.title}>{language === 'en' ? selectedMenu.menuName : selectedMenu.menuNameLang}</div>
            <div style={styles.menuPrice}>${selectedMenu.listPrice}</div>
            <div style={styles.imageContainer}>
              <img alt='' style={styles.image} src={'https://epbrowser.com:8090/gateway/epbm/api/image/stock?stkId=' + selectedMenu.stkId} />
            </div>
            <div style={styles.containsContainer}>
              {
                selectedMenu.contains1 &&
                <div style={styles.containsRow}>
                  <img height={24} width={24} alt='' src={this.doTranslateImage(selectedMenu.contains1)} />
                  <div style={{ marginLeft: 10 }}>{this.doTranslateImageText(selectedMenu.contains1)}</div>
                </div>
              }
              {
                selectedMenu.contains2 &&
                <div style={styles.containsRow}>
                  <img height={24} width={24} alt='' src={this.doTranslateImage(selectedMenu.contains2)} />
                  <div style={{ marginLeft: 10 }}>{this.doTranslateImageText(selectedMenu.contains2)}</div>
                </div>
              }
              {
                selectedMenu.contains3 &&
                <div style={styles.containsRow}>
                  <img height={24} width={24} alt='' src={this.doTranslateImage(selectedMenu.contains3)} />
                  <div style={{ marginLeft: 10 }}>{this.doTranslateImageText(selectedMenu.contains3)}</div>
                </div>
              }
              {
                selectedMenu.spicyFlg !== '0' &&
                <div style={styles.containsRow}>
                  <img height={24} width={24} alt='' src={this.doTranslateImage(selectedMenu.spicyFlg)} />
                  <div style={{ marginLeft: 10 }}>{this.doTranslateImageText(selectedMenu.spicyFlg)}</div>
                </div>
              }
            </div>
            <div style={styles.quantityContainer}>
              <div style={styles.quantityFirst} className="disable-select"
                onClick={() => this.doQtyChange('MINUS')}>
                <AntDesign name='minus' size={32} />
              </div>
              <div style={styles.quantitySecond}>
                {modalInputValueQty}
              </div>
              <div style={styles.quantityThird} className='disable-select'
                onClick={() => this.doQtyChange('PLUS')}>
                <AntDesign name='plus' size={32} />
              </div>
            </div>
            <div style={styles.modifierContainer}>

            </div>
            <div style={styles.remarksContainer}>
              {selectedMenu.remark}
            </div>
            <div style={styles.button} className={`${selectedMenu.statusFlg === 'A' ? 'bg-brand' : 'bg-grey'}`}
              onClick={() => this.doPressOrder()}>
              {language === 'en' ? 'ADD TO ORDER' : '加入点单'}
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
});

export default OverlayMenu;
