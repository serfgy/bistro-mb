import React, { Component } from 'react';
import constants from '../constants/constants';
import Icon, { AntDesign, Feather } from 'react-web-vector-icons';

class OverlayMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalInputValueQty: 1,
    };
  }

  componentDidMount() {
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

  render() {
    const { selectedMenu } = this.props;
    const { modalInputValueQty } = this.state;
    console.log('render overlaymenu');

    return (
      <div style={styles.overlay} className='disable-double-tap'>
        <div style={styles.overlayContent}>
          <div style={styles.imageContainer} className='box-shadow'>
            <img style={styles.image} src={'https://dev.epbmobile.app:8090/gateway/epbm/api/image/stock?stkId=' + selectedMenu.stkId} />
          </div>
          <div style={styles.menuPrice}>${selectedMenu.listPrice}</div>
          <div style={styles.title}>{selectedMenu.menuName}</div>
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
          <div style={styles.actionContainer}>
            <div style={styles.action}
              onClick={() => this.props.handleUpdateFromOverlayMenu()}>
              <AntDesign name='close' size={64} color={constants.paid} />
              <div style={styles.actionText}>BACK</div>
            </div>
            <div style={styles.action}
              onClick={() => this.props.handleUpdateFromOverlayMenu(modalInputValueQty)}>
              <AntDesign name='check' size={64} color={constants.vacant} />
              <div style={styles.actionText}>OK</div>
            </div>
          </div>
        </div >
      </div >
    );
  }
}

const styles = ({
  overlay: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    position: 'absolute',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: 192,
    height: 192,
    position: 'relative',
    zIndex: 1,
    overflow: 'hidden',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
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
    fontFamily: 'nunito-bold',
    fontSize: 16,
  },
  actionContainer: {
    marginTop: 40,
    display: 'flex',
    flexDirection: 'row',
  },
  action: {
    height: 100,
    width: 100,
    margin: 20,
    // backgroundColor: 'blue',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 12,
    letterSpacing: 2,
    fontFamily: 'nunito-semibold',
  },
  quantityContainer: {
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
