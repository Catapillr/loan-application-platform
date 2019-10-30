import mangopay from "mangopay2-nodejs-sdk"

const mango = new mangopay({
  clientId: process.env.MANGO_CLIENT_ID,
  clientApiKey: process.env.MANGO_KEY,
  baseUrl: process.env.MANGO_URL,
})

export default mango
