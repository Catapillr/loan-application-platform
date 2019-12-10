import { unformatFromGBP } from './currencyFormatter'

export default amountInPounds =>
  typeof amountInPounds === 'string'
    ? unformatFromGBP(amountInPounds) * 100
    : amountInPounds * 100
