import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Fingerprint2 from 'fingerprintjs2';
import constants from '../constants/constants';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fingerprint: '',
      ready: false,
      toMenu: false,
      toMenuKey: '',
      tableId: props.match.params.tableId,
      pax: 2,
      name: '',
      masters: '',
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

    let url = 'https://dev.epbmobile.app:8090/fnb-ws/api/foldergrps?orgId=X02';
    let promiseObject = { url: url, nameString: 'foldergrps' };
    promiseArray.push(promiseObject);

    url = 'https://dev.epbmobile.app:8090/fnb-ws/api/folders?orgId=X02&shopId=X0201'
    promiseObject = { url: url, nameString: 'folders' };
    promiseArray.push(promiseObject);

    url = 'https://dev.epbmobile.app:8090/fnb-ws/api/menus?orgId=X02';
    promiseObject = { url: url, nameString: 'menus' };
    promiseArray.push(promiseObject);

    url = 'https://dev.epbmobile.app:8090/fnb-ws/api/mods?orgId=X02'
    promiseObject = { url: url, nameString: 'mods' };
    promiseArray.push(promiseObject);

    url = 'https://dev.epbmobile.app:8090/fnb-ws/api/mod-bundles'
    promiseObject = { url: url, nameString: 'modBundles' };
    promiseArray.push(promiseObject);

    url = 'https://dev.epbmobile.app:8090/fnb-ws/api/combo-items?orgId=X02'
    promiseObject = { url: url, nameString: 'comboItems' };
    promiseArray.push(promiseObject);

    url = 'https://dev.epbmobile.app:8090/fnb-ws/api/combo-groups?orgId=X02'
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
      let url = 'https://dev.epbmobile.app:8090/fnb-ws/api/verify-openorder';
      const body = {
        shopId: 'X0201',
        fingerprint: fingerprint,
        orderType: tableId === 'null' ? 'B' : 'A',
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
          if (tableId === 'null') {
            // queue qr code
            this.setState({
              toMenuKey: response.openorder.recKey,
              toMenu: true,
            })
          } else {
            // table qr code
            if (response.openorder && response.openorder.tableId && tableId === response.openorder.tableId) {
              this.setState({
                toMenuKey: response.openorder.recKey,
                toMenu: true,
              })
            } else {
              this.setState({
                ready: true,
              })
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    });
  }

  doUpdateOpenorder() {
    const { fingerprint, tableId, pax, name } = this.state;
    let url = 'https://dev.epbmobile.app:8090/fnb-ws/api/update-openorder';
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

  render() {
    const { fingerprint, ready, pax, name, toMenu, toMenuKey, masters } = this.state;
    console.log('render register');

    if (toMenu) {
      return <Redirect to={{
        pathname: '/menu/' + toMenuKey,
        state: {
          masters: masters,
        }
      }} />
    }

    if (ready) {
      return (
        <div style={styles.container}>
          <div style={styles.headerContainer}>
            <div style={styles.header}>
              <div style={styles.headerFirst}>TABLE</div>
              <div style={styles.headerSecond}>{this.props.match.params.tableId}</div>
            </div>
            <div style={styles.header}>
              <div style={styles.headerFirst}>ITEMS</div>
              <div style={styles.headerSecond}>-</div>
            </div>
            <div style={styles.header}>
              <div style={styles.headerFirst}>TOTAL</div>
              <div style={styles.headerSecond}>$-</div>
            </div>
          </div>

          <div style={styles.bodyContainer}>
            {/* <div style={styles.title}>Hi,</div> */}
            <div>{fingerprint}</div>
            <div style={styles.inputTitle}>ENTER NAME</div>
            <input style={styles.nameInputText} type='text' spellCheck='false'
              value={name}
              placeholder='Guest'
              onChange={e => this.setState({ name: e.target.value })}
              onFocus={e => e.target.select()} />

            <div style={styles.inputTitle}>SELECT PAX</div>
            <div style={styles.paxInputText}>{pax}</div>

            <div style={styles.paxButtons}>
              <div style={styles.paxButton} className={`${pax === 1 && 'bg-dark text-light'}`} onClick={() => this.setState({ pax: 1 })}>1</div>
              <div style={styles.paxButton} className={`${pax === 2 && 'bg-dark text-light'}`} onClick={() => this.setState({ pax: 2 })}>2</div>
              <div style={styles.paxButton} className={`${pax === 3 && 'bg-dark text-light'}`} onClick={() => this.setState({ pax: 3 })}>3</div>
              <div style={styles.paxButton} className={`${pax === 4 && 'bg-dark text-light'}`} onClick={() => this.setState({ pax: 4 })}>4</div>
            </div>
            <div style={styles.paxButtons}>
              <div style={styles.paxButton} className={`${pax === 5 && 'bg-dark text-light'}`} onClick={() => this.setState({ pax: 5 })}>5</div>
              <div style={styles.paxButton} className={`${pax === 6 && 'bg-dark text-light'}`} onClick={() => this.setState({ pax: 6 })}>6</div>
              <div style={styles.paxButton} className={`${pax === 7 && 'bg-dark text-light'}`} onClick={() => this.setState({ pax: 7 })}>7</div>
              <div style={styles.paxButton} className={`${pax === 8 && 'bg-dark text-light'}`} onClick={() => this.setState({ pax: 8 })}>8</div>
            </div>
          </div>

          <div style={styles.button}
            onClick={() => this.doUpdateOpenorder()}>
            START
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
  bodyContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: constants.grey1,
    margin: 20,
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'varela-round',
    letterSpacing: 2,
    color: 'white',
  },
  title: {
    margin: '0px 0px 0px 60px',
    fontFamily: 'nunitosans-bold',
    fontSize: 48,
  },
  inputTitle: {
    // marginTop: 20,
    textAlign: 'center',
    fontSize: 12,
    letterSpacing: 2,
    fontFamily: 'nunito-semibold',
    // backgroundColor: constants.paid,
  },
  nameInputText: {
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'nunitosans-semibold',
    fontSize: 54,
  },
  paxInputText: {
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'nunitosans-semibold',
    fontSize: 48,
    // backgroundColor: constants.reserved,
  },
  paxButtons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paxButton: {
    height: 80,
    width: 80,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    borderRadius: 5,
    fontFamily: 'varela-round',
  },
});

export default Register;
