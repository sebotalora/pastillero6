import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

//import { FirebaseAuth } from '@firebase/auth-types';
/*
  Generated class for the AutenticacionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AutenticacionProvider {

  constructor(private afAuth :  AngularFireAuth) {
    console.log('Hello AuthProvider Provider');
 }
  
 registerUser(email:string, password:string){
  return this.afAuth.auth.createUserWithEmailAndPassword( email, password)
  .then((res)=>{
   // El usuario se ha creado correctamente.
  })
  .catch(err=>Promise.reject(err))
}

loginUser(email:string, password:string){
  return this.afAuth.auth.signInWithEmailAndPassword(email, password)
    .then(user=>Promise.resolve(user))
    .catch(err=>Promise.reject(err))
}

// Devuelve la session
get Session(){
  return this.afAuth.authState;
 }

 recuperarusuario(email:string){
  return this.afAuth.auth.sendPasswordResetEmail(email)
    .then(function() {
      Promise.resolve(true)
    })
    .catch(err=>Promise.reject(err));
}


 // Logout de usuario
 logout(){
  this.afAuth.auth.signOut().then(()=>{
    
  })
}

}
