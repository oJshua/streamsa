
import * as Room from 'ipfs-pubsub-room';
import * as IPFS from 'ipfs';
import * as ipfsHttpClient from 'ipfs-http-client';

(async () => {
  const ipfs = ipfsHttpClient('http://ipfs_node1:5001');

  const pubsubNode = await IPFS.create({
    EXPERIMENTAL: {
      pubsub: true
    }
  });

  let id = await ipfs.id();
  console.log(`Leader peer id is ${id.id}`);

  const room = new Room(pubsubNode, 'josh-test-room');

  room.on('peer joined', (peer) => {
    console.log('Peer joined the channel', peer)

  });

  room.on('peer left', (peer) => {
    console.log('Peer left...', peer)
  });

  // now started to listen to room
  room.on('subscribed', () => {
    console.log('Now connected!')

    setInterval(() => {
      let count = room.getPeers().length;
      console.log(`Nodes in channel: ${count}`);
    }, 15000);

  });


})();
