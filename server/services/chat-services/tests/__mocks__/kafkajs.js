export const Kafka = class {
  producer() {
    return {
      connect: async () => {},
      send: async () => {},
      disconnect: async () => {},
    };
  }
  consumer() {
    return {
      connect: async () => {},
      subscribe: async () => {},
      run: async () => {},
    };
  }
  admin() {
    return {
      createTopics: async () => {},
    };
  }
};

export const Partitioners = { LegacyPartitioner: 'legacy' };

export default { Kafka, Partitioners };
