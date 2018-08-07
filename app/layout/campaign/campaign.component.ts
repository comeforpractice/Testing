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

import { AppComponent } from '../../app.component';

import {
    Ng4FilesService,
    Ng4FilesConfig,
    Ng4FilesStatus,
    Ng4FilesSelected
} from '../../shared/modules';

import { DeviceService } from '../../shared/services/index';
import { configuration, uriConfig, httpOptions, httpOptionsImage } from '../../shared/config/config';
import { StationService } from '../../shared/services/index';

import { CampaignService, CampaignFileService, CampaignButtonService } from '../../shared/services/index';

import { Campaign, CampaignFile, RelatedObject, Relations, DateType } from '../../shared/models/index';

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
    if (dateType && null != dateType) {
        let date = new Date(dateType.iso);
        return date.getFullYear() + '-' + date.getMonth() + 1 + '-' + date.getDate();
    }
    return null;

}

@Component({
    selector: 'app-campaign',
    templateUrl: './campaign.component.html',
    styleUrls: ['./campaign.component.scss'],
    animations: [routerTransition()]
})
export class CampaignComponent implements OnInit {

    campaignForm: FormGroup;
    rows = [];
    selected = [];
    campaignFormMode: any = false;
    campaignFormEditMode: any = false;

    campaignName: FormControl;
    effectiveDate: FormControl;
    terminationDate: FormControl;

    campaignID: FormControl;
    deviceID: FormControl;

    keepSorted = true;
    key: string;
    display: string;
    filter = true;
    source: Array<CampaignFile>;
    disabled = false;
    confirmed: Array<CampaignFile>;
    format: any = AppComponent.DEFAULT_FORMAT;

    campaignFiles: Array<CampaignFile>;
    confirmedFiles: Array<CampaignFile>;

    selectedCampaign: Campaign;

    constructor(
        private modalService: NgbModal,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        public sanitizer: DomSanitizer,
        private ng4FilesService: Ng4FilesService,
        private campaignService: CampaignService,
        private campaignFileService: CampaignFileService) {
        this.fetch();
        this.resetFlags();
    }

    ngOnInit() {
        this.resetFlags();
        this.createFormControls();
        this.createForm();
        this.fetch();
    }

    createFormControls() {
        this.campaignName = new FormControl('', Validators.required);
        this.effectiveDate = new FormControl( null);
        this.terminationDate = new FormControl(null);
        this.campaignID = new FormControl(null);
        this.deviceID = new FormControl(null);
    }

    createForm() {
        this.campaignForm = new FormGroup({
            campaignName: this.campaignName,
            effectiveDate: this.effectiveDate, 
            terminationDate: this.terminationDate
            
            });
    }

    fetch() {
        this.campaignService.getAll().subscribe(data => {
            this.rows = data;
            this.selected = [];
            this.resetFlags();
        }, error => {
            this.selected = [];
            this.rows = [];
            console.log(error);
            this.resetFlags();
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
                this.campaignService.delete(row.objectId).subscribe(data => {
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

    displayCheck(row) {
        return true;
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

    private useStations() {
        this.key = 'objectId';
        this.display = 'fileName';
        this.keepSorted = true;
        this.source = this.campaignFiles;
        this.confirmed = this.confirmedFiles;
    }

    doAddCampaign() {
        this.createFormControls();
        this.createForm();
        this.campaignFiles = [];
        this.confirmedFiles = [];
        this.useStations();
        this.campaignFormMode = true;
        this.fetchCampaignFiles(null);
    }

    editCampaign(campaignId) {
        console.log(campaignId);
        this.campaignFiles = [];
        this.confirmedFiles = [];
        this.useStations();
        this.campaignService.getById(campaignId).subscribe(data => {
            this.selectedCampaign = data;
            this.updateFormControls(data);
            this.campaignFormMode = true;
            this.campaignFormEditMode = true;

            this.fetchCampaignFiles(campaignId);
        }, error => {
            console.log(error);
            this.campaignFiles = [];
            this.confirmedFiles = [];
            this.useStations();
            this.resetFlags();
            // TODO: throw error message.
        });
    }

    updateFormControls(data) {
        if (data) {
            this.campaignName = new FormControl(data.name, Validators.required);

            if (data.effectiveDate) {
                this.effectiveDate = new FormControl(getDateFromModel(data.effectiveDate), Validators.required);
            }

            if (data.terminationDate) {
                this.terminationDate = new FormControl(getDateFromModel(data.terminationDate), Validators.required);
            }
            this.createForm();
        }
    }

    viewCampaignFiles(campaignId) {
        console.log(campaignId);
        this.router.navigate(['campaignFile', campaignId]);
    }

    fetchCampaignFiles(campaignId) {
        this.campaignFileService.getAll().subscribe(data => {
            this.campaignFiles = data;
            this.confirmedFiles = [];
            if (null != campaignId) {
                this.filterCampaignSourceFiles(campaignId);
            } else {
                this.useStations();
            }
        }, error => {
            console.log(error);
            this.campaignFiles = [];
            this.confirmedFiles = [];
            this.useStations();
            this.resetFlags();
            // TODO: throw error message.
        });
    }

    resetFlags() {
        this.campaignFormMode = false;
        this.campaignFormEditMode = false;
        this.selectedCampaign = null;
    }

    filterCampaignSourceFiles(campaignId) {
        this.campaignFileService.getByCampaignId(campaignId).subscribe(data => {
            if (data && data.length > 0 && this.campaignFiles && this.campaignFiles.length > 0) {
                this.confirmedFiles = data;
                let validList: Array<CampaignFile> = [];
                for (let item of this.campaignFiles) {
                    for (let cf of data) {
                        if (cf.objectId !== item.objectId) {
                            validList.push(item);
                        }
                    }
                }
                this.campaignFiles = validList;
            }
            this.useStations();
        }, error => {
            console.log(error);
            this.campaignFiles = [];
            this.confirmedFiles = [];
            this.useStations();
            this.resetFlags();
            // TODO: throw error message.
        });
    }

    cancel() {
        this.resetFlags();
    }

    onCampaignFormSubmit(campaignForm) {
        if (campaignForm.valid) {
            let campn = new Campaign();
            let createdAt = null;
            let updatedAt = null;
            if (this.selectedCampaign) {
                campn = this.selectedCampaign;
                if (this.selectedCampaign.createdAt) {
                    campn.createdAt = this.selectedCampaign.createdAt;
                }
            }
            campn.name = this.campaignName.value;
            campn.createdAt = getDateType(createdAt);
            campn.updatedAt = getDateType(updatedAt);

            let date = this.effectiveDate.value;
            if (null!=date){
                let dt = new Date(date);
                let dateType: DateType = new DateType();
                dateType.__type = 'Date';
                dateType.iso = dt.toUTCString();
                campn.effectiveDate = dateType;
            }
            let date2 = this.terminationDate.value;
            if (null!=date2){
                let dt2 = new Date(date2);
                let dateType2: DateType = new DateType();
                dateType2.__type = 'Date';
                dateType2.iso = dt2.toUTCString();
                campn.terminationDate = dateType2;
            }   
            this.campaignService.create(campn).subscribe(data => {
                let objId = campn.objectId;
                if (!objId || objId == null) {
                    objId = data.objectId;
                }
                this.campaignFileService.getByCampaignId(objId).subscribe(res => {
                    let newF: Array<CampaignFile> = [];
                    let rmdF: Array<CampaignFile> = [];

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
                    this.performRelationalOP(objId, newF, 'AddRelation');
                    this.performRelationalOP(objId, rmdF, 'RemoveRelation');
                }, error => {
                    console.log(error);
                    this.campaignFiles = [];
                    this.confirmedFiles = [];
                    this.useStations();
                    this.resetFlags();
                    // TODO: throw error message.
                });
            }, error => {
                console.log(error);
                this.fetch();
            });
        }else {
            console.log('Camp Form Invalid');
        }
    }

    performRelationalOP(campId: string, newF: CampaignFile[], op: string) {
        console.log('Operation : ' + op + ' : ' + newF);
        let campaign = new Campaign();
        let relArr: RelatedObject[] = [];
        for (let entry of newF) {
            let rel: RelatedObject = new RelatedObject();
            rel.__type = 'Pointer';
            rel.className = 'CampaignFile';
            rel.objectId = entry.objectId;
            relArr.push(rel);
        }
        if (relArr.length > 0) {
            let dep: Relations = new Relations();
            dep.__op = op;
            dep.objects = relArr;
            campaign.campaignFiles = dep;
            console.log('Campaign : ' + JSON.stringify(campaign));
            this.campaignService.updateRelation(campaign, campId).subscribe(res => {
                console.log(' Updated Relationship ');
            }, err => {
                console.log(err);
            });
        }
        this.fetch();
    }

}
