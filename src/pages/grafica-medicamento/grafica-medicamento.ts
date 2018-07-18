import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';
/**
 * Generated class for the GraficaMedicamentoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-grafica-medicamento',
  templateUrl: 'grafica-medicamento.html',
})
export class GraficaMedicamentoPage {
  listaMes:any;
  datosSuma:any;
  med:any;
  
  @ViewChild('lineCanvas') lineCanvas;     

  barChart: any;
  doughnutChart: any;
  lineChart: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.listaMes = this.navParams.get('listaMes');
    this.datosSuma = this.navParams.get('datosSuma'
  );
    this.med = this.navParams.get('med');
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
                      backgroundColor: "rgba(22, 226, 43,0.4)",
                      borderColor: "rgba(22, 226, 43,1)",
                      borderCapStyle: 'butt',
                      borderDash: [],
                      borderDashOffset: 0.0,
                      borderJoinStyle: 'miter',
                      pointBorderColor: "rgba(22, 226, 43,1)",
                      pointBackgroundColor: "#fff",
                      pointBorderWidth: 1,
                      pointHoverRadius: 5,
                      pointHoverBackgroundColor: "rgba(22, 226, 43,1)",
                      pointHoverBorderColor: "rgba(220,220,220,1)",
                      pointHoverBorderWidth: 2,
                      pointRadius: 1,
                      pointHitRadius: 10,
                      data: this.datosSuma,
                      spanGaps: false,
                  }
              ]
          }

      });

  }

  cerrar(){
    this.navCtrl.pop();
  }

}
