
import * as Room from 'ipfs-pubsub-room';
import * as IPFS from 'ipfs';
import * as ipfsHttpClient from 'ipfs-http-client';
import { LobbyChannel } from './ipfs/lobby-channel';

(async () => {
  const ipfs = ipfsHttpClient('http://ipfs_node1:5001');

  const pubsubNode = await IPFS.create({
    EXPERIMENTAL: {
      pubsub: true
    }
  });

  let id = await ipfs.id();
  console.log(`Leader peer id is ${id.id}`);

  let lobby = new LobbyChannel(pubsubNode);

})();
