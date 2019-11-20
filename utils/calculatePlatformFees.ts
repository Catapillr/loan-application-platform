import R from "ramda"

const loanBuckets = [
  [0, 100000],
  [100100, 200000],
  [200100, 300000],
  [300100, 400000],
  [400100, 500000],
  [500100, 600000],
  [600100, 700000],
  [700100, 800000],
  [800100, 900000],
  [900100, 1000000],
]

const calculatePlatformFees = ({ loanAmount, minimumLoanFee }) => {
  const bucketIndex = R.findIndex(
    (bucket: any[]) => loanAmount >= bucket[0] && loanAmount <= bucket[1]
  )(loanBuckets)

  const fee =
    Math.round((minimumLoanFee / 100) * Math.pow(1.05, bucketIndex)) * 100

  const feePlusVAT = Math.round((fee / 100) * 1.2) * 100
  return feePlusVAT
}

export { calculatePlatformFees as default }
