
import * as Room from 'ipfs-pubsub-room';
import { EventEmitter } from 'events';

export class Channel extends EventEmitter {
  protected room: Room;

  constructor(protected ipfs) {
    super();
  }

  protected initRoom(topic: string) {
    this.room = new Room(this.ipfs, topic);
    console.log(`Connecting to ${topic}`);
    this.room.on('subscribed', () => {
      this.emit('ready');
    });
  }

  getPeerCount() {
    return this.room.getPeers().length;
  }
}
