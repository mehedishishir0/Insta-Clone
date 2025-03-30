import React, { useState } from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { useAppContext } from '@/Context/Context'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

const Sginup = () => {
    const { url } = useAppContext()
    const naviget = useNavigate()
    const [input, setInput] = useState({
        username: '',
        email: '',
        password: ''
    })
    const [loding, setLoding] = useState(false)
    const handelChange = (event) => {
        setInput({ ...input, [event.target.name]: event.target.value })
    }
    const handelSubmit = async (event) => {
        event.preventDefault()
        setLoding(true)
        await axios.post(`${url}/api/user/register`, input, {
            headers: { 'Content-Type': 'application/json' }
        }
        )
            .then((response) => {
                toast.success(response.data.message)
                setInput({
                    username: '',
                    email: '',
                    password: ''
                })
                naviget('/login')
            })
            .catch((error) => {
                toast.error(error.response.data.message)
            })
            .finally(() => setLoding(false))
    }

    return (
        <div className='flex w-full h-screen border justify-center items-center'>
            <form onSubmit={handelSubmit} className='shadow-lg flex-col flex gap-5 p-8'>
                <div className='my-4'>
                    <h1 className='text-center font-bold text-xl'>LOGO</h1>
                    <p className='text-sm text-center'>Signup to see photos & videos from your friends</p>
                </div>
                <div>
                    <Label>Username</Label>
                    <Input type="text" name="username" value={input.username} onChange={handelChange} className='my-2' placeholder='Username' required />
                </div>
                <div>
                    <Label>Email</Label>
                    <Input type="email" name="email" value={input.email} onChange={handelChange} className='my-2' placeholder='email' required />
                </div>
                <div>
                    <Label>Password</Label>
                    <Input type="password" name="password" value={input.password} onChange={handelChange} className='my-2' placeholder='password' required />
                </div>
                {
                    loding ? 
                    <Button>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Please wait
                    </Button>
                    : <Button variant="secondary" type='submit'>sign up</Button>
                }
                <span>Already have an account? <Link to={'/login'} className='text-blue-600'>Login</Link></span>
            </form>
        </div>
    )
}

export default Sginup