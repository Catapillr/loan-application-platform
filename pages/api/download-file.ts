import { NextApiRequest, NextApiResponse } from "next"
import * as R from "ramda"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  var file = R.pipe(
    R.keys,
    R.head
  )(req.query)

  // @ts-ignore
  return res.download(file)
}
