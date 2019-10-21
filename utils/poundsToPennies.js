import currencyFormatter from "currency-formatter"

export default amountInPounds =>
  typeof amountInPounds === "string"
    ? currencyFormatter.unformat(amountInPounds, { code: "GBP" }) * 100
    : amountInPounds * 100
