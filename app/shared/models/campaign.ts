import { DateType } from './index';

export class Campaign {
    objectId: string;
    createdAt: DateType;
    updatedAt: DateType;

    name: string;
    effectiveDate: DateType;
    terminationDate: DateType;

    campaignFiles: Relations;
}

export class Relations {
    __op: string;
    objects: RelatedObject[];
}

export class RelatedObject {
    __type: string;
    className: string;
    objectId: string;
}
