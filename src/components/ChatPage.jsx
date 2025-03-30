import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { setSelectedUser } from '@/Redux/authSlice'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { MessageCircleCode } from 'lucide-react'
import Messagese from './Messagese'

const ChatPage = () => {
    const {onlineUser} = useSelector(store => store.chat)
    console.log(onlineUser)
    const { user, suggesteduser, selectedUser } = useSelector(store => store.auth)
    const dispatch = useDispatch()
    return (
        <div className='flex ml-[16%] h-screen w-full'>
            <section className='w-full md:w-1/4 mt-10 pl-3'>
                <h1 className='font-bold mb-4 text-xl text-gray-600'>{user.username}</h1>
                <div className='mb-4 '>
                    <Avatar className='w-16 h-16'>
                        <AvatarImage src={user.profilePic && user.profilePic.url} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
                <h1 className='mb-4 font-bold text-gray-600'>Messages</h1>
                <div className='overflow-y-auto h-[80vh]'>
                    {suggesteduser.map((user) => {
                       const isOnline =  onlineUser && onlineUser.icludes(suggesteduser._id)
                        return <div onClick={() => dispatch(setSelectedUser(user))} key={user._id} className='flex cursor-pointer items-center gap-4 py-3  hover:bg-gray-50'>
                            <Avatar className='w-14 h-14'>
                                <AvatarImage src={user.profilePic && user.profilePic.url} />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col'>
                                <span className='font-semibold'>{user.username}</span>
                                <span className={`text-xs ${isOnline ? 'text-green-600' : 'text-red-600'} font-bold `}>{isOnline ? 'online' : 'offline'}</span>
                            </div>
                        </div>
                    })

                    }
                </div>
            </section>
            {
                selectedUser ? (
                    <section className='flex-1 border-l  border-gray-300 flex flex-col h-full'>
                        <div className='flex items-center gap-3 p-4 border-b border-gray-300 sticky top-0 bg-white z-10'>
                            <Avatar>
                                <AvatarImage src={selectedUser.profilePic && selectedUser.profilePic.url} />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col'>
                                <span className='text-gray-600 font-bold'>{selectedUser.username}</span>
                            </div>
                        </div>
                        <Messagese selectedUser={selectedUser} />
                        <div className='flex items-center p-4 border-t border-gray-300'>
                            <Input type='text' className='flex-1 mr-2 focus-visible:ring-transparent' placeholder='Messages...' />
                            <Button>Send</Button>
                        </div>
                    </section>
                ) : (
                    <div className='flex flex-col items-center justify-center mx-auto'>
                        <MessageCircleCode className='w-32 h-32 my-4' />
                        <h1 className='font-bold text-xl'>Your messages</h1>
                        <span>Send a message to start a chat.</span>
                    </div>
                )
            }
        </div>
    )
}

export default ChatPage
