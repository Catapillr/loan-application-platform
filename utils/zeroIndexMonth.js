import * as R from 'ramda'

export default date => R.assoc('month', date.month - 1, date)
