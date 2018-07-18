import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MedicamentoFormulaPage } from './medicamento-formula';

@NgModule({
  declarations: [
    MedicamentoFormulaPage,
  ],
  imports: [
    IonicPageModule.forChild(MedicamentoFormulaPage),
  ],
})
export class MedicamentoFormulaPageModule {}
