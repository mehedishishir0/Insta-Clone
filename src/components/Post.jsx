import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { useAppContext } from '@/Context/Context'
import { toast } from 'sonner'
import { setPost, setSelectedPost } from '@/Redux/postSlice'
import { Badge } from './ui/badge'


const Post = ({ post }) => {
    const [text, setText] = useState("")
    const [open, setOpen] = useState(false)
    const { user } = useSelector(store => store.auth)
    const { posts } = useSelector(store => store.posts)
    const [menu, setMenu] = useState(false)
    const { url } = useAppContext()
    const dispatch = useDispatch()
    const [like, setlike] = useState(post.likes.includes(user?._id) || false)
    const [postLike, setPostLike] = useState(post.likes.length)
    const [showHeart, setShowHeart] = useState(false);
    const [comment, setComment] = useState(post.comments)

    const changeEventHandler = (e) => {
        const inputText = e.target.value
        if (inputText.trim()) {
            setText(inputText)
        } else {
            setText("")
        }
    }

    const deletePostHandelar = async () => {
        await axios.post(`${url}/api/post/deletepost/${post?._id}`)
            .then((response) => {
                toast.success(response.data.message)
                const updatePost = posts.filter((postItem) => postItem._id !== post._id)
                dispatch(setPost(updatePost))
                setMenu(false)
            })
            .catch((error) => {
                toast.error(error.response.data.message)
            })
    }

    const likeHandelar = async () => {
        if (like) {
            await axios.get(`${url}/api/post/dislike/${post?._id}`)
                .then((response) => {
                    setPostLike(postLike - 1)
                    setShowHeart(true);
                    setTimeout(() => setShowHeart(false), 1500);
                    const updatedPost = posts.map((postItem) => postItem._id === post._id ? {
                        ...postItem, likes: postItem.likes.filter((likeId) => likeId !== user?._id)
                    } : postItem)
                    dispatch(setPost(updatedPost))
                    setlike(!like)

                })
                .catch((error) => {
                    toast.error(error.response.data.message)
                })
        } else {
            await axios.get(`${url}/api/post/like/${post?._id}`)
                .then((response) => {
                    setPostLike(postLike + 1)
                    setShowHeart(true);
                    setTimeout(() => setShowHeart(false), 1500);
                    const updatedPost = posts.map((postItem) => postItem._id === post._id ? {
                        ...postItem, likes: [...postItem.likes, user?._id]
                    } : postItem)
                    dispatch(setPost(updatedPost))
                    setlike(!like)
                })
                .catch((error) => {
                    toast.error(error.response.data.message)
                })
        }
    }

    const commentHandelar = async () => {
        await axios.post(`${url}/api/post/sendcomment/${post?._id}`, { commentText: text }, {
            headers: { 'Content-Type': 'application/json' }
        })
            .then((response) => {
                const updateCommentData = [...comment, response.data.data]
                setComment(updateCommentData)
                const updatedPostData = posts.map((postItem) => postItem._id === post?._id ? { ...postItem, comments: updateCommentData } : postItem)
                dispatch(setPost(updatedPostData))
                setText("")
                toast.success(response.data.message);
            })
            .catch((error) => {
                toast.error(error.response.data.message)
            })
    }

    return (
        <div className='my-8 w-full max-w-sm mx-auto'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src={post.author.profilePic && post.author.profilePic.url} alt='User' />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className='flex items-center gap-2'>
                    <h1>{post.author.username}</h1>
                  {user._id === post.author._id && <Badge variant='secondary'>Auther</Badge>
                  }
                    </div>
                </div>
                <Dialog open={menu}>
                    <DialogTrigger asChild>
                        <MoreHorizontal onClick={() => setMenu(true)} className='cursor-pointer' />
                    </DialogTrigger>
                    <DialogContent onInteractOutside={() => setMenu(false)} className='flex flex-col items-center text-sm text-center'>
                        <Button variant='ghost' className='cursor-pointer font-bold w-fit text-[#ED4956]'>Unfllow</Button>
                        <Button variant='ghost' className='cursor-pointer w-fit '>Add to favorites</Button>
                        {user && user?._id === post?.author._id && <Button onClick={deletePostHandelar} variant='ghost' className='cursor-pointer w-fit '>Delete</Button>}
                        <Button onClick={() => setMenu(false)} variant='ghost' className='cursor-pointer w-fit '>Cancel</Button>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="relative w-full h-full  rounded-md overflow-hidden">
                {/* Image with Double Click Event */}
                <img
                    src={post.image && post.image.url}
                    alt="Post"
                    className='w-full h-full  rounded-sm my-2 object-contain'
                    onDoubleClick={likeHandelar}
                />

                {/* Animated Heart Icon */}
                {showHeart && (
                    <FaHeart
                        className="absolute text-red-500 text-6xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-100 animate-ping"
                    />
                )}
            </div>


            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    {like ? <FaHeart size={'22px'} className='cursor-pointer text-red-600' />
                        :
                        <FaRegHeart onClick={likeHandelar} size={'22px'} className='cursor-pointer' />
                    }
                    <MessageCircle onClick={() => { dispatch(setSelectedPost(post)), setOpen(true) }} className='cursor-pointer hover:text-gray-600' />
                    <Send className='cursor-pointer hover:text-gray-600' />
                </div>
                <Bookmark className='cursor-pointer hover:text-gray-600' />
            </div>
            <span className='font-medium block mb-2'>{postLike} Likes</span>
            <p>
                <span className='font-medium mr-2'>{post.author.username}</span>
                {post.caption}
            </p>
            <span onClick={() => { dispatch(setSelectedPost(post)), setOpen(true) }} className='cursor-pointer text-gray-400'>View all {comment.length} comments</span>

            <CommentDialog open={open} setOpen={setOpen} post={post} />

            <div className='flex items-center justify-between'>
                <input type="text"
                    value={text}
                    onChange={changeEventHandler}
                    placeholder='Add a comment...'
                    className='outline-none text-sm w-full'
                />
                {
                    text && <span onClick={commentHandelar} className='text-[#31a7f5] cursor-pointer hover:text-gray-500'>Post</span>
                }
            </div>
        </div>
    )
}

export default Post
