import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { CurrencyServiceProxy, CurrencyListDto } from 'shared/service-proxies/service-proxies';
import { CreateCurrencyModalComponent } from './create-or-edit-currency.component';
import { FileDownloadService } from "shared/utils/file-download.service";

import * as _ from 'lodash';
@Component({
    templateUrl: './currency.component.html',
    styleUrls: ['./currency.component.less'],
    animations: [appModuleAnimation()]
})

export class CurrencyComponent extends AppComponentBase implements OnInit {

   @ViewChild('createCurrencyModal') createCurrencyModal: CreateCurrencyModalComponent;
   filter = '';
   currencies: CurrencyListDto[] = [];
   cusCurrencies: CurrencyListDto[] = [];
   // filedownload:FileDto=new FileDto();

   constructor(
        injector: Injector,
        private _currencyService: CurrencyServiceProxy
        // private _fileDownloadService: FileDownloadService
    )
    {
        super(injector);
    }

  ngOnInit(): void {
        this.getCurrency();
    }
  createCurrency(): void {
        this.createCurrencyModal.show(0);
    }

  editCurrency(data): void {
        this.createCurrencyModal.show(data.id);
    }


  getCurrency(): void {
     this._currencyService.getCurrencyNew().subscribe((result) => {
            this.currencies    = result.currency;
			this.cusCurrencies = result.customCurrency;
        });
 }
 deleteCurrency(currency: CurrencyListDto): void {
    this.message.confirm(
        this.l('Are you sure to Delete the Currency', currency.name),
        isConfirmed => {
            if (isConfirmed) {
              this._currencyService.deleteCustomCurrency(currency.id).subscribe(result=>{
                _.remove(this.cusCurrencies, currency);
                this.notify.success(this.l("Deleted Successfully"));
              });
            }
        }
    );
}
}