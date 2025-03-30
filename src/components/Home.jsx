import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSidebar from './RightSidebar'
import usegetAllPost from '@/hooks/useGetAllPost'
import usegetSuggestedUser from '@/hooks/useGetSuggestedUser'

const Home = () => {
  usegetAllPost()
  usegetSuggestedUser()
  return (
    <div className='flex w-full'>
      <Feed />
      <RightSidebar />
    </div>
  )
}

export default Home