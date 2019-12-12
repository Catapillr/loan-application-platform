import calculatePlatformFees from "../calculatePlatformFees"

test("platform fees are calculated correctly", () => {
  let actual = calculatePlatformFees({
    minimumLoanFee: 10000,
    loanAmount: 200000,
  })
  let expected = 12600
  expect(actual).toBe(expected)

  actual = calculatePlatformFees({
    minimumLoanFee: 10000,
    loanAmount: 350000,
  })
  expected = 13920
  expect(actual).toBe(expected)

  actual = calculatePlatformFees({
    minimumLoanFee: 10000,
    loanAmount: 749000,
  })
  expected = 16920
  expect(actual).toBe(expected)

  actual = calculatePlatformFees({
    minimumLoanFee: 10000,
    loanAmount: 900000,
  })
  expected = 17760
  expect(actual).toBe(expected)

  actual = calculatePlatformFees({
    minimumLoanFee: 10000,
    loanAmount: 900100,
  })
  expected = 18600
  expect(actual).toBe(expected)
})

test("platform fees are calculated correctly when minimum loan fee is different", () => {
  let actual = calculatePlatformFees({
    minimumLoanFee: 20000,
    loanAmount: 200000,
  })
  let expected = 25200
  expect(actual).toBe(expected)

  actual = calculatePlatformFees({
    minimumLoanFee: 15000,
    loanAmount: 350000,
  })
  expected = 20880
  expect(actual).toBe(expected)

  actual = calculatePlatformFees({
    minimumLoanFee: 12500,
    loanAmount: 749000,
  })
  expected = 21120
  expect(actual).toBe(expected)

  actual = calculatePlatformFees({
    minimumLoanFee: 11000,
    loanAmount: 900000,
  })
  expected = 19560
  expect(actual).toBe(expected)

  actual = calculatePlatformFees({
    minimumLoanFee: 25000,
    loanAmount: 900100,
  })
  expected = 46560
  expect(actual).toBe(expected)
})
