export default class MockRedis {
  constructor() {
    this.incr = async () => 1;
    this.expire = async () => 1;
    this.pexpire = async () => 1;
    this.pttl = async () => 60000;
    this.ttl = async () => 60;
    this.set = async () => 'OK';
    this.get = async () => null;
    this.del = async () => 1;
    this.exists = async () => 0;
    this.hSet = async () => 1;
    this.setEx = async () => 'OK';
    this.quit = async () => 'OK';
  }
}
