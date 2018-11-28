import React, { Component } from 'react'
import { Input } from 'semantic-ui-react'
import { FadeLoader } from 'react-spinners'
import { css } from 'react-emotion'
import { ContextMenu, MenuItem, ContextMenuTrigger, connectMenu } from 'react-contextmenu'

import './index.scss'

const loaderCSS = css`
  margin: 30px auto;
`;

export default class Friends extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchNameInput: ''
    };

    this.changeInputValue = this.changeInputValue.bind(this);
    this.changeFriendButtonStyling = this.changeFriendButtonStyling.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  changeFriendButtonStyling(e) {
    /* 
      Have only one 'clicked friend' styling on at one time. Clicking on a different
      friend will remove the 'clicked' class from the currently selected friend
    */
    let clickedFriend = e.target.closest('div.friend');
    if (clickedFriend) {
      if (this.state.clickedFriend && this.state.clickedFriend !== clickedFriend) this.state.clickedFriend.classList.remove('clicked');
      clickedFriend.classList.add('clicked');
      this.setState({clickedFriend});
    }
  }

  componentDidMount() {
    // Event Delegation
    document.getElementsByClassName('friends-list')[0].addEventListener('mousedown', this.changeFriendButtonStyling);
  }

  componentWillUnmount() {
    document.getElementsByClassName('friends-list')[0].removeEventListener('mousedown', this.changeFriendButtonStyling);
  }

  changeInputValue(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleClick(e, data) {
    const { chat, voice, video, favorite, viewProfile, friend } = data;
    const { changeChatroom, requestChangeInfo, user, friends, viewUserProfile,
            openVideoChat, socket } = this.props;
    if (chat) {
      let classList = document.getElementsByClassName('SplitPane')[0].classList;
      classList.remove('profileOpen');
      classList.add('chatroomOpen');
      changeChatroom(friend);
      viewUserProfile(null);
    }
    if (video) {
      let roomId = String(new Date() - new Date().setHours(0, 0, 0, 0));
      openVideoChat(roomId, friend);
      socket.emit('callingFriend', {user, friend, roomId});
    }
    if (favorite) requestChangeInfo({user, friends, friend, favorite});
    if (viewProfile) {
      document.getElementsByClassName('SplitPane')[0].classList.add('profileOpen');
      viewUserProfile(friend);
    }
  }

  render() {
    const { searchNameInput } = this.state;
    const { chatroom, user, friends, isFetching, changeChatroom, viewUserProfile } = this.props;
    const { changeInputValue, handleClick } = this;
    let friendSections = [
      {name: 'My Profile', list: [user]},
      {name: 'Favorites', list: friends.filter(friend => friend.favorite)},
      {name: 'Friends', list: friends}
    ];
    return (
      <div className='friends-wrapper'>
        <Input 
          focus
          icon='search'
          name='searchNameInput'
          placeholder='Search name...'
          iconPosition='left'
          onChange={changeInputValue} 
          value={searchNameInput}
        />
        <div className='friends-list'>
          {
            friendSections.map(section => (
              <div key={section.name}>
                <div className='section-name'>
                  {section.name}
                  {
                    section.name === 'Friends' &&
                    <span style={{paddingLeft: '8px', fontSize: '16px', fontWeight: '900'}}>
                      {section.list.length}
                    </span>
                  }
                </div>
                <hr/>
                {
                  isFetching ?
                  <FadeLoader
                    className={loaderCSS}
                    sizeUnit='px' 
                    size={80}
                  /> :
                  section.list.sort((a,b) => a.name < b.name ? -1 : 1)
                  .filter(friend => friend.name && friend.name.toLowerCase().replace(/\s/g, '').includes(searchNameInput.toLowerCase().replace(/\s/g, '')))
                  .map((friend, i) => (
                    <ContextMenuTrigger key={friend.email + i} id='right-click-menu' user={user} friend={friend} collect={props => props} onItemClick={handleClick}>
                      <Friend
                        handleClick={handleClick}
                        friend={friend}
                      />
                    </ContextMenuTrigger>
                  ))
                }
              </div>
            ))
          }
          <ConnectedMenu />
        </div>
      </div>
    )
  }
}

const DynamicMenu = props => {
  const { id, trigger } = props;
  const user = trigger && trigger.user;
  const friend = trigger && trigger.friend;
  const handleClick = trigger && trigger.onItemClick;
  return (
    <ContextMenu id={id} style={{display: trigger ? 'inherit': 'none'}}>
      <MenuItem data={{chat: true}} onClick={handleClick}>
        Chat
      </MenuItem>
      {
        user && friend && user.email !== friend.email &&
        <div>
          <MenuItem data={{voice: true}} onClick={handleClick}>
            Voice Call
          </MenuItem>
          <MenuItem data={{video: true}} onClick={handleClick}>
            Video Call
          </MenuItem>
          <MenuItem divider />
          <MenuItem data={{favorite: friend && friend.favorite ? 'remove' : 'add'}} onClick={handleClick}>
            { 
              friend.favorite ?
              <span>Remove from Favorites</span> :
              <span>Add To Favorites</span>
            }
          </MenuItem> 
        </div>
      }
      <MenuItem data={{viewProfile: true}} onClick={handleClick}>
        View Profile
      </MenuItem>   
    </ContextMenu>
  )
}

const ConnectedMenu = connectMenu('right-click-menu')(DynamicMenu);

const Friend = props => {
  const {friend, handleClick} = props;

  return (
    <div 
      className='friend'
      onDoubleClick={e => handleClick(e, {chat: true, friend})}
    >
      <div className='friend-photo photo'>
        <img src={
          friend.photo ? friend.photo : 
          'https://res.cloudinary.com/fresh-aire-mechanical-co/image/upload/v1542834528/34AD2_tbfqai.jpg'
        }/>
      </div>
      <div className='friend-name'>
        <p>{friend.tempName || friend.name}</p>
      </div>
      <div className='friend-motto'>
        <p>{friend.motto}</p>
      </div>
    </div>
  )
}