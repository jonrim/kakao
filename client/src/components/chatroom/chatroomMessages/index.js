import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import component from './component';
import { withRouter } from 'react-router-dom'

function mapStateToProps(state) {
  return {
    isFetching: state.auth.isFetching,
    error: state.auth.error,
    friends: state.user.friends
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(component));