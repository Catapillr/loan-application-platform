import { useEffect } from "react"

const useOnOutsideClick = ({ className, openState, setOpenState }) =>
  useEffect(() => {
    const outsideClickListener = event => {
      if (event.target.closest(className) === null && openState) {
        setOpenState(false)
        removeClickListener()
      }
    }

    const removeClickListener = () => {
      document.removeEventListener("click", outsideClickListener)
    }
    const addClickListener = () => {
      document.addEventListener("click", outsideClickListener)
    }

    openState && addClickListener()
    return removeClickListener
  }, [openState])

export default useOnOutsideClick
