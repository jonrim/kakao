import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import './index.scss'


export default class Nav extends Component {
  changeNavButtonStyling(e) {
    let clickedNavButton = e.target.closest('a.main-button');
    /* 
      Have only one 'clicked nav button' styling on at one time. Clicking on a different
      nav button will remove the 'clicked' class from all other nav buttons
    */
    if (clickedNavButton) {
      if (!clickedNavButton.classList.contains('clicked')) {
        Array.from(e.currentTarget.getElementsByClassName('main-button')).forEach(button => {
          button.classList.remove('clicked');
        });
      }
      clickedNavButton.classList.add('clicked');
    }
  }

  componentDidMount() {
    // Event Delegation
    document.getElementById('buttons').addEventListener('mousedown', this.changeNavButtonStyling);

    // Set initial active nav button
    Array.from(document.getElementsByClassName('main-button')).forEach(navButton => {
      let name = navButton.id.substr(0, navButton.id.indexOf('-'));
      let currentRoute = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
      console.log(name, currentRoute)
      if (name === currentRoute || name === 'friends' && currentRoute === '') {
        navButton.classList.add('clicked');
      }
    });
  }

  componentWillUnmount() {
    document.getElementById('buttons').removeEventListener('mousedown', this.changeNavButtonStyling);
  }

  render() {
    return (
      <nav id='main-nav'>
        <span id='buttons'>
          <Link id='friends-nav-button' className='main-button' to='/'>
            <i className='fas fa-user' />
            <span className='tooltiptext'>Friends</span>
          </Link>
          <Link id='chats-nav-button' className='main-button' to='/chats'>
            <i className='fas fa-comment' />
            <span className='tooltiptext'>Chats</span>
          </Link>
          <Link id='find-nav-button' className='main-button' to='/find'>
            <i className='fas fa-search' />
            <span className='tooltiptext'>Find</span>
          </Link>
          <Link id='more-nav-button' className='main-button' to='/more'>
            <i className='fas fa-ellipsis-h' />
            <span className='tooltiptext'>More</span>
          </Link>
          </span>
        <img id='logo' src='https://res.cloudinary.com/fresh-aire-mechanical-co/image/upload/v1541254122/logo_ism2cy.png' />
      </nav>
    )
  }
}