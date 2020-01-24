import faker from 'faker'

const getId = faker.random.uuid

const buildClub = {
  id: getId(),
  companyName: faker.company.companyName(),
  companyNumber: faker.random.number(9999999),
  websiteURL: faker.internet.url,
  imageURL: faker.image.imageUrl,
}

export default { buildClub }
