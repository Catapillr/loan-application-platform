import React from "react"
import styled from "styled-components"

import logo from "../static/icons/catapillr-orange.svg"
import avatar from "../static/icons/avatar.svg"

const Container = styled.section.attrs({
  className: "bg-white w-full py-8 px-12",
})`
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.02), 0 4px 6px 1px rgba(0, 0, 0, 0.06);
`

const Nav = styled.nav.attrs({
  className: "flex justify-between items-center",
})``

const Logo = styled.div.attrs({
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
  box-shadow: ${({ underline }) =>
    underline ? `inset 0 -10px 0 0 #FFC67E` : "inherit"};
`

const Header = () => (
  <Container>
    <Nav>
      <Logo />
      <Links>
        <HeaderLink underline>My Payments</HeaderLink>
        <HeaderLink href="/make-a-payment">Make a payment</HeaderLink>
        <HeaderLink>My contacts</HeaderLink>
      </Links>
      <Avatar />
    </Nav>
  </Container>
)

export default Header
