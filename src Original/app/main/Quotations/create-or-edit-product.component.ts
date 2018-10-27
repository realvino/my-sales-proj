import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ProductServiceProxy,QuotationProductList,CreateQuotationProductInput,QuotationServiceProxy,Select2ServiceProxy,Datadto, UpdateQuotationTotal } from "shared/service-proxies/service-proxies";


export interface SelectOption {
    id?: number;
    text?: string;
}


@Component({
    selector: 'createQProductModal',
    templateUrl: './create-or-edit-product.component.html',
    styleUrls : ['./create-or-edit-product.component.css']
})
export class CreateEditQProductComponent extends AppComponentBase  {

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    @Output() messageEvent = new EventEmitter<string>();

	
    active = false;
    saving = false;
    code:Array<any>=[];
    codes:Array<any>=[];
    level:Array<any>=[];
    levels:Array<any>=[];
    quotation:number;
    origin:boolean=false;
    optional:boolean=false;
    active_code:SelectOption[];
    active_level:SelectOption[];
    pro_input:CreateQuotationProductInput=new CreateQuotationProductInput();
    pro_edit:QuotationProductList = new QuotationProductList();
    quttot:UpdateQuotationTotal=new UpdateQuotationTotal();
    rate: number;

    constructor(
        injector: Injector,
        private _selectProxyService: Select2ServiceProxy,
        private _productServiceProxy:ProductServiceProxy,
        private _quotationProxy:QuotationServiceProxy
    ) {
        super(injector);
        this.getCodes();
    }

    show(quotation?:any,product?:any,rate?:any): void {

        this.pro_input=new CreateQuotationProductInput();
        this.quttot=new UpdateQuotationTotal();
        this.quotation=quotation;
        this.rate=rate;
        this.modal.show();
        //console.log(this.quotation);
        this.active= true;
        if(product === undefined || product == 0){
            this.getCodes();
            this.pro_input.priceLevelProductId=null;
            this.pro_input.discount=false;
            this.pro_input.optimizer=false;
            this.pro_input.estimatedPrice=null;
            this.pro_input.estimatedPriceUSD=null;
            this.pro_input.price=null;
            this.pro_input.quantity=null;
            this.pro_input.productId=null;
            this.active_code=[];this.active_level=[];
        }
        else{
            this._quotationProxy.getQuotationProductForEdit(product).subscribe((res)=>{
                //console.log(res.quotationProducts);
                this.pro_edit=res.quotationProducts;
                this.pro_input.productId = this.pro_edit.productId;
                this.pro_input.id=this.pro_edit.id;
                this.pro_input.priceLevelProductId=this.pro_edit.priceLevelProductId;
                this.pro_input.discount=this.pro_edit.discount;
                this.pro_input.optimizer=this.pro_edit.optional;
                this.pro_input.estimatedPrice=this.pro_edit.estimatedPrice;
                this.pro_input.estimatedPriceUSD=this.pro_edit.estimatedPriceUSD;
                this.pro_input.price=this.pro_edit.price;
                this.pro_input.quantity=this.pro_edit.quantity;
                this.pro_input.quotationId=this.pro_edit.quotationId;
                this.getPricelevel(this.pro_input.productId);
				this.getCodes();
            });
            
        }


    }


	getCodes(){
        this._selectProxyService.getProduct().subscribe((res)=>{
            if(res.select2data != null){
                this.code = res.select2data;
                this.codes = [];
                this.code.forEach((quo:{id:number,name:string})=>{
                    if(this.pro_input.productId==quo.id){
                        this.active_code=[{id:quo.id,
                            text:quo.name}];
                    }
                    this.codes.push({
                        id:quo.id,
                        text:quo.name
                    });
                });
				//console.log(this.active_code,'acode');
            }
        });
    }
	
    private removedCode(data){
        this.pro_input.productId = null;
        this.pro_input.priceLevelProductId = null;
        this.pro_input.price = null;
        this.active_level = [];
        this.estimatePrice(this.pro_input.quantity);
    }
    private selectedCode(data){
        this.pro_input.productId=data.id
        this.getPricelevel(data.id);
        this.pro_input.priceLevelProductId = null;
        this.pro_input.price = null;
        this.active_level = [];
        this.estimatePrice(this.pro_input.quantity);
    }
	
	getPricelevel(id){
        this._productServiceProxy.getProductLevelPriceList(id).subscribe((res)=>{
            if(res.items!=null){
                this.level = res.items;
                this.levels = [];
                this.level.forEach((quo:{id:number,priceLevelName:string})=>{
                    if(this.pro_input.priceLevelProductId==quo.id){
                        this.active_level=[{id:quo.id,
                            text:quo.priceLevelName}];
                    }
                    this.levels.push({
                        id:quo.id,
                        text:quo.priceLevelName
                    });
                });
            }
        });
    }
    private removeLevel(data){
        this.pro_input.priceLevelProductId=null;
        this.pro_input.price=null;
        this.pro_input.priceUSD=null;
        this.estimatePrice(this.pro_input.quantity);
    }
    selectedLevel(data){
        this.pro_input.priceLevelProductId=data.id;
        this.level.forEach((quo:{id:number,price:number})=>{
            if(this.pro_input.priceLevelProductId==quo.id){
                this.pro_input.price= Math.round(quo.price * this.rate);
                this.pro_input.priceUSD= quo.price;
                this.estimatePrice(this.pro_input.quantity);
            }
        });
    }
    
    // private searchEnquiry(data){
    //     this.level.forEach((quo:{id:number,price:number})=>{
    //         if(this.pro_input.priceLevelProductId==quo.id)
    //             this.pro_input.price=quo.price;
    //             this.estimatePrice(this.pro_input.quantity);
    //     });
    // }
    save(): void {
        this.saving = true;
        if(!this.pro_input){
            this.pro_input.id =0;
        }
        this.quttot.quotationId = this.quotation;
        this.pro_input.discount=this.origin;
        this.pro_input.optimizer=this.optional;
        this.pro_input.quotationId=this.quotation;
        this.pro_input.quantity= +(this.pro_input.quantity);
        this.pro_input.tenantId = abp.multiTenancy.getTenantIdCookie();
        //console.log(this.pro_input);
        this._quotationProxy.createOrUpdateQuotationProduct(this.pro_input).finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.success(this.l('SavedSuccessfully'));
                this._quotationProxy.updateQuotationTotal(this.quttot).finally(() => this.saving = false)
                .subscribe(() => {
                   let message ='yes';
                   this.messageEvent.emit(message);
                 });
                this.close();
                this.modalSave.emit(this.pro_input.quotationId);
                this.pro_input.priceLevelProductId=null;
                this.pro_input.discount=false;
                this.pro_input.optimizer=false;
                this.pro_input.estimatedPrice=null;
                this.pro_input.estimatedPriceUSD=null;
                this.pro_input.price=null;
                this.pro_input.quantity=null;
                this.pro_input.productId=null;
                this.active_code=[];this.active_level=[];
              //  this.pro_input.priceLevelId

            });
        /* this._quotationProxy.updateQuotationTotal(this.quttot).finally(() => this.saving = false)
        .subscribe(() => {

                let message ='yes';
                this.messageEvent.emit(message);
            }); */
    }
    onShown(): void {
        $(this.nameInput.nativeElement).focus();
    }
    close(): void {
        this.modal.hide();
        this.active = false;
        this.pro_input.priceLevelProductId=null;
        this.pro_input.discount=false;
        this.pro_input.optimizer=false;
        this.pro_input.estimatedPrice=null;
        this.pro_input.estimatedPriceUSD=null;
        this.pro_input.price=null;
        this.pro_input.quantity=null;
        this.pro_input.productId=null;
        this.active_code=[];this.active_level=[];
    }
    estimatePrice(data){
        this.pro_input.estimatedPrice=+(data*this.pro_input.price);
        this.pro_input.estimatedPriceUSD=+(data*this.pro_input.priceUSD);
    }
    changeOrigin(){

    }

}