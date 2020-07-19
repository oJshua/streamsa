
import * as Room from 'ipfs-pubsub-room';
import { Streamer } from '../subscriptions';
import { Inject } from 'typescript-ioc';
import { Config } from '../config';

export class StreamerChannel {
  @Inject
  private config: Config;

  private room: Room;

  constructor(private ipfs: any, private streamer: Streamer) {

    this.room = new Room(ipfs, this.getTopic());

    this.init();
  }

  init() {

    this.room.on('peer joined', (peer) => {
      console.log('Peer joined the channel', peer)
    })

    this.room.on('peer left', (peer) => {
      console.log('Peer left...', peer)
    })

    this.room.on('subscribed', () => {
      console.log(`Now connected to ${this.getTopic()}`)
      this.room.on('message', (message) => {
        console.log(message.data.toString());
      });
    })

  }

  getTopic() {
    return [this.config.channelPrefix, this.streamer._id].join(':');
  }

  leave() {
    this.room.leave();
  }
}
