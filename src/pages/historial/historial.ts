import { Component } from '@angular/core';
import { Camera } from '@ionic-native/camera';
import { NavController, ModalController, ActionSheetController, AlertController, LoadingController } from 'ionic-angular';

import { BdfirebaseProvider } from '../../providers/bdfirebase/bdfirebase';
import firebase from 'firebase';

@Component({
  selector: 'page-historial',
  templateUrl: 'historial.html'
})
export class HistorialPage {

  
  cantidad_formulas: number;
  formulas=[];
  contador_formulas: number;
  public base64Image: string;
  id_: string;
  siguiente_formula="";
  vacio=true;

  listaGraf=[];
 listaMes=[];
 listaMed=[];
 datosSuma=[];
 startTime;
   endTime; 

  constructor(public loadingCtrl: LoadingController, public navCtrl: NavController,  private bd: BdfirebaseProvider,
    private camera: Camera, private actionSheetCtrl: ActionSheetController, 
    private modalCtrl: ModalController, private alertCtrl: AlertController) {
      this.start();
      this.contador_formulas=0;
      let self = this;
      self.loadingCtrl.create({
      content: '<ion-spinner name="crescent"></ion-spinner> Espera un momento...',
      duration: 1700,
      }).present();

      var idd=this.bd.idactual();
      this.init_formulas(idd);
      this.traerCronograma(idd);
     // setTimeout(this.ordenarMes(), 1500);

      //console.log(">>>>>>>>>>>Carga Historias",this.end());
      //this.showPopup(">>>>>>>>>>>Carga Historias", this.end());
  
      
    }

    start() {
      this.startTime = new Date();
    };
  
    end() {
      this.endTime = new Date();
      var timeDiff = this.endTime - this.startTime; //in ms
      
      return timeDiff;
    }
  
  takePicture(sourceType){
// Create options for the Camera Dialog
var options = {
  quality: 100,
  destinationType: this.camera.DestinationType.FILE_URI,
  sourceType: sourceType,
  saveToPhotoAlbum: false,
  correctOrientation: true
};

// Get the data of an image
this.camera.getPicture(options).then((imagePath) => {
  console.log("imagePath:"+imagePath)
  let modal = this.modalCtrl.create('UploadModalPage', { data: imagePath, siguiente: this.siguiente_formula});
  modal.present();
  
}, (err) => {
  console.log('Error: ', err);
});
}
    
grafica(){
 // this.navCtrl.push(GraficasPage);
 
 this.datosGrafica1();
// console.log("A:",this.listaMes);
// console.log("B:",this.datosSuma);
 let modal_dia = this.modalCtrl.create('GraficasPage', { 
  listaMes: this.listaMes, datosSuma:this.datosSuma, listaMed: this.listaMed, listaGraf:this.listaGraf
});
modal_dia.present();
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


presentActionSheet() {
  
  this.siguiente_nombre(this.bd.idactual());

  let actionSheet = this.actionSheetCtrl.create({
    title: 'Añadir Fórmula: Seleccione método de ingreso',
    buttons: [
      {
        text: 'Cargar de la galería',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Tomar Fotografía',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Ingresar fórmula manualmente',
        handler: () => {
          var lista=[];
          
          let modal_verificacion = this.modalCtrl.create('MedicamentoFormulaPage', { 
            data: lista,
            total:1,
            med: 1,
            banderaFinal: true,
            siguiente: this.siguiente_formula
          });
          modal_verificacion.present();
        }
      },
      {
        text: 'Cancelar',
        role: 'cancel'
      }
    ]
  });
  actionSheet.present();
}

vacioNO(){
  this.vacio=false;
}

cant_formulas(cant){
  this.cantidad_formulas = cant;
}
sumar_formula(){
  this.contador_formulas=this.contador_formulas+1;
}

arreglo_formulas(arreglo){
  this.formulas.push(arreglo);
 //console.log("Ajá");
 // console.log(this.formulas);
}

setformulascero(){
  this.formulas=[];
}

contadorformulascero(){
  this.contador_formulas=0;
}

init_formulas(id){
  
  
  firebase.database().ref('/historias/'+id+'/').on('value', (snapshot) => {
    this.contadorformulascero();
    this.setformulascero();
   // console.log("***Cant Formulas "+id+": "+snapshot.numChildren());
    this.cant_formulas(snapshot.numChildren());  /////////////////
   // console.log("Usuario: "+snapshot.key);

    snapshot.forEach(childSnapshot => {
      this.vacioNO();
      var keyFormula = childSnapshot.key;
      var formula_array= new Array();

     // console.log("Formula: "+keyFormula);
      
      var fechaFormula = childSnapshot.child('datos').child('fecha').val();
      
      //console.log("Fecha Formula: "+fechaFormula);
      
      var urlimg="";
      if(this.contador_formulas % 2 == 0) {
        urlimg="assets/imgs/myjobs/receta1.jpg";
      }
      else {
        urlimg="assets/imgs/myjobs/receta2.jpg";
      }

    //  console.log("Contador: ",this.contador_formulas);
     // console.log("# meds: ",childSnapshot.child('medicamentos').numChildren());

      formula_array[0]=this.contador_formulas+1;
      formula_array[1]=keyFormula;
      formula_array[2]=fechaFormula;
      formula_array[3]=childSnapshot.child('medicamentos').numChildren();
      formula_array[4]=urlimg;

    //  console.log("Agregar formula");
      this.arreglo_formulas(formula_array);

      this.sumar_formula();
      return false;

    });

   });
   
}

addContador(){
  this.contador_formulas=this.contador_formulas+1;
  return this.contador_formulas;
}

ver_formula(datos){
  this.start();
 // console.log("datos");
//  console.log(datos);
  let modal_verformula = this.modalCtrl.create('FormulaPage', { data: datos, startTime:this.startTime });
  modal_verformula.present();
}
siguiente_nombre(id,numero=this.cantidad_formulas+1){
   
  firebase.database().ref('/historias/'+id+'/h'+numero.toString()+'/').once('value', (snapshot) => {
    if (snapshot.val()){
      this.siguiente_nombre(id,numero+1);
    }else{
      this.siguiente_formula='h'+numero.toString();
      console.log("Sig nombre de formula:",this.siguiente_formula);
    }
  });
}


traerCronograma(id){
  console.log("************************ACTUALIZANDOOO***************")
  
  firebase.database().ref('/cronograma/'+id+'/').once('value', (snapshot) => {
    snapshot.forEach(hist => {

      hist.forEach(med => {

        med.forEach(dia => {

      dia.forEach(meds => {
       // var keyMed = meds.key;
        var meses=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

        var fecha = meds.child('fecha').val();
        //console.log(fecha);
        var fechaaux = fecha.split("-");
        //var mes_anio=meses[parseInt(fechaaux[1])-1]+"-"+fechaaux[0];
        var mes_anio=fechaaux[0]+"-"+fechaaux[1];
        var medicamento = meds.child('medicamento').val();
        var presentacion = meds.child('presentacion').val();
       // console.log([mes_anio,fechaaux[0],fechaaux[1],fechaaux[2],medicamento,presentacion]);
       if (presentacion==null){presentacion="TABLETAS";}
        this.listaTodo([mes_anio,fechaaux[0],fechaaux[1],fechaaux[2],medicamento,presentacion]);

        return false;
      });
        
        
        return false;
      });
      return false;
    });
      
      
      return false;
    });
   });
   
 }

 

 datosgrafica=[];
 listafinalmes=[];
 listaTodo(arreglo){
  
  this.listaGraf.push(arreglo);
  if (this.listaMes.indexOf(arreglo[0])==-1){
    this.listaMes.push(arreglo[0]);
   // this.listafinalmes.push(arreglo[1]+"-"+arreglo[2]);
   // this.setnumber(this.listafinalmes.length);
  }
  if (this.listaMed.indexOf(arreglo[4])==-1){
    this.listaMed.push(arreglo[4]);
  }
  //console.log(this.listaMes);
 }

number=0;
setnumber(sad){
this.number=sad;
}
lista2=[];
 ordenarMes(){  

  this.lista2=this.listafinalmes.sort(function(a, b){

    //compare two values
    if(a < b) return -1;
    if(a > b) return 1;
    return 0;
  
  });
 /*  this.listafinalmes.sort(function(a,b){

    var aa=new Date(parseInt(a[1]),(parseInt(a[2])-1),8,0,0,0,0);
    var bb=new Date(parseInt(b[1]),(parseInt(b[2])-1),8,0,0,0,0);

    if (aa < bb) {
      return 1;
    }
    if (aa < bb) {
      return -1;
    }
    // aa must be equal to bb
    return 0;
  }); */
  
  setTimeout(this.limpiarMes(), 2000);
 }

 limpiarMes(){
   console.log("zxMESEEES***");

   console.log("l1:",this.lista2);
   console.log("lf:",this.listafinalmes);
   var meses=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  console.log("lenght: ",this.number);
  for(var j=0;j < this.lista2.length; j++){
    
    var fechaaux = this.lista2[j].split("-");
    var mes_anio=meses[parseInt(fechaaux[1])-1]+"-"+fechaaux[0];
    console.log("yy ",mes_anio);
    if (this.listaMes.indexOf(mes_anio)==-1){
      console.log(mes_anio);
      this.listaMes.push(mes_anio);
    }
  }
  
 }
 
 datosGrafica1(){
  this.datosSuma=[];
  var contarMes=0;
  this.listaMes.sort();
  console.log("df",this.listaMes.sort());
  for(var j=0;j < this.listaMes.length; j++){
    contarMes=0;
   for(var i=0;i < this.listaGraf.length; i++){
      if (this.listaMes[j]==this.listaGraf[i][0]){
        contarMes=contarMes+1;
      }
   }
   this.datosSuma.push(contarMes);
  }
 }

}
