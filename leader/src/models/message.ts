import { Streamer } from "./streamer";
import { Stream } from "stream";

export class Message {
  type: string;
  stream?: Stream;
  streamer?: Streamer;
}
