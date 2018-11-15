import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import component from './component';
import { withRouter } from 'react-router-dom';

function mapStateToProps(state) {
  return {
    isFetching: state.auth.isFetchingMessage,
    error: state.auth.error,
    friends: state.user.friends,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
  }, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(component));