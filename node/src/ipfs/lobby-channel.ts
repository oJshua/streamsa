
import * as Room from 'ipfs-pubsub-room';
import { Inject } from 'typescript-ioc';
import { Config } from '../config';
import { Message } from '../models/message';
import { Channel } from './channel';
import { EvaluateChannel } from './evaluate-channel';
import { StreamerChannel } from './streamer-channel';
import { Channels } from './channels';

const promiseTimeout = time => new Promise(resolve => setTimeout(resolve, time));

export class LobbyChannel extends Channel {
  @Inject
  protected config: Config;

  constructor(ipfs, private channels: Channels) {
    super(ipfs);
    this.initRoom(LobbyChannel.getTopic(this.config));
    this.init();
  }

  init() {

    this.room.on('peer joined', (peer) => {
      console.log('Peer joined the channel', peer)
    })

    this.room.on('peer left', (peer) => {
      console.log('Peer left...', peer)
    })

    this.room.on('message', (message) => {
      try {
        let parsedMessage: Message = JSON.parse(message.data.toString());
        this.receiveMessage(parsedMessage);
      } catch(error) {
        console.log(error);
      }
    });

    this.room.on('subscribed', () => {
      console.log(`Now connected to ${LobbyChannel.getTopic(this.config)}`)
    })

  }

  receiveMessage(message: Message) {
    console.log(message);

    if (message.type === 'streamer') {

      let topic = StreamerChannel.getTopic(this.config, message.streamer);
      let evaluate = new EvaluateChannel(this.ipfs, topic);

      evaluate.on('ready', async () => {
        console.log('READY TO EVALUATE');

        try {
          if (this.channels.belongsToChannel(topic)) {
            return;
          }

          let count = this.getPeerCount();

          await promiseTimeout(Math.random() * 10000);

          let join = await evaluate.shouldJoin(count);

          if (join) {
            this.channels.addStreamer(message.streamer);
          }
        } catch(error) {
          console.log(error);
        }

      });
    }

  }

  static getTopic(config: Config) {
    return [config.channelPrefix, 'lobby'].join(':');
  }

  leave() {
    this.room.leave();
  }
}
