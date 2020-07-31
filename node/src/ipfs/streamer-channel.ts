
import * as Room from 'ipfs-pubsub-room';
import { Inject } from 'typescript-ioc';
import { Config } from '../config';
import { UrlParser } from '../subscriptions/util/url-parser';
import { Streamer } from '../models/streamer';
import { Channel } from './channel';

export class StreamerChannel extends Channel {
  @Inject
  private config: Config;

  @Inject
  private urlParser: UrlParser;

  constructor(ipfs: any, private streamer: Streamer) {
    super(ipfs);
    this.initRoom(StreamerChannel.getTopic(this.config, streamer));
    this.init();
  }

  init() {

    let id = this.urlParser.identify(this.streamer.url);

    console.log(id);

    this.room.on('peer joined', (peer) => {
      console.log('Peer joined the channel', peer)
    });

    this.room.on('peer left', (peer) => {
      console.log('Peer left...', peer)
    });

    this.room.on('subscribed', () => {
      console.log(`Now connected to ${StreamerChannel.getTopic(this.config, this.streamer)}`)
    });

    this.room.on('message', (message) => {
      console.log(message.data.toString());
    });

  }

  static getTopic(config: Config, streamer: Streamer) {
    return [config.channelPrefix, 'streamer', streamer.url].join(':');
  }

  leave() {
    this.room.leave();
  }
}
