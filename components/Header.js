import { useState } from "react"
import styled from "styled-components"

import useOnOutsideClick from "../hooks/useOnOutsideClick"
import { useAuth } from "../context/auth-context"

import logo from "../static/icons/catapillr-orange.svg"
import avatar from "../static/icons/avatar.svg"
import logoutIcon from "../static/icons/logout.svg"
import downChevron from "../static/icons/down-chevron.svg"

const Header = ({ activeHref }) => {
  const { logout } = useAuth()

  const [logoutDropdownOpen, setLogoutDropdownOpen] = useState(false)
  const toggleLogoutDropdown = () =>
    setLogoutDropdownOpen(prevState => !prevState)

  const [paymentDropdownOpen, setPaymentDropdownOpen] = useState(false)
  const togglePaymentDropdown = () =>
    setPaymentDropdownOpen(prevState => !prevState)

  useOnOutsideClick({
    className: "logout-dropdown",
    openState: logoutDropdownOpen,
    setOpenState: setLogoutDropdownOpen,
  })

  useOnOutsideClick({
    className: "payment-dropdown",
    openState: paymentDropdownOpen,
    setOpenState: setPaymentDropdownOpen,
  })

  return (
    <Container>
      <Nav>
        <Logo href="/dashboard" activeHref={activeHref} />
        <Links>
          <HeaderLink activeHref={activeHref} href="/dashboard">
            My Payments
          </HeaderLink>
          <div>
            <div className="flex flex-row" onClick={togglePaymentDropdown}>
              <HeaderLink
                activeHref={activeHref}
                href="/make-a-payment"
                as="div"
              >
                Make a payment
              </HeaderLink>
              <DownChevron src={downChevron} alt="Open dropdown menu" />
            </div>
            <div className="relative">
              <PaymentDropdownContainer>
                <PaymentDropdown
                  {...{ paymentDropdownOpen }}
                  className="payment-dropdown"
                >
                  <div className="w-full">
                    <div className="text-base font-normal py-2 pl-2 w-full">
                      Chilcare provider
                    </div>
                    <div className="text-base font-normal py-2 pl-2 w-full">
                      Tax free account
                    </div>
                  </div>
                </PaymentDropdown>
              </PaymentDropdownContainer>
            </div>
          </div>
        </Links>
        <Avatar className="cursor-pointer" onClick={toggleLogoutDropdown} />
      </Nav>
      <LogoutDropdownContainer>
        <LogoutDropdown
          {...{ logoutDropdownOpen }}
          className="logout-dropdown"
          onClick={logout}
        >
          <img src={logoutIcon} alt="Log out" />
          <p className="ml-2">Log out</p>
        </LogoutDropdown>
      </LogoutDropdownContainer>
    </Container>
  )
}

const DownChevron = styled.img`
  height: 12px;
  align-self: center;
`

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

const LogoutDropdownContainer = styled.div.attrs({
  className: "absolute px-12 w-full flex justify-end",
})`
  bottom: -40px;
  right: 0;
`

const PaymentDropdownContainer = styled.div.attrs({
  className: "absolute w-full flex justify-start",
})`
  top: 10px;
`

const LogoutDropdown = styled.div.attrs({
  className: "px-4 flex items-center bg-white cursor-pointer",
})`
  height: 40px;
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.02), 0 4px 6px 1px rgba(0, 0, 0, 0.06);
  display: ${({ logoutDropdownOpen }) =>
    logoutDropdownOpen ? "flex" : "none"};
`

const PaymentDropdown = styled.div.attrs({
  className: "flex bg-white cursor-pointer w-full",
})`
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.02), 0 4px 6px 1px rgba(0, 0, 0, 0.06);
  display: ${({ paymentDropdownOpen }) =>
    paymentDropdownOpen ? "flex" : "none"};
`

export default Header
