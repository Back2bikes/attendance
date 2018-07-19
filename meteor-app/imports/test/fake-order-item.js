import faker from 'faker'

const orderItem = {
  partId: faker.finance.amount(),
  part: faker.lorem.sentence(),
  partNo: 91234567,
  addedAt: faker.date.recent(),
  price: (faker.finance.amount() / 10),
  qty: ((faker.finance.amount() / 500) + 1),
  userId: faker.finance.amount(),
}


export default orderItem