
import * as Room from 'ipfs-pubsub-room';
import { Inject } from 'typescript-ioc';
import { Config } from '../config';
import { Streamer } from '../models/streamer';
import { Message } from '../models/message';

export class LobbyChannel {
  @Inject
  private config: Config;

  private room: Room;

  constructor(private ipfs) {
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

      setInterval(() => {

        this.broadcastStreamer({
          name: 'Test streamer',
          url: 'https://www.facebook.com/' + Math.floor(Math.random() * 100000000),
          tags: []
        });

      }, 10000);

    });

  }

  broadcastStreamer(streamer: Streamer) {
    let message: Message = {
      type: 'streamer',
      streamer: streamer
    };

    this.room.broadcast(JSON.stringify(message));
  }

  getTopic() {
    return [this.config.channelPrefix, 'lobby'].join(':');
  }

  leave() {
    this.room.leave();
  }
}
