import { ImagesProvider } from './../../providers/images/images';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ModalController, LoadingController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-upload-modal',
  templateUrl: 'upload-modal.html',
})
export class UploadModalPage {
  imageData: any;
  desc: string;
  formula: any;
  total_med: number;
  siguiente: string;

  constructor(public loadingCtrl: LoadingController, public modalCtrl: ModalController, public navCtrl: NavController, private navParams: NavParams, private viewCtrl: ViewController, private imagesProvider: ImagesProvider, private alertCtrl: AlertController) {
    this.imageData = this.navParams.get('data');
    this.siguiente = this.navParams.get('siguiente');
  }

  verificarMedicamentos(lista){
    var tamano= Object.keys(lista).length;
    var listaM=[];
    for (var i = 0; i < tamano; i++) {
      if (lista[i].M != null){
        listaM.push(i);
      }
    }
    this.total_med=listaM.length;
    this.verificar(1,listaM,lista);
  }
  verificar(num, listaM,lista){
    var ultimoMed=false;
    //console.log(listaM.length);
    if(listaM.length >0){
      if(listaM.length==1){
        ultimoMed=true;
      }
      var i=listaM[0];
    listaM.shift();
    let modal_verificacion = this.modalCtrl.create('MedicamentoFormulaPage', { data: lista[i], total:this.total_med, med: num, banderaFinal: ultimoMed, siguiente:this.siguiente  });
        modal_verificacion.onDidDismiss(()=>{
          this.verificar(num+1,listaM,lista);
        });
    modal_verificacion.present();
    
    }else{
      //cerrar upload ts
      //mostrar receta etc
    }
    
  }

  saveImage() {
    this.start();
    let self = this;
    self.loadingCtrl.create({
      content: '<ion-spinner name="crescent"></ion-spinner> Cargando...',
      duration: 8000,
      dismissOnPageChange: true
    }).present();

    this.imagesProvider.uploadImage(this.imageData, this.desc).then(res => {
      console.log("Exito");
     // var json_str=res.response;
      
      var datos=JSON.parse(res.response);
      //datos.response[1].M
      let alert = this.alertCtrl.create({
        title: 'Enviado con Exito',
        subTitle: 'Por favor, proceda a confirmar la información de la receta medica, reconocida por nuestro servidor.',
        buttons: [
          {
            text: 'Ok',
            role: 'Ok',
            handler: () => {
              this.verificarMedicamentos(datos);
              this.viewCtrl.dismiss();
              
            }
          }
          ]
        
      });
      alert.present();
    //  console.log(">>>>>>>>>>>Carga Foto",this.end());

      //let nuevaf  = this.modalCtrl.create(FormulaActualPage, {formula: JSON.parse(res.response)});
     // nuevaf.present();
      
    }, err => {
      console.log(err.message);
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: JSON.stringify(err),
        buttons: ['cerrar']
      });
      alert.present();

      //this.dismiss();
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
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

}
