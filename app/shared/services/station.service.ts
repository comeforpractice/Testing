import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { Station, Device } from '../models/index';

import { configuration, uriConfig, httpOptions } from '../config/config';

@Injectable()
export class StationService {

    constructor(private http: HttpClient) {   }

    getAll(): Observable<Station[]> {
        return this.http.get<any>(uriConfig.STATION, { headers: httpOptions.headers })
            .map(res => {
                return res.results;
            });
    }

    getById(id: string): Observable<any> {
        return this.http.get(uriConfig.STATION + '/' + id, { headers: httpOptions.headers })
        .map(res => {
            return res;
        });
    }

    create(station: Station): Observable<any>{
        if (station.objectId) {
            return this.update(station);
        }
        return this.http.post(uriConfig.STATION, station, { headers: httpOptions.headers })
        .map(res => {
            return res;
        });
    }

    update(station: Station): Observable<any> {
        return this.http.put(uriConfig.STATION + '/' + station.objectId, station, { headers: httpOptions.headers })
        .map(res => {
            return res;
        });
    }

    delete(id: string): Observable<any> {
        return this.http.delete(uriConfig.STATION + '/' + id, { headers: httpOptions.headers })
        .map(res => {
            return res;
        });
    }
 updateRelation(station: Station, stationId: string): Observable<any> {
        return this.http.put(uriConfig.STATION + '/' + stationId, station, { headers: httpOptions.headers })
        .map(res => {
            
            return res;
        });
    }
    getByStationId(stationId: string): Observable<Device[]> {
        return this.http.get<any>(uriConfig.DEVICE +
            '?where={"$relatedTo":{"object":{"__type":"Pointer","className":"Station","objectId":"'
            + stationId + '"},"key":"deviceStation"}}',
            { headers: httpOptions.headers })
            .map(res => {
                return res.results;
            });
    }

}
