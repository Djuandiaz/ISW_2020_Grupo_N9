import {NgModule} from '@angular/core';
import {EntregaComponent} from './entrega/entrega.component';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import { RecoleccionComponent } from './recoleccion/recoleccion.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule
    ],
    declarations: [EntregaComponent, RecoleccionComponent],
    entryComponents: [EntregaComponent, RecoleccionComponent]
})
export class ModalsModule {

}
