import * as R from "ramda" //eslint-disable-line

const getThemeValue = strPath => props => {
  const path = R.split(".", strPath)
  return R.path(path, props.theme)
}

export { getThemeValue as default }
