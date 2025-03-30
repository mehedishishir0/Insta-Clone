import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import Comment from './Comment'
import axios from 'axios'
import { useAppContext } from '@/Context/Context'
import { toast } from 'sonner'
import { setPost } from '@/Redux/postSlice'


const CommentDialog = ({ setOpen, open, post }) => {
    const [text, setText] = useState("")
    const { url } = useAppContext()
    const { posts } = useSelector(store => store.posts)
    const { selectedPost } = useSelector(store => store.posts)
    const [comment, setComment] = useState(selectedPost?.comments)
    const dispatch = useDispatch()

    useEffect(() => {
        if (selectedPost) {
            setComment(selectedPost.comments)
        }
    }, [selectedPost])

    const changeEventHandler = (e) => {
        const inputText = e.target.value
        if (inputText.trim()) {
            setText(inputText)
        } else {
            setText("")
        }
    }

    const sendCommentHandelar = async () => {
        await axios.post(`${url}/api/post/sendcomment/${selectedPost?._id}`, { commentText: text }, {
            headers: { 'Content-Type': 'application/json' }
        }).then((response) => {
            const updateCommentData = [...comment, response.data.data]
            setComment(updateCommentData)
            const updatedPostData = posts.map((postItem) => postItem._id === selectedPost?._id ? { ...postItem, comments: updateCommentData } : postItem)
            dispatch(setPost(updatedPostData))
            setText("")
            toast.success(response.data.message);
        })
            .catch((error) => {
                toast.error(error.response.data.message)
            })
    }
    return (
        <Dialog open={open} className='w-96'>
            <DialogContent onInteractOutside={() => setOpen(false)} className='max-w-5xl p-0 flex flex-col'>
                <div className='flex flex-1 '>
                    <div className='w-1/2 flex items-center'>
                        <img className='w-full h-full object-cover' src={open && selectedPost.image.url} alt="comment" />
                    </div>
                    <div className='w-1/2 flex flex-col justify-between'>
                        <div className='flex items-center justify-between p-4'>
                            <div className='flex gap-3 items-center'>
                                <Link>
                                    <Avatar>
                                        <AvatarImage src={open && selectedPost?.author.profilePic?.url} />
                                        <AvatarFallback >CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <Link className='font-semibold text-xs'>{open && selectedPost?.author.username}</Link>
                                </div>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <MoreHorizontal className='cursor-pointer' />
                                </DialogTrigger>
                                <DialogContent>
                                    <button className='cursor-pointer text-center text-[#ed4956] font-bold'>Report</button>
                                    <button className='cursor-pointer text-center text-[#ed4956] font-bold'>Unfollow</button>
                                    <button className='cursor-pointer text-center  '>Add to favorites</button>
                                    <button className='cursor-pointer text-center  '>Share to...</button>
                                    <button className='cursor-pointer text-center '>Copy link</button>
                                    <button className='cursor-pointer text-center '>Cancel</button>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <hr className=' border-gray-200' />
                        {open && selectedPost?.comments.length > 0 ?
                            <div className='flex-1 overflow-y-auto max-h-96 p-4'>
                                {comment && comment.map((comment) => <Comment key={comment._id} comment={comment} />)}
                            </div>
                            :
                            <div className='flex flex-col items-center gap-3'>
                                <h1 className='font-black text-xl'>No comments yet.</h1>
                                <p className='text-sm font-semibold'>Start the conversation.</p>
                            </div>
                        }
                        <div className='p-4'>
                            <div className='flex items-center gap-2'>
                                <input onChange={changeEventHandler} value={text} type="text" placeholder='Add a comments...' className='w-full text-sm outline-none border border-gray-300 p-1 rounded' />
                                <Button disabled={!text.trim()} onClick={sendCommentHandelar} variant='outline'>Send</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CommentDialog
