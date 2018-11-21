import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import component from './component';
import { requestLogin, requestSignup } from 'Actions/auth';

function mapStateToProps(state) {
  return {
    isFetching: state.auth.isFetching,
    error: state.auth.error,
    user: state.auth.user
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    requestLogin,
    requestSignup
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(component);