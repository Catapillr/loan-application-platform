import * as R from "ramda" //eslint-disable-line

const convertToSterling = (amount, fromPennies) => `£${(parseInt(amount) / (fromPennies ? 100 : 1)).toFixed(2)}`

export default convertToSterling
