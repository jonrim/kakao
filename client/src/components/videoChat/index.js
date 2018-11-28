import React, { Component } from 'react'
import MediaContainer from './MediaContainer'
import CommunicationContainer from './CommunicationContainer'
import { connect } from 'react-redux'
import { store } from 'Redux/configureStore'
import io from 'socket.io-client'

class VideoChat extends Component {
  constructor(props) {
    super(props);
    this.getUserMedia = navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    }).catch(e => alert('getUserMedia() error: ' + e.name))
  }
  componentDidMount() {
    this.props.addRoom();
  }
  render(){
    const { socket } = this.props;
    return (
      <div>
        <MediaContainer media={media => this.media = media} socket={this.socket} getUserMedia={this.getUserMedia} />
        <CommunicationContainer socket={this.socket} media={this.media} getUserMedia={this.getUserMedia} />
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
