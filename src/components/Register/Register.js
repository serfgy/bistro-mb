import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Fingerprint2 from 'fingerprintjs2';
import constants from '../constants/constants';
import logo from '../images/logo1.png';
import splash from '../images/splash.jpg';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: props.language,
      fingerprint: '',
      ready: false,
      toMenu: false,
      toMenuKey: '',
      tableId: props.match.params.tableId,
      pax: 2,
      name: '',
      masters: '',
      openorderInfo: '',
    };
  }

  componentDidMount() {
    this.doFingerprint();
  }

  async doFingerprint() {
    const components = await Fingerprint2.getPromise();
    const values = components.map(component => component.value);
    const murmur = Fingerprint2.x64hash128(values.join(''), 31);
    console.log('fingerprint', murmur);
    this.setState({
      fingerprint: murmur,
    })
    this.doVerifyOpenorder(murmur);
  }

  doVerifyOpenorder(fingerprint) {
    const { tableId } = this.state;

    let promiseArray = [];

    let url = 'https://epbrowser.com:8090/fnb-ws/api/foldergrps?orgId=X02';
    let promiseObject = { url: url, nameString: 'foldergrps' };
    promiseArray.push(promiseObject);

    url = 'https://epbrowser.com:8090/fnb-ws/api/folders?orgId=X02&shopId=X0201'
    promiseObject = { url: url, nameString: 'folders' };
    promiseArray.push(promiseObject);

    url = 'https://epbrowser.com:8090/fnb-ws/api/menus?orgId=X02';
    promiseObject = { url: url, nameString: 'menus' };
    promiseArray.push(promiseObject);

    url = 'https://epbrowser.com:8090/fnb-ws/api/mods?orgId=X02'
    promiseObject = { url: url, nameString: 'mods' };
    promiseArray.push(promiseObject);

    url = 'https://epbrowser.com:8090/fnb-ws/api/mod-bundles'
    promiseObject = { url: url, nameString: 'modBundles' };
    promiseArray.push(promiseObject);

    url = 'https://epbrowser.com:8090/fnb-ws/api/combo-items?orgId=X02'
    promiseObject = { url: url, nameString: 'comboItems' };
    promiseArray.push(promiseObject);

    url = 'https://epbrowser.com:8090/fnb-ws/api/combo-groups?orgId=X02'
    promiseObject = { url: url, nameString: 'comboGroups' };
    promiseArray.push(promiseObject);

    Promise.all([
      ...promiseArray.map(el =>
        fetch(el.url)
          .then(response => response.json())
          .then(response => {
            console.log('fetching', el.nameString, response);
            return ({ [el.nameString]: response });
          })
      )
    ]).then(response => {
      const masters = response.reduce((o, item) => ({ ...o, [Object.keys(item)[0]]: Object.values(item)[0] }), {});
      console.log('masters', masters);
      this.setState({
        masters: masters,
      });
    }).then(response => {
      let url = 'https://epbrowser.com:8090/fnb-ws/api/verify-openorder';
      const body = {
        shopId: 'X0201',
        fingerprint: fingerprint,
        orderType: tableId === 'null' ? 'B' : 'A',
        tableId: tableId === 'null' ? '' : tableId,
      };
      return fetch(url, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(body),
      })
        .then(response => response.json())
        .then(response => {
          console.log('post verify-openorder successful', response);
          if (response.redirect === 'Y') {
            // redirect to menu
            this.setState({
              toMenuKey: response.openorder.recKey,
              toMenu: true,
            })
          } else {
            // ready in register
            this.setState({
              ready: true,
              openorderInfo: response,
            })
          }
        })
        .catch(error => {
          console.log(error);
        });
    });
  }

  doUpdateOpenorder() {
    const { fingerprint, tableId, pax, name } = this.state;
    let url = 'https://epbrowser.com:8090/fnb-ws/api/update-openorder';
    const body = {
      shopId: 'X0201',
      tableId: tableId,
      pax: pax,
      vipName: name,
      phone: '',
      fingerprint: fingerprint,
    };
    console.log('body', body);
    fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(body),
    })
      .then(response => response.json())
      .then(response => {
        console.log('post update-openorder successful', response);
        if (response.message) {
          return;
        }
        this.setState({
          toMenuKey: response.openorder.recKey,
          toMenu: true,
        })
      })
      .catch(error => {
        console.log(error);
      });
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

  doCalculateTotalItems() {
    const { openorderInfo } = this.state;
    return openorderInfo.openorderItems.filter(el => !el.refRecKey).reduce((a, b) => a + b.orderQty, 0);
  }

  render() {
    const { fingerprint, ready, pax, name, toMenu, toMenuKey, masters, openorderInfo, language } = this.state;
    console.log('render register');

    if (toMenu) {
      return <Redirect to={{
        pathname: '/menu/' + toMenuKey,
        state: {
          language: language,
          masters: masters,
        }
      }} />
    }

    if (ready) {
      return (
        <div style={styles.container}>
          <img alt='' style={styles.splashImage} src={splash} />
          <div style={styles.headerContainer}>
            <div style={styles.headerAbsolute}>
              <img alt='' style={styles.logoImage} src={logo} />
            </div>
            <div style={styles.headerAbsolute2} onClick={() => this.doToggleLanguage()}>
              <div style={styles.headerFirst}>{language === 'en' ? 'EN' : 'ZH'}</div>
              <div style={styles.headerSecond}>{language === 'en' ? '英' : '中'}</div>
            </div>
            <div style={styles.headerReverse}
              onClick={() => this.doToOrder()}>
              <div style={styles.headerFirst}>{openorderInfo.openorder.vipName || 'GUEST'}</div>
              <div style={styles.headerSecond}>${openorderInfo.openorder.grandTotal.toFixed(2)}</div>
            </div>
            {
              openorderInfo.openorder.tableId &&
              <div style={styles.header} className='bg-dark'
                onClick={() => this.doToOrder()}>
                <div style={styles.headerFirst}>{language === 'en' ? 'TABLE' : '桌号'}</div>
                <div style={styles.headerSecond}>{openorderInfo.openorder.tableId.split('-')[0]}</div>
              </div>
            }
            <div style={styles.header} className='bg-brand'>
              <div style={styles.headerFirst}>{language === 'en' ? 'ITEMS' : '项目'}</div>
              <div style={styles.headerSecond}>{this.doCalculateTotalItems()}</div>
              <div style={styles.alertCircle} className={`${(openorderInfo.openorderItems.length > 0 && openorderInfo.openorderItems.find(el => el.confirmFlg === 'N')) ? 'bg-paid' : 'bg-none'}`}></div>
            </div>
          </div>
          <div style={styles.bodyContainer}>
            {/* <div>{fingerprint}</div> */}
            <div style={styles.inputTitle}>{language === 'en' ? 'ENTER NAME' : '输入姓名'}</div>
            <input style={styles.nameInputText} type='text' spellCheck='false'
              value={name}
              placeholder='Guest'
              onChange={e => this.setState({ name: e.target.value })}
              onFocus={e => e.target.select()} />

            <div style={styles.inputTitle}>{language === 'en' ? 'SELECT PAX' : '选择人数'}</div>
            <div style={styles.paxInputText}>{pax}</div>
            <div style={styles.paxButtons}>
              <div style={styles.paxButton} className={`${pax === 1 ? 'bg-brand text-light' : 'bg-light text-dark'}`} onClick={() => this.setState({ pax: 1 })}>1</div>
              <div style={styles.paxButton} className={`${pax === 2 ? 'bg-brand text-light' : 'bg-light text-dark'}`} onClick={() => this.setState({ pax: 2 })}>2</div>
              <div style={styles.paxButton} className={`${pax === 3 ? 'bg-brand text-light' : 'bg-light text-dark'}`} onClick={() => this.setState({ pax: 3 })}>3</div>
              <div style={styles.paxButton} className={`${pax === 4 ? 'bg-brand text-light' : 'bg-light text-dark'}`} onClick={() => this.setState({ pax: 4 })}>4</div>
            </div>
            <div style={styles.paxButtons}>
              <div style={styles.paxButton} className={`${pax === 5 ? 'bg-brand text-light' : 'bg-light text-dark'}`} onClick={() => this.setState({ pax: 5 })}>5</div>
              <div style={styles.paxButton} className={`${pax === 6 ? 'bg-brand text-light' : 'bg-light text-dark'}`} onClick={() => this.setState({ pax: 6 })}>6</div>
              <div style={styles.paxButton} className={`${pax === 7 ? 'bg-brand text-light' : 'bg-light text-dark'}`} onClick={() => this.setState({ pax: 7 })}>7</div>
              <div style={styles.paxButton} className={`${pax === 8 ? 'bg-brand text-light' : 'bg-light text-dark'}`} onClick={() => this.setState({ pax: 8 })}>8</div>
            </div>
          </div>

          <div style={styles.button}
            onClick={() => this.doUpdateOpenorder()}>
            {language === 'en' ? 'START' : '开始'}
          </div>
        </div >
      );
    }

    return null;
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
    flexDirection: 'column',
    backgroundColor: 'rgba(0,0,0,0.4)',
    overflow: 'hidden',
  },
  splashImage: {
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
    overflow: 'hidden',
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
  bodyContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: constants.brand,
    margin: '10px 10px 20px 10px',
    height: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'varela-round',
    letterSpacing: 2,
    color: 'white',
  },
  inputTitle: {
    // marginTop: 20,
    marginRight: 40,
    textAlign: 'right',
    fontSize: 16,
    letterSpacing: 2,
    fontFamily: 'nunito-regular',
    color: 'white',
    // backgroundColor: constants.paid,
  },
  nameInputText: {
    marginRight: 40,
    textAlign: 'right',
    marginBottom: 20,
    fontFamily: 'nunitosans-semibold',
    fontSize: 48,
    color: 'white',
  },
  paxInputText: {
    marginRight: 40,
    textAlign: 'right',
    marginBottom: 20,
    fontFamily: 'nunitosans-semibold',
    fontSize: 48,
    color: 'white',
  },
  paxButtons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: 40,
  },
  paxButton: {
    height: 36,
    width: 36,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    fontFamily: 'varela-round',
  },
});

export default Register;
