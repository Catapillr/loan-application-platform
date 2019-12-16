import * as R from 'ramda'

export default path => R.pipe(R.without(['']), R.last)(path.split('/'))
