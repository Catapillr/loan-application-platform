import { POUNDS, PENNIES } from "../utils/constants"

export default (amount, denomination = POUNDS) => {
  const sanitised = `${
    denomination === PENNIES ? amount / 100 : amount
  }`.replace(/[^0-9.]/g, "")

  const currency = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(sanitised)

  return currency !== "£NaN" ? currency : "£0.00"
}
