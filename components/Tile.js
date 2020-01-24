import styled from 'styled-components'

const Tile = styled.div.attrs({
  className:
    'flex flex-col justify-between bg-white flex-wrap w-full px-4 pb-5 pt-9d5',
})`
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.02), 0 4px 6px 1px rgba(0, 0, 0, 0.06);
`
const TileContainer = styled.section.attrs({
  className: 'mb-10',
})``

const TileGrid = styled.section.attrs({
  className: '',
})`
  display: grid;
  grid-column-gap: ${cssTheme('spacing.5')};
  grid-row-gap: ${cssTheme('spacing.5')};
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto;
`

const Button = styled.button.attrs({
  className:
    'text-teal border border-teal rounded-full py-2 w-full text-center',
})``

const Icon = styled.div`
  background: ${({ src }) => `url(${src})`};
`

const Link = styled.a.attrs({
  className: 'underline text-teal db mb-3d5',
})``

const LinkButton = styled(Button).attrs({
  as: 'a',
})``

const Name = styled.span.attrs({
  className: 'font-bold w-8/12 mb-2 w-full mb-4d5',
})``

const Subtitle = styled.h2.attrs({
  className: 'font-2xl font-bold',
})``

export {
  Tile,
  TileContainer,
  TileGrid,
  Icon,
  Name,
  Button,
  LinkButton,
  Link,
  Subtitle,
}
