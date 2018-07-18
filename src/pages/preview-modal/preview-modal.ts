import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-preview-modal',
  templateUrl: 'preview-modal.html',
})
export class PreviewModalPage {
  keymed: string;
  idusuario: string;
  idhistoria: string;
  lista_efectos=[];
  nombre: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private viewCtrl: ViewController,private alertCtrl: AlertController) {
    this.keymed = this.navParams.get('keymed');
    this.idusuario = this.navParams.get('idusuario');
    this.idhistoria = this.navParams.get('idhistoria');
    this.nombre=this.navParams.get('nombre');
    this.startTime=this.navParams.get('startTime');
    console.log(this.keymed," ",this.idusuario," ",this.idhistoria);

    this.efectosMed();
    console.log(">>>>>>>>>>>Carga Efectos",this.end());
    this.showPopup(">>>>>>>>>>>Carga Efectos", this.end());
  }

  cerrar(){
    this.navCtrl.pop();
  }

 
  efectosMed(){
    firebase.database().ref('/historias/'+this.idusuario+'/'+this.idhistoria+'/medicamentos/'+this.keymed+"/efectos/").on('value', (snapshot) => {
      snapshot.forEach(efectos => {
       // console.log(efectos.child('efecto').val());
        this.addLista(efectos.child('efecto').val());
        return false;
      });
    });
  }

  addLista(valor){
    this.lista_efectos.push(valor);
  }

  startTime;
  endTime;
  start() {
   this.startTime = new Date();
 };

 end() {
   this.endTime = new Date();
   var timeDiff = this.endTime - this.startTime; //in ms
   
   return timeDiff;
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
