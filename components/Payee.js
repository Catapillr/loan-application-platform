import React from "react"
import styled from "styled-components"
import { NURSERY, CHILDMINDER, CLUB } from "../components/constants"

import nursery from "../static/icons/nursery.svg"
import childminder from "../static/icons/childminder.svg"
import club from "../static/icons/club.svg"

const _Payee = styled.div.attrs({
  className:
    "flex flex-col justify-between bg-white flex-wrap w-full px-4 pb-5 pt-9d5",
})`
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.02), 0 4px 6px 1px rgba(0, 0, 0, 0.06);
`

const Name = styled.span.attrs({
  className: "font-bold w-8/12 mb-2 w-full mb-4d5",
})``

const Icon = styled.div.attrs({
  className: "w-10 h-10 mb-2",
})`
  background: ${({ src }) => `url(${src})`};
`

const childcareToIcon = childcareType => {
  switch (childcareType) {
    case NURSERY:
      return nursery
    case CHILDMINDER:
      return childminder
    case CLUB:
      return club
    default:
      return nursery
  }
}
const Button = styled.a.attrs({
  className:
    "text-teal border border-teal rounded-full py-2 w-full text-center",
})``

const Payee = ({ name, childcareType, slug }) => (
  <_Payee>
    <Icon src={childcareToIcon(childcareType)} />
    <Name>{name}</Name>
    <Button href={`${process.env.HOST}/pay/${slug}`}>Pay</Button>
  </_Payee>
)

export default Payee
