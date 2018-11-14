import React, { Component } from 'react'
import moment from 'moment'
import { Emoji } from 'emoji-mart'
import reactStringReplace from 'react-string-replace'
import ReactPlayer from 'react-player'
import Linkify from 'react-linkify'

import './index.scss'

export default class ChatroomMessages extends Component {
  constructor(props) {
    super(props);

    this.displayTimeForThisMessage = this.displayTimeForThisMessage.bind(this);
  }

  displayTimeForThisMessage(i) {
    const { chatHistory } = this.props;
    /*
      If the difference between this date and the next date is greater than 1 minute, or
      if the difference is less than 1 minute (e.g. 10:55pm 55 sec and 10:56pm 05 sec has 
      different time stamp but less than 1 minute difference) but the the time stamps are
      different, print the timestamp next to this message
    */
    if (i + 1 === chatHistory.length) return true;
    let thisDate = new Date(chatHistory[i].date);
    let nextDate = new Date(chatHistory[i + 1].date);
    return (moment(thisDate).diff(moment(nextDate), 'minutes') < 0 ||
          thisDate.getMinutes() !== nextDate.getMinutes()) ||
          chatHistory[i].friend !== chatHistory[i + 1].friend;
  }

  scrollToBottom() {
    let chatMessagesDiv = document.getElementsByClassName('chatroom-messages')[0];
    chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
  }

  componentDidMount() {
    // let messages = document.getElementsByClassName('message');
    //   let lastMessage = messages[messages.length - 1];
    //   lastMessage.scrollIntoView({
    //     behavior: 'instant',
    //     inline: 'end'
    //   })
    this.scrollToBottom();
    // setTimeout(() => {
      
    // }, 2000)
  }

  componentDidUpdate(prevProps) {
    // if you change to a different friend's chatroom, scroll back to bottom
    if (prevProps.chatroom.id !== this.props.chatroom.id) {
      this.scrollToBottom();
    }
  }

  render() {
    const { chatroom, chatHistory } = this.props;
    const { displayTimeForThisMessage } = this;
    return (
      <div className='chatroom-messages'>
        <div className='chatroom-messages-container'>
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
                        moment(message.date).format('dddd, MMMM D, YYYY')
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
                      !chatHistory[i].friend &&
                      <div className='date-container'>
                        {
                          !message.read &&
                          <span className='unread' style={{bottom: displayTimeForThisMessage(i) ? '19px' : '4px'}}>1</span>
                        }
                        {
                          displayTimeForThisMessage(i) &&
                          <span className='time'>{ moment(message.date).format('h:mm A') }</span>
                        }
                      </div>
                    }
                    {
                      message.text ? (
                        <p className='text'>
                          <Linkify>
                            { 
                              reactStringReplace(message.text, /(\:[a-zA-Z_-]+\:)/g, (match, i) => (
                                <Emoji key={match+i} size={16} emoji={match} set='emojione' />
                              ))
                            }
                          </Linkify>
                        </p>
                      ) : (
                        <div>
                          {
                            message.file.type.indexOf('image') > -1 ? (
                              <img src={message.file.preview} className='image' onLoad={this.scrollToBottom} />
                            ) : message.file.type.indexOf('audio') > -1 || message.file.type.indexOf('video') > -1 ? (
                              <ReactPlayer url={message.file.preview} width='250px' height='150px' controls playing />
                            ) : message.file.type.indexOf('text') > -1 ? (
                              <ReactPlayer url={'https://www.youtube.com/watch?v=nM0xDI5R50E'} height='150px' width='250px' controls playing />
                            ) : (
                              <div />
                            )
                          }
                        </div>
                      )
                    }
                    {
                      chatHistory[i].friend &&
                      <div className='date-container'>
                        {
                          !message.read &&
                          <span className='unread' style={{bottom: displayTimeForThisMessage(i) ? '19px' : '4px'}}>1</span>
                        }
                        {
                          displayTimeForThisMessage(i) && 
                          <span className='time'>{ moment(message.date).format('h:mm A') }</span>
                        }
                      </div>
                    }
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}