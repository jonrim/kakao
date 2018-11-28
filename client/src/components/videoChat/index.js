import React, { Component } from 'react'
import MediaContainer from './MediaContainer'
import CommunicationContainer from './CommunicationContainer'
import { connect } from 'react-redux'
import { store } from 'Redux/configureStore'
import io from 'socket.io-client'

import './index.scss'

class VideoChat extends Component {
  constructor(props) {
    super(props);
    this.getUserMedia = navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    }).catch(e => console.log(e))
    console.log(this.getUserMedia)
  }
  componentDidMount() {
    this.props.addRoom();
  }
  render(){
    const { socket, videoChat, closeVideoChat } = this.props;
    return (
      <div>
        <MediaContainer media={media => this.media = media} socket={socket} getUserMedia={this.getUserMedia} />
        <CommunicationContainer socket={socket} media={this.media} getUserMedia={this.getUserMedia} />
      </div>
    );
  }
}

const mapStateToProps = state => ({rooms: new Set([...state.rooms])});
const mapDispatchToProps = (dispatch, ownProps) => (
  {
    addRoom: () => store.dispatch({ type: 'ADD_ROOM', room: ownProps.match.params.room })
  }
);
export default connect(mapStateToProps, mapDispatchToProps)(VideoChat);
