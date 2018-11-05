import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { login } from 'Modules/auth';
import component from './component';

const mapStateToProps = (state) => {
  return {
    error: state.auth.error
  };
};

export const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    login,
    push
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(component);