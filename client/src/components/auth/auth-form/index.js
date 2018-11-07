import { connect } from 'react-redux';
import component from './component';
import { requestLogin } from 'Actions/auth';

function mapStateToProps(state) {
  return {
    isFetching: state.auth.login.isFetching,
    error: state.auth.login.error
  };
}

function mapDispatchToProps(dispatch) {
  return {
    requestLogin: loginInfo => dispatch(requestLogin(loginInfo))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(component);