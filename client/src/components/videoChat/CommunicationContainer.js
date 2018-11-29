import React from 'react'
import { PropTypes } from 'prop-types'
import Remarkable from 'remarkable'
import MediaContainer from './MediaContainer'
import Communication from './Communication'
import { store } from 'Redux/configureStore'
import { connect } from 'react-redux'
class CommunicationContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sid: '',
      message: '',
      audio: true,
      video: true
    };
    this.handleHangup = this.handleHangup.bind(this);
    this.toggleVideo = this.toggleVideo.bind(this);
    this.toggleAudio = this.toggleAudio.bind(this);
  }
  hideAuth() {
    this.props.media.setState({bridge: 'connecting'});
  } 
  full() {
    this.props.media.setState({bridge: 'full'});
  }
  componentDidMount() {
    const socket = this.props.socket;
    console.log('props', this.props)
    this.setState({video: this.props.video, audio: this.props.audio});

    socket.on('create', () => {
      this.props.media.setState({user: 'host', bridge: 'create'});
      console.log('socket create')
    });
    socket.on('full', this.full);
    socket.on('bridge', role => {
      console.log('socket bridge')
      this.props.media.init();
    });
    socket.on('join', () => {
      this.props.media.setState({user: 'guest', bridge: 'join'});
      console.log('socket join')
      socket.emit('auth', this.state);
    });
    socket.on('approve', ({ message, sid }) => {
      this.props.media.setState({bridge: 'approve'});
      this.setState({ message, sid });
      console.log('socket approve')
      socket.emit('accept', this.state.sid);
      this.hideAuth();
    });
    socket.emit('find');
    this.props.getUserMedia
      .then(stream => {
        console.log(stream)
          this.localStream = stream;
          this.localStream.getVideoTracks()[0].enabled = this.state.video;
          this.localStream.getAudioTracks()[0].enabled = this.state.audio;
        });
  }
  getContent(content) {
    return {__html: (new Remarkable()).render(content)};
  }
  toggleVideo() {
    const video = this.localStream.getVideoTracks()[0].enabled = !this.state.video;
    this.setState({video: video});
    this.props.setVideo(video);
  }
  toggleAudio() {
    const audio = this.localStream.getAudioTracks()[0].enabled = !this.state.audio;
    this.setState({audio: audio});
    this.props.setAudio(audio);
  }
  handleHangup() {
    this.props.media.hangup();
  }
  render(){
    return (
      <Communication
        {...this.state}
        toggleVideo={this.toggleVideo}
        toggleAudio={this.toggleAudio}
        getContent={this.getContent}
        handleHangup={this.handleHangup}
      />
    );
  }
}
const mapStateToProps = store => ({video: store.video, audio: store.audio});
const mapDispatchToProps = dispatch => (
  {
    setVideo: boo => store.dispatch({type: 'SET_VIDEO', video: boo}),
    setAudio: boo => store.dispatch({type: 'SET_AUDIO', audio: boo})
  }
);

CommunicationContainer.propTypes = {
  socket: PropTypes.object.isRequired,
  getUserMedia: PropTypes.object.isRequired,
  audio: PropTypes.bool.isRequired,
  video: PropTypes.bool.isRequired,
  setVideo: PropTypes.func.isRequired,
  setAudio: PropTypes.func.isRequired,
  media: PropTypes.instanceOf(MediaContainer)
};
export default connect(mapStateToProps, mapDispatchToProps)(CommunicationContainer);