import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Segment, Form, Input, Message } from 'semantic-ui-react';
import Spinner from 'react-loader-spinner';

import './index.scss';

export default class Auth extends Component {

  static propTypes = {
    title: PropTypes.string,
    buttonLabel: PropTypes.string,
    buttonStyle: PropTypes.string,
    onSubmit: PropTypes.func,
    error: PropTypes.string
  }

  static defaultProps = {
    title: '',
    buttonStyle: 'default',
    buttonLabel: 'Submit'
  }

  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      name: '',
      phone: '',
      signUp: false
    };
  }

  handleSubmit = e => {
    e.preventDefault()
    if (this.state.signUp) this.props.requestSignup(this.state);
    else this.props.requestLogin(this.state);
  }

  handleChange = e => {
    this.setState({[e.target.name]: e.target.value});
  }

  toggleFormType = () => {
    this.setState({signUp: !this.state.signUp});
  }

  render () {
    const { name, email, password, phone, signUp } = this.state;
    const { title, buttonLabel, buttonStyle, isFetching, error } = this.props;

    return (
      <div className='login'>
        <div className='login-form-wrapper'>
          <img className='login-logo' src={
            `https://res.cloudinary.com/fresh-aire-mechanical-co/image/upload/c_scale,w_332/v1541415680/KakaoTalk_logo_Kakao_Talk_rtqtbc.png`
          }/>
          <Form
            error={!!error}
            onSubmit={this.handleSubmit}
          >
            <div className='fields-wrapper'>
              {
                signUp &&
                <Form.Field className='field'>
                  <Input
                    transparent
                    className='field-input'
                    type='text'
                    name='name'
                    placeholder='Name'
                    value={name}
                    onChange={this.handleChange}
                  />
                </Form.Field>
              }
              <Form.Field className='field'>
                <Input
                  transparent
                  className='field-input'
                  type='text'
                  name='email'
                  placeholder='Email'
                  value={email}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field className='field'>
                <Input
                  transparent
                  className='field-input'
                  type='password'
                  name='password'
                  placeholder='Password'
                  value={password}
                  onChange={this.handleChange}
                />
              </Form.Field>
              {
                signUp &&
                <Form.Field className='field'>
                  <Input
                    transparent
                    className='field-input'
                    type='tel'
                    name='phone'
                    placeholder='Phone Number'
                    value={phone}
                    onChange={this.handleChange}
                  />
                </Form.Field>
              }
            </div>
            <Message
              className='error-message'
              error
              content={error !== 'You are not logged in.' ? error : null}
            />
            <Form.Button disabled={!email || !password}>
              { 
                isFetching ?
                <Spinner type='ThreeDots' color='#fff' height={30} width={30}/> :
                <span>{signUp ? 'Sign Up' : 'Log In'}</span>
              }
            </Form.Button>
            <span className='login-signup-toggle' onClick={this.toggleFormType}>
              {signUp ? 'Log In' : 'Sign Up'}
            </span>
          </Form>
        </div>
      </div>
    )
  }
}
