import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import component from './component'
import { changeChatroom, requestChangeInfo } from 'Actions/user'

const mapStateToProps = (state) => {
  return {
    user: state.auth.user || {},
    friends: state.user.friends || [],
    isFetching: state.user.isFetchingFriendList
  }
}

export const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    changeChatroom,
    requestChangeInfo,
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(component)