const mockModel = () => ({
  findOne: async () => null,
  findById: async () => null,
  find: async () => [],
  findByIdAndUpdate: async () => null,
  findByIdAndDelete: async () => null,
  create: async () => ({}),
});

export default {
  connect: async () => {},
  disconnect: async () => {},
  connection: { on: () => {} },
  model: () => mockModel(),
};

export const Schema = class {};
