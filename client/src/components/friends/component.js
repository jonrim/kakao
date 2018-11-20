import React, { Component } from 'react'
import { Input } from 'semantic-ui-react'
import { FadeLoader } from 'react-spinners'
import { css } from 'react-emotion'

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

  render() {
    const { searchNameInput, focusedFriend } = this.state;
    const { chatroom, myProfile, friends, isFetching, changeChatroom } = this.props;
    const { changeInputValue } = this;
    let friendSections = [
      {name: 'My Profile', list: myProfile},
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
                    <span style={{'paddingLeft': '8px', 'fontSize': '16px', 'fontWeight': '900'}}>
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
                  .filter(friend => friend.name ? friend.name.toLowerCase().replace(/\s/g, '').includes(searchNameInput.toLowerCase().replace(/\s/g, '')) : null)
                  .map(friend => (
                    <Friend
                      key={friend.email}
                      changeChatroom={changeChatroom}
                      friend={friend}
                    />
                  ))
                }
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}

const Friend = props => {

  const {friend, changeChatroom} = props;
  const changeChatroomInfo = () => {
    document.getElementsByClassName('SplitPane')[0].classList.add('chatroomOpen');
    changeChatroom(friend);
  };

  return (
    <div 
      className={'friend'}
      onDoubleClick={changeChatroomInfo}
    >
      <div className='friend-photo'>
        <img src={friend.photo} />
      </div>
      <div className='friend-name'>
        <p>{friend.name}</p>
      </div>
      <div className='friend-motto'>
        <p>{friend.motto}</p>
      </div>
    </div>
  )
}