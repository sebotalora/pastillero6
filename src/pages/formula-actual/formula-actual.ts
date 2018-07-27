import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import firebase from 'firebase';
import { BdfirebaseProvider } from '../../providers/bdfirebase/bdfirebase';
import { LocalNotifications } from '@ionic-native/local-notifications';

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
    private bd: BdfirebaseProvider,private alertCtrl: AlertController,
    private localNotifications: LocalNotifications) {
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
   
    firebase.database().ref('/cronograma/'+id+'/').orderByChild('hora').on('value', (snapshot) => {
      this.medvacio();
      snapshot.forEach(hist => {

        hist.forEach(med => {
      
          med.child(this.busqueda).forEach(childSnapshot => {
        this.vacio=false;
        
        this.agregaMedicamento(
          childSnapshot.child('hora').val(),
          childSnapshot.child('medicamento').val(),
          childSnapshot.child('ruta').val(),
          childSnapshot.key,
          id,
          childSnapshot.child('notificacion').val(),
          childSnapshot.child('estado').val(),
          childSnapshot.child('presentacion').val()
        );

        return false;

      });

      return false;
    });

    return false;
  });
    });
    //console.log(">>>>>>>>>>>Carga Cronograma",this.end());
   // this.showPopup(">>>>>>>>>>>Carga Cronograma", this.end());
  }
  medvacio(){
    this.medicamentos=[];
  }
  quitarnot(med){
   // console.log('a/cronograma/'+med[5]+'/'+med[3]+'/'+this.busqueda+'/'+med[4]);
   firebase.database().ref('/cronograma/'+med[5]+'/'+med[3]+'/'+this.busqueda+'/'+med[4]).once('value', (snap) => {
    snap.ref.update({
      estado: "inactivo"
    });
   });
    this.localNotifications.cancel(med[6]);
    
  }

  agregarnot(med){
    // console.log('a/cronograma/'+med[5]+'/'+med[3]+'/'+this.busqueda+'/'+med[4]);
    firebase.database().ref('/cronograma/'+med[5]+'/'+med[3]+'/'+this.busqueda+'/'+med[4]).once('value', (snap) => {
     snap.ref.update({
       estado: "activo"
     });
    });
    this.notificacion(med[6],this.fecha(this.busqueda,med[0]), this.texto(med[8],med[1]));
   
     
   }

   notificacion(id,fecha, texto){
    //"assets/sonidos/open-ended.mp3"
  
    this.localNotifications.schedule({
      id: id,
      title: 'Hora de tomar tu medicamento:',
      text: texto,
      trigger: {at: fecha},
      icon: 'file://assets/imgs/pildoras-01.png',
      sound: 'file://assets/sonidos/open-ended.mp3',
      vibrate: true,
      wakeup: true,
      color:"2dd30c"
   }); 

  }

  agregaMedicamento(hora, medicamento,ruta,key,id,notificacion,estado,presentacion){
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
      arreglo[3]=ruta;
      arreglo[4]=key;
      arreglo[5]=id;
      arreglo[6]=notificacion;
      if(estado=="activo"){
        arreglo[7]=true;
      }else{
        arreglo[7]=false;
      }
      arreglo[8]=presentacion;

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

  texto(present,medic){
    var presentacion="", textof="";
    if(present.toLowerCase().slice(-1)=="s"){
      presentacion=present.slice(0,-1);
    }else{
      presentacion=present;
    }
    textof=medic+" - 1 "+presentacion;
    return textof;
  }

  fecha(fecha,hora){
    var parte_fecha =fecha.split('-');
    var parte_hora =hora.split(':');
    var fecha_y_hora = new Date(parseInt(
      parte_fecha[0]), 
      parseInt(parte_fecha[1]) - 1, 
      parseInt(parte_fecha[2]),
      parseInt(parte_hora[0]),
      parseInt(parte_hora[1]),
      0,
      0
    );
    
    return fecha_y_hora;
  }

}
