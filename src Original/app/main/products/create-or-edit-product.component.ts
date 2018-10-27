import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective ,TabsetComponent} from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { FileUploader, FileUploaderOptions, Headers } from '@node_modules/ng2-file-upload';
import { PriceLevelProductList,CreatePriceLevelProductInput,ProductServiceProxy,ProductListDto,CreateProductInput,Select2ServiceProxy,Datadto } from "shared/service-proxies/service-proxies";
import { IAjaxResponse } from "abp-ng2-module/src/abpHttp";
import { AppConsts } from "shared/AppConsts";
import { TokenService } from "abp-ng2-module/src/auth/token.service";

export interface SelectOption {
    id?: number;
    text?: string;
}


@Component({
    selector: 'createProductModal',
    templateUrl: './create-or-edit-product.component.html',
    styleUrls : ['./create-or-edit-product.component.css']
})
export class CreateEditProductComponent extends AppComponentBase {

    @Output() modalSave:EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal:ModalDirective;
    @ViewChild('nameInput') nameInput:ElementRef;
    @ViewChild('staticTabs') staticTabs: TabsetComponent;

    public editor;
    public editorContent = `<h3>I am Example 02</h3>`;
    public editorOptions = {
        placeholder: "insert content..."
    };

    discontinue:boolean = false;
    product_sub:Datadto[];
    private product_subgroup:Array<any> = [];
    product:Datadto[];
    private product_group:Array<any> = [];
    HtmlEditorInput:string;
    active_product:SelectOption[];
    active_product_sub:SelectOption[];

    products:ProductListDto = new ProductListDto();
    product_input:CreateProductInput = new CreateProductInput();
    eventOriginal = this.product_input;
    SelectedGroupNo:number = 0;
    SelectedGroupName:string = "";
    SelectedSubGroupNo:number = 0;
    SelectedSubGroupName:string = "";
    processed_image:boolean = false;


    active = false;
    active_price = false;
    public uploader:FileUploader;
    public temporaryPictureUrl:string;
    public saving:boolean = false;
    private pictureFileName:string;
    private _uploaderOptions:FileUploaderOptions = {};
    private _$profilePictureResize:JQuery;
    private _$jcropApi:any;
    path:string = AppConsts.remoteServiceBaseUrl;
    productsId:number;
    productprice:Array<any> = [];

    priceLevel:CreatePriceLevelProductInput = new CreatePriceLevelProductInput();

    private price_level:Array<any> = [];
    pricelevel:Datadto[];
    activepricelevel:SelectOption[];


    constructor(injector:Injector,
                private _selectProxyService:Select2ServiceProxy,
                private _productServiceProxy:ProductServiceProxy,
                private _tokenService:TokenService) {
        super(injector);

    }

    initializeModal(data?:any):void {
        this.active = true;
        this.pictureFileName = null;
        this._$profilePictureResize = null;
        this._$jcropApi = null;
        this.initFileUploader(data);
    }

    initFileUploader(data?:any):void {

        let self = this;
        if (!this.product_input.path)
            this.product_input.path = '';

        self.uploader = new FileUploader({url: AppConsts.remoteServiceBaseUrl + "/Profile/UploadProductPicture?ProductId=" + data.id + "&ImgPath=" + data.path});
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
                if (this.pictureFileName != null && this.product_input.id != null && this.product_input.id != 0) {
                    //  this.product_imageInput.imageUrl = this.pictureFileName;
                    //this.product_imageInput.productId = this.product_input.id;
                    //  this.productImageSave();
                    //console.log(resp.result.fileName);
                    this.product_input.path = resp.result.fileName;
                }
            } else {
                this.message.error(resp.error.message);
            }
        };
        //console.log(this.pictureFileName, 'opopopopopop');
        self.uploader.setOptions(self._uploaderOptions);
    }


    show(product?:any):void {
        this.product_input = new CreateProductInput();
        this.getprice(product);
        this.productsId = product;
		this.SelectedGroupNo = 0;
        this.SelectedGroupName = "";
        this.SelectedSubGroupNo = 0;
        this.SelectedSubGroupName = "";
        this.active_product_sub=[];
        this.priceLevel.price = null;
        this._selectProxyService.getProductGroup().subscribe(result=> {
            if (result.select2data != null) {
                this.product = result.select2data;
                this.product_group = [];
                this.product.forEach((pro:{id:number,name:string})=> {
                    this.product_group.push({
                        id: pro.id,
                        text: pro.name
                    });
                });
            }
        });
        this._productServiceProxy.getProductForEdit(product).subscribe((result)=> {

            if (result.products != null) {
                this.product_input.id = result.products.id;
                this.product_input.productName = result.products.productName;
                this.product_input.productCode = result.products.productCode;
                this.product_input.discontinued = result.products.discontinued;
                this.product_input.description = result.products.description;
                this.SelectedSubGroupNo = result.products.productSubGroupId;
                this.SelectedSubGroupName = result.products.productSubGroupName;
                this.SelectedGroupNo = result.products.producGroupId;
                this.SelectedGroupName = result.products.productGroupName;
                this.product_input.path = result.products.path;

                this.active_product = [{id: result.products.producGroupId, text: result.products.productGroupName}];
                this.active_product_sub = [{
                    id: result.products.productSubGroupId,
                    text: result.products.productSubGroupName
                }];
                this.initializeModal(this.product_input);
                this.product_input.productSubGroupId = result.products.productSubGroupId;
            }

        });

        this._selectProxyService.getPriceLevel().subscribe(result=> {
            if (result.select2data != null) {
                this.pricelevel = result.select2data;
                this.price_level = [];
                this.pricelevel.forEach((price:{id:number,name:string})=> {
                    this.price_level.push({
                        id: price.id,
                        text: price.name
                    });
                });
            }
        });
        this._selectProxyService.getProductSubGroup().subscribe(result=> {
            if (result.select2data != null) {
                this.product_subgroup = [];
                this.product_sub = result.select2data;
                this.product_sub.forEach((pro:{id:number,name:string})=> {
                    this.product_subgroup.push({
                        id: pro.id,
                        text: pro.name
                    });
                });
            }
        });
		
		  if(product){
            
            if(this.product_input.id){
                this.staticTabs.tabs[0].active = true;
            }
        }
		
		
        this.modal.show();
        this.active = true;
        this.active_price=true;

    }

    private selectedProductgroup(data) {
        this.active_product = [{id: data.id, text: data.text}];

        /*this._selectProxyService.getProductSubGroup().subscribe(result=> {
            if (result.select2data != null) {
                this.product_subgroup = [];
                this.product_sub = result.select2data;
                this.product_sub.forEach((pro:{id:number,name:string})=> {
                    this.product_subgroup.push({
                        id: pro.id,
                        text: pro.name
                    });
                });
            }
        });*/
    }


    private removeProductgroup(data) {
        this.active_product = [];
    }

    private selectedProductsubgroup(data) {

        this.active_product_sub = [{id: data.id, text: data.text}];
        this.product_input.productSubGroupId = data.id;
    }

    private removeProductsubgroup(data) {
        this.active_product_sub = [];
        this.product_input.productSubGroupId = null;
    }


    save():void {
        this.saving = true;
        if (!this.product_input) {
            this.product_input.id = 0;
        }
        this.product_input.tenantId = abp.multiTenancy.getTenantIdCookie();
//console.log(this.product_input,10000);
        this._productServiceProxy.createOrUpdateProduct(this.product_input).finally(() => this.saving = false)
            .subscribe(() => {
           
            this.product_input = this.eventOriginal;
			 this.close();
            
            this.modalSave.emit(this.product_input);
			this.product_input.productSubGroupId = null;
        });


    }

    onShown():void {
        $(this.nameInput.nativeElement).focus();
    }

    close():void {
		this.product_input.productSubGroupId = null;
        this.modal.hide();
        this.active = false;
        this		
    }


    getprice(product) {
        //console.log(product,'dfghj');
        //this.productprice.productId = this.product_input.id;
        this._productServiceProxy.getProductLevelPriceList(product).subscribe((result) => {
            this.productprice = result.items;


        });
    }


    private selectedPricelevel(data) {
       // console.log(data, 'sel');
        this.priceLevel.priceLevelId = data.id;
    }

    private removePricelevel(data) {

        this.priceLevel.priceLevelId = null;
    }

    pricelevelsave() {

        if (this.priceLevel.id == null) {
            this.priceLevel.id = 0;
        }

        this.priceLevel.productId = this.product_input.id;
        this.priceLevel.tenantId = abp.multiTenancy.getTenantIdCookie();

        //console.log(this.priceLevel, 'save');
        this._productServiceProxy.createOrUpdatePriceLevelProduct(this.priceLevel).subscribe(result=> {
            //console.log(this.priceLevel);
            this.notify.success(this.l("SavedSuccessfully"));
            this.priceLevel = new CreatePriceLevelProductInput();
            this.getprice(this.product_input.id);
            this.activepricelevel=[];

        });

    }

    deletePricelevel(data) {

        this.message.confirm(
            this.l('Are you sure to Delete the pricelevel', data.priceLevelName),
                isConfirmed => {
                if (isConfirmed) {
                    this._productServiceProxy.deletePriceLevelProduct(data.id).subscribe(() => {
                        this.notify.success(this.l('Deleted Successfully'));
                        this.getprice(this.productsId);
                    });
                }
            });
    }

    onEditorBlured(quill) {
        //console.log('editor blur!', quill);
    }

    onEditorFocused(quill) {
        //console.log('editor focus!', quill);
    }

    onEditorCreated(quill) {
        this.editor = quill;
        //console.log('quill is ready! this is current quill instance object', quill);
    }


    onContentChanged({ quill, html, text }) {
        //console.log('quill content is changed!', quill, html, text);
    }

}
