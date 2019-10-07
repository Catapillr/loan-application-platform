import styled from "styled-components"

const Copy = styled.p.attrs(() => ({
  className: "font-base",
}))``

const Heading = styled.h1.attrs(() => ({
  className: "font-lg font-bold",
}))``

const Button = styled.button.attrs(({ className }) => ({
  className: `${className} font-base py-2 px-5d5 rounded-full`,
  type: "button",
}))``

export { Heading, Copy, Button }
