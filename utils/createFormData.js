import * as R from "ramda"
export default values => {
  const form = new FormData()

  const [files, fields] = R.partition(value => value instanceof File)(values)

  const [complexFields, simpleFields] = R.partition(
    value => typeof value === "object"
  )(fields)

  R.mapObjIndexed((val, key) => form.append(key, val))(simpleFields)
  R.mapObjIndexed((val, key) => form.append(key, JSON.stringify(val)))(
    complexFields
  )
  R.mapObjIndexed((val, key) => form.append(key, val, val.name))(files)

  return form
}
