import { Component } from '@angular/core';

import { HistorialPage } from '../historial/historial';
import { PerfilPage } from '../perfil/perfil';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = HistorialPage;
  tab3Root = PerfilPage;

  constructor() {

  }
}
