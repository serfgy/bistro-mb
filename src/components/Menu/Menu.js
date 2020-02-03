import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import constants from '../constants/constants';
import OverlayMenu from './OverlayMenu';
import OverlayCombo from './OverlayCombo';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      overlayMenuVisible: false,
      overlayComboVisible: false,
      toOrder: false,
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
    fetch('https://dev.epbmobile.app:8090/fnb-ws/api/openorders/' + match.params.openorderRecKey)
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
      const selectedComboGroups = comboGroups.filter(el => el.refMenuId === item.menuId);
      const selectedComboItems = comboItems.filter(el => el.refMenuId === item.menuId);
      this.setState({
        selectedMenu: item,
        selectedComboGroups: selectedComboGroups,
        selectedComboItems: selectedComboItems,
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

    let url = 'https://dev.epbmobile.app:8090/fnb-ws/api/insert-openorder-item/';
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

  handleUpdateFromOverlayCombo = (item) => {
    const { match } = this.props;
    const { selectedMenu } = this.state;

    this.setState({ overlayComboVisible: false })

    if (!item) {
      return;
    }
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

  render() {
    const { match, location } = this.props;
    const { openorderInfo, toOrder,
      foldergrps, displays, selectedFoldergrp, selectedMenu, overlayMenuVisible,
      selectedComboGroups, selectedComboItems, overlayComboVisible } = this.state;
    console.log('render menu', openorderInfo);

    if (toOrder === true) {
      return <Redirect to={{
        pathname: '/order/' + match.params.openorderRecKey,
        state: {
          masters: location.state.masters,
        }
      }} />
    }

    return (
      <div style={styles.container}>
        {
          overlayMenuVisible &&
          <OverlayMenu
            selectedMenu={selectedMenu}
            handleUpdateFromOverlayMenu={this.handleUpdateFromOverlayMenu} />
        }
        {
          overlayComboVisible &&
          <OverlayCombo
            selectedMenu={selectedMenu}
            selectedComboGroups={selectedComboGroups}
            selectedComboItems={selectedComboItems}
            handleUpdateFromOverlayCombo={this.handleUpdateFromOverlayCombo} />
        }
        <div style={styles.leftContainer}>
          {
            foldergrps && foldergrps.map(item => (
              <div style={styles.selection}
                key={item.recKey}
                onClick={() => this.doSelectFoldergrp(item)}>
                <img alt='' style={styles.image} src={'https://dev.epbmobile.app:8090/gateway/epbm/api/image/stock?stkId=' + item.foldergrpId} />
                <div style={styles.selectionTextFirst}>{item.name}</div>
                <div style={styles.selectionBetween}>-</div>
                <div style={styles.selectionTextSecond}>{item.foldergrpId}</div>
              </div>
            ))
          }
        </div>
        {
          selectedFoldergrp && openorderInfo &&
          <div style={styles.rightContainer}>
            <div style={styles.headerContainer}
              onClick={() => this.doToOrder()}>
              <div style={styles.headerReverse}>
                <div style={styles.headerFirstReverse}>{openorderInfo.openorder.vipName || 'GUEST'}</div>
                <div style={styles.headerSecondReverse}>${openorderInfo.openorder.grandTotal.toFixed(2)}</div>
              </div>
              {
                openorderInfo.openorder.tableId &&
                <div style={styles.header} className='bg-dark'>
                  <div style={styles.headerFirst}>TABLE</div>
                  <div style={styles.headerSecond}>{openorderInfo.openorder.tableId}</div>
                </div>
              }
              <div style={styles.header} className={`background-transition ${(openorderInfo.openorderItems.length > 0 && openorderInfo.openorderItems.find(el => el.confirmFlg === 'N')) ? 'bg-paid' : 'bg-dark'}`}>
                <div style={styles.headerFirst}>ITEMS</div>
                <div style={styles.headerSecond}>{openorderInfo.openorderItems.length}</div>
              </div>
            </div>
            <div style={{ margin: 10 }}>
              <div style={styles.subtitle}>{selectedFoldergrp.name}</div>
              <div style={styles.title}>{selectedFoldergrp.foldergrpId}</div>
              <div style={styles.subsubtitle}>• {displays.length} selections •</div>
            </div>
            <div style={styles.menus}>
              {
                displays && displays.map(item => (
                  <div style={styles.menu}
                    key={item.recKey}
                    onClick={() => this.doSelectMenu(item)}>
                    <div style={styles.menuLeft}>
                      <div style={styles.menuName}>{item.menuName}</div>
                      <div style={styles.menuPrice}>${item.listPrice}</div>
                      {
                        openorderInfo.openorderItems.find(el => el.stkId === item.stkId) &&
                        <div style={styles.menuOrdered}>ORDERED {this.doCalculateOrderedQty(item)}</div>
                      }
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
        }
      </div>
    );
  }
}

const styles = ({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  headerContainer: {
    display: 'flex',
    margin: '0px 10px 0px 10px',
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
});

export default Menu;
