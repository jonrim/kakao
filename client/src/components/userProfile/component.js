import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'

import './index.scss'

export default class UserProfile extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { user, profile, friends, viewUserProfile, requestChangeInfo } = this.props;
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
        <div className='name'>{profile.name}</div>
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

const FavoriteButton = props => {
  const { user, profile, friends, requestChangeInfo } = props;
  const favoriteUser = () => {
    console.log(profile.favorite)
    requestChangeInfo({user, friends, friend: profile, favorite: profile.favorite ? 'remove' : 'add'});
  };
  return (
    <i 
      className={'button far fa-circle favorite-button ' + (profile.favorite && 'favorite')}
      onClick={favoriteUser}
    >
      <i className='button fas fa-star'/>
    </i>
  )
}