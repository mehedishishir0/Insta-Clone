import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAppContext } from "@/Context/Context"
import { setAuthUser, setSuggestedUser } from "@/Redux/authSlice"
import axios from "axios"
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp, User } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import CreatePost from "./CreatePost"
import { setPost, setSelectedPost } from "@/Redux/postSlice"

const LeftSidebar = () => {
    const { url } = useAppContext()
    const naviget = useNavigate()
    const { user } = useSelector(store => store.auth)
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false)

    const logoutHandler = async () => {
        await axios.get(`${url}/api/user/logout`)
            .then((response) => {
                toast.success(response.data.message)
                dispatch(setAuthUser(null))
                dispatch(setSelectedPost([])),
                    dispatch(setPost([]))
                dispatch(setSuggestedUser([]))
                naviget('/login')
            }).catch((err) => {
                toast.error(err.response.data.message)
            })
    }

    const sideBarhandelar = (item) => {
        if (item === 'Logout') {
            logoutHandler()
        } else if (item === 'Create') {
            setOpen(true)
        } else if (item === 'Profile') {
            naviget(`/profile/${user._id}`)
        }else if (item === 'Home'){
          naviget('/')
        }else if (item === 'Messages'){
          naviget('/chat')
        }
    }

    const sideberItem = [
        { name: 'Home', icon: <Home /> },
        { name: 'Search', icon: <Search /> },
        { name: 'Explore', icon: <TrendingUp /> },
        { name: 'Profile', icon: <User /> },
        { name: 'Messages', icon: <MessageCircle /> },
        { name: 'Notifications', icon: <Heart /> },
        { name: 'Create', icon: <PlusSquare /> },
        {
            name: 'Profile', icon: (
                <Avatar className='w-6 h-6'>
                    <AvatarImage src={user.profilePic && user.profilePic.url} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            )
        },
        { name: 'Logout', icon: <LogOut /> },

    ]

    return (
        <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen'>
            <div className="flex flex-col">
                <h1 className="my-8 pl-3 font-bold text-xl">LOGO</h1>
                <div>
                    {sideberItem.map((item, index) => (
                        <div onClick={() => sideBarhandelar(item.name)} key={index} className="flex items-center gap-4 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3">
                            {item.icon}
                            <span>{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>
            <CreatePost open={open} setOpen={setOpen} />
        </div>
    )
}

export default LeftSidebar