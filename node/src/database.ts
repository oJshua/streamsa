
import * as PouchDB from 'pouchdb';
import * as path from 'path';
import { Singleton } from 'typescript-ioc';

@Singleton
export class SubscriptionsDatabase extends PouchDB {

}

export const subscriptionsDatabaseFactory = () => new SubscriptionsDatabase(path.join(__dirname, '../subscriptions.db'));
