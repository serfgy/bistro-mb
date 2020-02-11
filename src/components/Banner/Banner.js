import React, { Component } from 'react';
import constants from '../constants/constants';
import { AntDesign } from 'react-web-vector-icons';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

class Banner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
    };
  }

  componentDidMount() {
    this.targetElement = document.querySelector('#targetElement');
    disableBodyScroll(this.targetElement);
  }

  componentWillUnmount() {
    enableBodyScroll(this.targetElement);
  }

  render() {
    const { content } = this.props;
    console.log('render banner');

    return (
      <div style={styles.overlay} id='targetElement'>
        <div style={styles.overlayContent}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <AntDesign name='warning' size={32} color={constants.paid} />
            <div style={{ fontFamily: 'varela-round', textTransform: 'uppercase', margin: '10px 20px 0px 20px', textAlign: 'center' }}>{content}</div>
          </div>
          <div style={styles.button} className='bg-grey'
            onClick={() => this.props.handleUpdateFromBanner()}>
            OK
          </div>
        </div>
      </div >
    );
  }
}

const styles = ({
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.9)',
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
    minHeight: 200,
    width: '80%',
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    border: '5px solid rgba(66,69,73,0.1)',
    // borderTopLeftRadius: 20,
    // borderBottomRightRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    // backgroundColor: 'rgba(0,0,0,0.1)',
    width: '100%',
    height: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'varela-round',
    letterSpacing: 2,
    color: 'white',
  }
});

export default Banner;
