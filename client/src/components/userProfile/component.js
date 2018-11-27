import React, { Component } from 'react'
import { Button, Grid, Form } from 'semantic-ui-react'
import request from 'superagent'
import Dropzone from 'react-dropzone'

import './index.scss'

var CLOUDINARY_UPLOAD_PRESET = 'hstdvlir';
var CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/fresh-aire-mechanical-co/upload';

export default class UserProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: props.profile.tempName || props.profile.name,
      motto: props.profile.motto,
      uploadedFileCloudinaryUrl: props.user.photo || '',
    };
    this.toggleEditNameInput = this.toggleEditNameInput.bind(this);
    this.toggleEditMottoInput = this.toggleEditMottoInput.bind(this);
    this.editInfo = this.editInfo.bind(this);
    this.submitEditedName = this.submitEditedName.bind(this);
    this.submitEditedMotto = this.submitEditedMotto.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.deletePhoto = this.deletePhoto.bind(this);
  }

  toggleEditNameInput(cancel) {
    const { showEditNameInput, name } = this.state;
    const { profile } = this.props;
    this.setState({
      name: cancel && showEditNameInput ? profile.tempName || profile.name : name,
      showEditNameInput: !showEditNameInput
    }, () => {
      if (this.state.showEditNameInput) document.getElementById('edit-name-input').focus();
    });
  }

  toggleEditMottoInput(cancel) {
    const { showEditMottoInput, motto } = this.state;
    const { profile } = this.props;
    this.setState({
      motto: cancel && showEditMottoInput ? profile.motto : motto,
      showEditMottoInput: !showEditMottoInput
    }, () => {
      if (this.state.showEditMottoInput) document.getElementById('edit-motto-input').focus();
    });
  }

  editInfo(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  submitEditedName() {
    const { name } = this.state;
    const { user, profile, requestChangeInfo, friends } = this.props;
    // Editing my own name 
    if (user.email === profile.email) {
      requestChangeInfo({user, newInfo: {name}});
    }
    else {
      requestChangeInfo({user, friend: profile, newFriendName: name, friends});
    }
    this.toggleEditNameInput();
  }

  submitEditedMotto() {
    const { motto } = this.state;
    const { user, requestChangeInfo } = this.props;
    // Editing my own motto 
    requestChangeInfo({user, newInfo: {motto}});
    this.toggleEditMottoInput();
  }

  handleImageUpload(files, backgroundOrProfile) {
    let file = files[0];
    let upload = request.post(CLOUDINARY_UPLOAD_URL)
                        .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
                        .field('file', file);
    const { requestChangeInfo, user } = this.props;
    upload.end((err, response) => {
      if (err) console.error(err);
      let photoURL = response.body.secure_url;
      if (photoURL && photoURL !== '') {
        this.setState({uploadedFileCloudinaryUrl: photoURL});
        let newInfo = backgroundOrProfile === 'profilePhoto' ? {photo: photoURL} : {backgroundPhoto: photoURL};
        requestChangeInfo({user, newInfo});
      }
    });
  }

  deletePhoto(backgroundOrProfile) {
    const { requestChangeInfo, user } = this.props;
    this.setState({uploadedFileCloudinaryUrl: ''});
    let newInfo = backgroundOrProfile === 'profilePhoto' ? {photo: ''} : {backgroundPhoto: ''};
    requestChangeInfo({user, newInfo});
  }

  componentDidUpdate(prevProps) {
    const { profile, user } = this.props;
    if (prevProps.profile.email !== profile.email) {
      this.setState({
        name: profile.tempName || profile.name,
        showEditNameInput: false,
        showEditMottoInput: false,
      });
    }
    if (user && this.state.uploadedFileCloudinaryUrl !== user.photo) {
      this.setState({uploadedFileCloudinaryUrl: user.photo});
    }
  }

  render() {
    const { toggleEditNameInput, toggleEditMottoInput, editInfo, deletePhoto } = this;
    const { name, motto, showEditNameInput, showEditMottoInput, uploadedFileCloudinaryUrl } = this.state;
    const { user, profile, chatroom, friends, viewUserProfile, changeChatroom, requestChangeInfo } = this.props;
    const showingMyProfile = user.email === profile.email;
    return (
      <div className='user-profile'>
        <div className='background'>
          <BackButton viewUserProfile={viewUserProfile} />
          {
            !showingMyProfile &&
            <FavoriteButton {...this.props} />
          }
          <div className='background-photo'>
            {
              showingMyProfile ?
              <BackgroundPhoto {...this.props} {...this.state} {...this} /> :
              profile.backgroundPhoto && <img src={profile.backgroundPhoto} />
            }
          </div>
          <div 
            className='motto'
            style={{width: showEditMottoInput && '50%'}}
          >
            {
              showEditMottoInput ?
              <div className='edit-motto'>
                <EditInput
                  id='edit-motto-input'
                  name='motto'
                  onChange={this.editInfo}
                  submitEdit={this.submitEditedMotto}
                  toggleInput={() => toggleEditMottoInput('cancel')}
                  value={motto}
                  {...this.props}
                />
              </div> :
              <div>
                <div className='motto-text'>{profile.motto}</div>
                {
                  showingMyProfile &&
                  <EditButton 
                    {...this.props}
                    toggleEditMottoInput={toggleEditMottoInput}
                  />
                }
              </div>
            }
          </div>
          <div className='photo'>
            <div className='tv-border'>
              {
                showingMyProfile ?
                <ProfilePhoto {...this.props} {...this.state} {...this} /> :
                <img src={profile.photo ? profile.photo : 
                          'https://res.cloudinary.com/fresh-aire-mechanical-co/image/upload/v1542834528/34AD2_tbfqai.jpg'} />
              }
            </div>
            {
              showingMyProfile && uploadedFileCloudinaryUrl &&
              <i className='fas fa-times delete-photo' onClick={() => deletePhoto('profilePhoto')} />
            }
          </div>
        </div>
        {
          showEditNameInput ?
          <div className='bottom-section'>
            <div className='edit-name'>
              <EditInput 
                id='edit-name-input'
                name='name'
                onChange={this.editInfo}
                submitEdit={this.submitEditedName}
                toggleInput={() => toggleEditNameInput('cancel')}
                value={name}
                {...this.props}
              />
              {
                !showingMyProfile &&
                <div>
                  <p style={{margin: '10px 0 5px'}}>Name set by friend:</p>
                  <p style={{margin: '0px 4px'}}>{profile.name}</p>
                </div>
              }
            </div>
          </div> :
          <div className='bottom-section'>
            <div className='name'>
              <span>{name || profile.name}</span>
              <EditButton 
                {...this.props}
                toggleEditNameInput={toggleEditNameInput}
              />
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

const BackgroundPhoto = props => {
  const { profile, uploadedFileCloudinaryUrl, handleImageUpload, deletePhoto } = props;
  return (
    <div style={{height: '100%'}}>
      <Dropzone
        className='dropzone editable-photo'
        multiple={false}
        accept='image/*'
        onDrop={(files) => handleImageUpload(files, 'backgroundPhoto')}
      >      
        {
          profile.backgroundPhoto &&
          <img src={profile.backgroundPhoto} />
        }
      </Dropzone>
      {
        profile.backgroundPhoto &&
        <Button color='red' className='delete-background-photo' onClick={() => deletePhoto('backgroundPhoto')}>
          Delete Background Photo
        </Button>
      }
    </div>
  )
}

const ProfilePhoto = props => {
  const { profile, uploadedFileCloudinaryUrl, handleImageUpload } = props;
  return (
    <Dropzone
      className='dropzone editable-photo'
      multiple={false}
      accept='image/*'
      onDrop={(files) => handleImageUpload(files, 'profilePhoto')}
    >
      <img 
        id='uploadedImg' 
        src={uploadedFileCloudinaryUrl || 
          'https://res.cloudinary.com/fresh-aire-mechanical-co/image/upload/v1542834528/34AD2_tbfqai.jpg'}
      />
    </Dropzone>
  )
}

const EditInput = props => {
  const { name, onChange, value, submitEdit, toggleInput, user, profile, id } = props;
  return (
    <Form 
      onSubmit={submitEdit}
      style={{marginTop: user.email === profile.email ? '20px' : '0'}}
    >
      <Form.Input className='edit-input' id={id} value={value} name={name} onChange={onChange} />
      <i className='fas fa-check' onClick={submitEdit} />
      <i className='fas fa-times' onClick={toggleInput} />
    </Form>
  )
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

const EditButton = props => {
  const { requestChangeInfo, toggleEditNameInput, toggleEditMottoInput } = props;
  return (
    <i 
      className='button fas fa-pencil-alt edit-name-button'
      onClick={toggleEditNameInput || toggleEditMottoInput}
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