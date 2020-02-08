import React, { Component } from 'react';
import constants from '../constants/constants';
import { AntDesign } from 'react-web-vector-icons';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

class OverlayCombo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalInputValueQty: 1,
      selectedComboItems: [],
    };
  }

  componentDidMount() {
    this.targetElement = document.querySelector('#targetElement');
    disableBodyScroll(this.targetElement);
  }

  componentWillUnmount() {
    enableBodyScroll(this.targetElement);
  }

  doSelectComboItem(group, item) {
    const { selectedComboItems } = this.state;
    let selectedComboItemsUpdate = selectedComboItems;
    let itemUpdate = { ...item, combogroupRecKey: group.recKey };
    if (!selectedComboItems.find(el => el.recKey === item.recKey)) {
      selectedComboItemsUpdate.push(itemUpdate);
    }
    this.setState({
      selectedComboItems: selectedComboItemsUpdate,
    });
  }

  render() {
    const { selectedMenu, availableComboGroups, availableComboItems, } = this.props;
    const { selectedComboItems } = this.state;
    console.log('render overlaycombo', selectedComboItems);

    return (
      <div style={styles.overlay} className='disable-double-tap'>
        <div style={styles.overlayContent}>
          <div style={styles.overlayScroll} id='targetElement'>
            <div style={styles.backButton} onClick={() => this.props.handleUpdateFromOverlayCombo()}>
              <div style={styles.backButtonText}>BACK</div>
            </div>
            <div style={styles.menuContainer}>
              <div style={styles.imageContainer} className='box-shadow'>
                <img alt='' style={styles.image} src={'https://dev.epbmobile.app:8090/gateway/epbm/api/image/stock?stkId=' + selectedMenu.stkId} />
              </div>
              <div style={styles.menuPrice}>${selectedMenu.listPrice}</div>
              <div style={styles.title}>{selectedMenu.menuName}</div>
            </div>
            {
              availableComboGroups && availableComboGroups.map(el => (
                <div style={styles.groupContainer} key={el.recKey}>
                  <div style={styles.groupTitle}>{el.groupName}</div>
                  <div style={styles.groupItems}>
                    {
                      availableComboItems && availableComboItems.filter(item => item.groupNo === el.groupNo).map(item => (
                        <div style={styles.groupItem}
                          key={item.recKey}
                          onClick={() => this.doSelectComboItem(el, item)}>
                          {
                            selectedComboItems.find(obj => obj.recKey === item.recKey) ?
                              <div style={styles.groupItemLeftSelected}></div>
                              :
                              <div style={styles.groupItemLeft}></div>
                          }
                          <div style={styles.groupItemRight}>{item.menuName}</div>
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
                onClick={() => this.props.handleUpdateFromOverlayCombo(selectedComboItems)}>
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
    // backgroundColor: 'green',
    // borderTopLeftRadius: 20,
    // borderBottomRightRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  overlayScroll: {
    overflow: 'scroll',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
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
  menuContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    margin: '0px 20px 0px 20px',
    fontFamily: 'nunitosans-semibold',
    fontWeight: 'bold',
    fontSize: 24,
  },
  groupContainer: {
    margin: '20px 0px 20px 0px',
    backgroundColor: 'pink',
    // height: 400,
  },
  groupTitle: {
    margin: '20px 0px 0px 20px',
    fontFamily: 'nunito-bold',
    fontWeight: 'bold',
    fontSize: 16,
  },
  groupItems: {
    // backgroundColor: 'orange',
    margin: '0px 20px 0px 20px',
  },
  groupItem: {
    display: 'flex',
    flexDirection: 'row',
    // backgroundColor: 'purple',
    margin: '0px 0px 20px 0px',
    alignItems: 'center',
  },
  groupItemLeft: {
    // backgroundColor: constants.paid,
    height: 16,
    width: 16,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 5,
    border: `1px solid ${constants.paid}`,
  },
  groupItemLeftSelected: {
    backgroundColor: constants.paid,
    height: 16,
    width: 16,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 5,
    borderRadius: 5,
    border: `1px solid ${constants.paid}`,
  },
  groupItemRight: {
    fontFamily: 'nunito-regular',
    fontWeight: 'normal',
  },
  // menus: {
  //   flex: 1,
  //   backgroundColor: 'green',
  //   borderRadius: 10,
  //   margin: '10px 10px 0px 10px',
  //   overflowY: 'scroll',
  // },
  // menu: {
  //   display: 'flex',
  //   flexDirection: 'row',
  //   margin: 10,
  //   borderRadius: 5,
  //   backgroundColor: 'rgba(0,0,0,0.1)',
  // },
  // menuLeft: {
  //   flex: 1,
  //   display: 'flex',
  //   flexDirection: 'column',
  //   alignItems: 'flex-start',
  // },
  // menuRight: {
  //   width: 100,
  //   backgroundColor: 'black'
  // },
  menuName: {
    fontFamily: 'nunitosans-light',
    fontSize: 18,
  },
  menuPrice: {
    fontFamily: 'nunito-bold',
    fontSize: 16,
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
    marginTop: 80,
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
