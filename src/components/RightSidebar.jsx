import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import SuggestedUser from './SuggestedUser'

const RightSidebar = () => {
  const { user } = useSelector(store => store.auth)

  return (
    <div className='w-fit my-10  pr-20'>
      <div className='flex items-center gap-2'>
        <Link to={`/profile/${user._id}`}>
          <Avatar>
            <AvatarImage src={user.profilePic && user.profilePic.url} alt='User' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <h1 className='font-semibold text-sm'><Link to={`/profile/${user._id}`}>{user.username}</Link></h1>
          <p className='text-gray-500 text-sm'>{user.bio || 'Set bio'}</p>
        </div>
      </div>
      <SuggestedUser/>
    </div>
  )
}

export default RightSidebar