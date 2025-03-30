import { useAppContext } from "@/Context/Context"
import { setUserProfile } from "@/Redux/authSlice"
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

const usegetUserProfile = (userId) => {
    const { url } = useAppContext()
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchAllPost = async () => {
            await axios.get(`${url}/api/user/profile/${userId}`)
                .then((response) => {
                    dispatch(setUserProfile(response.data.data))
                })
                .catch((err) => {
                    console.error(err.response.data.message)
                })
        }
        fetchAllPost()
    }, [userId])
}

export default usegetUserProfile