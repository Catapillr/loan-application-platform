export default amountInPounds =>
  typeof amountInPounds === String
    ? parseInt(amountInPounds.substring(1)) * 100
    : amountInPounds * 100
