import L from 'react-loadable';
import Spinner from 'react-loader-spinner';

const Loadable = opts =>
  L({
    loading: Spinner,
    ...opts
  });

export default Loadable;