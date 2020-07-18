
import * as PouchDB from 'pouchdb';
import * as path from 'path';

export class SubscriptionsDatabase extends PouchDB {

}

export const subscriptionsDatabaseFactory = () => new SubscriptionsDatabase(path.join(__dirname, '../subscriptions.db'));
