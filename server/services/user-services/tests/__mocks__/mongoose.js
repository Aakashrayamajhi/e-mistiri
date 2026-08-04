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
  Schema: class {
    constructor(definition) {
      this.definition = definition;
    }
  },
};
