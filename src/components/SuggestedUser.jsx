import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const SuggestedUser = () => {
    const { suggesteduser } = useSelector(store => store.auth)
   
    const textCutting = (text) => {
        if (text.length > 25) {
            return `${text.slice(0, 25)}...`
        }
        return text
    }

    return (
        <div className='my-10 flex flex-col gap-5'>
            <div className='flex items-center justify-between text-sm'>
                <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
                <span className='font-medium cursor-pointer'>See all</span>
            </div>
            {suggesteduser && suggesteduser.map((Suser) => (
                <div key={Suser._id} className='flex items-center gap-5 justify-between'>
                    <div className='flex items-center gap-3'>
                        <Link to={`/profile/${Suser._id}`}>
                            <Avatar>
                                <AvatarImage src={Suser.profilePic && Suser.profilePic.url} alt='User' />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </Link>
                        <div>
                            <h1 className='font-semibold text-sm'><Link to={`/profile/${Suser._id}`}>{Suser.username}</Link></h1>
                            <p className='text-gray-500 text-sm'>{textCutting(Suser.bio) || 'Set bio'}</p>
                        </div>
                    </div>
                    <span className='text-[#3badf8] text-xs font-bold cursor-pointer hover:text-[#88c9f5]'>Follow</span>
                </div>
            ))

            }
        </div>
    )
}

export default SuggestedUser
