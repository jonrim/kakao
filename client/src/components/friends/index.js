import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import auth from 'Modules/auth';
import component from './component';

import './index.scss';

const mapStateToProps = (state) => {
  return {
    myProfile: [state.auth.user]
  };
};

export const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    auth,
    push
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(component);