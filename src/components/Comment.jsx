import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const Comment = ({comment}) => {
  return (
    <div className='my-2'>
            <div className='flex gap-3 items-center'>
                <Avatar>
                    <AvatarImage src={comment?.author.profilePic?.url}/>
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className='font-semibold'>{comment?.author.username}  <span className='font-normal '>{comment?.comment}</span></h1>
            </div>
    </div>
  )
}

export default Comment
