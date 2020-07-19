import { Inject } from "typescript-ioc";
import { SubscriptionsDatabase } from "../database";

export interface DesignDocument {
  _id: string;
  _rev?: string;
  views: any;
}

function emit(key: any, doc?: any) { }

export class SubscriptionsDesign {
  @Inject
  private db: SubscriptionsDatabase;

  async load() {
    try {
      await this.loadDesign({
        _id: '_design/subscriptions_index',
        views: {
          streamers: {
            map: ((doc) => {
              let parts = doc._id.split(':');
              if (parts[0] === 'streamer') {
                emit(doc._id, doc);
              }
            }).toString()
          },
          streams: {
            map: ((doc) => {
              let parts = doc._id.split(':');
              if (parts[0] === 'stream') {
                emit(doc._id, doc);
              }
            }).toString()
          }
        }
      });

    } catch(error) {
      throw error;
    }
  }

  async loadDesign(design: DesignDocument) {
    let doc;

    try {
      doc = await this.db.get(design._id)
    } catch(error) {
      console.log(error);
    }

    try {
      if (doc) {
        design._rev = doc._rev;
      }

      this.db.put(design);

      console.log(design);

      console.log(`Loaded design: ${design._id}`);
    } catch(error) {
      throw error;
    }
  }

}
