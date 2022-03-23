import { Platform } from "react-native";

export class VelocityTracker {
  history: number[];
  lastPosition?: number;
  lastTimestamp?: number;

  constructor() {
    this.history = [];
    this.lastPosition = undefined;
    this.lastTimestamp = undefined;
  }

  add(position: number) {
    const timestamp = new Date().valueOf();
    if (this.lastPosition && this.lastTimestamp && timestamp > this.lastTimestamp) {
      const diff = position - this.lastPosition;
      if (diff > 0.001 || diff < -0.001) {
        this.history.push(diff / (timestamp - this.lastTimestamp));
      }
    }
    this.lastPosition = position;
    this.lastTimestamp = timestamp;
  }

  estimateSpeed() {
    // on iOS the most recent registered velocity in the history array often is an inverted value
    // therefore it should be ignored on iOS, and an earlier value should be taken instead
    const isIos = Platform.OS === "ios"
    const finalTrend = this.history.slice(isIos ? -4 : -3, ...(isIos ? [-1] : []));
    const sum = finalTrend.reduce((r, v) => r + v, 0);
    return sum / finalTrend.length;
  }

  reset() {
    this.history = [];
    this.lastPosition = undefined;
    this.lastTimestamp = undefined;
  }
}
