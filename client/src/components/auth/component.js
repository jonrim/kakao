import React, { Component } from 'react';
import AuthForm from './auth-form';

export default class Auth extends Component {
  handleLogin = credentials => {
    const {login, push} = this.props;
    login(credentials)
    .then(result => {
      console.log(result)
      // push('/friends');
    });
  }

  render () {
    return (
      <AuthForm
        buttonLabel="LOG IN"
        onSubmit={this.handleLogin}
        error={this.props.error}
      />
    );
  }
}