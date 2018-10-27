import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CurrencyServiceProxy, CurrencyListDto,CreateCurrencyInput,CreateCustomCurrencyInput } from 'shared/service-proxies/service-proxies';
import { Select2ServiceProxy,Datadto } from "shared/service-proxies/service-proxies";

export interface SelectOption {
    id?: number;
    text?: string;
}

@Component({
    selector: 'createCurrencyModal',
    templateUrl: './create-or-edit-currency.component.html'
})
export class CreateCurrencyModalComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    currency: CurrencyListDto = new CurrencyListDto();
    currency_input:CreateCustomCurrencyInput = new CreateCustomCurrencyInput(); 
    eventOriginal = this.currency;
	public currencytypes: Array<any>=[];
	public currencytypo:Array<any> =[];
	curId = 0;
	active_currency: Array<any>=[];
    active = false;
    saving = false;
	public Index:Array<any>=[];
	currency_disaled:boolean = false;
	conversionRatio:number;
	//conratio: number;
	
    constructor(
        injector: Injector,
        private _currencyService: CurrencyServiceProxy,
		private _selectProxyService: Select2ServiceProxy
    ) {
        super(injector);
    }


   show(currencyId?: number): void {
    this.currency_input = new CreateCustomCurrencyInput();
	
       
        this._currencyService.getCustomCurrencyForEdit(currencyId).subscribe((result) => {
		
           if (result.customCurrency != null) {
			   
            this.currency_input = result.customCurrency;
			
			this.curId = this.currency_input.currencyId;
			//this.conratio = this.currency_input.conversionRatio;
           }else{;
		   	this.curId = 0;
			this.active_currency = [];
		   }
		   	 this.currencySelect();
             this.active = true;
             this.modal.show();
        });
    }
	doSomething(data): void {
		this.currency_input.currencyId = data.id;
		
		
		  var Index = this.currencytypes.findIndex(
					y => y.id ===  this.currency_input.currencyId);
					//console.log(this.currencytypes[0].code,'code');
					//console.log(data.text,'name');
					this.currency_input.code = this.currencytypes[Index].code;
					this.currency_input.name = data.text; 
					this.currency_disaled =true;
				
		
		
		
    }
	currencySelect(): void{
	
		   	this._selectProxyService.getCurrency().
            subscribe((result)=>{

                if(result.select3data != null){
					
                    this.currencytypes=result.select3data;
                    this.currencytypo = [];
                    this.currencytypes.forEach((crency:{id:number, name:string}) => {
                        if(crency.id != 1){
                            this.currencytypo.push({
                                id: crency.id,
                                text: crency.name
                            });
                        }
						if(this.curId===crency.id){
							this.active_currency = [{id:crency.id,text:crency.name}];
							this.currency_input.currencyId = crency.id;
						}
						
                    });

                }
        });
		   
	}
    removeType(data?:any){
        this.currency_input.currencyId = null;
    }
 save(): void {
			this.saving = true;
			   if (this.currency_input.id == null) {
				   
				   this.currency_input.id = 0;
			   }
				  if (this.currency_input.conversionRatio == null) {
				   
				   this.currency_input.conversionRatio = 0;
			   }  
			
			this.currency_input.tenantId = abp.multiTenancy.getTenantIdCookie();
			console.log(this.currency_input);
			this._currencyService.createOrUpdateCustomCurrency(this.currency_input)
            .finally(() => this.saving = false)
            .subscribe(() => {
				
                this.notify.info(this.l('SavedSuccessfully'));
                 this.currency = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.currency_input);
            });
    }

    onShown(): void {
        $(this.nameInput.nativeElement).focus();
    }
	
	doSomethingchange(currency_disaled){
		
		/* this.conratio= this.currency_input.conversionRatio;
		console.log(this.conratio); */
		if(currency_disaled == true)
		{
		 this.currency_input.conversionRatio = null;
			
		}
		
		
		
	}
	
    close(): void {
		this.currency_disaled =false;
        this.modal.hide();
        this.active = false;
    }
}
