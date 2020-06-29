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

class OverlayCombo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalInputValueQty: 1,
      selectedComboItems: [],
      availableComboItems: [...props.availableComboItems.filter(el => el.fixedItem === 'Y'), ...props.availableComboItems.filter(el => el.fixedItem === 'N')],
    };
  }

  componentDidMount() {
    this.doSelectFixedItems();
    this.targetElement = document.querySelector('#targetElement');
    disableBodyScroll(this.targetElement);
  }

  componentWillUnmount() {
    enableBodyScroll(this.targetElement);
  }

  doSelectFixedItems() {
    const { availableComboItems, availableComboGroups } = this.props;
    availableComboItems.filter(el => el.fixedItem === 'Y').forEach(el => {
      this.doSelectComboItem(availableComboGroups.find(obj => obj.groupNo === el.groupNo), el)
    });
  }

  doSelectComboItem(group, item) {
    const { availableComboGroups } = this.props;
    const { selectedComboItems } = this.state;
    // early return for already selected fixed items
    if (item.fixedItem === 'Y' && selectedComboItems.find(el => el.recKey === item.recKey)) {
      return;
    }
    // special return for items with fixed item in group
    if (item.fixedItem === 'N' && selectedComboItems.filter(el => el.groupNo === item.groupNo).find(el => el.fixedItem === 'Y')) {
      let selectedComboItemsUpdate = selectedComboItems.filter(el => !(el.groupNo === item.groupNo && el.fixedItem === 'N'));
      let itemUpdate = { ...item, combogroupRecKey: group.recKey };
      selectedComboItemsUpdate.push(itemUpdate);
      this.setState({
        selectedComboItems: selectedComboItemsUpdate,
      });
      return;
    }
    // special return for items with min 1 max 1
    if (
      item.fixedItem === 'N' &&
      !selectedComboItems.filter(el => el.groupNo === item.groupNo).find(el => el.fixedItem === 'Y') &&
      availableComboGroups.find(el => el.groupNo === item.groupNo).maxSelectItem === 1 &&
      availableComboGroups.find(el => el.groupNo === item.groupNo).minSelectItem === 1
    ) {
      let selectedComboItemsUpdate = selectedComboItems.filter(el => !(el.groupNo === item.groupNo));
      let itemUpdate = { ...item, combogroupRecKey: group.recKey };
      selectedComboItemsUpdate.push(itemUpdate);
      this.setState({
        selectedComboItems: selectedComboItemsUpdate,
      });
      return;
    }
    // no control yet for other cases
    let selectedComboItemsUpdate = selectedComboItems;
    let itemUpdate = { ...item, combogroupRecKey: group.recKey };
    if (!selectedComboItems.find(el => el.recKey === item.recKey)) {
      selectedComboItemsUpdate.push(itemUpdate);
    } else {
      selectedComboItemsUpdate = selectedComboItems.filter(el => el.recKey !== item.recKey);
    }
    // update state
    this.setState({
      selectedComboItems: selectedComboItemsUpdate,
    });
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
    const { selectedComboItems, modalInputValueQty } = this.state;
    if (selectedMenu.statusFlg === 'B') {
      return;
    }
    this.props.handleUpdateFromOverlayCombo(selectedComboItems, modalInputValueQty);
  }

  render() {
    const { language, selectedMenu, availableComboGroups, } = this.props;
    const { modalInputValueQty, selectedComboItems, availableComboItems } = this.state;
    console.log('render overlaycombo', selectedComboItems, availableComboItems, availableComboGroups);

    return (
      <div style={styles.overlay} className='disable-double-tap'>
        <div style={styles.overlayContent}>
          <div style={styles.overlayScroll} id='targetElement'>
            <div style={styles.headerContainer}>
              <div style={styles.header} onClick={() => this.props.handleUpdateFromOverlayCombo()}>
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

              {
                availableComboGroups && availableComboGroups.map(el => (
                  <div style={styles.groupContainer} key={el.recKey}>
                    <div style={styles.groupTitle}>{language === 'en' ? el.groupName : el.groupNameLang}</div>
                    <div style={styles.groupItems}>
                      {
                        availableComboItems && availableComboItems.filter(item => item.groupNo === el.groupNo).map(item => (
                          <div style={styles.groupItem}
                            key={item.recKey}
                            onClick={() => this.doSelectComboItem(el, item)}>
                            {
                              item.fixedItem === 'Y' ?
                                <div style={styles.groupItemLeftFixed}></div>
                                :
                                availableComboItems.filter(obj => obj.groupNo === item.groupNo).find(obj => obj.fixedItem === 'Y') ?
                                  <div style={styles.groupItemLeftNonFixed} className={`${selectedComboItems.find(obj => obj.recKey === item.recKey) ? 'bg-brand' : 'bg-none'}`}></div>
                                  :
                                  <div style={styles.groupItemLeft} className={`${selectedComboItems.find(obj => obj.recKey === item.recKey) ? 'bg-brand' : 'bg-none'}`}></div>
                            }
                            <div style={styles.groupItemRight}>{language === 'en' ? item.menuName : item.menuNameLang}{item.addonPrice !== 0 && <span style={{ color: constants.paid }}> +${item.addonPrice.toFixed(2)}</span>}</div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                ))
              }
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
    // display: 'flex',
    // flex: 1,
    flexDirection: 'column',
  },
  headerContainer: {
    // backgroundColor: 'red'
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
  title: {
    paddingHorizontal: 20,
    textAlign: 'center',
    fontFamily: 'nunitosans-regular',
    fontSize: 24,
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
  menuPrice: {
    textAlign: 'center',
    fontFamily: 'nunito-bold',
    fontSize: 16,
    marginBottom: 10,
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
  }
});

export default OverlayCombo;
