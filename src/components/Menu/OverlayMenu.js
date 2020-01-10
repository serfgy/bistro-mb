import React, { Component } from 'react';
import constants from '../constants/constants';
// import Icon, { AntDesign, Feather } from 'react-web-vector-icons';

class OverlayMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalInputValueQty: 1,
    };
  }

  componentDidMount() {
  }

  render() {
    const { selectedMenu } = this.props;
    const imageArray = [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqNdtXK-n6cTgV4yGng1ZwVWPXnjdFesMNxflpYCg-sq5ZTUVA&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxr371J0hm5MzBU-_bFxnhy2PkOZ7p9wtHyQwHoMpvE6Wqc6m5-w&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD-rah58B_evIlY83P2-c-mtXyceUbUu-GHvSuVxHI9xKMh5tbtw&s',
      ''
    ];

    return (
      <div style={styles.overlay}
        onClick={() => this.props.handleUpdateFromOverlayMenu()}>
        <div style={styles.overlayContent}
          onClick={() => this.props.handleUpdateFromOverlayMenu(1)}>
          <div style={styles.imageContainer}>
            <img style={styles.image} src={'https://dev.epbmobile.app:8090/gateway/epbm/api/image/stock?stkId=' + selectedMenu.stkId} />
          </div>
        </div>
      </div>
    );
  }
}

const styles = ({
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    position: 'absolute',
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
    width: 250,
    height: 400,
    backgroundColor: constants.grey2,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  imageContainer: {
    width: 250,
    height: 250,
    position: 'relative',
    zIndex: 1,
    overflow: 'hidden',
    borderBottomLeftRadius: '80px/2px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
});

export default OverlayMenu;
