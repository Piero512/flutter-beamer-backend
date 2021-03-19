import {NewPositionCallback, PasskeyBackend, GeoLocation} from './passkey_backend';

export class MemoryBackend implements PasskeyBackend {
    private internalList: Map<String,GeoLocation[]> = new Map();
    private listeners: NewPositionCallback[] = [];
    exists(passkeyId: string): boolean {
        return this.internalList.get(passkeyId) != undefined;
    }
    getLastLocation(passkeyId: string): GeoLocation | undefined {
        if(this.exists(passkeyId)){
            let locationsArray = this.internalList.get(passkeyId)!;
            let lastLocation = locationsArray.pop();
            if(lastLocation !== undefined){
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
        if(positions){
            positions.push(location);
        } else {
            this.internalList.set(passkeyId, [location]);
        }
    }
    subscribePosition(passkeyId: string, onNewPositionCallback: NewPositionCallback): void {
        throw new Error("Method not implemented.");
    }

    removeLocation(passkeyId: string): boolean {
        return this.internalList.delete(passkeyId);
    }
}
