import { Request as JSONRequest } from './request';

class Globals extends JSONRequest {
  constructor() {
    super({ bakend: process.env.BAKEND, blockchain: process.env.BLOCKCHAIN })
  }
  getGlobals() {
    return this.getPrepared(`/v1/global`)
  }
}

export let globals = new Globals();