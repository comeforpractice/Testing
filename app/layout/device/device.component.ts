import { PushObject } from './../../shared/models/pushObject';
import { Component, OnInit, ViewChild } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
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

import { DeviceService, CampaignService, StationService } from '../../shared/services/index';
import { configuration, uriConfig, httpOptions, httpOptionsImage } from '../../shared/config/config';
import { ParseService } from '../../shared/services/parse.service';
import { Device, DateType, Campaign, Station } from '../../shared/models/index';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';

export function getDateType(dtType) {
    if (null == dtType) {
        dtType = new Date().toUTCString();
    }
    if (typeof dtType === 'string') {
        const dataType: DateType = new DateType();
        dataType.__type = 'Date';
        dataType.iso = dtType;
        return dataType;
    }
    return dtType;
}

export function getDateFromModel(dtType) {
    const dateType = getDateType(dtType);
    if (dateType && null != dateType) {
        const date = new Date(dateType.iso);
        return date.getFullYear() + '-' + date.getMonth() + 1 + '-' + date.getDate();
    }
    return null;
}

@Component({
    selector: 'app-device',
    templateUrl: './device.component.html',
    styleUrls: ['./device.component.scss'],
    animations: [routerTransition()]
})
export class DeviceComponent implements OnInit {

    validateForm: FormGroup;
    rows = [];
    selected = [];
    deviceFormMode: any = false;
    deviceEditFormMode: any = false;

    serialNo: FormControl;
    campaignId: FormControl;
    installedDate: FormControl;
    vehicleNo: FormControl;
    email: FormControl;
    phone: FormControl;
    stationID: FormControl;
    accessories: FormControl;
    driverName: FormControl;
    repairedDate: FormControl;
    replacedDate: FormControl;
    lastCampUpdateTime: FormControl;

    selectedDevice: any;
    campaignsLOV: Array<Campaign>;
    stationsLOV: Array<Station>;

    constructor(private deviceService: DeviceService,
        private modalService: NgbModal,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        public sanitizer: DomSanitizer,
        private ng4FilesService: Ng4FilesService,
        private parseServer: ParseService,
        private campaignService: CampaignService,
        private stationService: StationService) {
        this.fetch();
        this.deviceFormMode = false;
        this.populateLOV();
    }

    ngOnInit() {
        this.deviceFormMode = false;
        this.createFormControls();
        this.createForm();
        this.fetch();
    }

    campSearch = (text$: Observable<string>) => {
        return text$
            .debounceTime(200)
            .distinctUntilChanged()
            .map(term => term === '' ? []
                : this.campaignsLOV.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));
    }

    stateSearch = (text$: Observable<string>) => {
        return text$
            .debounceTime(200)
            .distinctUntilChanged()
            .map(term => term === '' ? []
                : this.stationsLOV.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));
    }

    formatter = (x: { name: string }) => x.name;

    fetch() {
        this.deviceService.getAll().subscribe(data => {
            this.rows = data;
            console.log(data);
            this.deviceFormMode = false;
        }, error => {
            this.selected = [];
            this.rows = [];
            console.log(error);
            this.deviceFormMode = false;
        });
    }

    onSelect({ selected }) {
        this.selected.splice(0, this.selected.length);
        this.selected.push(...selected);
    }

    remove() {
        console.log(this.selected);
        if (this.selected) {
            this.selected.forEach(row => {
                this.deviceService.delete(row.objectId).subscribe(data => {
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

    createFormControls() {
        this.serialNo = new FormControl('', Validators.required);
        this.campaignId = new FormControl(null);
        this.email = new FormControl(null);
        this.phone = new FormControl(null);
        this.stationID = new FormControl(null);
        this.accessories = new FormControl(null);
        this.vehicleNo = new FormControl(null);
        this.driverName = new FormControl(null);
        this.repairedDate = new FormControl(null);
        this.replacedDate = new FormControl(null);
        this.installedDate = new FormControl(null);
        this.lastCampUpdateTime = new FormControl(null);
    }

    createForm() {
        this.validateForm = new FormGroup({
            serialNo: this.serialNo,
            campaignId: this.campaignId,
            vehicleNo: this.vehicleNo,
            email: this.email,
            phone: this.phone,
            stationID: this.stationID,
            accessories: this.accessories,
            driverName: this.driverName,
            repairedDate: this.repairedDate,
            replacedDate: this.replacedDate,
            installedDate: this.installedDate,
            lastCampUpdateTime: this.lastCampUpdateTime
        });
    }

    addOrModifyDeviceFile(deviceId, editMode) {
        this.validateForm = this.fb.group({});
        // populate lov values here.
        if (!editMode) {
            this.createFormControls();
            this.createForm();
            this.deviceFormMode = true;
        } else {
            this.selectedDevice = null;
            this.deviceService.getById(deviceId).subscribe(
                data => {
                    this.selectedDevice = data;
                    this.updateFormControls();
                    this.deviceFormMode = true;
                }, error => {
                    console.log('Error while loading the device details.');
                }
            );
        }
    }
     pushDevice() {
        let pushObject = new PushObject();
        console.log(this.selected);
        if (this.selected) {
            this.selected.forEach(row => {
                    pushObject.cmd = 'campaignPush';
                    let deviceText1 ='';
                    deviceText1  =  deviceText1+ "\"" + row.serialNo  +"\"" + ","; 
                    let deviceText2 = deviceText1.substring(0,deviceText1.length-1 );                    
                    console.log(deviceText2);
                    let  text2 =  "["  +deviceText2  + "]";
                    var OBject = JSON.parse(text2);
                    pushObject.deviceId  = OBject;
                    pushObject.extra = "device";
                    this.parseServer.pushDevice(pushObject);
                    console.log("send push notification");
                }, error => {
                    console.log(error);
                
            });
        }
        setTimeout(() => {
            this.fetch();
        }, 3000);
    }

    onSubmitCampFileForm(newDeviceForm) {
        console.log(newDeviceForm.valid);
        let createdAt = null;
        let updatedAt = null;
        let lastCampUpdateTime = null;
        if (newDeviceForm.valid) {
            let device = new Device();
            if (this.selectedDevice && null != this.selectedDevice) {
                device = this.selectedDevice;
                if (device.createdAt) {
                    createdAt = device.createdAt.iso;
                }
                if (device.lastCampUpdateTime) {
                    lastCampUpdateTime = device.lastCampUpdateTime.iso;
                }
            }
            device.accessories = this.accessories.value;
            if (null!=  this.campaignId.value){
                device.campaignID = this.campaignId.value.objectId;
            }
            device.vehicleNo = this.vehicleNo.value;
            device.email = this.email.value;
            device.phone = this.phone.value;
            if (null!=  this.stationID.value){
                device.stationID = this.stationID.value.objectId;
            }
            device.driverName = this.driverName.value;
            device.serialNo = this.serialNo.value;

            device.createdAt = getDateType(createdAt);
            device.updatedAt = getDateType(updatedAt);
            device.lastCampUpdateTime = getDateType(lastCampUpdateTime);

            let date = this.repairedDate.value;
            if (date && null != date) {
                let dt = new Date(date);
                let dateType: DateType = new DateType();
                dateType.__type = 'Date';
                dateType.iso = dt.toUTCString();
                device.repairedDate = dateType;
            }

            let date2 = this.replacedDate.value;
            if (date2 && null != date2) {
                let dt2 = new Date(date2);
                let dateType2: DateType = new DateType();
                dateType2.__type = 'Date';
                dateType2.iso = dt2.toUTCString();
                device.replacedDate = dateType2;
            }

            let date3 = this.installedDate.value;
            console.log(date3);
            if (date3 && null != date3) {
                let dt3 = new Date(date3);
                let dateType3: DateType = new DateType();
                dateType3.__type = 'Date';
                dateType3.iso = dt3.toUTCString();
                device.installedDate = dateType3;
            }

            console.log(JSON.stringify(device));
            this.deviceService.create(device).subscribe(data => {
                console.log(data);
                this.fetch();
            }, error => {
                console.log(error);
                this.fetch();
            });
        } else {
            console.log('Not valid form');
        }
    }

    updateFormControls() {
        this.serialNo = new FormControl(this.selectedDevice.serialNo );
        this.email = new FormControl(this.selectedDevice.email);
        this.phone = new FormControl(this.selectedDevice.phone);
        this.accessories = new FormControl(this.selectedDevice.accessories);
        this.vehicleNo = new FormControl(this.selectedDevice.vehicleNo);
        this.driverName = new FormControl(this.selectedDevice.driverName);

        if (this.selectedDevice.repairedDate) {
            this.repairedDate = new FormControl(getDateFromModel(this.selectedDevice.repairedDate) );
        }
        if (this.selectedDevice.replacedDate) {
            this.replacedDate = new FormControl(getDateFromModel(this.selectedDevice.replacedDate));
        }
        if (this.selectedDevice.installedDate) {
            this.installedDate = new FormControl(getDateFromModel(this.selectedDevice.installedDate));
        }
        if (this.selectedDevice.lastCampUpdateTime) {
            this.lastCampUpdateTime = new FormControl(getDateFromModel(this.selectedDevice.lastCampUpdateTime));
        }
        const camp = this.campaignsLOV.filter(x => x.objectId === this.selectedDevice.campaignID)[0];
        const stat = this.stationsLOV.filter(x => x.objectId === this.selectedDevice.stationID)[0];
        this.stationID = new FormControl(stat);
        this.campaignId = new FormControl(camp);
        this.createForm();
    }

    cancel() {
        this.resetFlags();
    }

    resetFlags() {
        this.deviceFormMode = false;
        this.deviceEditFormMode = false;
    }

    showMoreDetails(row) {
        console.log(row);
        this.selectedDevice = row;
        const campId = row.campaignID;
        if (campId && null != campId) {
            this.campaignService.getById(campId).subscribe(
                data => {
                    this.selectedDevice.campaignName = data.name;
                }, error => {
                    console.log('Error while fetching the Campaign name');
                }
            );
        }
        const statId = row.stationID;
        if (statId && null != statId) {
            this.stationService.getById(statId).subscribe(
                data => {
                    this.selectedDevice.stationName = data.name;
                }, error => {
                    console.log('Error while fetching the station name.');
                }
            );
        }
    }

    populateLOV() {
        // Campaign details.
        this.campaignsLOV = [];
        this.stationsLOV = [];
        this.campaignService.getAll().subscribe(
            data => {
                data.forEach(item => {
                    const camp = new Campaign();
                    camp.objectId = item.objectId;
                    camp.name = item.name;
                    this.campaignsLOV.push(camp);
                });
            }, err => {
                console.log('Error while loading the campaigns lov values.');
            }
        );

        // populate stations lov values.
        this.stationService.getAll().subscribe(
            data => {
                data.forEach(item => {
                    const stat = new Station();
                    stat.objectId = item.objectId;
                    stat.name = item.name;
                    this.stationsLOV.push(stat);
                });
            }, err => {
                console.log('Error while loading the stations lov values.');
            }
        );
    }
}
