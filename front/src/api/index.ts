import axios from 'axios'

const PORT = import.meta.env.API_PORT || 6767
const API_URL = `http://localhost:${PORT}`

const api = axios.create({
    baseURL : API_URL
})

export default api