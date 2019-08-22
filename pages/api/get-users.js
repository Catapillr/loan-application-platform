import { prisma } from "../../prisma/generated"

export default async (req, res) => {
  // const newUser = await prisma.createUser({ name: "Alice" })
  // console.log(`Created new user: ${newUser.name} (ID: ${newUser.id})`)

  // Read all users from the database and print them to the console
  const allUsers = await prisma.users()

  res.setHeader("Content-Type", "application/json")
  res.statusCode = 200
  res.json({ allUsers })
}
