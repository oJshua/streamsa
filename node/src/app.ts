
import { Container } from "typescript-ioc";

import * as Room from 'ipfs-pubsub-room';
import * as IPFS from 'ipfs';

import * as errorHandler from "errorhandler";

import { app } from './control-panel';
import { SubscriptionsDatabase, subscriptionsDatabaseFactory } from './database';
import { Subscriptions } from "./subscriptions";
import { SubscriptionsDesign } from "./subscriptions/subscriptions-design";
import { Channels } from "./ipfs/channels";

Container.bind(SubscriptionsDatabase).factory(subscriptionsDatabaseFactory);

const PORT = process.env.PORT || 8999;

(async () => {

  const ipfs = await IPFS.create({
    EXPERIMENTAL: {
      pubsub: true
    }
  });

  let channels = new Channels(ipfs);
  let subscriptions = new Subscriptions();
  let subscriptionsDesign = new SubscriptionsDesign();

  try {
    await subscriptionsDesign.load();

    await subscriptions.addStreamer({
      name: 'Sol Luna',
      url: 'https://www.facebook.com/100012680239266',
      tags: ['blm']
    });

    let streamers = await subscriptions.getStreamers();

    for(let streamer of streamers) {
      channels.addStreamer(streamer);
    }
  } catch(error) {
    console.log(error);
  }

  const room = new Room(ipfs, 'josh-test-room');

  room.on('peer joined', (peer) => {
    console.log('Peer joined the channel', peer)
  })

  room.on('peer left', (peer) => {
    console.log('Peer left...', peer)
  })

  // now started to listen to room
  room.on('subscribed', () => {
    console.log('Now connected!')

    room.on('message', (message) => {
      console.log(message.data.toString());
    });

  })

  app.use(errorHandler());

  const server = app.listen(PORT, () => {
    console.log(
        "  App is running at http://localhost:%d in %s mode",
        PORT,
        app.get("env")
    );
    console.log("  Press CTRL-C to stop\n");
  });

})();
