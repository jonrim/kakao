import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import component from './component';
import { viewUserProfile } from 'Actions/user';

function mapStateToProps(state) {
  return {
    isFetching: state.auth.isFetchingMessage,
    error: state.auth.errorMessage,
    friends: state.user.friends,
    chatHistory: state.user.chatHistory || [],
    chatroom: state.user.chatroom
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    viewUserProfile
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(component);