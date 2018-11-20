import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import component from './component'
import { push } from 'connected-react-router'
import auth from 'Reducers/auth'
import { withRouter } from 'react-router-dom'
import { requestSession, requestLogout } from 'Actions/auth'
import { requestFriendsList, requestReceiveMessages } from 'Actions/user'

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    friends: state.user.friends,
    chatroom: state.user.chatroom
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    auth,
    push,
    requestSession,
    requestFriendsList,
    requestReceiveMessages,
    requestLogout
  }, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(component))