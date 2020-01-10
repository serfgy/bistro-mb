import React, { Component } from 'react';
// import Icon, { AntDesign, Feather } from 'react-web-vector-icons';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      load: false,
    };
  }

  componentDidMount() {

  }

  doCreateOpenorder() {
    let url = 'https://dev.epbmobile.app:8090/fnb-ws/api/create-openorder';
    const body = {
      shopId: 'X0201',
      tableId: 'A01',
      pax: 3,
      phone: '11111111',
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
        console.log('post create-openorder successful', response);
        // if(response.message){
        //   console.log('message', response);

        // }
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const { load } = this.state;
    console.log('here register');
    const imageArray = [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqNdtXK-n6cTgV4yGng1ZwVWPXnjdFesMNxflpYCg-sq5ZTUVA&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxr371J0hm5MzBU-_bFxnhy2PkOZ7p9wtHyQwHoMpvE6Wqc6m5-w&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD-rah58B_evIlY83P2-c-mtXyceUbUu-GHvSuVxHI9xKMh5tbtw&s',
      ''
    ];

    return (
      <div style={styles.container}
        onClick={() => this.doCreateOpenorder()}>
        hello this is register
      </div>
    );
  }
}

const styles = ({
  container: {
    height: window.innerHeight,
    width: '100%',
    display: 'flex',
    backgroundColor: 'red',
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

export default Register;
