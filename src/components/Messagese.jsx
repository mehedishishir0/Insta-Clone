import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'

const Messagese = ({ selectedUser }) => {
    return (
        <div className='overflow-y-auto flex-1 p-4'>
            <div className='flex justify-center'>
                <div className='flex flex-col gap-3 justify-center items-center'>
                    <Avatar className='h-20 w-20'>
                        <AvatarImage src={selectedUser.profilePic && selectedUser.profilePic.url} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span className='font-semibold text-gray-700'>{selectedUser && selectedUser.username}</span>
                    <Link to={`/profile/${selectedUser._id}`}><Button variant='secondary'>View profile</Button></Link>
                </div>
            </div>
            <div className='flex flex-col gap-3'>
                {/* Messages */}
                {[1, 2, 3, 4, 5].map((message) => (
                    <div className={`flex `}>
                       <div>
                        {message}
                       </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Messagese
