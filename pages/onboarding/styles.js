import styled from "styled-components"

const Copy = styled.p.attrs(() => ({
  className: "font-base",
}))``

const Heading = styled.h1.attrs(() => ({
  className: "font-lg font-bold",
}))``

const Button = styled.button.attrs(() => ({
  className: "text-white bg-teal font-base py-2 px-5d5 rounded-full",
}))`
  box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.03),
    0 6px 10px 2px rgba(20, 190, 203, 0.3);
`
export { Heading, Copy, Button }
