import React, { Component } from 'react'

import './index.scss'

export default class Chatroom extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { chatroom } = this.props;
    console.log('rendered', chatroom)
    return (
      <div className='chatroom'>
        <p>
          {
            chatroom.name
          }
        </p>
      </div>
    )
  }
}