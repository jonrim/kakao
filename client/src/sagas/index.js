import watchAuth from './auth';
import watchUser from './user';

export default function* mainSaga() {
  yield [
    watchAuth(),
    watchUser()
  ]
}