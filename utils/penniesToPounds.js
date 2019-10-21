import currencyFormatter from "currency-formatter"

const penniesToPounds = amountInPennies =>
  typeof amountInPennies === "string"
    ? currencyFormatter.unformat(amountInPennies, { code: "GBP" }) / 100
    : amountInPennies / 100

export default penniesToPounds
