import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import component from './component';
import { push } from 'connected-react-router';
import auth from 'Reducers/auth';
import { withRouter } from 'react-router-dom'
import { requestSession } from 'Actions/auth';
import { requestFriendsList, requestReceiveMessages } from 'Actions/user';

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    chatroom: null
  };
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    auth,
    push,
    requestSession,
    requestFriendsList,
    requestReceiveMessages
  }, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(component));