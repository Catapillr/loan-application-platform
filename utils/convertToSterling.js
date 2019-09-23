import * as R from "ramda" //eslint-disable-line

const convertToSterling = amount => `£${(parseInt(amount) / 100).toFixed(2)}`

export default convertToSterling
