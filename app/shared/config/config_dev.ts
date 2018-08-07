import { HttpClient, HttpHeaders } from '@angular/common/http';

export const configuration = {
    SERVER_URL: 'http://skygear.zzzz.io:1337/parse',
    PARSE_KEY: '12344321',
    MASTER_KEY: '192837465'
  };

export const uriConfig = {
  CAMPAIGN: configuration.SERVER_URL + '/classes/Campaign',
  CAMPAIGN_FILE: configuration.SERVER_URL + '/classes/CampaignFile',
  CAMPAIGN_BUTTON: configuration.SERVER_URL + '/classes/CampaignButton',
  STATION: configuration.SERVER_URL + '/classes/Station',
  DEVICE: configuration.SERVER_URL + '/classes/Device',
  FILE: configuration.SERVER_URL + '/files/12344321/'
};

export const httpOptions = {
  headers: new HttpHeaders()
  .set('X-Parse-Application-Id', configuration.PARSE_KEY)
  .set('Content-Type', 'application/json')
  .set('Accept', 'application/json')
};

export const httpOptionsImage = {
  headers: new HttpHeaders()
  .set('X-Parse-Application-Id', configuration.PARSE_KEY)
  .set('Accept', 'application/x-www-form-urlencoded')
};
