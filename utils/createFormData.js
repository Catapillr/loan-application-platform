import * as R from "ramda"
export default values => {
    const form = new FormData()

    const [files, fields] = R.partition(value => value instanceof File)(values)

    R.mapObjIndexed((val, key) => form.append(key, val))(fields)
    R.mapObjIndexed((val, key) => form.append(key, val, val.name))(files)

return form
}