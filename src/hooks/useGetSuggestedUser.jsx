import { useAppContext } from "@/Context/Context"
import { setSuggestedUser } from "@/Redux/authSlice"
import { setPost } from "@/Redux/postSlice"
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

const usegetSuggestedUser = () => {

    const { url } = useAppContext()
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchAllPost = async () => {
            await axios.get(`${url}/api/user/suggested`)
                .then((response) => {
                    dispatch(setSuggestedUser(response.data.data))
                })
                .catch((err) => {
                    console.error(err.response.data.message)
                })
        }
        fetchAllPost()
    },[])
}

export default usegetSuggestedUser