import React from "react"
import styled from "styled-components"

const Container = styled.section.attrs({
  className: "bg-white w-full py-10 px-12",
})``

const Nav = styled.nav.attrs({
  className: "flex flex-wrap justify-between items-center",
})``

const Links = styled.div.attrs({
  className: "flex justify-between mr-auto mb-4d5",
})``

const FooterLink = styled.a.attrs({
  className: "uppercase text-teal mr-4",
})``

const Rights = styled.div.attrs({
  className: "w-full pt-4d5 border-t border-midgray text-teal text-right",
})``

const Footer = () => (
  <Container>
    <Nav>
      <Links>
        <FooterLink>Help</FooterLink>
        <FooterLink>Contact us</FooterLink>
        <FooterLink>About</FooterLink>
        <FooterLink>T&C</FooterLink>
      </Links>
      <Rights>Catapillr. All rights reserved.</Rights>
    </Nav>
  </Container>
)

export default Footer
