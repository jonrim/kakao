import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Segment, Form, Input, Message } from 'semantic-ui-react';
import './auth-form.scss';

export default class AuthForm extends Component {

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
    this.props.onSubmit(this.state);
    this.setState({ password: '' });
  }

  handleChange = e => {
    this.setState({[e.target.name]: e.target.value});
  }

  render () {
    const { email, password } = this.state;
    const { title, buttonLabel, buttonStyle, error } = this.props;

    return (
      <div className="client-login">
        <div className="lower-background">
          <Form
            error={!!error}
            onSubmit={this.handleSubmit}
          >
            <Form.Field className="field">
              <Input
                transparent
                className="field-input"
                type="text"
                name="email"
                placeholder="E-mail"
                value={email}
                onChange={this.handleChange}
              />
              <div className="line"/>
            </Form.Field>

            <Form.Field className="field">
              <Input
                transparent
                className="field-input"
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={this.handleChange}
              />
              <div className="line"/>
            </Form.Field>
            <Message
              className="error-message"
              error
              content={error}
            />
            <Form.Button disabled={!email || !password}>
              {buttonLabel}
            </Form.Button>
          </Form>
        </div>
      </div>
    )
  }
}
