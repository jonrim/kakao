import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import component from './component';
import { push } from 'connected-react-router';
import auth from 'Modules/auth';
import { withRouter } from 'react-router-dom'
import { requestSession } from 'Actions/auth';

const mapStateToProps = (state) => {
  return {
    user: state.auth.user
  };
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    auth,
    push,
    requestSession
  }, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(component));