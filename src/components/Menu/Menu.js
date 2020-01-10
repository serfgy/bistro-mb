import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import constants from '../constants/constants';
import OverlayMenu from './OverlayMenu';

// import Icon, { AntDesign, Feather } from 'react-web-vector-icons';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openorderInfo: props.location.state.openorderInfo,
      overlayMenuVisible: false,
      toOrder: false,
    };
  }

  componentDidMount() {
    fetch('https://dev.epbmobile.app:8090/fnb-ws/api/foldergrps?orgId=X02')
      .then(response => response.json())
      .then(response => {
        this.setState({ foldergrps: response })
        setTimeout(() => this.doSelectFoldergrp(response[0]), 500)
      });
    fetch('https://dev.epbmobile.app:8090/fnb-ws/api/folders?orgId=X02&shopId=X0201')
      .then(response => response.json())
      .then(response => {
        this.setState({ folders: response })
      });
    fetch('https://dev.epbmobile.app:8090/fnb-ws/api/menus?orgId=X02')
      .then(response => response.json())
      .then(response => {
        this.setState({ menus: response })
      });
    fetch('https://dev.epbmobile.app:8090/fnb-ws/api/openorders/46161')
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
    this.setState({
      selectedMenu: item,
      overlayMenuVisible: true,
    });
  }

  handleUpdateFromOverlayMenu = (item) => {
    console.log('handled', item)
    const { selectedMenu } = this.state;

    this.setState({ overlayMenuVisible: false })

    if (!item) {
      return;
    }

    let url = 'https://dev.epbmobile.app:8090/fnb-ws/api/insert-openorder-item/';
    const body = {
      openorderRecKey: '46161',
      restmenuRecKey: selectedMenu.recKey,
      restmenuMod: '',
      orderQty: 1,
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

  render() {
    const { openorderInfo, toOrder,
      foldergrps, displays, selectedFoldergrp, selectedMenu, overlayMenuVisible } = this.state;
    console.log('props', this.props);

    if (toOrder === true) {
      return <Redirect to={{
        pathname: '/order',
        // state: {
        //   openorderInfo: openorderInfo
        // }
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
        <div style={styles.leftContainer}>
          {
            foldergrps && foldergrps.map(item => (
              <div style={styles.selection}
                key={item.recKey}
                onClick={() => this.doSelectFoldergrp(item)}>
                <img style={styles.image} src={'https://dev.epbmobile.app:8090/gateway/epbm/api/image/stock?stkId=' + item.foldergrpId} />
                <div style={styles.selectionTextFirst}>{item.name}</div>
                <div style={styles.selectionBetween}>hidden</div>
                <div style={styles.selectionTextSecond}>{item.foldergrpId}</div>
              </div>
            ))
          }
        </div>
        {
          selectedFoldergrp &&
          <div style={styles.rightContainer}>
            <div style={styles.headerContainer}
              onClick={() => this.doToOrder()}>
              <div style={styles.header}>
                <div style={styles.headerFirst}>TABLE</div>
                <div style={styles.headerSecond}>{openorderInfo.openorder.tableId}</div>
              </div>
              <div style={styles.header}>
                <div style={styles.headerFirst}>ITEMS</div>
                <div style={styles.headerSecond}>{openorderInfo.openorderItems.length}</div>
              </div>
              <div style={styles.header}>
                <div style={styles.headerFirst}>TOTAL</div>
                <div style={styles.headerSecond}>${openorderInfo.openorder.grandTotal.toFixed(0)}</div>
              </div>
            </div>
            <div style={{ margin: 10 }}>
              <div style={styles.subtitle}>{selectedFoldergrp.name}</div>
              <div style={styles.title}>{selectedFoldergrp.foldergrpId}</div>
              <div style={styles.subsubtitle}>• {displays.length} selections •</div>
              <div style={{ marginTop: 50 }}></div>
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
                        <div style={styles.menuOrdered}>ORDERED</div>
                      }
                    </div>
                    <div style={styles.menuRight}>
                      <div style={styles.imageContainer}>
                        <img style={styles.menuImage} src={'https://dev.epbmobile.app:8090/gateway/epbm/api/image/stock?stkId=' + item.stkId} />
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
    overflow: 'scroll',
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
    backgroundColor: constants.grey1,
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
  },
  headerSecond: {
    fontSize: 16,
    color: 'white',
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
    margin: 10,
    overflow: 'scroll',
  },
  menu: {
    display: 'flex',
    marginBottom: 20,
    // backgroundColor: 'rgba(0,0,0,0.1)',
  },
  menuLeft: {
    flex: 1
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
    color: constants.paid,
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
