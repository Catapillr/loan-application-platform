import { useState, useEffect } from "react"
import styled from "styled-components"

import { useAuth } from "../context/auth-context"

import logo from "../static/icons/catapillr-orange.svg"
import avatar from "../static/icons/avatar.svg"
import logoutIcon from "../static/icons/logout.svg"

const Container = styled.section.attrs({
  className: "bg-white w-full py-8 px-12 relative",
})`
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.02), 0 4px 6px 1px rgba(0, 0, 0, 0.06);
`

const Nav = styled.nav.attrs({
  className: "flex justify-between items-center",
})``

const Logo = styled.a.attrs({
  className: "mr-10d5",
})`
  background: url(${logo});
  width: 70px;
  height: 46px;
`

const Avatar = styled.div`
  background: url(${avatar});
  width: 47px;
  height: 47px;
`

const Links = styled.div.attrs({
  className: "flex justify-between mr-auto",
})`
  &::first-child {
    margin-right: 40px;
    font-weight: bold;
  }
`

const HeaderLink = styled.a.attrs({
  className: "mr-5 font-lg font-bold",
})`
  box-shadow: ${({ href, activeHref }) =>
    href === activeHref ? `inset 0 -10px 0 0 #FFC67E` : "inherit"};
`

const DropdownContainer = styled.div`
  bottom: -40px;
  right: 0;
`

const Dropdown = styled.div`
  height: 40px;
  box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.1);
  display: ${({ dropdownOpen }) => (dropdownOpen ? "flex" : "none")};
`

const Header = ({ activeHref }) => {
  const { logout } = useAuth()

  const [dropdownOpen, setDropwdownOpen] = useState(false)
  const toggleDropdown = () => setDropwdownOpen(!dropdownOpen)

  useEffect(() => {
    const outsideClickListener = event => {
      if (
        event.target.closest(".onclick-keep-dropdown-open-area") === null &&
        dropdownOpen
      ) {
        setDropwdownOpen(false)
        removeClickListener()
      }
    }

    const removeClickListener = () => {
      document.removeEventListener("click", outsideClickListener)
    }
    const addClickListener = () => {
      document.addEventListener("click", outsideClickListener)
    }

    dropdownOpen && addClickListener()
    return removeClickListener
  }, [dropdownOpen])

  return (
    <Container>
      <Nav>
        <Logo href="/dashboard" activeHref={activeHref} />
        <Links>
          <HeaderLink activeHref={activeHref} href="/dashboard">
            My Payments
          </HeaderLink>
          <HeaderLink activeHref={activeHref} href="/make-a-payment">
            Make a payment
          </HeaderLink>
        </Links>
        <Avatar className="cursor-pointer" onClick={toggleDropdown} />
      </Nav>
      <DropdownContainer className="absolute px-12 w-full flex justify-end">
        <Dropdown
          {...{ dropdownOpen }}
          className="px-4 flex items-center bg-white cursor-pointer onclick-keep-dropdown-open-area"
          onClick={logout}
        >
          <img src={logoutIcon} alt="Log out" />
          <p className="ml-2">Log out</p>
        </Dropdown>
      </DropdownContainer>
    </Container>
  )
}

export default Header
