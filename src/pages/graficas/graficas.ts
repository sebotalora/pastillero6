import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Chart } from 'chart.js';

/**
 * Generated class for the GraficasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-graficas',
  templateUrl: 'graficas.html',
})
export class GraficasPage {


 
    @ViewChild('lineCanvas') lineCanvas;     

  barChart: any;
  doughnutChart: any;
  lineChart: any;
  listaMes:any;
  datosSuma:any;
  listaMed:any;
  listaGraf:any;
  constructor(public navCtrl: NavController,public navParams: NavParams,private modalCtrl: ModalController) {
    this.listaMes = this.navParams.get('listaMes');
    this.datosSuma = this.navParams.get('datosSuma');
    this.listaMed = this.navParams.get('listaMed');
    this.listaGraf = this.navParams.get('listaGraf');
    console.log("Mes: ",this.listaMes);
    console.log("Dat: ",this.datosSuma);
    console.log("listaMed: ",this.listaMed);
    //console.log("listaGraf: ",this.listaGraf);
   
  }

  ionViewDidLoad() {


     

      this.lineChart = new Chart(this.lineCanvas.nativeElement, {

          type: 'line',
          data: {
              labels: this.listaMes,
              datasets: [
                  {
                      label: "Tomas de medicamentos",
                      fill: false,
                      lineTension: 0.1,
                      backgroundColor: "rgba(75,192,192,0.4)",
                      borderColor: "rgba(75,192,192,1)",
                      borderCapStyle: 'butt',
                      borderDash: [],
                      borderDashOffset: 0.0,
                      borderJoinStyle: 'miter',
                      pointBorderColor: "rgba(75,192,192,1)",
                      pointBackgroundColor: "#fff",
                      pointBorderWidth: 1,
                      pointHoverRadius: 5,
                      pointHoverBackgroundColor: "rgba(75,192,192,1)",
                      pointHoverBorderColor: "rgba(220,220,220,1)",
                      pointHoverBorderWidth: 2,
                      pointRadius: 1,
                      pointHitRadius: 10,
                      data: this.datosSuma,
                      spanGaps: false,
                  }
              ]
          },
          options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
          }

      });

  }

  cerrar(){
    this.navCtrl.pop();
  }
  graf_med(med){
      
      console.log("ir a: ",med);
      let modal_dia = this.modalCtrl.create('GraficaMedicamentoPage', { 
        listaMes: this.listaMes, datosSuma:this.datosGraficaMed(med), med:med
      });
      modal_dia.present();
  }

  datosGraficaMed(med){
    var datos=[];
    var contarMes=0;
    for(var j=0;j < this.listaMes.length; j++){
      contarMes=0;
     for(var i=0;i < this.listaGraf.length; i++){
        if (this.listaMes[j]==this.listaGraf[i][0] && med==this.listaGraf[i][4]){
          contarMes=contarMes+1;
        }
     }
     datos.push(contarMes);
    }
    return datos
   }
}
