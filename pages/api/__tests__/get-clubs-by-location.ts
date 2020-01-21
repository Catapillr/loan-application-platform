import getClubsByLocation from '../private/get-clubs-by-location'
import { createMocks } from 'node-mocks-http'

jest.mock('../../../prisma/generated/ts')

test('get-clubs-by-location returns a nested object of "clubs" within "locations"', async () => {
  const { req, res } = createMocks()

  const response = await getClubsByLocation(req, res)
  console.log('Get clubs by location', response)

  expect(response.status).toBe(200)
})

test.todo('get-clubs-by-location snapshot matches')
