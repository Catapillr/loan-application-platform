import { NextApiRequest, NextApiResponse } from 'next'
import * as R from 'ramda'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<any> => {
  const file = R.pipe(R.keys, R.head)(req.query)

  // @ts-ignore
  return res.download(file)
}
