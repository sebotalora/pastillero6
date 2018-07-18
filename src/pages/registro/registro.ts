import { Component } from '@angular/core';
import { IonicPage, NavController,  AlertController, LoadingController } from 'ionic-angular';
import { AutenticacionProvider } from '../../providers/autenticacion/autenticacion';
import { BdfirebaseProvider } from '../../providers/bdfirebase/bdfirebase';

import { TabsPage } from '../tabs/tabs';
/**
 * Generated class for the RegistroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html',
})
export class RegistroPage {

  createSuccess = false;
  registerCredentials = { name: '', email: '', password: '', confirmation_password: '', apellido:'', edad:'', telefono:'', sexo:'',nacimiento:''};

  constructor(
    private nav: NavController, public loadingCtrl: LoadingController, private alertCtrl: AlertController, private auth: AutenticacionProvider, private bd: BdfirebaseProvider
  ) {}

  public register() {
    if (this.registerCredentials.password != this.registerCredentials.confirmation_password) {
      this.showPopup("Error", 'La confirmación de contraseña no coincide.');
    } else {
      
      this.auth.registerUser(this.registerCredentials.email,this.registerCredentials.password )
    .then((user) => {
          this.createSuccess = true;
          try{

            this.auth.loginUser(this.registerCredentials.email,this.registerCredentials.password ).then((user) => {
                        
                        this.bd.crearUsuario(
                          this.bd.idactual(),
                        this.registerCredentials.email,
                        this.registerCredentials.telefono,
                        this.registerCredentials.name,
                        this.registerCredentials.apellido,
                        this.registerCredentials.edad,
                        this.registerCredentials.sexo,
                        this.registerCredentials.nacimiento
                      );
                      
                      this.nav.push(TabsPage);
                  
            
                }
              )
              .catch(err=>{
                let alert = this.alertCtrl.create({
                  title: 'Error',
                  subTitle: err.message,
                  buttons: ['Aceptar']
                });
                alert.present();
              })




            
          }
          catch (err){
            this.showPopup("Error", err);
          }
          
          
    })
    .catch(err=>{
      this.showPopup("Error", err);
    })
    }
  }

  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            if (this.createSuccess) {
              this.nav.popToRoot();
            }
          }
        }
      ]
    });
    alert.present();
  }

}
