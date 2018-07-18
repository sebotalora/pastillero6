import { Component } from '@angular/core';
import { NavController, App, AlertController} from 'ionic-angular';
import { AutenticacionProvider } from '../../providers/autenticacion/autenticacion';
import { LoginPage } from '../login/login';
import { BdfirebaseProvider } from '../../providers/bdfirebase/bdfirebase';
import { MedicamentoFormulaPage } from '../medicamento-formula/medicamento-formula';
import firebase from 'firebase';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html'
})
export class PerfilPage {

  perfil_: any = []
  foto: string;
  
  constructor(public navCtrl: NavController, public auth : AutenticacionProvider, private app: App,
    private bd: BdfirebaseProvider, private alertCtrl: AlertController,
    private localNotifications: LocalNotifications) {
      this.inicializar();
  }
  tempo(){
    this.navCtrl.push(MedicamentoFormulaPage);

  }

  cerrarSesion(){
    this.auth.logout();
    this.localNotifications.cancelAll();
    localStorage.removeItem("Correo_Pastillero");
   localStorage.removeItem("Clave_Pastillero");

    this.app.getRootNav().setRoot(LoginPage);
  }

  inicializar(){
    
    //this.showPopup("Ase",JSON.stringify(this.bd.getPerfil(this.bd.idactual())));
   // console.log("ID_C: "+this.bd.idactual());
    //var perfil=this.bd.getPerfil(this.bd.idactual());
    var datosperfil:string[]; 
    firebase.database().ref('/usuarios/'+this.bd.idactual()+'/').on('value', (snapshot) => {
       
       datosperfil=[
         snapshot.child('apellido').val(),
         snapshot.child('correo').val(),
         snapshot.child('edad').val(),
         snapshot.child('nombre').val(),
         snapshot.child('sexo').val(),
         snapshot.child('telefono').val(),
         snapshot.child('nacimiento').val()
      ];
      var sexo="";
      if(datosperfil[4]=="F"){
        sexo='assets/imgs/perfil-mujer.png';
      }else{
        sexo='assets/imgs/perfil-hombre.png'
      }
      
      this.llenarPerfil(datosperfil,sexo);
      
       });
    
  }

  llenarPerfil(datos,sexo){
    this.perfil_=datos;
    // 1-apellido 2-correo 3-edad 4-nombre 5-sexo 6-telefono 7-nacimiento
    //console.log("Perfil_out: "+this.perfil_);
    this.foto=sexo;
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
