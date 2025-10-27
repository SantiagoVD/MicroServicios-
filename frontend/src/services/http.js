import axios from 'axios'

// Simple Axios instance; could add interceptors for auth later
export const http = axios.create({
  // Base left empty to use full URLs in service modules
  timeout: 8000,
})

export function setAuthHeader(token) {
  if (token) http.defaults.headers.common['Authorization'] = `Bearer ${token}`
  else delete http.defaults.headers.common['Authorization']
}

