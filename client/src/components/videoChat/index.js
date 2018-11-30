import React, { Component } from 'react'
import { connect } from 'react-redux'
import { store } from 'Redux/configureStore'
import SimpleWebRTC from 'simplewebrtc'

import './index.scss'

var webrtc = new SimpleWebRTC({
    // the id/element dom element that will hold "our" video
    localVideoEl: 'local-videos',
    // the id/element dom element that will hold remote videos
    remoteVideosEl: 'remote-videos',
    // immediately ask for camera access
    autoRequestMedia: true
});

export default class VideoChat extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const { socket, videoChat, closeVideoChat } = this.props;
    // we have to wait until it's ready
    webrtc.on('readyToCall', function () {
      // you can name it anything
      webrtc.joinRoom(videoChat.roomId);
    });
  }

  componentWillUnmount() {
    this.props.closeVideoChat();
  }

  render(){
    return (
      <div className='video-chat'>
        <video id='local-videos'></video>
        <div id='remote-videos'></div>
      </div>
    );
  }
}
