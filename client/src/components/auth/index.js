import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import auth from 'Reducers/auth';
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
    push,
    requestLogin,
    requestSignup
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(component);