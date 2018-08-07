import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { CampaignButton } from '../models/index';

import { configuration, uriConfig, httpOptions } from '../config/config';

@Injectable()
export class CampaignButtonService {

    constructor(private http: HttpClient) {   }

    getAll(): Observable<CampaignButton[]> {
        return this.http.get<any>(uriConfig.CAMPAIGN_BUTTON, { headers: httpOptions.headers })
            .map(res => {
                console.log(res);
                return res.results;
            });
    }

    getByCampaignFileId(campaignFileId: string): Observable<CampaignButton> {
        return this.http.get<any>(uriConfig.CAMPAIGN_BUTTON +
            '?where={"$relatedTo":{"object":{"__type":"Pointer","className":"CampaignFile","objectId":"'
            + campaignFileId + '"},"key":"campaignButtonData"}}',
            { headers: httpOptions.headers })
            .map(res => {
                return res.results;
            });
    }

    getById(id: string) {
        return this.http.get(uriConfig.CAMPAIGN_BUTTON + '/' + id, { headers: httpOptions.headers });
    }

    create(campaignBtn: CampaignButton): Observable<any> {
        return this.http.post(uriConfig.CAMPAIGN_BUTTON, campaignBtn, { headers: httpOptions.headers })
        .map(res => {
            return res;
        });
    }

    update(campaignBtn: CampaignButton) {
        return this.http.put(uriConfig.CAMPAIGN_BUTTON + '/' + campaignBtn.objectId, campaignBtn, { headers: httpOptions.headers });
    }

    delete(id: string) {
        return this.http.delete(uriConfig.CAMPAIGN_BUTTON + '/' + id, { headers: httpOptions.headers });
    }
}
