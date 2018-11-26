import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import component from './component'
import { changeChatroom, requestChangeInfo, viewUserProfile } from 'Actions/user'

const mapStateToProps = (state) => {
  return {
    user: state.auth.user || {},
    friends: state.user.friends || [],
    profile: state.user.profile,
    chatroom: state.user.chatroom,
  }
}

export const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    viewUserProfile,
    requestChangeInfo,
    changeChatroom,
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(component)