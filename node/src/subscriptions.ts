import { SubscriptionsDatabase } from "./database";
import { Inject } from "typescript-ioc";
import { Streamer } from "./models/streamer";
import { Stream } from "./models/stream";

export class Subscriptions {

  @Inject
  private db: SubscriptionsDatabase;

  constructor() {
  }

  async getStreamers(): Promise<Streamer[]> {
    try {
      let res = await this.db.query('subscriptions_index/streamers');

      let streamers = res.rows.map(o => o.value);

      return streamers;
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
