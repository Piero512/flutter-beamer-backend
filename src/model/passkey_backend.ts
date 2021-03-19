export interface GeoLocation {
    lat: number;
    long: number;
}

export interface NewPositionCallback{
    (location: GeoLocation): void;
} 

export interface PasskeyBackend {
    exists(passkeyId:string ): boolean;
    getLastLocation(passkeyId: string): GeoLocation | undefined;
    updatePosition(passkeyId: string,location: GeoLocation): void;
    subscribePosition(passkeyId:string, onNewPositionCallback: NewPositionCallback): void;
    removeLocation(passkeyId:string): boolean;
}