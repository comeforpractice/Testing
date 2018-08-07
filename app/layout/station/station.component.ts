
import { element } from 'protractor';
import { ParseService } from './../../shared/services/parse.service';

import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {
    ReactiveFormsModule,
    FormsModule, FormBuilder, Validators, FormGroup, FormControl, AbstractControl
} from '@angular/forms';
import { DomSanitizer, SafeResourceUrl, BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import {
    Ng4FilesService,
    Ng4FilesConfig,
    Ng4FilesStatus,
    Ng4FilesSelected
} from '../../shared/modules';


import { configuration, uriConfig, httpOptions, httpOptionsImage } from '../../shared/config/config';
import { StationService, DeviceService } from '../../shared/services/index';
import { Station, Device, RelatedObject, Relations, DateType  } from '../../shared/models/index';
import { AppComponent } from '../../app.component';
import { PushObject } from '../../shared/models/pushObject';




export function getDateType(dtType) {
    if (null == dtType) {
        dtType = new Date().toUTCString();
    }
    if (typeof dtType === 'string') {
        let dataType: DateType = new DateType();
        dataType.__type = 'Date';
        dataType.iso = dtType;
        return dataType;
    }
    return dtType;
}

export function getDateFromModel(dtType) {
    let dateType = getDateType(dtType);
    let monthString :string;
    let monthNumber :number;
    let dayString :string;
    let dayNumber :number;
    if (dateType && null != dateType) {
        let date = new Date(dateType.iso);
        monthNumber= date.getMonth() +1 ;
        if (monthNumber < 10 ){
            monthString = '0'+ monthNumber;
        }
        else{
            monthString = ''+ monthNumber;
        }
        dayNumber=date.getDate() +1;
        if (dayNumber < 10 ){
            dayString = '0'+ dayNumber;
        }
        else{
            dayString = ''+ dayNumber;
        }
        return date.getFullYear() + '-' +  monthString  + '-' + dayString;
    }
    return null;

}


@Component({
    selector: 'app-station',
    templateUrl: './station.component.html',
    styleUrls: ['./station.component.scss'],
    animations: [routerTransition()]
})
export class StationComponent implements OnInit {
	stationForm: FormGroup;
    rows = [];
    selected = [];
    objectIdArray =[];
    stationFormMode: any = false;
    stationFormEditMode: any = false;
    deviceText = new String(); ;
    stationId1 :any;
    stationName:  FormControl;
    campaignID: FormControl;
    deviceID:FormControl;
    minBrightness: FormControl;
    minVolume: FormControl;
    maxBrightness: FormControl;
    volThresholdTime : FormControl;
   
    keepSorted = true;
    key: string;
    display: string;
    filter = true;
    source: Array<Device>;
    disabled = false;
    confirmed: Array<Device>;
    format: any = AppComponent.DEFAULT_FORMAT;

    
    stationDevices: Array<Device>;
    confirmedDevices: Array<Device>;

    selectedStation: Station;

    constructor(
        private modalService: NgbModal,
		private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        public sanitizer: DomSanitizer,
        private ng4FilesService: Ng4FilesService,
        private stationService: StationService ,private deviceService : DeviceService,
        private parseServer: ParseService) {
		this.fetch();
        this.stationFormMode=false;
        this.resetFlags();
     }

     ngOnInit() {
		this.stationFormMode=false;
		this.createFormControls();
        this.createForm();
        this.fetch();
    }
    createFormControls() {
        this.stationName = new FormControl('', Validators.required);
        this.campaignID = new FormControl('', null);
        
        this.minBrightness = new FormControl('40', null);
        this.minVolume= new FormControl('20', null);
        this.maxBrightness= new FormControl('80', null);
        this.volThresholdTime = new FormControl('10', null);
        
    }
	createForm() {
        this.stationForm = new FormGroup({
            stationName: this.stationName,
            campaignID: this.campaignID,
            minBrightness:this.minBrightness,
            minVolume:this.minVolume,
            maxBrightness:this.maxBrightness,
            volThresholdTime:this.volThresholdTime
        });
    }

    resetFlags() {
        this.stationFormMode = false;
        this.stationFormEditMode = false;
        this.selectedStation = null;
    }

    fetch() {
        
        this.stationService.getAll().subscribe(data => {
            this.rows = data;
            console.log(data);
            this.stationFormMode=false;

        }, error => {
            this.selected = [];
            this.rows = [];
            console.log(error);
            this.stationFormMode=false;

        });
    }

    onSelect({ selected }) {
        console.log('Select Event', selected, this.selected);

        this.selected.splice(0, this.selected.length);
        this.selected.push(...selected);
    }

    onActivate(event) {
        console.log('Activate Event', event);
    }

    add() {
        this.stationFormMode = false;
        this.selected.push(this.rows[1], this.rows[3]);
    }
    d
    update() {
        this.selected =[this.rows];
    }

    remove() {
        console.log(this.selected);
        if (this.selected) {
            this.selected.forEach(row => {
                this.stationService.delete(row.objectId).subscribe(data => {
                    console.log(data);
                }, error => {
                    console.log(error);
                });
            });
        }
        setTimeout(() => {
            this.fetch();
        }, 3000);
    }

    pushDevice() {
        console.log(this.selected);
        let pushObject = new PushObject();
        if (this.selected) {
            this.selected.forEach(row => {
                this.stationService.getByStationId(row.objectId).subscribe(data => {
                    console.log(data);
                    pushObject.cmd = 'campaignPush';
                    
                    let deviceText1 = '';
             //       data.forEach(function(element){
             //          deviceText1  =  deviceText1+ "\"" + element.serialNo  +"\"" + ","; 
             //       });
             //       let deviceText2 = deviceText1.substring(0,deviceText1.length-1 );
                    
             //       console.log(deviceText2);

             //       let  text2 =  "["  +deviceText2  + "]";

              //      var OBject = JSON.parse(text2);
              //      pushObject.deviceId  = OBject;
              //      pushObject.extra = "station";
                    //let text1  =  " {\"deviceId\" :[" + deviceText1 + "], \"cmd\":\"campaignPush\", \"extra\":\"station\" }";
                    console.log();                     
                    this.parseServer.pushDevice(pushObject);
                    console.log("send push notification");
                }, error => {
                    console.log(error);
                });
            });
        }
        setTimeout(() => {
            this.fetch();
        }, 3000);
    }

    displayCheck(row) {
        return true;
    }

    onSubmitStationFileForm(newStationForm) {
        console.log(newStationForm.valid);
        let createdAt,updatedAt = null;
        
        if(newStationForm.valid){
            let station = new Station();
            console.log(station);
            if(this.selectedStation){
                station = this.selectedStation;
                if(station.createdAt){
                    createdAt=station.createdAt.iso;
                }
                if(station.updatedAt){
                    updatedAt=station.updatedAt.iso;
                }
            }
            station.campaignID= this.campaignID.value;
            station.name= this.stationName.value;
            
            station.minBrightness = Number(this.minBrightness.value);
            station.maxBrightness= Number(this.maxBrightness.value);
            station.minVolume= Number(this.minVolume.value);
            station.volThresholdTime=Number(this.volThresholdTime.value);
            station.createdAt = getDateType(createdAt);     
            station.updatedAt = getDateType(updatedAt);
            let stationObjectId =station.objectId;
            console.log(station);
            setTimeout(() => {
                this.stationService.create(station).subscribe(data => {
                    console.log(data);
                    let objctId = data.objectId;
                    if(!objctId && objctId == null){
                        objctId = stationObjectId;
                    }
                    this.deviceService.getByStationId(objctId).subscribe(res => {
                        let newF: Array<Device> = [];
                        let rmdF: Array<Device> = [];
    
                        if (0 === res.length) {
                            newF = this.confirmed;
                        } else {
                            res.forEach(item => {
                                const found = this.confirmed.find((e: any) => e.objectId === item.objectId);
                                if (!found) {
                                    rmdF.push(item);
                                }
                            });
                        }
                        if (0 === this.confirmed.length) {
                            rmdF = res;
                        } else {
                            this.confirmed.forEach(item => {
                                const found = res.find((e: any) => e.objectId === item.objectId);
                                if (!found) {
                                    newF.push(item);
                                }
                            });
                        }
                        this.performRelationalOP(objctId, newF, 'AddRelation');
                        this.performRelationalOP(objctId, rmdF, 'RemoveRelation');
                    }, error => {
                        console.log(error);
                        this.stationDevices = [];
                        this.confirmedDevices = [];
                        this.useStations();
                        this.resetFlags();
                        // TODO: throw error message.
                    });
                

                    this.fetch();
                }, error => {
                    console.log(error);
                    this.fetch();
                });
            }, 3000);
        } else {
            console.log('Not valid form');
        }
       
    }

    
    editStation(stationId1) {
        console.log(stationId1);
        this.stationDevices = [];
        this.confirmedDevices = [];
        this.useStations();
        this.stationService.getById(stationId1).subscribe(data => {
            this.selectedStation = data;
            this.updateFormControls(data);
            this.stationFormMode = true;
            this.stationFormEditMode = true;

            this.fetchDevices(stationId1);
        }, error => {
            console.log(error);
            this.stationDevices = [];
            this.confirmedDevices = [];
            this.useStations();
            this.resetFlags();
            // TODO: throw error message.
        });
    }

    
    updateFormControls(data) {
        if (data) {
            this.stationName = new FormControl(data.name, Validators.required);
            this.campaignID = new FormControl(data.campaignID);
            
            this.minBrightness= new FormControl(data.minBrightness);
            this.maxBrightness= new FormControl(data.maxBrightness);
            this.minVolume= new FormControl(data.minVolume);
            this.volThresholdTime= new FormControl(data.volThresholdTime);

            this.createForm();
        }
    }

    
    cancel() {
        this.resetFlags();
    }

    viewDevices(stationId) {
        console.log(stationId);
        this.router.navigate(['campaignFile', stationId]);
    }
    
    performRelationalOP(stationId: string, newF: Device[], op: string) {
        console.log('Operation : ' + op + ' : ' + newF);
        let station = new Station();
        let relArr: RelatedObject[] = [];
        for (let entry of newF) {
            let rel: RelatedObject = new RelatedObject();
            rel.__type = 'Pointer';
            rel.className = 'Device';
            rel.objectId = entry.objectId;
            relArr.push(rel);
        }
        if (relArr.length > 0) {
            let dep: Relations = new Relations();
            dep.__op = op;
            dep.objects = relArr;
            station.deviceStation = dep;
            console.log('station : ' + JSON.stringify(station));
            this.stationService.updateRelation(station, stationId).subscribe(res => {
                console.log(' Updated Relationship ');
            }, err => {
                console.log(err);
            });
        }
        this.fetch();
    }

    doAddStation() {
        this.createFormControls();
        this.createForm();
        this.stationDevices = [];
        this.confirmedDevices = [];
        //this.useStations();
        this.stationFormMode = true;
        setTimeout(this.fetchDevices(null), 1000);
    }

    fetchDevices(stationId) {
        this.deviceService.getAll().subscribe(data => {
            console.log('data ' +data);
            this.stationDevices = data;
            console.log('this.stationDevices' + this.stationDevices);
            this.confirmedDevices = [];
            if (null != stationId) {
                this.filterStationSourceDevices(stationId);
            } else {
                this.useStations();
            }
        }, error => {
            console.log(error);
            this.stationDevices = [];
            this.confirmedDevices = [];
            this.useStations();
            this.resetFlags();
            // TODO: throw error message.
        })
    }
    

    filterStationSourceDevices(stationId) {
        this.deviceService.getByStationId(stationId).subscribe(data => {
            if (data && data.length > 0 && this.stationDevices && this.stationDevices.length > 0) {
                this.confirmedDevices = data;
                let validList: Array<Device> = [];
                for (let item of this.stationDevices) {
                    for (let cf of data) {
                        if (cf.objectId !== item.objectId) {
                            validList.push(item);
                        }
                    }
                }
                this.stationDevices = validList;
            }
            this.useStations();
        }, error => {
            console.log(error);
            this.stationDevices = [];
            this.confirmedDevices = [];
            this.useStations();
            this.resetFlags();
            // TODO: throw error message.
        });
    }

    private useStations() {
        this.key = 'objectId';
        this.display = 'serialNo';
        this.keepSorted = true;
        this.source = this.stationDevices;
        this.confirmed = this.confirmedDevices;
        console.log('confirmed  ' + this.confirmedDevices );
        console.log('Sources   ' + this.stationDevices );
        console.log('confirmed  ' + this.confirmed );

    }
    doAddCampaign() {
        this.createFormControls();
        this.createForm();
        this.stationDevices = [];
        this.confirmedDevices = [];
        this.useStations();
        this.stationFormMode = true;
        this.fetchDevices(null);
    }

    
    doAdd() {
        for (let i = 0, len = this.source.length; i < len; i += 1) {
            const o = this.source[i];
            const found = this.confirmed.find((e: any) => e === o);
            if (!found) {
                this.confirmed.push(o);
                break;
            }
        }
    }

    doRemove() {
        if (this.confirmed.length > 0) {
            this.confirmed.splice(0, 1);
        }
    }
    
    doFilter() {
        this.filter = !this.filter;
    }

    filterBtn() {
        return (this.filter ? 'Hide Filter' : 'Show Filter');
    }

    doDisable() {
        this.disabled = !this.disabled;
    }

    disableBtn() {
        return (this.disabled ? 'Enable' : 'Disabled');
    }


}
