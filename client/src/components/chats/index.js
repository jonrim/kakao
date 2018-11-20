import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'connected-react-router'
import auth from 'Reducers/auth'
import component from './component'
import { changeChatroom } from 'Actions/user'

import './index.scss'

const mapStateToProps = (state) => {
  return {
    myProfile: [state.auth.user || {}],
    friends: state.user.friends || [],
    isFetching: state.user.isFetchingFriendList,
    chatroom: state.user.chatroom
  }
}

export const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    auth,
    push,
    changeChatroom
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(component)