import { Inject } from "typescript-ioc";
import { Config } from "../config";
import { Channel } from "./channel";

// these will be dynamic
const PERCENTAGE = .05;
const MINIMUM = 2;

export class EvaluateChannel extends Channel {
  @Inject
  private config: Config;

  constructor(ipfs, topic: string) {
    super(ipfs);
    this.initRoom(topic);
  }

  async shouldJoin(lobbyCount: number) {

    let count = lobbyCount * PERCENTAGE;

    if (count < MINIMUM) {
      count = MINIMUM;
    }

    let currentCount = this.getPeerCount();

    if (currentCount < count) {
      return true;
    }

    return false;
  }

  async tieBreak() {
    return true;
  }

}
