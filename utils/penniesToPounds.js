const penniesToPounds = amountInPennies =>
  typeof amountInPennies === "string"
    ? parseInt(amountInPennies.substring(1)) / 100
    : amountInPennies / 100

export default penniesToPounds
