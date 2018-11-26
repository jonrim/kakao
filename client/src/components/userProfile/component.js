import React, { Component } from 'react'
import { Button, Grid, Form } from 'semantic-ui-react'

import './index.scss'

export default class UserProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: props.profile.tempName || props.profile.name,
      showEditNameInput: false
    };
    this.toggleEditNameInput = this.toggleEditNameInput.bind(this);
    this.editName = this.editName.bind(this);
    this.submitEditedName = this.submitEditedName.bind(this);
  }

  toggleEditNameInput(cancel) {
    this.setState({
      name: cancel ? this.props.profile.tempName || this.props.profile.name : this.state.name,
      showEditNameInput: !this.state.showEditNameInput
    });
  }

  editName(e) {
    this.setState({name: e.target.value});
  }

  submitEditedName() {
    const { name } = this.state;
    const { user, profile, requestChangeInfo, friends } = this.props;
    requestChangeInfo({user, friend: profile, newFriendName: name, friends});
    this.toggleEditNameInput();
  }

  render() {
    const { toggleEditNameInput } = this;
    const { name, showEditNameInput } = this.state;
    const { user, profile, chatroom, friends, viewUserProfile, changeChatroom, requestChangeInfo } = this.props;
    return (
      <div className='user-profile'>
        <div className='background'>
          <BackButton viewUserProfile={viewUserProfile} />
          <FavoriteButton {...this.props} />
          <div className='background-photo'>
              <img src='https://i.redd.it/enmir0135l6y.jpg' />
          </div>
          <div className='motto'>{profile.motto}</div>
          <div className='photo'>
            <div className='tv-border'>
              <img src={profile.photo} />
            </div>
          </div>
        </div>
        {
          showEditNameInput ?
          <div className='bottom-section'>
            <div className='edit-name'>
              <Form onSubmit={this.submitEditedName}>
                <Form.Input focus className='edit-name-input' value={name} onChange={this.editName} />
                <i className='fas fa-check' onClick={this.submitEditedName} />
                <i className='fas fa-times' onClick={() => toggleEditNameInput('cancel')} />
              </Form>
              <p style={{margin: '10px 0 5px'}}>Name set by friend:</p>
              <p style={{margin: '0px 4px'}}>{profile.name}</p>
            </div>
          </div> :
          <div className='bottom-section'>
            <div className='name'>
              <span>{name || profile.name}</span>
              <EditNameButton {...this.props} {...this} />
            </div>
            <Grid columns={chatroom ? 1 : 4}>
              {
                !chatroom &&
                <Grid.Column />
              }
              {
                !chatroom &&
                <Grid.Column>
                  <ChatButton {...this.props} />
                </Grid.Column>
              }
              <Grid.Column>
                <FreeCallButton {...this.props} />
              </Grid.Column>
              {
                !chatroom &&
                <Grid.Column />
              }
            </Grid>
          </div>
        }
      </div>
    )
  }
}

const BackButton = props => {
  const { viewUserProfile } = props;
  const goBack = () => {
    viewUserProfile(null);
    document.getElementsByClassName('SplitPane')[0].classList.remove('profileOpen');
  };
  return (
    <i 
      className='button fas fa-times back-button'
      onClick={goBack}
    />
  )
}

const EditNameButton = props => {
  const { requestChangeInfo, toggleEditNameInput } = props;
  return (
    <i 
      className='button fas fa-pencil-alt edit-name-button'
      onClick={toggleEditNameInput}
    />
  )
}

const FavoriteButton = props => {
  const { user, profile, friends, requestChangeInfo } = props;
  const favoriteOrUnfavoriteThisFriend = () => {
    console.log(profile.favorite)
    requestChangeInfo({user, friends, friend: profile, favorite: profile.favorite ? 'remove' : 'add'});
  };
  return (
    <i 
      className={'button fas fa-star favorite-button ' + (profile.favorite && 'favorite')}
      onClick={favoriteOrUnfavoriteThisFriend}
    />
  )
}

const FreeCallButton = props => {
  const { user, profile } = props;
  const callThisFriend = () => {
  };
  return (
    <div className='call-button'>
      <i 
        className='button fas fa-phone'
        onClick={callThisFriend}
      />
      <p>Free Call</p>
    </div>
  )
}

const ChatButton = props => {
  const { user, profile, changeChatroom, viewUserProfile } = props;
  const chatWithThisFriend = () => {
    changeChatroom(profile);
    viewUserProfile(null);
    let classList = document.getElementsByClassName('SplitPane')[0].classList;
    classList.add('chatroomOpen');
    classList.remove('profileOpen');
  };
  return (
    <div className='chat-button'>
      <i 
        className='button fas fa-comment'
        onClick={chatWithThisFriend}
      />
      <p>1:1 Chat</p>
    </div>
  )
}