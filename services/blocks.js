import { Request as JSONRequest } from './request';

class Blocks extends JSONRequest {
  constructor() {
    super({ bakend: process.env.BAKEND, blockchain: process.env.BLOCKCHAIN })
  }
  getBlocksLatest() {
    return this.getPrepared('/v1/block/latest')
  }
  getBlocksById(id) {
    return this.getPrepared(`/v1/block/${id}`)
  }
  getBlocksByProducer(id) {
    return this.getPrepared(`/v1/block/producer/${id}`)
  }
}

export let blocks = new Blocks();