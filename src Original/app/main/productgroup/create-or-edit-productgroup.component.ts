import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ProductGroupListDto, ProductGroupServiceProxy } from "shared/service-proxies/service-proxies";
import { IAjaxResponse } from "abp-ng2-module/src/abpHttp";
import { AppConsts } from "shared/AppConsts";
import { TokenService } from "abp-ng2-module/src/auth/token.service";
import { FileUploader, FileUploaderOptions, Headers } from '@node_modules/ng2-file-upload';

@Component({
    selector: 'createProductGroupModal',
    templateUrl: './create-or-edit-productgroup.component.html'
})
export class CreateProductGroupModalComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    productGroup: ProductGroupListDto = new ProductGroupListDto();
    eventOriginal = this.productGroup;

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
        private _productgroupService: ProductGroupServiceProxy,
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
        if(!this.productGroup.path)
            this.productGroup.path='';

        self.uploader = new FileUploader({ url: AppConsts.remoteServiceBaseUrl + "/Profile/UploadProductGroupPicture?ProductId="+data.id+"&ImgPath="+data.path});
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
                if(this.pictureFileName!=null && this.productGroup.id!=null && this.productGroup.id!=0){

                    //console.log(resp);
                    this.productGroup.path=resp.result.fileName;
                }
            } else {
                this.message.error(resp.error.message);
            }
        };
        //console.log(this.pictureFileName,'opopopopopop');
        self.uploader.setOptions(self._uploaderOptions);
    }

   show(productId?: number): void {
        this.productGroup = new ProductGroupListDto();
        this._productgroupService.getProductGroupForEdit(productId).subscribe((result) => {
           if (result.productGroup != null) {
               //console.log(result.productGroup);
            this.productGroup = result.productGroup;
               this.initializeModal(this.productGroup);
           }
             this.active = true;
             this.modal.show();
        });      
    }

 save(): void {
        this.saving = true;
           if (this.productGroup.id == null) {
               this.productGroup.id = 0;
           }
             this._productgroupService.createOrUpdateProductGroup(this.productGroup)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.info(this.l('Saved Successfully'));
                this.productGroup = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.productGroup);
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
