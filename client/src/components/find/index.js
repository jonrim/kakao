import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import component from './component'
import { requestFindUser, requestFriendRequest } from 'Actions/user'

const mapStateToProps = (state) => {
  return {
    isFetching: state.user.isFetchingUser,
    foundUser: state.user.foundUser,
    errorFindingUser: state.user.errorFindingUser,
    errorFriendRequest: state.user.errorFriendRequest,
    friends: state.user.friends,
    user: state.auth.user
  }
}

export const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    requestFindUser,
    requestFriendRequest
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(component)