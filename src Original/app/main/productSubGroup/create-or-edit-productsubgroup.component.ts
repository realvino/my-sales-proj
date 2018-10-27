import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { FileUploader, FileUploaderOptions, Headers } from '@node_modules/ng2-file-upload';
import { Select2ServiceProxy, Datadto, ProductSubGpListDto, ProductSubGroupServiceProxy,CreateProductSubGpInput } from "shared/service-proxies/service-proxies";
import { IAjaxResponse } from "abp-ng2-module/src/abpHttp";
import { AppConsts } from "shared/AppConsts";
import { TokenService } from "abp-ng2-module/src/auth/token.service";

export interface SelectOption{
   id?: number;
   text?: string;
}
@Component({
    selector: 'createProductSubGroupModal',
    templateUrl: './create-or-edit-productsubgroup.component.html'
})
export class CreateproductsubgroupModalComponent extends AppComponentBase  {

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    @ViewChild('subGroupCombobox') subGroupCombobox: ElementRef;

    productsubGroup: ProductSubGpListDto = new ProductSubGpListDto();
	subGroup:CreateProductSubGpInput = new CreateProductSubGpInput();
    SelectedGroupNo:number = 0;
	groups:Array<any> = [];
    eventOriginal = this.productsubGroup;
    public product_group:Array<any> = [];
    active_subgroup:SelectOption[]=[];

    active = false;
    public uploader: FileUploader;
    public temporaryPictureUrl: string;
    public saving: boolean = false;
    private pictureFileName: string;
    private _uploaderOptions: FileUploaderOptions = {};
    private _$profilePictureResize: JQuery;
    private _$jcropApi: any;
    path : string = AppConsts.remoteServiceBaseUrl;
    processed_image:boolean=false;


    constructor(
        injector: Injector,
        private _productSubGroupProxyService: ProductSubGroupServiceProxy,
        private _select2Service: Select2ServiceProxy,
        private _tokenService: TokenService
    ) {
        super(injector);
		
    }
    initializeModal(data? : any): void {
        this.active = true;
        this.pictureFileName = null;
        this._$profilePictureResize = null;
        this._$jcropApi = null;
        this.initFileUploader(data);
    }

    initFileUploader(data? : any): void {

        let self = this;
        if(!this.subGroup.path)
            this.subGroup.path='';

        self.uploader = new FileUploader({ url: AppConsts.remoteServiceBaseUrl + "/Profile/UploadProductSubGroupPicture?ProductId="+data.id+"&ImgPath="+data.path});
        self._uploaderOptions.autoUpload = true;
        self._uploaderOptions.authToken = 'Bearer ' + self._tokenService.getToken();
        self._uploaderOptions.removeAfterUpload = true;
        self.uploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;

        };
        self.uploader.onSuccessItem = (item, response, status) => {
            this.processed_image = true;
            let resp = <IAjaxResponse>JSON.parse(response);
            if (resp.success) {

                this.temporaryPictureUrl = AppConsts.remoteServiceBaseUrl + resp.result.fileName;
                this.pictureFileName = resp.result.fileName;
                if(this.pictureFileName!=null && this.subGroup.id!=null && this.subGroup.id!=0){

                    this.subGroup.path=resp.result.fileName;
                }
            } else {
                this.message.error(resp.error.message);
            }
        };
        self.uploader.setOptions(self._uploaderOptions);
    }

   show(subGroupId?: number): void {
        this.subGroup = new CreateProductSubGpInput();
        this.SelectedGroupNo = 0;
       this.active_subgroup=[];


        this._productSubGroupProxyService.getProductSubGroupForEdit(subGroupId).subscribe((result) => {
           if (result.productsubGroup != null) {
            this.subGroup = result.productsubGroup;
            this.SelectedGroupNo = result.productsubGroup.productGroupId;

               this.initializeModal(this.subGroup);
           }

             this.active = true;
            this._select2Service.getProductGroup().subscribe((result) => {
                if(result.select2data != null){
                    this.groups = result.select2data;

                    this.product_group=[];
                    this.groups.forEach((pro_group:{id:number,name:string})=>{
                        if(this.subGroup.productGroupId==pro_group.id){
                            this.active_subgroup = [{id:pro_group.id,text:pro_group.name}];
                        }
                        this.product_group.push({
                            id:pro_group.id,
                            text:pro_group.name
                        });

                    });

                }

            });
             this.modal.show();
        });
    }
    doSomething(data?:any): void {
     this.subGroup.productGroupId = data.id;
    }
    removeProduct(data?:any){
        this.subGroup.productGroupId =null;
    }
   save(): void {
        this.saving = true;
           if (this.subGroup.id == null) {
               this.subGroup.id = 0;
           }
             this._productSubGroupProxyService.createOrUpdateProductSubGroup(this.subGroup)
            .finally(() => this.saving = false)
            .subscribe((result) => {
                this.notify.info(this.l('Saved Successfully'));
                this.subGroup = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.subGroup);
            },(error)=>{
                     this.notify.error(this.l(error.details));
           });
    }
    onShown(): void {
        $(this.nameInput.nativeElement).focus();
    }
    close(): void {
        this.modal.hide();
        this.active = false;
    }
}
