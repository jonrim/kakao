import React from 'react'
import { Link } from 'react-router-dom'

import './index.scss'

const Nav = () => (
  <nav id='main-nav'>
    <span id='buttons'>
      <Link className='main-button' to='/'>
        <i className='fas fa-user' />
        <span className='tooltiptext'>Friends</span>
      </Link>
      <Link className='main-button' to='/chats'>
        <i className='fas fa-comment' />
        <span className='tooltiptext'>Chats</span>
      </Link>
      <Link className='main-button' to='/find'>
        <i className='fas fa-search' />
        <span className='tooltiptext'>Find</span>
      </Link>
      <Link className='main-button' to='/more'>
        <i className='fas fa-ellipsis-h' />
        <span className='tooltiptext'>More</span>
      </Link>
      </span>
    <img id='logo' src={ require('Images/logo.png') } />
  </nav>
)

export default Nav;