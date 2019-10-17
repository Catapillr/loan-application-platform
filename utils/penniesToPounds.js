export default amountInPennies =>
  typeof amountInPennies === String
    ? parseInt(amountInPennies.substring(1)) / 100
    : amountInPennies / 100
