import React, { use, useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '@/Context/Context'
import { toast } from 'sonner'
import { setAuthUser } from '@/Redux/authSlice'

const EditProfile = () => {
    const imageref = useRef()
    const { url } = useAppContext()
    const { userProfile, user } = useSelector(store => store.auth)
    const [loding, setLoding] = useState(false)
    const [input, setInput] = useState({
        userPhot: userProfile.profilePic && userProfile.profilePic.url,
        username: userProfile.username && userProfile.username,
        bio: userProfile.bio && userProfile.bio,
        gender: userProfile.gender && userProfile.gender
    })
    const [profilePicView, setProfilePicView] = useState('')
    const naviget = useNavigate()
    const dispatch = useDispatch()

    const filchangeHandler = (e) => {
        const file = e.target.files[0]
        if (file) {
            setInput({ ...input, userPhot: file })
            setProfilePicView(URL.createObjectURL(file))
        }
    }
    const handleSelectChange = (e) => {
        setInput({ ...input, gender: e })
    }

    const editProfileHandler = async () => {
        setLoding(true)
        const fromdata = new FormData()
        fromdata.append('bio', input.bio)
        fromdata.append('gender', input.gender)
        if (input.userPhot) fromdata.append('profilepic', input.userPhot)
        await axios.post(`${url}/api/user/profile/update`, fromdata, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then((response) => {
            toast.success(response.data.message)
            const updatedData = {
                ...user,
                bio: response.data.data.bio && response.data.data.bio,
                gender: response.data.data.gender && response.data.data.gender,
                profilePic: response.data.data.profilePic && response.data.data.profilePic
            }
            dispatch(setAuthUser(updatedData))
            naviget(`/profile/${user._id}`)
            setLoding(false)
        }).catch((error) => {
            toast.error(error.response.data.message)
            setLoding(false)
        })
    }

    return (
        <div className='flex mx-auto w-2xl items-center my-10'>
            <section className='flex flex-col gap-6 w-full'>
                <h1 className='text-xl font-bold'>Edit profile</h1>
                <div className='flex items-center justify-between gap-4 bg-gray-100 rounded-xl p-4'>
                    <div className='flex gap-4'>
                        <div to={`/profile/${user._id}`}>
                            <Avatar>
                                <AvatarImage src={profilePicView ? profilePicView : input.userPhot} alt='User' />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </div>
                        <div>
                            <h1 className='font-bold text-sm'>{user.username}</h1>
                            <p className='text-gray-500 text-sm'>{user.bio || 'Set bio'}</p>
                        </div>
                    </div>
                    <input ref={imageref} onChange={filchangeHandler} type="file" className='hidden' />
                    <Button onClick={() => imageref.current.click()} className='cursor-pointer bg-[#0095f6] h-8 hover:bg-[#0094f6c2]'>Change photo</Button>
                </div>
                <div>
                    <h1 className='font-bold text-xl mb-2'>Bio</h1>
                    <Textarea name='bio' value={input.bio} onChange={(e) => setInput({ ...input, bio: e.target.value })} className='outline-none focus-visible:ring-transparent' />
                </div>
                <div>
                    <h1 className='font-bold mb-2'>Gender</h1>
                    <Select onValueChange={(e) => handleSelectChange(e)} defaultValue={input.gender || ""}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a fruit" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Others">Others</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex justify-end'>
                    {loding ? <Button className='w-fit bg-[#0095f6] h-8 cursor-pointer hover:bg-[#0094f6c2] '><Loader2 className='mr-2 h-4 w-4  animate-spin' />Please wait</Button>
                        :
                        <Button onClick={editProfileHandler} className='w-fit bg-[#0095f6] h-8 cursor-pointer hover:bg-[#0094f6c2] '>Submit</Button>
                    }
                </div>
            </section>
        </div>
    )
}

export default EditProfile
