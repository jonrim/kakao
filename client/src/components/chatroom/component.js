import React, { Component } from 'react'
import { Input, Form, TextArea, Button, Modal } from 'semantic-ui-react'
import ReactResizeDetector from 'react-resize-detector'
import { Picker } from 'emoji-mart'
import Dropzone from 'react-dropzone'
import ChatroomMessages from './chatroomMessages'

import 'emoji-mart/css/emoji-mart.css'
import './index.scss'

export default class Chatroom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: false,
      messageInput: '',
      filesToSend: [],
      chatHistory: props.user.email === props.chatroom.email ? [] : props.friends.find(friend => props.chatroom.email === friend.email).chatHistory || []
    };
    this.showSearch = this.showSearch.bind(this);
    this.showMore = this.showMore.bind(this);
    this.changeMessageInput = this.changeMessageInput.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.send = this.send.bind(this);
    this.onResize = this.onResize.bind(this);
    this.addEmoji = this.addEmoji.bind(this);
    this.sendMedia = this.sendMedia.bind(this);
    this.readMessages = this.readMessages.bind(this);
  }

  showSearch() {
    this.setState({search: !this.state.search}, () => {
      if (this.state.search) document.getElementById('chatroom-search-input').focus();
      else document.getElementById('chatroom-type-input').focus();
    });
  }

  showMore() {

  }

  changeMessageInput(e) {
    this.setState({ messageInput: e.target.value });
  }

  handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.sendMessage();
    }
  }

  scrollToBottom() {
    let chatMessagesDiv = document.getElementsByClassName('chatroom-messages')[0];
    chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
  }

  sendMessage(e) {
    const { messageInput } = this.state;
    if (messageInput === '') return;
    this.send('text');
  }

  sendMedia(files) {
    this.send('media', files);
  }

  send(typeOfMessage, files) {
    const { messageInput } = this.state;
    const { friends, socket, user, chatroom, requestSendMessage } = this.props;
    // If you're in a chatroom with yourself, don't send anything
    if (user.email === chatroom.email) return;
    const { sameDate, sameMinute } = this;
    let today = new Date();
    let chatHistory = friends.find(friend => friend.email === chatroom.email).chatHistory || [];
    let latestMessage, sameDay, sameTime;

    let messageInfo = {
      userSocketId: socket.id,
      userEmail: user.email,
      friendEmail: chatroom.email,
      messages: typeOfMessage === 'text' ? {
        text: messageInput,
        date: today,
        friend: false,
        read: false
      } : files.map((file, i) => {
        return {
          file: file,
          date: today,
          friend: false,
          read: false
        }
      })
    };
    this.setState({ messageInfo }, () => {
      requestSendMessage(messageInfo);
    });
  }

  onResize() {
    this.scrollToBottom();
  }

  displayEmojis() {
    document.getElementsByClassName('emoji-mart')[0].classList.toggle('visible');
  }

  addEmoji(emoji) {
    this.setState({ 
      messageInput: this.state.messageInput + emoji.colons
    }, () => {
      document.getElementById('chatroom-type-input').focus();
    });
  }

  // hideEmojiPickerOnClick(e) {
  //   if (!e.target.closest('.emoji-mart').length) {
  //     document.getElementsByClassName('emoji-mart')[0].classList.remove('visible');
  //   }
  // }

  readMessages() {
    const { requestReadMessages, user, chatroom } = this.props;
    const { chatHistory } = this.state;
    // Only notify that the messages were read if there were unread messages in the first place
    let latestFriendMessage;
    for (let i = chatHistory.length - 1; i >= 0; i--) {
      // find the friend's latest message and check if it's read
      if (chatHistory[i].friend) {
        latestFriendMessage = chatHistory[i];
        break;
      }
    }
    if (latestFriendMessage && !latestFriendMessage.read) {
      requestReadMessages({userEmail: user.email, friendEmail: chatroom.email});
    }
  }

  componentDidMount() {
    document.getElementById('chatroom-type-input').focus();
    // window.addEventListener('click', this.hideEmojiPickerOnClick)

    // update read receipts
    this.readMessages();
    this.scrollToBottom();
  }

  componentWillUnmount() {
    // window.removeEventListener('click', this.hideEmojiPickerOnClick)
  }

  componentDidUpdate(prevProps, prevState) {
    const { requestReadMessages, user, friends, chatroom, socket } = this.props;
    // if you change to a different friend's chatroom,
    // 1. update read receipts
    // 2. scroll back to bottom
    if (prevProps.chatroom.email !== chatroom.email) {
      document.getElementById('chatroom-type-input').focus();
      this.readMessages();
      this.setState({
        chatHistory: friends.find(friend => chatroom.email === friend.email).chatHistory || []
      }, () => {
        this.scrollToBottom();
      });
    }

    if (prevState === this.state && user.email !== chatroom.email) {
      const { messageInfo } = this.state;
      const chatHistory = friends.find(friend => chatroom.email === friend.email).chatHistory;

      // Only emit if I am the user that has messageInfo ready to be sent
      // A message was sent
      if (messageInfo) {
        socket.emit('message', messageInfo);
        this.setState({
          messageInput: '',
          messageInfo: null
        });
      }
      else {
        const prevChatHistory = prevProps.friends.find(friend => chatroom.email === friend.email).chatHistory;
        const prevLastMessage = prevChatHistory[prevChatHistory.length - 1];
        const currLastMessage = chatHistory[prevChatHistory.length - 1];
        const d1 = new Date(prevLastMessage.date);
        const d2 = new Date(currLastMessage.date);
        // If there were any updates to the chat history...
        if (d1.getTime() !== d2.getTime() ||
          prevLastMessage.read !== currLastMessage.read && d1.getTime() === d2.getTime() && prevLastMessage.friend === currLastMessage.friend) {
          socket.emit('message', {userEmail: user.email, friendEmail: chatroom.email});
        }
      }
      // Update the chat history regardless of whether I am the user or the friend
      this.setState({
        chatHistory
      }, () => {
        this.scrollToBottom();
      });
    }
  }

  render() {
    const { chatroom, changeFriendState, mobileWindow, socket, friends } = this.props;
    const { search, messageInput, chatHistory } = this.state;
    return (
      <Dropzone
        className='dropzone'
        onDrop={this.sendMedia}
        disableClick={true}
        acceptClassName='dropzone-drag'
      >
        {({ open }) => (
          <div className='chatroom' onFocus={this.readMessages}>
            <div className='chatroom-nav'>
              <BackButton
                changeFriendState={changeFriendState}
              />
              <img className='chatroom-photo' src={chatroom.photo}/>
              <div className='chatroom-name'>
                <p>{chatroom.name}</p>
              </div>
              <i
                className='button fas fa-search'
                onClick={this.showSearch}
              />
              <i
                className='button fas fa-bars'
                onClick={this.showMore}
              />
            </div>
            {
              search &&
              <div className='search-container'>
                <Input
                  focus
                  icon='search'
                  name='searchInput'
                  id='chatroom-search-input'
                  iconPosition='left'
                  placeholder='Search'
                />
              </div>
            }
            <ChatroomMessages
              chatHistory={chatHistory}
              chatroom={chatroom}
              socket={socket}
            />
            <div className='chatroom-type'>
              <Form>
                <ReactResizeDetector handleWidth handleHeight onResize={this.onResize}>
                  <TextArea 
                    autoHeight 
                    rows='2' 
                    id='chatroom-type-input' 
                    value={messageInput} 
                    onChange={this.changeMessageInput}
                    onKeyPress={this.handleKeyPress}
                  />
                </ReactResizeDetector>
                <Button size='mini' onClick={this.sendMessage}>Send</Button>
                <i 
                  className="bot-button far fa-smile-wink"
                  onClick={this.displayEmojis}
                />
                <i
                  className="bot-button fas fa-paperclip" 
                  onClick={open}
                />
                <i className="bot-button far fa-image" />
                <i className="bot-button fas fa-phone" />
              </Form>
            </div>
            <Picker set='emojione' onSelect={this.addEmoji} style={{
              bottom: mobileWindow ? (document.getElementsByClassName('chatroom-type')[0] ?
                document.getElementsByClassName('chatroom-type')[0].scrollHeight : 120 + 'px') : '0',
              left: mobileWindow ? '0' : '-348px'
            }}/>
          </div>
        )}
      </Dropzone>
    )
  }
}

const BackButton = props => {
  const { changeFriendState } = props;
  const goBack = () => {
    changeFriendState('chatroom', null);
  };
  return (
    <i 
      className='button fas fa-arrow-left'
      onClick={goBack}
    />
  )
}