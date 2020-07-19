import { StreamerChannel } from "./streamer-channel";
import { Streamer } from "../subscriptions";
import { LobbyChannel } from "./lobby-channel";

export class Channels {

  lobby: LobbyChannel;

  streamers: { [id: string] : StreamerChannel } = {};

  // streams: { [id: string] : Channel } = {};

  constructor(private ipfs: any) {
    this.lobby = new LobbyChannel(ipfs);
  }

  addStreamer(streamer: Streamer) {
    let topic = streamer._id;

    if (topic in this.streamers) {
      return;
    }

    this.streamers[topic] = new StreamerChannel(
      this.ipfs,
      streamer
    );
  }

  removeStreamer(streamer: Streamer) {
    let topic = streamer._id;

    if (!(topic in this.streamers)) {
      return;
    }

    this.streamers[topic].leave();
    delete this.streamers[topic];
  }

}
