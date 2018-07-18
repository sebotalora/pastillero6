import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GraficaMedicamentoPage } from './grafica-medicamento';

@NgModule({
  declarations: [
    GraficaMedicamentoPage,
  ],
  imports: [
    IonicPageModule.forChild(GraficaMedicamentoPage),
  ],
})
export class GraficaMedicamentoPageModule {}
