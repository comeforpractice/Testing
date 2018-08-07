import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { Device } from '../models/index';

import { configuration, uriConfig, httpOptions } from '../config/config';

@Injectable()
export class DeviceService {

    constructor(private http: HttpClient) {   }

    getAll(): Observable<Device[]> {
        return this.http.get<any>(uriConfig.DEVICE + '?limit=1000', { headers: httpOptions.headers })
            .map(res => {
                return res.results;
            });
    }

    getById(id: string): Observable<any> {
        return this.http.get(uriConfig.DEVICE + '/' + id, { headers: httpOptions.headers })
        .map(res => {
            return res;
        });
    }

    create(device: Device): Observable<any> {
        if (device && device.objectId && null != device.objectId) {
            return this.update(device);
        }
        return this.http.post(uriConfig.DEVICE, device, { headers: httpOptions.headers })
        .map(res => {
            return res;
        });
    }

    update(device: Device): Observable<any> {
        return this.http.put(uriConfig.DEVICE + '/' + device.objectId, device, { headers: httpOptions.headers })
        .map(res => {
            return res;
        });
    }

    delete(id: string): Observable<any> {
        return this.http.delete(uriConfig.DEVICE + '/' + id, { headers: httpOptions.headers })
        .map(res => {
            return res;
        });
    }

	getByStationId(stationId: string): Observable<Device[]> {
        return this.http.get<any>(uriConfig.DEVICE +
            '?where={"$relatedTo":{"object":{"__type":"Pointer","className":"Station","objectId":"'
            + stationId + '"},"key":"deviceStation"}}&limit=1000',
            { headers: httpOptions.headers })
            .map(res => {
                return res.results;
            });
    }
}
