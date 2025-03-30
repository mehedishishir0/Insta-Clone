import React, { useEffect } from 'react'
import Sginup from './components/Sginup'
import axios from 'axios'
import { createBrowserRouter, RouterProvider, } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import Login from './components/Login'
import Home from './components/Home'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import ChatPage from './components/ChatPage'
import { io } from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux'
import { useAppContext } from './Context/Context'
import { setSocket } from './Redux/socketSlice'
import { setOnlineUser } from './Redux/chatSlice'
axios.defaults.withCredentials = true

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'profile/:id',
        element: <Profile />,
      },
      {
        path: 'chat',
        element: <ChatPage />,
      },
      {
        path: 'account/edit',
        element: <EditProfile />,
      }
    ],
  },
  {
    path: '/signup',
    element: <Sginup />,
  },
  {
    path: '/login',
    element: <Login />,
  }

  // other routes...
])


const App = () => {
  const { user } = useSelector(store => store.auth)
  const { url } = useAppContext()
  const dispatch = useDispatch()
  const {socket} = useSelector(store => store.socketio)

  useEffect(() => {
    if (user) {
      const socketio = io(url, {
        query: {
          userId: user._id
        },
        transports: ['websocket']
      });
      dispatch(setSocket(socketio))

      socketio.on('getOnlineUsers', (onlineUser) => {
        dispatch(setOnlineUser(onlineUser))
      })

      return () => {
        socketio.close()
        dispatch(setSocket(null))
      }
    }
    else if(socket) {
      socket.close()
      dispatch(setSocket(null))
    }
  }, [user, dispatch])

  return (
    <div>
      <RouterProvider router={browserRouter} />
    </div>
  )
}

export default App
