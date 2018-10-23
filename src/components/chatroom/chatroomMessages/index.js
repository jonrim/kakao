import React, { Component } from 'react'

import './index.scss'

export default class ChatroomMessages extends Component {
  constructor(props) {
    super(props);

    this.displayTimeForThisMessage = this.displayTimeForThisMessage.bind(this);
  }

  displayTimeForThisMessage(i) {
    const { chatHistory } = this.props;
    return (i + 1 === chatHistory.length || i + 1 < chatHistory.length &&
          (chatHistory[i].date.diff(chatHistory[i + 1].date, 'minutes') ||
          chatHistory[i].friend !== chatHistory[i + 1].friend));
  }

  componentDidMount() {
    // let messages = document.getElementsByClassName('message');
    //   let lastMessage = messages[messages.length - 1];
    //   lastMessage.scrollIntoView({
    //     behavior: 'instant',
    //     inline: 'end'
    //   })
    let chatMessagesDiv = document.getElementsByClassName('chatroom-messages')[0];
    chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
    // setTimeout(() => {
      
    // }, 2000)
  }

  componentDidUpdate(prevProps) {
    // if you change to a different friend's chatroom, scroll back to bottom
    if (prevProps.chatroom.id !== this.props.chatroom.id) {
      let chatMessagesDiv = document.getElementsByClassName('chatroom-messages')[0];
      chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
    }

  }

  render() {
    const { chatHistory, chatroom } = this.props;
    const { displayTimeForThisMessage } = this;
    return (
      <div className='chatroom-messages'>
        {
          chatHistory.map((message, i) => (
            <div 
              className={(message.friend ? 'her-message' : 'my-message') + ' message'} 
              key={'message' + i}
              style={{
                /*
                  separate (more) texts with different time stamps
                */
                marginBottom: displayTimeForThisMessage(i) ? '8px' : '0'
              }}
            >
              {
                message.firstMessageOfDay && (
                  <p className='date' style={{margin: '15px 0'}}>
                    {
                      message.date.format('dddd, MMMM D, YYYY')
                    }
                  </p>
                )
              }
              {/*
                flex container used for its child (right sibling) to extend its width to the remaining width of
                the container. this is so the actual text bubble can utilize most of the width. e.g. short
                texts can now be displayed on one line instead of awkwardly being put on 3 lines.
              */}
              <div style={{display: 'flex'}}>
                {
                  message.friend &&
                  <div style={{width: '40px', display: 'inline-block'}}>
                  {
                    message.firstMessageOfMinute &&
                    <img className='chatroom-photo' src={chatroom.photo}/>
                  }
                  </div>
                }
                <div 
                  className='clearfix' 
                  style={{
                    /* 
                      if it's a friend's message, or if it's one of my messages that doesn't display the time,
                      make this clearfix container an inline-block. otherwise use flex for my own messages that show time
                      so that I can properly position the time to be at the bottom right corner of it's container,
                      just to the left of the message 
                     */
                    display: !displayTimeForThisMessage(i) || chatHistory[i].friend ? 'inline-block' : 'flex',
                    verticalAlign: 'top',
                    marginLeft: '3px',
                    position: 'relative',
                    flex: 1
                  }}>
                  {
                    message.friend && message.firstMessageOfMinute &&
                    <p style={{margin: '0', padding: '0 10px'}}>{chatroom.name}</p>
                  }
                  {
                    displayTimeForThisMessage(i) && !chatHistory[i].friend &&
                    <div className='date-container'>
                      <span>{ message.date.format('h:mm A') }</span>
                    </div>
                  }
                  <p className='text'>{ message.text }</p>
                  {
                    displayTimeForThisMessage(i) && chatHistory[i].friend &&
                    <div className='date-container'>
                      <span>{ message.date.format('h:mm A') }</span>
                    </div>
                  }
                </div>
              </div>
            </div>
          ))
        }
      </div>
    );
  }
}