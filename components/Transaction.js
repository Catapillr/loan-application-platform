import React from 'react'
import styled from 'styled-components'

const _Transaction = styled.li.attrs({
  className: 'flex justify-between flex-wrap w-full mb-5',
})``

const Name = styled.span.attrs({
  className: 'font-bold w-8/12 mb-2',
})``

const Amount = styled.span.attrs(({ children }) => {
  return {
    className: `w-4/12 text-right ${
      children.startsWith('-') ? 'text-red' : 'text-green'
    }`,
  }
})``

const Date = styled.span.attrs({
  className: 'text-gray',
})``

const Transaction = ({ name, amount, date }) => (
  <_Transaction>
    <Name>{name}</Name>
    <Amount>{amount}</Amount>
    <Date>{date}</Date>
  </_Transaction>
)

export default Transaction
