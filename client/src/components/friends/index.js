import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import component from './component'
import { changeChatroom } from 'Actions/user'

const mapStateToProps = (state) => {
  return {
    myProfile: [state.auth.user || {}],
    friends: state.user.friends || [],
    isFetching: state.user.isFetchingFriendList
  }
}

export const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    changeChatroom
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(component)