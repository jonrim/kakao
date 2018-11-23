import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import component from './component'
import { withRouter } from 'react-router-dom'
import { requestSession, requestLogout } from 'Actions/auth'
import { 
  requestFriendsList,
  requestReceiveMessages,
  requestPendingFriendRequests,
  requestManageFriendRequest
} from 'Actions/user'

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    friends: state.user.friends || [],
    chatroom: state.user.chatroom,
    pendingFriendRequests: state.user.pendingFriendRequests || [],
    errorManageFriendRequest: state.user.errorManageFriendRequest
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    requestSession,
    requestFriendsList,
    requestReceiveMessages,
    requestPendingFriendRequests,
    requestLogout,
    requestManageFriendRequest,
  }, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(component))