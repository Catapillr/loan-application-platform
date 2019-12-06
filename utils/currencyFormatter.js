import currencyFormatter from "currency-formatter"

const formatToGBP = amount => currencyFormatter.format(amount, { code: "GBP" })
const unformatFromGBP = amount =>
  currencyFormatter.unformat(amount, { code: "GBP" })

export { formatToGBP, unformatFromGBP }
