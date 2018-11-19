import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import component from './component';

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

export default connect(mapStateToProps, mapDispatchToProps)(component);