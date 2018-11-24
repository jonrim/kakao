import React, { Component } from 'react'
import { Form, Input, Button } from 'semantic-ui-react'
import { FadeLoader } from 'react-spinners'
import { css } from 'react-emotion'

import './index.scss'

const loaderCSS = css`
  margin: 30px auto;
`;

export default class Find extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchUserInput: ''
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.changeInputValue = this.changeInputValue.bind(this);
    this.addFriend = this.addFriend.bind(this);
  }

  handleFormSubmit(e) {
    const { requestFindUser } = this.props;
    const { searchUserInput } = this.state;
    requestFindUser({userID: searchUserInput});
    this.setState({searchUserInput: ''});
  }

  changeInputValue(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  addFriend() {
    const { requestFriendRequest, user, foundUser, errorFriendRequest, socket } = this.props;

    requestFriendRequest({user, friend: foundUser});
    socket.emit('sentFriendRequest', {userEmail: user.email, friendEmail: foundUser.email});

    let notification = document.getElementById('notification');
    notification.classList.add('active');
    setTimeout(() => {
      notification.classList.add('inactive');
    }, 3000);
    setTimeout(() => {
      notification.classList.remove('active', 'inactive');
    }, 4000);
  }

  render() {
    const { searchUserInput } = this.state;
    const { user, foundUser, isFetching, errorFindingUser, friends } = this.props;
    return (
      <div className='find-wrapper'>
        <Form onSubmit={this.handleFormSubmit}>
          <Form.Input 
            focus
            icon='search'
            name='searchUserInput'
            placeholder='Search by email...'
            iconPosition='left'
            onChange={this.changeInputValue} 
            value={searchUserInput}
          />
        </Form>
        <div className='find'>
          {
            isFetching ?
            <FadeLoader
              className={loaderCSS}
              sizeUnit='px' 
              size={80}
            /> : (
              errorFindingUser ?
              <p>{errorFindingUser}</p> :
              foundUser ?
              <div className='find-user'>
                <div className='find-photo photo'>
                  <div className='tv-border'>
                    <img src={
                      foundUser.photo ? foundUser.photo : 
                      'https://res.cloudinary.com/fresh-aire-mechanical-co/image/upload/v1542834528/34AD2_tbfqai.jpg'
                    }/>
                  </div>
                </div>
                <p className='find-name'>{foundUser.name}</p>
                <Button 
                  className='yellow-button'
                  size='mini'
                  disabled={foundUser.email === user.email || friends.findIndex(friend => friend.email === foundUser.email) > -1}
                  onClick={this.addFriend}
                >
                  Add Friend
                </Button>
              </div> :
              <p>
                Search for a user by their email.
              </p>
            )
          }
        </div>
        <div id='notification'>
          <i className="fas fa-bell" />
          <span>Friend Request Sent!</span>
        </div>
      </div>
    )
  }
}