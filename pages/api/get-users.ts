import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../prisma/generated"

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  // const newUser = await prisma.createUser({ name: "Alice" })
  // console.log(`Created new user: ${newUser.name} (ID: ${newUser.id})`)

  // Read all users from the database and print them to the console
  const allUsers = await prisma.users()

  res.status(200).json({ allUsers })
}
