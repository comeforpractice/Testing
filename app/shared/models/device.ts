import { DateType } from './index';

export class Device {
    objectId: string;
    serialNo: string;
    createdAt: DateType;
    updatedAt: DateType;
    campaignID: string;
    defaultBrightness: number;
    lastCampUpdateTime: DateType;
    vehicleNo: string;
    phone: string;
    stationID: string;
    accessories: string;
    driverName: string;
    installedDate: DateType;
    email: string;
    repairedDate: DateType;
    replacedDate: DateType;
    minBrightness: number;
    minVolume: number;
}
