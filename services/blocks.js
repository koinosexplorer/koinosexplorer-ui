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
  getBlocksByProducer(id, page = 0, page_size = 30) {
    return this.getPrepared(`/v1/block/producer/${id}`, { page, page_size })
  }
}

export let blocks = new Blocks();