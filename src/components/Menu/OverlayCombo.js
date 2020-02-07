import React, { Component } from 'react';
import constants from '../constants/constants';
import { AntDesign } from 'react-web-vector-icons';

class OverlayCombo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalInputValueQty: 1,
    };
  }

  componentDidMount() {
  }

  render() {
    const { selectedMenu, selectedComboGroups, selectedComboItems, } = this.props;
    const { modalInputValueQty } = this.state;
    console.log('render overlaycombo', selectedMenu, selectedComboGroups, selectedComboItems);

    return (
      <div style={styles.overlay} className='disable-double-tap'>
        <div style={styles.overlayContent} onClick={() => this.props.handleUpdateFromOverlayCombo()}>
          <div style={styles.overlayScroll}>
            <div style={styles.subtitle}>${selectedMenu.listPrice}</div>
            <div style={styles.title}>{selectedMenu.menuName}</div>
            <div style={styles.subsubtitle}>You may select an item for each option.</div>
            {
              selectedComboGroups && selectedComboGroups.map(el => (
                <div style={styles.groupContainer} key={el.recKey}>
                  <div style={styles.groupTitle}>{el.groupName}</div>
                  <div style={styles.menus}>
                    {
                      selectedComboItems && selectedComboItems.filter(item => item.groupNo === el.groupNo).map(item => (
                        <div style={styles.menu}
                          key={item.recKey}
                          onClick={() => this.doSelectMenu(item)}>
                          <div style={styles.menuLeft}>
                            <div style={styles.menuName}>{item.menuName}</div>
                            <div style={styles.menuPrice}>${item.listPrice}</div>
                            {/* {
                              openorderInfo.openorderItems.find(el => el.stkId === item.stkId) &&
                              <div style={styles.menuOrdered}>ORDERED {this.doCalculateOrderedQty(item)}</div>
                            } */}
                          </div>
                          <div style={styles.menuRight}>
                            <div style={styles.imageContainer}>
                              <img alt='' style={styles.menuImage} src={'https://dev.epbmobile.app:8090/gateway/epbm/api/image/stock?stkId=' + item.stkId} />
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              ))
            }
            <div style={styles.actionContainer}>
              <div style={styles.action}
                onClick={() => this.props.handleUpdateFromOverlayCombo()}>
                <AntDesign name='close' size={64} color={constants.paid} />
                <div style={styles.actionText}>BACK</div>
              </div>
              <div style={styles.action}
                onClick={() => this.props.handleUpdateFromOverlayCombo()}>
                <AntDesign name='check' size={64} color={constants.vacant} />
                <div style={styles.actionText}>OK</div>
              </div>
            </div>
          </div >
        </div>
      </div >
    );
  }
}

const styles = ({
  overlay: {
    backgroundColor: 'rgba(255,255,255,0.95)',
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
    backgroundColor: 'green',
    // borderTopLeftRadius: 20,
    // borderBottomRightRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  overlayScroll: {
    overflow: 'scroll',
  },
  title: {
    margin: '0px 20px 0px 20px',
    fontFamily: 'nunitosans-regular',
    fontSize: 24,
  },
  subtitle: {
    margin: '20px 0px 0px 20px',
    fontFamily: 'nunito-bold',
    fontSize: 16,
  },
  subsubtitle: {
    margin: '0px 0px 0px 20px',
    fontFamily: 'nunito-regular',
    fontSize: 16,
  },
  groupContainer: {
    margin: '20px 0px 20px 0px',
    backgroundColor: 'pink',
    height: 400,
  },
  groupTitle: {
    margin: '20px 0px 0px 20px',
    fontFamily: 'nunito-bold',
    fontSize: 16,
  },
  menus: {
    flex: 1,
    backgroundColor: 'green',
    borderRadius: 10,
    margin: '10px 10px 0px 10px',
    overflowY: 'scroll',
  },
  menu: {
    display: 'flex',
    flexDirection: 'row',
    margin: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  menuLeft: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  menuRight: {
    width: 100,
    backgroundColor: 'black'
  },
  menuName: {
    fontFamily: 'nunitosans-light',
    fontSize: 18,
  },
  menuPrice: {
    fontFamily: 'nunito-bold',
    fontSize: 16,
  },
  menuOrdered: {
    fontFamily: 'varela-round',
    fontSize: 12,
    letterSpacing: 1,
    color: 'white',
    backgroundColor: constants.reserved,
    height: 20,
    borderRadius: 10,
    padding: '0px 5px 0px 5px',
    display: 'flex',
    alignItems: 'center',
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
    width: 100,
    height: 100,
    position: 'relative',
    zIndex: 1,
    overflow: 'hidden',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionContainer: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default OverlayCombo;
