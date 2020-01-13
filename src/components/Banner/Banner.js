import React, { Component } from 'react';
import constants from '../constants/constants';
import { AntDesign } from 'react-web-vector-icons';

class Banner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
    };
  }

  componentDidMount() {
    setTimeout(() => this.setState({ ready: true }), 10)
    setTimeout(() => this.setState({ ready: false }, this.props.handleUpdateFromBanner()), 2000)
  }

  render() {
    const { content } = this.props;
    const { ready } = this.state;
    console.log('render banner');

    return (
      <div style={styles.container} className={`opacity-transition ${ready && 'opacity-1'}`}
        onClick={() => this.props.handleUpdateFromBanner()}>
        <AntDesign name='exclamationcircle' size={32} color={'black'} style={{ opacity: 0.7 }} />
        <div>{content}</div>
      </div >
    );
  }
}

const styles = ({
  container: {
    position: 'absolute',
    zIndex: 3,
    left: 20,
    right: 20,
    bottom: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: constants.paid6,
    // borderRadius: 10,
    padding: 10,
  },
});

export default Banner;
