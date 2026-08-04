const mockModel = () => ({
  findOne: async () => null,
  findById: async () => null,
  find: async () => [],
  findByIdAndUpdate: async () => null,
  findByIdAndDelete: async () => null,
  create: async () => ({}),
});

class MockSchema {
  constructor() {}
}

const mongoose = {
  connect: async () => {},
  disconnect: async () => {},
  connection: { on: () => {} },
  model: () => mockModel(),
  Schema: MockSchema,
};

export default mongoose;
export { MockSchema as Schema };
