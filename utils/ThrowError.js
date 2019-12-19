import { useEffect } from 'react'
const ThrowError = () => {
  useEffect(() => {
    throw new Error()
  }, [])

  return null
}

export default ThrowError
