import { Request as JSONRequest } from './request';

class Blocks extends JSONRequest {
  constructor() {
    super({ bakend: process.env.BAKEND, blockchain: process.env.BLOCKCHAIN })
  }
  getBlocksLatest() {
    return this.getPrepared('/v1/block/latest', { page_size: 30 })
  }
  getBlocksById(id) {
    return this.getPrepared(`/v1/block/${id}`, { page_size: 30 })
  }
  getBlocksByProducer(id) {
    return this.getPrepared(`/v1/block/producer/${id}`, { page_size: 30 })
  }
}

export let blocks = new Blocks();