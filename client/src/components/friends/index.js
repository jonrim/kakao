import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import auth from 'Reducers/auth';
import component from './component';
import { withRouter } from 'react-router-dom'

import './index.scss';

const mapStateToProps = (state) => {
  return {
    myProfile: [state.auth.user || {}],
    friends: state.user.friends || [],
    isFetching: state.user.isFetching
  };
};

export const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    auth,
    push
  }, dispatch);
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(component));