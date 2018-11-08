import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import auth from 'Modules/auth';
import component from './component';
import { requestLogin } from 'Actions/auth';
import { withRouter } from 'react-router-dom'

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
    requestLogin
  }, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(component));