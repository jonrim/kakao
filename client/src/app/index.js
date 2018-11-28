import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import component from './component'
import { withRouter } from 'react-router-dom'
import { requestSession, requestLogout } from 'Actions/auth'
import { push } from 'connected-react-router'

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
    isFetchingFriendList: state.user.isFetchingFriendList,
    chatroom: state.user.chatroom,
    profile: state.user.profile,
    pendingFriendRequests: state.user.pendingFriendRequests || [],
    errorManageFriendRequest: state.user.errorManageFriendRequest
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    push,
    requestSession,
    requestFriendsList,
    requestReceiveMessages,
    requestPendingFriendRequests,
    requestLogout,
    requestManageFriendRequest,
  }, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(component))