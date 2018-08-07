import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { CampaignFile } from '../models/index';

import { configuration, uriConfig, httpOptions, httpOptionsImage } from '../config/config';
import { CampaignButton } from '../models/campaign-button';


@Injectable()
export class CampaignFileService {

    constructor(private http: HttpClient) { }

    getAll(): Observable<CampaignFile[]> {
        return this.http.get<any>(uriConfig.CAMPAIGN_FILE, { headers: httpOptions.headers })
            .map(res => {
                return res.results;
            });
    }

    getByCampaignId(campaignId: string): Observable<CampaignFile[]> {
        return this.http.get<any>(uriConfig.CAMPAIGN_FILE +
            '?where={"$relatedTo":{"object":{"__type":"Pointer","className":"Campaign","objectId":"'
            + campaignId + '"},"key":"campaignFiles"}}&limit=1000',
            { headers: httpOptions.headers })
            .map(res => {
                return res.results;
            });
    }

    getById(id: string) {
        return this.http.get(uriConfig.CAMPAIGN_FILE + '/' + id, { headers: httpOptions.headers })
        .map(res => {
            return res;
        });
    }

    create(campaignFile: CampaignFile): Observable<any> {
        if (campaignFile.objectId) {
            return this.update(campaignFile);
        }
        return this.http.post(uriConfig.CAMPAIGN_FILE, campaignFile, { headers: httpOptions.headers })
            .map(res => {
                console.log(res);
                return res;
            });
    }

    update(campaignFile: CampaignFile) {
        return this.http.put(uriConfig.CAMPAIGN_FILE + '/' + campaignFile.objectId, campaignFile, { headers: httpOptions.headers });
    }

    delete(id: string): Observable<any> {
        return this.http.delete(uriConfig.CAMPAIGN_FILE + '/' + id, { headers: httpOptions.headers })
        .map(res => {
            return res;
        });
    }
    
    updateRelation(campaign: CampaignFile, campaignId: string): Observable<any> {
        console.log('uriConfig.CAMPAIGN_FILE + campaignId  '+ uriConfig.CAMPAIGN_FILE + '/' + campaignId );
        console.log('campaign ' + campaign);
        return this.http.put(uriConfig.CAMPAIGN_FILE + '/' + campaignId, campaign, { headers: httpOptions.headers })
        .map(res => {
            return res;
        });
    }
}
