export default {
  Counter: class {
    constructor() {}
    inc() {}
  },
  Histogram: class {
    constructor() {}
    observe() {}
  },
  register: {
    contentType: 'text/plain',
    metrics: async () => '',
  },
};
