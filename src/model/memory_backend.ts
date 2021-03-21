import {
  NewPositionCallback,
  PasskeyBackend,
  GeoLocation,
} from "./passkey_backend";

export class MemoryBackend implements PasskeyBackend {
  private internalList: Map<String, GeoLocation[]> = new Map();
  private listeners: Map<String, NewPositionCallback[]> = new Map();

  exists(passkeyId: string): boolean {
    return this.internalList.get(passkeyId) != undefined;
  }
  getLastLocation(passkeyId: string): GeoLocation | undefined {
    if (this.exists(passkeyId)) {
      let locationsArray = this.internalList.get(passkeyId)!;
      let lastLocation = locationsArray.pop();
      if (lastLocation !== undefined) {
        locationsArray.push(lastLocation);
      }
      return lastLocation;
    } else {
      console.log("Key doesn't exist!");
      return undefined;
    }
  }
  updatePosition(passkeyId: string, location: GeoLocation): void {
    let positions = this.internalList.get(passkeyId);
    if (positions) {
      positions.push(location);
    } else {
      this.internalList.set(passkeyId, [location]);
    }
  }
  subscribePosition(
    passkeyId: string,
    onNewPositionCallback: NewPositionCallback
  ): void {
    if (!this.listeners.has(passkeyId)) {
      this.listeners.set(passkeyId, [onNewPositionCallback]);
    } else {
      this.listeners.get(passkeyId)!.push(onNewPositionCallback);
    }
  }

  removeLocation(passkeyId: string): boolean {
    return this.internalList.delete(passkeyId);
  }
}
