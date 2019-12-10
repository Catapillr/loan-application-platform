import { curry } from 'ramda'
// Function allows us to automatically filter out user input that does not fit the specified pattern
// Curried with ramda, and can use R.__ as a placeholder for unknown arguments that aren't "e"

export default curry((setFieldValue, fieldName, pattern, e) => {
  if (e.target.value === '' || pattern.test(e.target.value)) {
    setFieldValue(fieldName, e.target.value)
  }
})
