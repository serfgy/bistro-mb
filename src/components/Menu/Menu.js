import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import OverlayMenu from './OverlayMenu';
// import Icon, { AntDesign, Feather } from 'react-web-vector-icons';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      overlayMenuVisible: false,
    };
  }

  componentDidMount() {
    fetch('https://dev.epbmobile.app:8090/fnb-ws/api/foldergrps?orgId=X02')
      .then(response => response.json())
      .then(response => {
        this.setState({ foldergrps: response })
        setTimeout(() => this.doSelectFoldergrp(response[0]), 1000)
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
    console.log(displaysUpdate);

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
    if (!item) {
      this.setState({ overlayMenuVisible: false })
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
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const { foldergrps, menus, displays, selectedFoldergrp, selectedMenu, overlayMenuVisible } = this.state;
    console.log('foldergrps', foldergrps, menus);
    const imageArray = [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqNdtXK-n6cTgV4yGng1ZwVWPXnjdFesMNxflpYCg-sq5ZTUVA&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxr371J0hm5MzBU-_bFxnhy2PkOZ7p9wtHyQwHoMpvE6Wqc6m5-w&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD-rah58B_evIlY83P2-c-mtXyceUbUu-GHvSuVxHI9xKMh5tbtw&s',
      ''
    ];

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
            <div style={styles.titleBox}>
              <div style={styles.subtitle}>{selectedFoldergrp.name}</div>
              <div style={styles.title}>{selectedFoldergrp.foldergrpId}</div>
              <div style={styles.subtitle}><Link to="/order">meat · justice · spicy</Link></div>
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
    height: window.innerHeight,
    width: '100%',
    display: 'flex',
  },
  leftContainer: {
    height: window.innerHeight,
    width: 120,
    // backgroundColor: 'yellow',
    overflow: 'scroll'
  },
  rightContainer: {
    flex: 1,
    height: window.innerHeight,
    padding: 10,
    overflow: 'scroll',
    display: 'flex',
    flexDirection: 'column',
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
  menus: {
    flex: 1,
    // backgroundColor: 'green',
    overflow: 'scroll',
  },
  menu: {
    display: 'flex',
    marginBottom: 20,
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
