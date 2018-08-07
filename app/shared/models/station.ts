import { Relations, DateType } from "./index";

export class Station {
    objectId: string;
    createdAt: DateType;
    updatedAt: DateType;
    name: string;
    campaignID: string;
    deviceID: string;
    deviceStation: Relations;
    minBrightness: number;
    minVolume: number;
    maxBrightness: number;
    volThresholdTime : number;

}
