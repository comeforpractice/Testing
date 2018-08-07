import { Relations } from './campaign';
import { FilePath, DateType } from './index';

export class CampaignFile {
    screen: number;
    startDate: DateType;
    endDate: DateType;
    priority: number;

    objectId: string;
    filePath: FilePath;
    createdAt: DateType;
    updatedAt: DateType;
    visibleArea: number;
    fileType: number;
    visibilityTime: number;
    fileName: string;
    campaignButtonData: Relations;
    visibleAreaDisplay : string;
    fileTypeDisplay : string;

}

