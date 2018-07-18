import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import firebase from 'firebase';
import { BdfirebaseProvider } from '../../providers/bdfirebase/bdfirebase';
/**
 * Generated class for the FormulaActualPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-formula-actual',
  templateUrl: 'formula-actual.html',
})
export class FormulaActualPage {
  busqueda:string;
  vacio=true;
  medicamentos=[];
  contadorMed=0;
  startTime;
  endTime;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private bd: BdfirebaseProvider,private alertCtrl: AlertController) {
    this.busqueda = this.navParams.get('busqueda');
    this.startTime = this.navParams.get('tiempoMedicion');

    this.buscarMeds(this.bd.idactual());
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FormulaActualPage');
  }

  end() {
    this.endTime = new Date();
    var timeDiff = this.endTime - this.startTime; //in ms
    
    return timeDiff;
  }

  buscarMeds(id){
   // console.log("Busqueda",this.busqueda);
    firebase.database().ref('/cronograma/'+id+'/'+this.busqueda+'/').orderByChild('hora').on('value', (snapshot) => {
      snapshot.forEach(childSnapshot => {
        this.vacio=false;
        
        this.agregaMedicamento(
          childSnapshot.child('hora').val(),
          childSnapshot.child('medicamento').val()
        );

        return false;

      });
    });
    console.log(">>>>>>>>>>>Carga Cronograma",this.end());
    this.showPopup(">>>>>>>>>>>Carga Cronograma", this.end());
  }

  agregaMedicamento(hora, medicamento){
    var arreglo=[];
    this.contadorMed=this.contadorMed+1;
    var urlimg="";
      if(this.contadorMed % 2 == 0) {
        urlimg="assets/imgs/pildoras-01.png";
      }
      else {
        urlimg="assets/imgs/pildoras-02.png";
      }
    
      arreglo[0]=hora;
      arreglo[1]=medicamento;
      arreglo[2]=urlimg;

    this.medicamentos.push(arreglo);
  }
  cerrar(){
    this.navCtrl.pop();
  }
  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
        {
          text: 'OK'
          
        }
      ]
    });
    alert.present();
  }

}
