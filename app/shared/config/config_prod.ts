import { HttpClient, HttpHeaders } from '@angular/common/http';

export const configuration = {
    SERVER_URL: 'http://43.229.84.125:1337/parse',
    PARSE_KEY: 'QzxAOPDw8p3VmLecPW5b8oyKLYhIr1btsqRzw4fd',
    MASTER_KEY:'RDKXdR29FSziEv7JhDt9ghPxR4opk6st5YWg3zoM'
  };

export const uriConfig = {
  CAMPAIGN: configuration.SERVER_URL + '/classes/Campaign',
  CAMPAIGN_FILE: configuration.SERVER_URL + '/classes/CampaignFile',
  CAMPAIGN_BUTTON: configuration.SERVER_URL + '/classes/CampaignButton',
  STATION: configuration.SERVER_URL + '/classes/Station',
  DEVICE: configuration.SERVER_URL + '/classes/Device',
  FILE: configuration.SERVER_URL + '/files/QzxAOPDw8p3VmLecPW5b8oyKLYhIr1btsqRzw4fd'	
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
