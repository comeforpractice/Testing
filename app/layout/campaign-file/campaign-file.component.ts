
import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
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
import { CampaignFile, FilePath, DateType, CampaignButton, Relations, RelatedObject } from '../../shared/models/index';
import { CampaignFileService } from '../../shared/services/campaign-file.service';
import { configuration, uriConfig, httpOptions, httpOptionsImage } from '../../shared/config/config';
import { ParseService } from '../../shared/services/parse.service';
import { CampaignButtonService } from '../../shared/index';
import { async } from '@angular/core/testing';



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
        let yearString: string;
        let monthString: string;
        let monthNumber: number;
        let dayString: string;
        let dayNumber: number;
        if (dateType && null != dateType) {
            let date = new Date(dateType.iso);
            let date2 =dateType.iso;
            console.log("(0,3): "    + dateType.iso.substring(0,4)); 
            console.log("(5,7): "    + dateType.iso.substring(5,7)); 
            console.log("(8,10): "    + dateType.iso.substring(8,10)); 
            yearString = dateType.iso.substring(0,4);
            monthString = dateType.iso.substring(5,7);
            dayString = dateType.iso.substring(8,10);
            
            return yearString + '-' + monthString + '-' + dayString;
        }
    
    return null;

}


@Component({
    selector: 'app-campaign-file',
    templateUrl: './campaign-file.component.html',
    styleUrls: ['./campaign-file.component.scss'],
    animations: [routerTransition()]
})
export class CampaignFileComponent implements OnInit {

    rows = [];
    selected = [];

    campForm: FormGroup;
    campaignIdCtrl: FormControl;
    campaignId: any = '';
    filePath: any;
    closeResult: any = '';
    filepathUri: SafeResourceUrl;
    monthVar: number;
    // Campaign File
    fileUpload1: any = false;
    fileUpload2: any = false;
    fileUpload3: any = false;
    campFileFormMode: any = false;
    moreFile: any = false;
    sideSelected: any = false;
    topSelected: any = false;
    eidtCampFileFormMode: any = false;
    buttonSelected: any = false;
    campFileForm: FormGroup;

    fileName: FormControl;
    fileType: FormControl;
    priority: FormControl;
    visibleArea: FormControl;
    visibilityTime: FormControl;
    startDate: FormControl;
    endDate: FormControl;
    visibleAreaDisplay: FormControl;
    fileTypeDisplay: FormControl;

    campaignFile: CampaignFile;
    campButton: CampaignButton;

    campainButtonObject: any;
    campainFileObject: any;
    public selectedFiles;
    public selectedFiles1;
    public selectedFiles2;
    fileContent: any;
    private sharedConfig: Ng4FilesConfig = {
        acceptExtensions: ['jpg', 'png'],
        maxFilesCount: 1
    };

    private namedConfig: Ng4FilesConfig = {
        acceptExtensions: ['mp4', 'jpg', 'png'],
        maxFilesCount: 1,
        maxFileSize: 512000,
        totalFilesSize: 1012000
    };

    constructor(
        private modalService: NgbModal,
        private fb: FormBuilder,
        public campaignFileService: CampaignFileService,
        public campaignButtonService: CampaignButtonService,
        private route: ActivatedRoute,
        public sanitizer: DomSanitizer,
        private ng4FilesService: Ng4FilesService,
        private parseServer: ParseService) {
        this.route.params.subscribe(params => {
            const tempCampId = params['campaignId'];
            this.campaignId = '';
            if (tempCampId && 'nocampaign' !== tempCampId) {
                this.campaignId = tempCampId;
                this.getCampaignFilesByCampaignId();
            }
        });
        this.campaignIdCtrl = new FormControl(this.campaignId, [Validators.required]);
        this.campForm = fb.group({
            'campaignId': this.campaignIdCtrl
        });
        if (this.campaignId === '') {
            this.fetch();
        }
        this.resetFlags();
    }

    ngOnInit() {
        console.log(this.campaignId);
        this.resetFlags();

        this.createFormControls();
        this.createForm();

        this.ng4FilesService.addConfig(this.sharedConfig);
        this.ng4FilesService.addConfig(this.namedConfig, 'another-config');
    }

    fetch() {
        this.campaignId = '';
        this.campaignIdCtrl.reset();
        this.campaignFileService.getAll().subscribe(data => {
            this.rows = data;
            console.log(data);
            this.resetFlags();
        }, error => {
            this.selected = [];
            this.rows = [];
            console.log(error);
            this.resetFlags();
        });
    }

    onSubmitCampaign(camp) {
        this.campaignId = this.campaignIdCtrl.value;
        this.getCampaignFilesByCampaignId();
    }

    getCampaignFilesByCampaignId() {
        console.log(this.campaignId);
        if (this.campaignId && '' !== this.campaignId) {
            this.campaignFileService.getByCampaignId(this.campaignId).subscribe(data => {
                this.rows = data;
                console.log(data);
            }, error => {
                this.selected = [];
                this.rows = [];
                console.log(error);
            });
        }
    }

    onSelect({ selected }) {
        this.selected.splice(0, this.selected.length);
        this.selected.push(...selected);
    }

    add() {
        this.selected.push(this.rows[1], this.rows[3]);
    }

    update() {
        this.selected = [this.rows[1], this.rows[3]];
    }

    remove() {
        console.log(this.selected);
        if (this.selected) {
            this.selected.forEach(row => {
                this.campaignFileService.delete(row.objectId).subscribe(data => {
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

    previewImg(content, row) {
        if (row) {
            row = this.campaignFile;
        }
        this.filePath = row.filePath;
        console.log(this.filePath);
        this.filepathUri = this.sanitizer.bypassSecurityTrustResourceUrl(this.filePath.url);
        console.log(this.filepathUri);
        this.modalService.open(content, { size: 'lg', windowClass: 'modal-xxl' }).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    private getDismissReason(reason: any): string {
        this.filePath = null;
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    addOrModifyCampFile() {
        this.campFileForm = this.fb.group({});
        this.createFormControls();
        this.createForm();
        this.campFileFormMode = true;
    }

    createFormControls() {
        this.fileName = new FormControl('', Validators.required);
        this.fileType = new FormControl(null);
        this.priority = new FormControl(null);
        this.visibilityTime = new FormControl(null);
        this.visibleArea = new FormControl(null);
        this.startDate = new FormControl(null);
        this.endDate = new FormControl(null);
        this.visibleAreaDisplay = new FormControl(null);
        this.fileTypeDisplay = new FormControl(null);
    }

    createForm() {
        this.campFileForm = new FormGroup({
            fileName: this.fileName,
            fileType: this.fileType,
            priority: this.priority,
            visibilityTime: this.visibilityTime,
            visibleArea: this.visibleArea,
            startDate: this.startDate,
            endDate: this.endDate,
            visibleAreaDisplay: this.visibleAreaDisplay,
            fileTypeDisplay: this.fileTypeDisplay,

        });
    }

    public filesSelect(selectedFiles: Ng4FilesSelected): void {
        this.selectedFiles = selectedFiles.files;
    }
    public filesSelect1(selectedFiles1: Ng4FilesSelected): void {
        this.selectedFiles1 = selectedFiles1.files;
    }
    public filesSelect2(selectedFiles2: Ng4FilesSelected): void {
        this.selectedFiles2 = selectedFiles2.files;
    }

    cancel() {
        this.campFileForm.clearValidators();
        this.resetFlags();
    }

    onSubmitCampFileForm(campFileForm) {
        if (campFileForm.valid) {
            let campFile = new CampaignFile();

            let createdAt = null;
            let updatedAt = null;
            if (this.campaignFile) {
                campFile = this.campaignFile;
                createdAt = this.campaignFile.createdAt;
                updatedAt = getDateType(this.campaignFile.updatedAt);
            }
            campFile.fileName = this.fileName.value;
            if (null != this.fileType.value) {
                campFile.fileType = Number(this.fileType.value);
                if (campFile.fileType == 1) {
                    campFile.fileTypeDisplay = "Video";
                }
                if (campFile.fileType == 2) {
                    campFile.fileTypeDisplay = "Image";
                }
            }
            if (null != this.priority.value) {
                campFile.priority = Number(this.priority.value);
            }

            if (null != this.visibleAreaDisplay.value) {
                campFile.visibleAreaDisplay = this.visibleAreaDisplay.value;
                if (this.visibleAreaDisplay.value == "TOP") {
                    campFile.visibleArea = 1;
                }

                if (this.visibleAreaDisplay.value == "SIDE") {
                    campFile.visibleArea = 2;
                }
                if (this.visibleAreaDisplay.value == "BUTTON") {
                    campFile.visibleArea = 3;
                }
            }
            if (null != this.visibilityTime.value) {
                campFile.visibilityTime = Number(this.visibilityTime.value);
            }
            campFile.createdAt = getDateType(createdAt);
            campFile.updatedAt = getDateType(updatedAt);

            let date = this.startDate.value;
            if (null != date && ''!= date) {
                let dt = new Date(date);
                console.log('Start Date : ' + dt);
                let dateType: DateType = new DateType();
                dateType.__type = 'Date';
                dateType.iso = dt.toUTCString();
                campFile.startDate = dateType;
            }else {
                campFile.startDate =  null;
            }

            let date2 = this.endDate.value;
            if (null != date2 && ''!= date2) {
                let dt2 = new Date(date2);
                console.log('End Date : ' + dt2);
                let dateType2: DateType = new DateType();
                dateType2.__type = 'Date';
                dateType2.iso = dt2.toUTCString();
                campFile.endDate = dateType2;
            }
            else {
                campFile.endDate =  null;
            }
            if (this.selectedFiles && this.selectedFiles.length > 0) {
                this.saveFile(campFile);
            } else {
                this.processCampFile(campFile, );
            }
            this.selectedFiles = [];
        } else {
            console.log('Not valid form');
        }
        this.resetFlags();
    }

    saveFile(campFile) {
        let file = this.selectedFiles[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        var self = this;
        reader.onload = () => {
            let fileContent = reader.result.split(',')[1];
            let parseFile = this.parseServer.uploadFile(file.name, file.type, fileContent);
            parseFile.save().then(function () {
                let filePath = new FilePath();

                filePath.url = parseFile._url;
                console.log('filePath.url 1 ' + filePath.url);
                filePath.__type = 'File';
                filePath.name = parseFile._name;
                campFile.filePath = filePath;
                console.log('campFile.filePath ' + campFile.filePath);
                self.processCampFile(campFile);
            }, function (error) {
                console.log('File saving error : ' + error);
                self.processCampFile(campFile);
            });
        }
    }

    processCampFile(campFile) {
        // Check for Visibile Aread.
        if (this.moreFile) {
            let campaignButton = new CampaignButton();
            this.saveCBFile1(campaignButton, campFile);
        } else {
            this.saveCampFile(campFile, null);
        }
    }

    saveCampFile(campFile, campBtnId) {
        this.campaignFileService.create(campFile).subscribe(data => {
            this.campainFileObject = campFile.objectId;
            console.log(data);
            // update Camp file with button data.
            if (null != campBtnId) {
                this.performRelationalOP(data.objectId, campBtnId, 'AddRelation');
            } else {
                this.fetch();
            }
        }, error => {
            console.log(error);
            this.fetch();
        });
    }

    saveCampaignButton(campBtn, campFile) {
        console.log('Campaign Button Befor save : ' + campBtn);
        this.campaignButtonService.create(campBtn).subscribe(
            data => {
                const objId = data.objectId;
                this.saveCampFile(campFile, objId);
            }, err => {
                console.log('Error while saving Camp Button.');
                this.saveCampFile(campFile, null);
            }
        );
    }

    saveCBFile1(campaignButton, campFile) {
        if (this.selectedFiles1 && this.selectedFiles1.length > 0) {
            let file = this.selectedFiles1[0];
            let reader = new FileReader();
            reader.readAsDataURL(file);
            var self = this;
            reader.onloadend = () => {
                let fileContent = reader.result.split(',')[1];
                let parseFile = this.parseServer.uploadFile(file.name, file.type, fileContent);
                parseFile.save().then(function () {
                    let filePath = new FilePath();
                    filePath.url = parseFile._url;
                    console.log('filePath.url 1 ' + filePath.url);
                    filePath.__type = 'File';
                    filePath.name = parseFile._name;
                    campaignButton.sideBannerFileName = filePath.name;
                    campaignButton.sideBannerPath = filePath;
                    console.log('campaignButton.sideBannerPath1 ' + campaignButton.sideBannerPath + campaignButton.sideBannerFileName);
                    self.saveCBFile2(campaignButton, campFile);
                }, function (error) {
                    console.log('File saving error : ' + error);
                    self.saveCBFile2(campaignButton, campFile);
                });
            };
        }
        else {
            this.saveCampFile(campFile, null);
        }
        this.selectedFiles1 = [];
    }

    saveCBFile2(campaignButton, campFile) {
        if (this.selectedFiles2 && this.selectedFiles2.length > 0) {
            let file = this.selectedFiles2[0];
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                let fileContent = reader.result.split(',')[1];
                let parseFile = this.parseServer.uploadFile(file.name, file.type, fileContent);
                var self = this;
                parseFile.save(null, { useMasterKey: true }).then(function () {
                    let filePath = new FilePath();
                    filePath.url = parseFile._url;
                    console.log('filePath.url 2' + filePath.url);
                    filePath.__type = 'File';
                    filePath.name = parseFile._name;
                    campaignButton.topBannerFileName = filePath.name;
                    campaignButton.topBannerPath = filePath;
                    console.log('campaignButton.topBannerPath ' + campaignButton.topBannerPath + campaignButton.topBannerFileName);
                    self.saveCampaignButton(campaignButton, campFile);
                }, function (error) {
                    console.log('File saving error : ' + error);
                    self.saveCampaignButton(campaignButton, campFile);
                });
            };
        }
        this.selectedFiles2 = [];
    }

    performRelationalOP(campFileId: string, campBtnId: string, op: string) {
        console.log('Operation : ' + op + ' : ' + campFileId);
        let campaignFile = new CampaignFile();
        let relArr: RelatedObject[] = [];
        let rel: RelatedObject = new RelatedObject();
        rel.__type = 'Pointer';
        rel.className = 'CampaignButton';
        rel.objectId = campBtnId;
        relArr.push(rel);
        if (relArr.length > 0) {
            let dep: Relations = new Relations();
            dep.__op = op;
            dep.objects = relArr;
            campaignFile.campaignButtonData = dep;
            console.log('Campaign File : ' + JSON.stringify(campaignFile));
            this.campaignFileService.updateRelation(campaignFile, campFileId).subscribe(res => {
                console.log(' Updated Relationship ');
            }, err => {
                console.log(err);
            });
        }
        this.fetch();
    }

    editCampaignFile(campFileId) {
        this.campButton = null;
        this.campaignFile =null;
        if (campFileId) {
            this.campaignFileService.getById(campFileId).subscribe(data => {
                this.updateFormControls(data);
            }, error => {
                this.resetFlags();
            });
        }
    }

    updateFormControls(data) {
        this.campaignFile = data;
        this.moreFile == false;
        console.log(data);
        this.fileName = new FormControl(data.fileName, Validators.required);
        this.fileType = new FormControl(data.fileType, null);
        let visibilityArea = data.visibleAreaDisplay;
        this.priority = new FormControl(data.priority, null);
        if (data.visibleAreaDisplay == "BUTTON") {
            //this.priority = new FormControl(data.priority, null);
            this.moreFile = true;
            this.buttonSelected = true;
        }
        this.visibilityTime = new FormControl(data.visibilityTime, null);
        this.visibleArea = new FormControl(data.visibleArea, null);
        this.visibleAreaDisplay = new FormControl(data.visibleAreaDisplay, null);
        this.campFileFormMode = true;
        this.eidtCampFileFormMode = false;
        let editFilePath = data.filePath;
        if (editFilePath && editFilePath.name) {
            this.eidtCampFileFormMode = true;
        }
        if (data.startDate) {
            this.startDate = new FormControl(getDateFromModel(data.startDate), null);
        }
        if (data.endDate) {
            this.endDate = new FormControl(getDateFromModel(data.endDate), null);
        }
        if (data.visibleAreaDisplay == "BUTTON") {
            this.campaignButtonService.getByCampaignFileId(data.objectId).subscribe(
                data => {
                    this.moreFile = true;
                    this.campButton = data[0];
                    //console.log(this.campButton.sideBannerPath.name);
                }, err => {
                    console.log('Error' + err);
                    this.moreFile = false;
                }
            );
        }
        this.createForm();
    }

    deleteFile() {
        this.eidtCampFileFormMode = false;
    }

    resetFlags() {
        this.campFileFormMode = false;
        this.eidtCampFileFormMode = false;
        this.selectedFiles = [];
        this.filePath = null;
        this.campButton = null;
        this.campaignFile = null;
    }
    leaveChange(control) {
        var msg = control.value == "3" ? this.moreFile = true : this.moreFile = false;
    }

    check(value) {
        this.eidtCampFileFormMode = false;
        var msg = value == "BUTTON" ? this.moreFile = true : this.moreFile = false;
        //var msg = value == "SIDE" ? this.sideSelected = true : this.sideSelected = false;
        //var msg = value == "TOP" ? this.TOP = true : this.sideSelected = false;
    }
    checkFileType(value) {
        var msg = value == "BUTTON" ? this.moreFile = true : this.moreFile = false;
    }

}
