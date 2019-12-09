import { unformatFromGBP } from './currencyFormatter'

const penniesToPounds = amountInPennies =>
  typeof amountInPennies === 'string'
    ? unformatFromGBP(amountInPennies) / 100
    : amountInPennies / 100

export default penniesToPounds
