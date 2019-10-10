import * as R from "ramda" //eslint-disable-line

const convertToPounds = (amount, fromPennies) =>
  `£${(parseInt(amount) / (fromPennies ? 100 : 1)).toFixed(2)}`

export default convertToPounds
