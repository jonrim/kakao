import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'

import './index.scss'

export default class UserProfile extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { profile } = this.props;
    return (
      <div className='user-profile'>
        <div className='tv-border'>
          <img src={profile.photo} />
        </div>
        {profile.name}
      </div>
    )
  }
}