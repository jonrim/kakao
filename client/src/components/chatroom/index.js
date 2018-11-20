import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import auth from 'Reducers/auth';
import component from './component';
import { requestLogin } from 'Actions/auth';
import { requestSendMessage, requestReadMessages, changeChatroom } from 'Actions/user';

function mapStateToProps(state) {
  return {
    isFetching: state.auth.isFetchingMessage,
    error: state.auth.error,
    user: state.auth.user,
    friends: state.user.friends,
    chatHistory: state.user.chatHistory || [],
    chatroom: state.user.chatroom
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    push,
    requestSendMessage,
    requestReadMessages,
    changeChatroom
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(component);