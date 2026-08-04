const mockIo = {
  on: () => mockIo,
  to: () => ({ emit: () => {} }),
};

export default mockIo;
export const Server = class {
  constructor() {}
};
