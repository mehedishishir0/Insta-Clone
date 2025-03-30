import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import { useAppContext } from '@/Context/Context'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setPost } from '@/Redux/postSlice'

const CreatePost = ({ open, setOpen }) => {
  const imageref = useRef()
  const [file, setFile] = useState('')
  const [caption, setCaption] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const [loding, setLoding] = useState('')
  const { url } = useAppContext()
  const { user } = useSelector(store => store.auth)
  const { posts } = useSelector(store => store.posts)
  const dispatch = useDispatch()

  const handelChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFile(file)
      setImagePreview(file)
    }
  }

  const createPostHandelear = async (e) => {
    e.preventDefault()
    setLoding(true)
    const formData = new FormData()
    formData.append('caption', caption)
    if (imagePreview) formData.append('image', file)
    await axios.post(`${url}/api/post/addnew`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then((response) => {
        dispatch(setPost([response.data.data, ...posts]))
        toast.success(response.data.message)
        setOpen(false)
        setCaption('')
        setFile('')
        setImagePreview('')
      })
      .catch((error) => {
        toast.error(error.response.data.message)
      })
      .finally(() => {
        setLoding(false)
      })
  }

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader className='text-center font-semibold'>Create New Post</DialogHeader>
        <div className='flex gap-3 items-center'>
          <Avatar>
            <AvatarImage src={user.profilePic && user.profilePic.url} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className='font-semibold text-xs'>{user.username}</h1>
            <p className='text-gray-600 text-xs'>{user.bio}</p>
          </div>
        </div>
        <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} className='focus-visible:ring-transparent border-none' placeholder='write a caption' />
        <input ref={imageref} onChange={handelChange} type='file' className='hidden' />
        {
          imagePreview &&
          <div className='flex items-center justify-center'>
            <img src={imagePreview && URL.createObjectURL(imagePreview)} className='object-contain rounded-md w-80 h-80' alt="" />
          </div>
        }
        <Button onClick={() => imageref.current.click()} className='w-fit mx-auto bg-[#0095f6] hover:bg-[#77acdd] '>Select from gallary</Button>
        {imagePreview && (
          loding ? (
            <Button>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              plase wite
            </Button>
          ) : (
            <Button onClick={createPostHandelear}>Post</Button>
          )
        )

        }
      </DialogContent>
    </Dialog>
  )
}

export default CreatePost
