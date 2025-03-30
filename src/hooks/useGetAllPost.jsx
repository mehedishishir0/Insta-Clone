import { useAppContext } from "@/Context/Context"
import { setPost } from "@/Redux/postSlice"
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

const usegetAllPost = () => {

    const { url } = useAppContext()
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchAllPost = async () => {
            await axios.get(`${url}/api/post/allpost`)
                .then((response) => {
                    dispatch(setPost(response.data.data))
                })
                .catch((err) => {
                    console.error(err.response.data.message)
                })
        }
        fetchAllPost()
    },[])
}

export default usegetAllPost