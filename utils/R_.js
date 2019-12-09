// Custom combinations of ramda functions
import * as R from 'ramda'

const mapIndexed = R.addIndex(R.map)
const reduceIndexed = R.addIndex(R.reduce)

export default {
  mapIndexed,
  reduceIndexed,
}
