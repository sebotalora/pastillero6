import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, App, AlertController } from 'ionic-angular';
import * as papa from 'papaparse';
import { BdfirebaseProvider } from '../../providers/bdfirebase/bdfirebase';
import { Http } from '@angular/http';
import {  OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { TabsPage } from '../tabs/tabs'; 
import firebase from 'firebase';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { HttpClient} from '@angular/common/http';
/**
 * Generated class for the MedicamentoFormulaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-medicamento-formula',
  templateUrl: 'medicamento-formula.html',
})
export class MedicamentoFormulaPage implements OnInit{
  medicamento="";
  medicVacio=true;
  medicamentosData = [];
  cantidad_total: number;
  presentacion: string;
  frecuencia_cant: number;
  frecuencia_utiempo: string;
  fecha_inicio: string;
  hora_inicio: string;
  numero: String;
  renglon: any;
  bandera_ultimoMed: boolean;
  total_med: number;
  presentacionData = [];
  frecuenciaData = [];
  nombre_formula: string;
  group: FormGroup;
  fechas_cronograma=[];
  cronograma_texto=[];
  flag=true;


  constructor(
    private nav: NavController, public loadingCtrl: LoadingController, public modalCtrl: ModalController,
    private bd: BdfirebaseProvider,public navParams: NavParams,private http: Http,public appCtrl: App,
    private localNotifications: LocalNotifications,public https: HttpClient,private alertCtrl: AlertController
  ) {

    this.renglon = this.navParams.get('data');
    this.numero = this.navParams.get('med').toString();
    this.bandera_ultimoMed = this.navParams.get('banderaFinal');
    this.total_med = this.navParams.get('total');
    this.nombre_formula= this.navParams.get('siguiente');

    //this.leerCSV_presentacion();
   // this.leerCSV_frecuencia();
    this.desglosar_info();
    
    

  }

  ngOnInit(){
    this.group = new FormGroup({
      medicament : new FormControl('',[Validators.required]),
      cantidad_tota : new FormControl('',[Validators.required]),
      presentacio : new FormControl('',[Validators.required]),
      frecuencia_can : new FormControl('',[Validators.required]),
      frecuencia_utiemp : new FormControl('',[Validators.required]),
      fecha_inici : new FormControl('',[Validators.required]),
      hora_inici : new FormControl('',[Validators.required])
    });
  }
  getMedicament() {
    return this.group.get('medicament');
   }
   getCantidad_tota() {
    return this.group.get('cantidad_tota');
   }
   getPresentacio() {
    return this.group.get('presentacio');
   }
   getFrecuencia_can() {
    return this.group.get('frecuencia_can');
   }
   getFrecuencia_utiemp() {
    return this.group.get('frecuencia_utiemp');
   }
   getFecha_inici() {
    return this.group.get('fecha_inici');
   }
   getHora_inici() {
    return this.group.get('hora_inici');
   }

  desglosar_info(){
    //{"F":["TOMAR","CADA"],
    //"M":["LOSARTAN"],
    //"N":["1","12"],
    //"P":["TAB","TABLETAS"],
    //"T":["HORAS"],
    //"LINEA":"[u'VEJA',u'LOSARTAN', u'POTASIO', u'GEOM', u'TAB', u'PENDIENTE', u'TOMAR', u'1', u'TABLETAS', u'CADA', u'12', u'HORAS']"}
    
    if(this.renglon.M !=null){
      var tamanoM= Object.keys(this.renglon.M).length;
      //console.log(this.renglon.M[0]);
      for (var i = 0; i < tamanoM; i++) {
        this.medicamentosData.push(this.renglon.M[i]);
      }
      if (tamanoM>=1){
        this.medicamento=this.medicamentosData[0];
        this.medicVacio=false;
      }else{
        this.medicamento="";
        
      }
      
    }

    if(this.renglon.N !=null){
      var tamanoN= Object.keys(this.renglon.N).length;
      if (tamanoN>1){
        if (this.renglon.N[0] != '1'){
          this.frecuencia_cant= parseInt(this.renglon.N[0]);
          this.cantidad_total= parseInt(this.renglon.N[1]);
        }else{
          this.frecuencia_cant= parseInt(this.renglon.N[1]);
          this.cantidad_total= 30;
        }      
      }else if (tamanoN==1){
        if(this.renglon.N[0] == '1'){
          this.frecuencia_cant= 8;
          this.cantidad_total= 30;
        }else{
          this.frecuencia_cant= parseInt(this.renglon.N[0]);
          this.cantidad_total= 30;
        }
      }else{
        this.frecuencia_cant= 8;
        this.cantidad_total= 30;
      }
    }
    
    if(this.renglon.P !=null){
      this.presentacion= this.renglon.P[0];
    }else{
      this.presentacion= "TABLETAS";
    }
    
    if(this.renglon.T !=null){
      this.frecuencia_utiempo= this.renglon.T[0];
    }else{
      this.frecuencia_utiempo= "HORAS";
    }
    //console.log(this.frecuencia_utiempo);
    
    this.fecha_inicio= new Date().toISOString().slice(0, 10);
    //console.log(this.fecha_inicio);
    this.hora_inicio= "08:00";

    
  
  }

  leerCSV_presentacion(){
    this.http.get('assets/diccionarios/dic_presentacion.csv')
      .subscribe(
      data => this.extraerDatosCSV_prese(data),
      err => this.gestionError(err)
      );
   
  }

  extraerDatosCSV_prese(res){
    let csvData = res['_body'] || '';
    let parsedData = papa.parse(csvData).data;
 
    this.presentacionData = parsedData;
  }

  leerCSV_frecuencia(){
    this.http.get('assets/diccionarios/dic_tiempo.csv')
      .subscribe(
      data => this.extraerDatosCSV_fre(data),
      err => this.gestionError(err)
      );

  }

  extraerDatosCSV_fre(res){
    let csvData = res['_body'] || '';
    let parsedData = papa.parse(csvData).data;
 
    this.frecuenciaData = parsedData;
  }

  gestionError(err){
    console.log('Error Lectura CSV: ', err);
  }

  fechaposterior(){
    var parte_fecha =this.fecha_inicio.split('-');
    var parte_hora =this.hora_inicio.split(':');
    var fecha_y_hora = new Date(
      parseInt(parte_fecha[0]), 
      parseInt(parte_fecha[1]) - 1, 
      parseInt(parte_fecha[2]),
      parseInt(parte_hora[0]),
      parseInt(parte_hora[1]),
      0,
      0
    );
    
    //console.log("Fecha Inicial: ",fecha_y_hora.toISOString());
    return fecha_y_hora;
  }

  cronograma(cantidad,unidad){
    var cantidad_dias=0;
    if(unidad=="DIA" || unidad=="DIAS"){
      cantidad_dias=cantidad;
    }else if (unidad=="QUINCENA" || unidad=="QUINCENAS"){
      cantidad_dias=cantidad*15;
    }else if (unidad=="HORA" || unidad=="HORAS"){
      cantidad_dias=cantidad/24;
    }else if(unidad=="SEMANA" || unidad=="SEMANAS"){
      cantidad_dias=cantidad*7;
    }else if(unidad=="AÑO" || unidad=="AÑOS"){
      cantidad_dias=cantidad*365;
    }else if(unidad=="MINUTO" || unidad=="MINUTOS"){
      cantidad_dias=cantidad/24/60;
    }else if(unidad=="SEGUNDO" || unidad=="SEGUNDOS"){
      cantidad_dias=cantidad/24/60/60;
    }else if(unidad=="MES" || unidad=="MESES"){
      cantidad_dias=cantidad*30;
    }else if(unidad=="ALMUERZO" || unidad=="CENA" ||  unidad=="DESAYUNO"){
      cantidad_dias=cantidad/2;
    }else if (unidad=="COMIDA"){
      cantidad_dias=cantidad/4;
    }

    var segundos=cantidad_dias* 86400;
    var fecha_aux=this.fechaposterior();

    this.fechas_cronograma[0]=[fecha_aux.getFullYear(),fecha_aux.getMonth()+1,fecha_aux.getDate(),fecha_aux.getHours(),fecha_aux.getMinutes()];
   
    this.cronograma_texto[0]=[ this.fechas_cronograma[0][0].toString() +"-"+this.dosdigitos(this.fechas_cronograma[0][1]) +"-"+this.dosdigitos(this.fechas_cronograma[0][2]),
    this.dosdigitos(this.fechas_cronograma[0][3])+":"+this.dosdigitos(this.fechas_cronograma[0][4])];
    
    for (var i = 1; i < this.cantidad_total; i++) {
      fecha_aux.setSeconds(segundos);
      
      this.fechas_cronograma[i]= [fecha_aux.getFullYear(),fecha_aux.getMonth()+1,fecha_aux.getDate(),fecha_aux.getHours(),fecha_aux.getMinutes()];
      
      this.cronograma_texto[i]=[ this.fechas_cronograma[i][0].toString() +"-"+this.dosdigitos(this.fechas_cronograma[i][1]) +"-"+this.dosdigitos(this.fechas_cronograma[i][2]),
      this.dosdigitos(this.fechas_cronograma[i][3])+":"+this.dosdigitos(this.fechas_cronograma[i][4])];
    }

  }

  dosdigitos(number){
    return  ("0" + number).slice(-2);
    
  }
  loading = this.loadingCtrl.create({
    content: '<ion-spinner name="crescent"></ion-spinner> Espera un momento...',
    duration: 12000,
    dismissOnPageChange: true
  });

  registrar() {
   // this.start();
   setTimeout(() => {
    this.loading.present();
    }, 300)

    var id_actual=this.bd.idactual();
    if (this.group.valid) {

      

      this.bd.addfecha2(
        id_actual,
        this.nombre_formula,
        new Date().toISOString().slice(0, 10)
      );

      this.consultarEfectos(id_actual);
     // this.cronograma(this.frecuencia_cant,this.frecuencia_utiempo);
     // this.cronograma_firebase(id_actual);
      
     
      this.ccerrar(this.servidorfirebase(id_actual));

    }else{
      console.log("NO VALIDO" );
    }
    
  }

  ccerrar(a){
    this.loading.dismiss();
    this.nav.pop();
  }


    f1() {
      return new Promise((resolve, reject) => {
        this.loading.present(); 

        var id_actual=this.bd.idactual();
        if (this.group.valid) {
    
          /* this.bd.addMedicamento(
            id_actual,
            this.nombre_formula,
            "m".concat(this.numero.toString()),
            this.medicamento,
            this.cantidad_total,
            this.presentacion,
            this.frecuencia_cant,
            this.frecuencia_utiempo,
            this.fecha_inicio,
            this.hora_inicio
          ); */
    
          this.bd.addfecha2(
            id_actual,
            this.nombre_formula,
            new Date().toISOString().slice(0, 10)
          );
    
          this.consultarEfectos(id_actual);
          //this.cronograma(this.frecuencia_cant,this.frecuencia_utiempo);
          //this.cronograma_firebase(id_actual);
          this.servidorfirebase(id_actual);
        
        }else{
          console.log("NO VALIDO" );
        }
          resolve();
      });
      }
  
      f2() {
        this.loading.dismiss();
        this.nav.pop();
      }

    
rg1(){
  this.f1().then(res => this.f2());
}


  

  registrarparte2(id_actual){
    this.cronograma_firebase(id_actual);
    let alert = this.alertCtrl.create({
      title: 'Notificaciones',
      subTitle: 'Terminado',
      buttons: [{
        text: 'Acepto',
        handler: () => {
          console.log('Acepto clicked');
          this.nav.pop();
          
        }
      }]
    });
    alert.present();
            
  }
  
  servidorfirebase(id_actual){
    console.log("FIREBASE")
  // this.agendarNotificaciones();
    
     var url='http://186.154.95.101/ocrpastillero/guardarCronograma?'
     +'id='+id_actual+'&fechainicio='+this.fecha_inicio+'&horainicio='+this.hora_inicio+'&cantidad='+this.cantidad_total
     +'&frecuencia='+this.frecuencia_cant+'&tiempo='+this.frecuencia_utiempo+'&nombreformula='+this.nombre_formula
     +'&numero='+this.numero+'&medicamento='+this.medicamento+'&presentacion='+this.presentacion;
     console.log(url);

     this.http.get(url).map(res => res.json()).subscribe(data => {
          
           console.log(data["data"][0]);
   
       });
       console.log("FIREBASE2");
      return url;
       
  }

  agendarNotificaciones(){
    for(var i = 0; i < this.cronograma_texto.length; i++){
      this.notificacion(this.idNotif(this.fecha_inicio,this.hora_inicio),this.fecha(this.fecha_inicio,this.hora_inicio), this.texto());
    }
   }

  

  cronograma_firebase(id_actual){
    
    var cantidad_med= this.cronograma_texto.length;
   // console.log("canti:",cantidad_med)
    
     for(var i = 0; i < cantidad_med; i++){

      var idnot =this.idNotif(this.fecha_inicio,this.hora_inicio);
     //this.notificacion(idnot,this.fecha(this.fecha_inicio,this.hora_inicio), this.texto());
           
      this.crearIndex(id_actual,this.cronograma_texto[i][0],this.cronograma_texto[i][1],idnot);
      
    } 

    }

 

  agregar_fecha_cronograma(id,index,fecha,hora,med,idnot){
   
    firebase.database().ref('/cronograma/'+id+'/'+this.nombre_formula+"/"+"m".concat(this.numero.toString())+"/"+fecha+'/'+index).set({
      fecha:fecha,
      hora: hora,
      medicamento: med,
      presentacion: this.presentacion,
      ruta: this.nombre_formula+"/"+"m".concat(this.numero.toString()),
      notificacion: idnot
    }); 
        
   
  }

  crearIndex(id,fecha,hora,idnot){
    var h=hora.split(":");
    var indexacion=this.nombre_formula+"m".concat(this.numero.toString())+"_"+h[0]+h[1];
    this.agregar_fecha_cronograma(id,indexacion,fecha,hora,this.medicamento,idnot);
  }

  /* verificar_indexacion_fecha(id,fecha,hora ,num=1){
    firebase.database().ref('/cronograma/'+id+'/'+fecha+'/'+num.toString()).once('value', (snapshot) => {
      if (snapshot.val()){
        this.verificar_indexacion_fecha(id,fecha,hora,num+1);
      }else{
        
      
        this.agregar_fecha_cronograma(id,num.toString(),fecha,hora,this.medicamento);
        
      }
      
    });
    
  } */
 

  descartar_y_anadir(){
    this.nav.pop();
    this.medicamentoAdicional();
  }

  confirmar_y_anadir(){
    if (this.group.valid) {
    this.registrar();
    this.medicamentoAdicional();
    }else{
      console.log("NO VALIDO" );
    }
  }

  medicamentoAdicional(){
    var lista=[];
    this.total_med=this.total_med+1;
    let modal_verificacion = this.modalCtrl.create('MedicamentoFormulaPage', { 
      data: lista,
      total:this.total_med,
      med: this.total_med,
      banderaFinal: true,
      siguiente: this.nombre_formula
    });
    modal_verificacion.present();
  }

  cancelar(){
    this.nav.pop();
  }

  confirmar_terminar(){
    this.registrar();
    this.appCtrl.getRootNav().push(TabsPage);
  }

  descartar_terminar(){
    this.bd.addfecha(
      this.bd.idactual(),
      this.nombre_formula,
      this.fecha_inicio= new Date().toISOString().slice(0, 10)
    );
    this.nav.pop();
    this.appCtrl.getRootNav().push(TabsPage);
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

  texto(){
    var presentacion="", textof="";
    if(this.presentacion.toLowerCase().slice(-1)=="s"){
      presentacion=this.presentacion.slice(0,-1);
    }else{
      presentacion=this.presentacion;
    }
    textof=this.medicamento+" - 1 "+presentacion;
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

  id_notificaciones=[];

  idNotif(fecha: String,hora : String,cont=1){
    var id;
   // var parte_fecha =fecha.split('-');
    //var parte_hora =hora.split(':');
    //id=parte_fecha[0]+parte_fecha[1]+parte_fecha[2]+parte_hora[0]+parte_hora[1]+cont.toString()+"0";
    id="99"+this.nombre_formula.slice(1)+"99"+this.numero.toString()+cont.toString()
    if(this.id_notificaciones.indexOf(id)==-1){
      
      this.id_notificaciones.push(id);
      return parseInt(id);
    }else{
      
      return this.idNotif(fecha,hora,cont+1);
    }
  
  }

  activo="";
  setActivo(valor){
    this.activo=valor;
  }
  activoVacio(){
    this.activo="";
  }

  consultarEfectos(id_actual){
    var medicamento=this.medicamento;//"NAPROXENO 250 MG TABLETA";
  
   var url='http://186.154.95.101/ocrpastillero/efectosAdversos?medicamento='+medicamento;
   console.log(url);
   this.http.get(url).map(res => res.json()).subscribe(data => {
   // console.log("Server:",data["data"]);
        this.arregloEfectos(id_actual,data["data"],Object.keys(data["data"]).length);
        this.setActivo(data["activo"][0]);


        this.bd.addMedicamento(
          id_actual,
          this.nombre_formula,
          "m".concat(this.numero.toString()),
          this.medicamento,
          this.cantidad_total,
          this.presentacion,
          this.frecuencia_cant,
          this.frecuencia_utiempo,
          this.fecha_inicio,
          this.hora_inicio,
          data["activo"][0]
        );

    });
  }
  efectos=[];
  arregloEfectos(id_actual,datos,tamano){
    //console.log("AQUI VA*****");
   // console.log(tamano);
    for(var i=0;i<tamano;i++){
      //console.log(datos[i]);
      this.efectos.push(datos[i]);
      
    }
   // console.log(this.efectos);
   this.efectoFirebase(id_actual);
  }
  efectoFirebase(id_actual){
    for(var i=0;i<this.efectos.length;i++){
      this.bd.addEfecto(id_actual,this.nombre_formula,"m".concat(this.numero.toString()),i.toString(),this.efectos[i]);
      
    }
    
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

  doOther(){

  }
}
