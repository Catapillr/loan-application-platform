import * as R from 'ramda' //eslint-disable-line

const cssTheme = strPath => props => {
  const path = R.split('.', strPath)
  return R.path(path, props.theme)
}

module.exports = cssTheme
