import { SubscriptionsDatabase } from "./database";
import { Inject } from "typescript-ioc";

export interface Streamer {
  _id?: string;
  _rev?: string;
  url: string;
  name: string;
  tags: string[];
}

export interface Stream {
  _id?: string;
  url: string;
}

export class Subscriptions {

  @Inject
  private db: SubscriptionsDatabase;

  constructor() {
  }

  async getStreamers() {
    try {
      let res = await this.db.query('subscriptions_index/by_url');
      return res;
    } catch(error) {
      throw error;
    }
  }

  async addStreamer(streamer: Streamer) {

    streamer._id = `streamer:${streamer.url}`;

    console.log('Add streamer', streamer);

    let doc;

    try {
      doc = await this.db.get(
        streamer._id
      );
    } catch(error) {
      console.log(error);
    }

    try {
      if (doc) {
        streamer._rev = doc._rev;
      }

      await this.db.put(streamer);
    } catch(error) {
      console.log(error);
    }

  }

  async addStream(stream: Stream) {

  }

}
