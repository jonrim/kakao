import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import component from './component';
import { requestLogin } from 'Actions/auth';
import { requestSendMessage, requestReadMessages, changeChatroom, viewUserProfile } from 'Actions/user';

function mapStateToProps(state) {
  return {
    isFetching: state.auth.isFetchingMessage,
    error: state.auth.errorMessage,
    user: state.auth.user,
    friends: state.user.friends,
    chatHistory: state.user.chatHistory || [],
    chatroom: state.user.chatroom
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    requestSendMessage,
    requestReadMessages,
    viewUserProfile,
    changeChatroom
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(component);