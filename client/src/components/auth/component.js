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
      password: ''
    };
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.requestLogin(this.state)
  }

  handleChange = e => {
    this.setState({[e.target.name]: e.target.value});
  }

  render () {
    const { email, password } = this.state;
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
              <Form.Field className='field'>
                <Input
                  transparent
                  className='field-input'
                  type='text'
                  name='email'
                  placeholder='E-mail'
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
                <span>{buttonLabel}</span>
              }
            </Form.Button>
          </Form>
        </div>
      </div>
    )
  }
}
