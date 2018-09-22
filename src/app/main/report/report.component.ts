import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { DashboardGraphServiceProxy, TenantDashboardServiceProxy, NullableIdDto } from "shared/service-proxies/service-proxies";
import * as _ from 'lodash';
import * as moment from "moment";
import * as Highcharts from 'highcharts';
import * as Highcharts3d from 'highcharts/highcharts-3d';
@Component({
    templateUrl: './report.component.html',
    styleUrls: ['./collection.component.less'],
    animations: [appModuleAnimation()]
})

export class ReportComponent extends AppComponentBase implements OnInit {


    filter = '';
    public graphdata:Array<any>=[];
    public lineChartData:Array<any>=[];
    public lineChartLabels:Array<any>=[];
    apgraphDatas:Array<any>;
    apgraphValues:Array<any>;
    apgraphlabel:Array<any>;
    graphDatas:Array<any>;
    graphValues:Array<any>;
    graphlabel:Array<any>;
    @ViewChild('carousel') carousel:any;
    slides : Array<Object> = [];
    lsgoption: Object;
    lgoption: Object;
    wonGraphInput:NullableIdDto= new NullableIdDto();
    cardIndex:number = 0;

    options : Object = {
    clicking: true,
    sourceProp: 'src',
    visible: 5,
    perspective: 1,
    startSlide: 0,
    border: 3,
    dir: 'ltr',
    width: 286,
    height: 150,
    space: 220,
    autoRotationSpeed: 500000,
    loop: true
    }

    yearPercent = {
        value: 10,
        options: {
            barColor: '#F8CB00',
            trackColor: '#f9f9f9',
            scaleColor: '#dfe0e0',
            scaleLength: 5,
            lineCap: 'round',
            lineWidth: 3,
            size: 75,
            rotate: 0,
            animate: {
                duration: 1000,
                enabled: true
            }
        }
    };
    monthPercent = {
        value: 25,
        options: {
            barColor: '#1bbc9b',
            trackColor: '#f9f9f9',
            scaleColor: '#dfe0e0',
            scaleLength: 5,
            lineCap: 'round',
            lineWidth: 3,
            size: 75,
            rotate: 0,
            animate: {
                duration: 1000,
                enabled: true
            }
        }
    };
    yeartarget: any;
    monthtarget: any;
    yearachived: any;
    monthachived: any;

    constructor(
        injector:Injector,
        private _graphService:DashboardGraphServiceProxy,
        private _dashboardService: TenantDashboardServiceProxy
       
    ) {
        super(injector);
        let d = abp.multiTenancy.getTenantIdCookie();
        this.graphdata =[
            {
                "meetingcount":"2",
                "date":"2017-09-17",
                "target":"75"
            },
            {
                "meetingcount":"6",
                "date":"2017-09-18",
                "target":"75"
            },
            {
                "meetingcount":"5",
                "date":"2017-09-19",
                "target":"75"
            },
            {
                "meetingcount":"6",
                "date":"2017-09-20",
                "target":"75"
            },
            {
                "meetingcount":"6",
                "date":"2017-09-24",
                "target":"75"
            },
            {
                "meetingcount":"7",
                "date":"2017-09-25",
                "target":"75"
            },
            {
                "meetingcount":"7",
                "date":"2017-09-26",
                "target":"75"
            },
            {
                "meetingcount":"4",
                "date":"2017-09-27",
                "target":"75"
            },
            {
                "meetingcount":"2",
                "date":"2017-09-28",
                "target":"75"
            },
            {
                "meetingcount":"4",
                "date":"2017-10-01",
                "target":"75"
            },
            {
                "meetingcount":"4",
                "date":"2017-10-02",
                "target":"75"
            },
            {
                "meetingcount":"6",
                "date":"2017-10-03",
                "target":"75"
            },
            {
                "meetingcount":"7",
                "date":"2017-10-04",
                "target":"75"
            },
            {
                "meetingcount":"7",
                "date":"2017-10-05",
                "target":"75"
            },
            {
                "meetingcount":"5",
                "date":"2017-10-08",
                "target":"75"
            }
        ];
        var data=[];
        var label =[];
        this.graphdata.forEach((quo:{meetingcount:number,date:string,target:number})=>{
            data.push(quo.meetingcount);
            label.push(quo.date);
        });

       /*   this.lineChartData = [
            {data: [65, 59, 80, 81, 56, 55, 40], label: '2017'},
            {data: [28, 48, 40, 19, 86, 27, 90], label: '2016'},
            {data: [18, 48, 77, 9, 100, 27, 40], label: '2015'}
        ];*/

        this.lineChartData=[{data:data,label:'2017'}];
        this.lineChartLabels=label;

     // this.lineChartLabels= ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

    }

    ngOnInit():void {
        this.loadSlider();
        this.getUserTarget();
    }
    activePotentialGraph(value:any){
        this._graphService.getActivepotential(value.id).subscribe(result=>{
            if(result!=null){
                this.apgraphDatas = result;
                this.apgraphlabel = [];
                this.apgraphValues =[];
                this.apgraphDatas.forEach((res)=>{
                    this.apgraphlabel.push(res.createmonth);
                    this.apgraphValues.push(res.optimalactive);
            });
            }
            this.lsgoption =  {
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: 'Active Potential Graph'
                },
                subtitle: {
                    text: 'Source: Quotation'
                },
                xAxis: [{
                    categories: this.apgraphlabel
                }],
                yAxis: [
                    {
                    labels: {
                        format: '{value} $',
                        style: {
                            color: Highcharts.getOptions().colors[2]
                        }
                    },
                    title: {
                        text: 'Target',
                        style: {
                            color: Highcharts.getOptions().colors[2]
                        }
                    },
                    opposite: true
            
                }, 
                { 
                    gridLineWidth: 0,
                    title: {
                        text: 'Achived',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    labels: {
                        format: '{value} $',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    }
            
                }
            ],
                tooltip: {
                    shared: true
                },
                legend: {
                    layout: 'vertical',
                    align: 'left',
                    x: 80,
                    verticalAlign: 'top',
                    y: 55,
                    floating: true,
                    backgroundColor:  '#FFFFFF'
                },
                series: [{
                    name: 'Achived',
                    type: 'column',
                    yAxis: 1,
                    data: this.apgraphValues,
                    tooltip: {
                        valueSuffix: ' $'
                    }
            
                }
                
            ]
            };
        });
    }
    wonGraph(value:any){
        this.wonGraphInput.id = value.id;
        this._graphService.wonTargetDevelopment(this.wonGraphInput).subscribe(result=>{
            // console.log(result,' graph services data');
            if(result!=null){
                this.graphDatas = result;
                this.graphlabel = [];
                this.graphValues =[];
                this.graphDatas.forEach((data)=>{
                    this.graphlabel.push(data.monthString);
                    this.graphValues.push(data.value);
                });
                
            }
            this.lgoption =  {
                title: {
                    text: 'Won Developement Graph'
                },
                xAxis: {
                    categories: this.graphlabel
                },
                yAxis: [
                    {
                    labels: {
                        format: '{value} $',
                        style: {
                            color: Highcharts.getOptions().colors[2]
                        }
                    },
                    title: {
                        style: {
                            display: 'none'
                        }
                    },
                   }, 
                   { 
                    gridLineWidth: 0,
                    title: {
                        style: {
                            color: Highcharts.getOptions().colors[0],
                            display: 'none'
                        }
                    },
                    labels: {
                        format: '{value} $',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    }
            
                    }
                ],
                
                series: [{
                    type: 'column',
                    name: 'Won',
                    data: this.graphValues,
                    yAxis: 1,
                    tooltip: {
                        valueSuffix: ' $'
                    }
                }]
            };
        });
    }
    slideClicked (index) {
        this.cardIndex = index;
        this.carousel.slideClicked(this.cardIndex);
        this.activePotentialGraph(this.slides[this.cardIndex]);
        this.wonGraph(this.slides[this.cardIndex]);
    }
    loadSlider(){
        this.slides = [];
        this._dashboardService.getSalesExecutive()
        .subscribe(result =>{
            let newSlide = new Array<object>()
            result.forEach((item) => {
                newSlide.push({
                    src: item['profilePicture'],
                    name: item['name'],
                    id: item['id'],
                    email: item['email']
                })
            });
            this.slides = newSlide.concat(this.slides);
            this.activePotentialGraph(this.slides[this.cardIndex]);
            this.wonGraph(this.slides[this.cardIndex]);
        });
    }
    getUserTarget():void{
       this._dashboardService.getUserTarget(0).subscribe((result) => {

        this.yeartarget = result[0].yeartarget;
        this.monthtarget = result[0].monthTarget;
        this.yearachived = result[0].yearAchived;
        this.monthachived = result[0].monthAchived;

        this.yearPercent.value = result[0]._Year;
        this.monthPercent.value =  result[0]._Month;
       });
    }

    public lineChartOptions:any = {
        responsive: true,
        maintainAspectRatio: false
    };
    public lineChartColors:Array<any> = [
        { // grey
            backgroundColor: 'transparent',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        },
        { // dark grey
            backgroundColor: 'transparent',
            borderColor: 'rgba(77,83,96,1)',
            pointBackgroundColor: 'rgba(77,83,96,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(77,83,96,1)'
        },
        { // grey
            backgroundColor: 'transparent',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        }
    ];
    public lineChartLegend:boolean = true;
    public lineChartType:string = 'line';

    // events
    public chartClicked(e:any):void {
        //console.log(e);

    }

    public chartHovered(e:any):void {
        //console.log(e);
    }

    public barChartOptions:any = {
        scaleShowVerticalLines: false,
        responsive: true,
        maintainAspectRatio: false
    };
    public barChartLabels:string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul','Aug','Seb','Oct','Nov','Dec'];
    public barChartType:string = 'bar';
    public barChartLegend:boolean = true;

    public barChartData:any[] = [
        {data:[10,20,10,30,50,90,70,60,50,20,10,5] , label: '2017'},
        {data:[10,20,10,30,50,90,70,60,50,20,10,5] , label: '2016'},
        {data:[10,20,10,30,50,90,70,60,50,20,10,5] , label: '2015'}
    ];


}
