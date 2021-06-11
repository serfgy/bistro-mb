import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Swiper from 'react-id-swiper';
import 'swiper/css/swiper.css';
import constants from '../constants/constants';
import logo from '../images/logo2.png';
import BEEF from '../images/beef.png';
import PORK from '../images/pork.png';
import VEGAN from '../images/vegan.png';
import SPICY1 from '../images/spicy1.png';
import SPICY2 from '../images/spicy2.png';
import SPICY3 from '../images/spicy3.png';
import OverlayMenu from './OverlayMenu';
import OverlayCombo from './OverlayCombo';
import { AntDesign } from 'react-web-vector-icons';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      overlayMenuVisible: false,
      overlayComboVisible: false,
      toOrder: false,
      language: props.location.state.language || props.language,
      foldergrps: props.location.state ? props.location.state.masters.foldergrps : '',
      folders: props.location.state ? props.location.state.masters.folders : '',
      menus: props.location.state ? props.location.state.masters.menus : '',
      mods: props.location.state ? props.location.state.masters.mods : '',
      modBundles: props.location.state ? props.location.state.masters.modBundles : '',
      comboGroups: props.location.state ? props.location.state.masters.comboGroups : '',
      comboItems: props.location.state ? props.location.state.masters.comboItems : '',
    };
  }

  componentDidMount() {
    const { match } = this.props;
    const { foldergrps } = this.state;
    this.doSelectFoldergrp(foldergrps[0]);
    fetch('http://203.208.248.200:9090/fnb-ws-epbsg/api/openorders/' + match.params.openorderRecKey)
      .then(response => response.json())
      .then(response => {
        this.setState({ openorderInfo: response })
      });
  }

  doSelectFoldergrp(item) {
    const { folders, menus } = this.state;
    let displaysUpdate = [];

    const temp = folders.filter(el => el.foldergrpId === item.foldergrpId);

    if (temp.length > 0) {
      temp.forEach(el => {
        const temp2 = menus.filter(obj => obj.folderId === el.folderId);
        displaysUpdate.push(...temp2);
      });
    }

    this.setState({
      selectedFoldergrp: item,
      displays: displaysUpdate,
    });
  }

  doSelectMenu(item) {
    console.log('selected item', item);
    if (item.menuType === 'O') {
      const { comboGroups, comboItems } = this.state;
      const availableComboGroups = comboGroups.filter(el => el.refMenuId === item.menuId);
      const availableComboItems = comboItems.filter(el => el.refMenuId === item.menuId);
      this.setState({
        selectedMenu: item,
        availableComboGroups: availableComboGroups,
        availableComboItems: availableComboItems,
        overlayComboVisible: true,
      });
    } else {
      this.setState({
        selectedMenu: item,
        overlayMenuVisible: true,
      });
    }
  }

  handleUpdateFromOverlayMenu = (item) => {
    const { match } = this.props;
    const { selectedMenu } = this.state;

    this.setState({ overlayMenuVisible: false })

    if (!item) {
      return;
    }

    let url = 'http://203.208.248.200:9090/fnb-ws-epbsg/api/insert-openorder-item/';
    const body = {
      openorderRecKey: match.params.openorderRecKey,
      restmenuRecKey: selectedMenu.recKey,
      restmenuMod: '',
      orderQty: item,
      orderType: '',
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
        console.log('post insert-openorder-item successful', response);
        if (response.message) {
          this.props.handleUpdateFromMenu(response.message)
          return;
        }
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

  handleUpdateFromOverlayCombo = (items, modalInputValueQty) => {
    const { match } = this.props;
    const { selectedMenu } = this.state;

    this.setState({ overlayComboVisible: false })

    if (!items) {
      return;
    }

    let url = 'http://203.208.248.200:9090/fnb-ws-epbsg/api/openorders/' + match.params.openorderRecKey + '/insert-combo';
    const body = {
      openorderRecKey: match.params.openorderRecKey,
      restmenuRecKey: selectedMenu.recKey,
      orderQty: modalInputValueQty,
      itemPayloads: items.map(el => ({
        combogroupRecKey: el.combogroupRecKey,
        comboitemRecKey: el.recKey,
      }))
    };
    console.log('testboyd', body);
    fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(body),
    })
      .then(response => response.json())
      .then(response => {
        console.log('post insert-combo successful', response);
        if (response.message) {
          this.props.handleUpdateFromMenu(response.message)
          return;
        }
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

  doToOrder() {
    this.setState({
      toOrder: true,
    })
  }

  doCalculateOrderedQty(item) {
    const { openorderInfo } = this.state;
    return openorderInfo.openorderItems.filter(el => el.stkId === item.stkId).reduce((a, b) => +a + +b.orderQty, 0);
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

  doCalculateTotalItems() {
    const { openorderInfo } = this.state;
    return openorderInfo.openorderItems.filter(el => !el.refRecKey).reduce((a, b) => a + b.orderQty, 0);
  }

  render() {
    const { match, location } = this.props;
    const { language, openorderInfo, toOrder,
      foldergrps, displays, selectedFoldergrp, selectedMenu, overlayMenuVisible,
      availableComboGroups, availableComboItems, overlayComboVisible } = this.state;
    console.log('render menu', openorderInfo);

    const params = {
      autoplay: {
        delay: 2500,
        disableOnInteraction: false
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      loop: true,
    }

    if (toOrder === true) {
      return <Redirect to={{
        pathname: '/order/' + match.params.openorderRecKey,
        state: {
          language: language,
          masters: location.state.masters,
        }
      }} />
    }

    return openorderInfo ? (
      <div>
        <div style={styles.fixedContainer} onClick={() => this.doToOrder()}>
          <div style={styles.fixedContent}>
            <div style={styles.headerAbsolute3}>
              <img alt='' style={styles.menuImage} src={logo} />
            </div>
            <div style={styles.headerAbsolute4}>
            </div>
            <div style={styles.headerAbsolute5}>
              <AntDesign name='doubleright' size={20} color='white' />
            </div>
            <div style={styles.headerAbsolute6} className={`${(openorderInfo.openorderItems.length > 0 && openorderInfo.openorderItems.find(el => el.confirmFlg === 'N')) ? 'bg-paid' : 'bg-none'}`}></div>
            <div style={styles.fixedContentLeft}></div>
            <div style={styles.fixedContentRight}>
              <div style={{ marginLeft: 10, marginRight: 20, }}>
                <div style={styles.headerFirst}>{openorderInfo.openorder.vipName || 'GUEST'}</div>
                <div style={styles.headerSecond}>${openorderInfo.openorder.grandTotal.toFixed(2)}</div>
              </div>
              <div style={{ marginRight: 20, }}>
                <div style={styles.headerFirst}>{language === 'en' ? 'TABLE' : '桌号'}</div>
                <div style={styles.headerSecond}>{openorderInfo.openorder.tableId || '-'}</div>
              </div>
              <div style={{ marginRight: 20, }}>
                <div style={styles.headerFirst}>{language === 'en' ? 'ITEMS' : '项目'}</div>
                <div style={styles.headerSecond}>{this.doCalculateTotalItems()}</div>
              </div>
            </div>
          </div>
        </div>
        <div style={styles.headerContainer}>
          <div style={styles.headerAbsolute7}>
            <img alt='' style={styles.logoImage} src={logo} />
          </div>
          <div style={styles.headerAbsolute2} onClick={() => this.doToggleLanguage()}>
            <div style={styles.headerFirstReverse}>{language === 'en' ? 'EN' : 'ZH'}</div>
            <div style={styles.headerSecondReverse}>{language === 'en' ? '英' : '中'}</div>
          </div>
          <div style={styles.headerReverse}
            onClick={() => this.doToOrder()}>
            <div style={styles.headerFirstReverse}>{openorderInfo.openorder.vipName || 'GUEST'}</div>
            <div style={styles.headerSecondReverse}>${openorderInfo.openorder.grandTotal.toFixed(2)}</div>
          </div>
          {
            openorderInfo.openorder.tableId &&
            <div style={styles.header} className='bg-dark'
              onClick={() => this.doToOrder()}>
              <div style={styles.headerFirst}>{language === 'en' ? 'TABLE' : '桌号'}</div>
              <div style={styles.headerSecond}>{openorderInfo.openorder.tableId.split('-')[0]}</div>
            </div>
          }
          <div style={styles.header} className='bg-brand' onClick={() => this.doToOrder()}>
            <div style={styles.headerFirst}>{language === 'en' ? 'ITEMS' : '项目'}</div>
            <div style={styles.headerSecond}>{this.doCalculateTotalItems()}</div>
            {/* <div style={styles.alertCircle} className={`${(openorderInfo.openorderItems.length > 0 && openorderInfo.openorderItems.find(el => el.confirmFlg === 'N')) ? 'bg-paid' : 'bg-none'}`}></div> */}
          </div>
        </div>
        <div style={styles.aboveContainer}>
          <Swiper {...params}>
            <div>
              <div style={styles.slide}>
                <img alt='' style={styles.menuImage} src={'https://media.cntraveler.com/photos/5a91e3bfa566be4ab1b46898/master/pass/Mott__-32_2018_MT-Cheung-Fun,-Chicken-Feet,-Minced-Beef-Balls,-Black-Cod-Dumplings,-Turnip-Cake,-Spare-Ribs-copy.jpg'} />
              </div>
            </div>
            <div>
              <div style={styles.slide}>
                <img alt='' style={styles.menuImage} src={'https://d22ir9aoo7cbf6.cloudfront.net/wp-content/uploads/sites/2/2019/12/Wan-Hao-Chinese-Restaurant-Singapore-Marriott-Tang-Plaza.jpg'} />
              </div>
            </div>
            <div>
              <div style={styles.slide}>
                <img alt='' style={styles.menuImage} src={'https://colorlib.com/wp/wp-content/uploads/sites/2/fast-food-menu-mockup.jpg'} />
              </div>
            </div>
            {/* <div>
              <div style={styles.slide}>
                <img alt='' style={styles.menuImage} src={'https://www.subway.com/~/media/Base_Arabic/English/Promotions/Marquees/Mobile/HomeBanner/jan-2018-all-markets-mobile-en.jpg'} />
              </div>
            </div> */}
          </Swiper>
        </div>
        <div style={styles.container}>
          {
            overlayMenuVisible &&
            <OverlayMenu
              language={language}
              selectedMenu={selectedMenu}
              handleUpdateFromOverlayMenu={this.handleUpdateFromOverlayMenu} />
          }
          {
            overlayComboVisible &&
            <OverlayCombo
              language={language}
              selectedMenu={selectedMenu}
              availableComboGroups={availableComboGroups}
              availableComboItems={availableComboItems}
              handleUpdateFromOverlayCombo={this.handleUpdateFromOverlayCombo} />
          }
          <div style={styles.leftContainer} ref={(ref) => this.scrollToRef = ref}>
            {
              foldergrps && foldergrps.map(item => (
                <div style={styles.selection}
                  key={item.recKey}
                  onClick={() => {
                    this.scrollToRef.scrollIntoView()
                    this.doSelectFoldergrp(item);
                  }}>
                  <img alt='' style={styles.image} src={'http://203.208.248.200:9090/image-proxy-epbsg/ASP/EPBSG/NORMAL/Shell/picture/' + item.name + '.jpg'} />
                  <div style={styles.selectionTextFirst}>{item.nameLang}</div>
                  <div style={styles.selectionBetween}>-</div>
                  <div style={styles.selectionTextSecond}>{item.name}</div>
                </div>
              ))
            }
            <div style={{ width: 60, height: 4, borderRadius: 3, backgroundColor: 'rgba(66,69,73,0.1)', margin: 'auto', marginBottom: 120 }}></div>
          </div>
          {
            selectedFoldergrp && openorderInfo &&
            <div style={styles.rightContainer}>
              <div style={{ margin: 10 }}>
                <div style={styles.subtitle}>{language === 'en' ? selectedFoldergrp.nameLang : selectedFoldergrp.name}</div>
                <div style={styles.title}>{language === 'en' ? selectedFoldergrp.name : selectedFoldergrp.nameLang}</div>
                <div style={styles.subsubtitle}>• {displays.length} {language === 'en' ? 'selections' : '菜单项目'} •</div>
              </div>
              <div style={styles.menus}>
                {
                  displays && displays.map(item => (
                    <div style={styles.menu}
                      key={item.recKey}
                      onClick={() => this.doSelectMenu(item)}>
                      <div style={styles.menuLeft}>
                        <div style={styles.menuName}>{language === 'en' ? item.menuName : item.menuNameLang}</div>
                        <div style={styles.menuPrice}>${item.listPrice}</div>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                          {
                            item.contains1 &&
                            <img height={24} width={24} alt='' src={this.doTranslateImage(item.contains1)} />
                          }
                          {
                            item.contains2 &&
                            <img height={24} width={24} alt='' src={this.doTranslateImage(item.contains2)} />
                          }
                          {
                            item.contains3 &&
                            <img height={24} width={24} alt='' src={this.doTranslateImage(item.contains3)} />
                          }
                          {
                            item.spicyFlg !== '0' &&
                            <img height={24} width={24} alt='' src={this.doTranslateImage(item.spicyFlg)} />
                          }
                        </div>
                        {/* {
                            openorderInfo.openorderItems.find(el => el.stkId === item.stkId) &&
                            <div style={styles.menuOrdered}>ORDERED {this.doCalculateOrderedQty(item)}</div>
                          } */}
                      </div>
                      <div style={styles.menuRight}>
                        <div style={styles.imageContainer}>
                          <img alt='' style={styles.menuImage} src={'http://203.208.248.200:9090/image-proxy-epbsg/ASP/EPBSG/NORMAL/Shell/picture/' + item.stkId+'.jpg'} />
                        </div>
                      </div>
                    </div>
                  ))
                }
                <div style={{ width: 60, height: 4, borderRadius: 3, backgroundColor: 'rgba(66,69,73,0.1)', margin: 'auto', marginBottom: 120 }}></div>
              </div>
            </div>
          }
        </div>
      </div >
    ) : null;
  }
}

const styles = ({
  fixedContainer: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
    height: 70,
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
  },
  fixedContent: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    flexDirection: 'row'
  },
  fixedContentLeft: {
    width: 70,
    // backgroundColor: 'red'
  },
  fixedContentRight: {
    flex: 1,
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    // backgroundColor: 'yellow'
  },
  aboveContainer: {
    // backgroundColor: 'green',
  },
  slide: {
    margin: 10,
    borderRadius: 10,
    height: 200,
    position: 'relative',
    zIndex: 1,
    overflow: 'hidden',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // right: 0,
    // bottom: 0,
    display: 'flex',
    // backgroundColor: constants.reserved
  },
  leftContainer: {
    height: '100%',
    width: 120,
    // backgroundColor: 'yellow',
    overflow: 'scroll'
  },
  rightContainer: {
    flex: 1,
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  alertCircle: {
    position: 'absolute',
    top: -4,
    right: -4,
    height: 10,
    width: 10,
    borderRadius: 5,
  },
  logoImage: {
    height: '100%',
    minWidth: '100%',
    position: 'absolute',
    // zIndex: -1,
    top: '-9999px',
    bottom: '-9999px',
    left: '-9999px',
    right: '-9999px',
    margin: 'auto',
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
  headerAbsolute3: {
    position: 'absolute',
    overflow: 'hidden',
    bottom: 20,
    left: 10,
    width: 46,
    height: 76,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    border: `2px solid ${constants.brand}`,
  },
  headerAbsolute4: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  headerAbsolute5: {
    position: 'absolute',
    bottom: 25,
    right: 20,
  },
  headerAbsolute6: {
    position: 'absolute',
    bottom: 45,
    right: 15,
    height: 10,
    width: 10,
    borderRadius: 5,
  },
  headerAbsolute7: {
    position: 'absolute',
    overflow: 'hidden',
    top: 10,
    left: 10,
    width: 50,
    height: 80,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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
  selection: {
    width: 100,
    height: 100,
    margin: 10,
    position: 'relative',
    zIndex: 1,
    overflow: 'hidden',
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionTextFirst: {
    textAlign: 'center',
    fontFamily: 'nunitosans-regular',
    color: 'white',
    fontSize: 20,
    paddingHorizontal: 10,
  },
  selectionBetween: {
    borderTop: '1px solid white',
    height: 0,
    width: 50,
    color: 'transparent',
  },
  selectionTextSecond: {
    textAlign: 'center',
    fontFamily: 'nunitosans-regular',
    color: 'white',
    fontSize: 14,
    paddingHorizontal: 10,
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
    filter: 'brightness(60%) contrast(200%)',
  },
  title: {
    fontFamily: 'nunitosans-semibold',
    fontSize: 36,
  },
  subtitle: {
    fontFamily: 'nunitosans-regular',
    fontSize: 16,
  },
  subsubtitle: {
    fontFamily: 'nunito-regular',
    fontSize: 16,
  },
  menus: {
    flex: 1,
    // backgroundColor: 'green',
    margin: '10px 10px 0px 10px',
    overflow: 'scroll',
  },
  menu: {
    display: 'flex',
    marginBottom: 20,
    // backgroundColor: 'rgba(0,0,0,0.1)',
  },
  menuLeft: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  menuRight: {
    width: 100,
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
    backgroundColor: constants.brand,
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
});

export default Menu;
