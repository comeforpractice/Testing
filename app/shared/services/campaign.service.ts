import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { Campaign } from '../models/index';

import { configuration, uriConfig, httpOptions } from '../config/config';

@Injectable()
export class CampaignService {

    constructor(private http: HttpClient) {   }

    getAll(): Observable<Campaign[]> {
        return this.http.get<any>(uriConfig.CAMPAIGN, { headers: httpOptions.headers })
            .map(res => {
                return res.results;
            });
    }

    getById(id: string): Observable<any> {
        return this.http.get(uriConfig.CAMPAIGN + '/' + id, { headers: httpOptions.headers })
        .map(res => {
            return res;
        });
    }

    create(campaign: Campaign): Observable<any> {
        console.log('Service : ' + campaign.objectId);
        if (campaign.objectId) {
            return this.update(campaign);
        }
        return this.http.post(uriConfig.CAMPAIGN, campaign, { headers: httpOptions.headers })
        .map(res => {
            return res;
        });
    }

    update(campaign: Campaign): Observable<any> {
        return this.http.put(uriConfig.CAMPAIGN + '/' + campaign.objectId, campaign, { headers: httpOptions.headers })
        .map(res => {
            return res;
        });
    }

    updateRelation(campaign: Campaign, campaignId: string): Observable<any> {
        return this.http.put(uriConfig.CAMPAIGN + '/' + campaignId, campaign, { headers: httpOptions.headers })
        .map(res => {
            return res;
        });
    }

    delete(id: string): Observable<any> {
        return this.http.delete(uriConfig.CAMPAIGN + '/' + id, { headers: httpOptions.headers })
        .map(res => {
            return res;
        });
    }
}
