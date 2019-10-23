import currencyFormatter from "currency-formatter"

const formatToGBP = amount => currencyFormatter.format(amount, { code: "GBP" })

export default formatToGBP
