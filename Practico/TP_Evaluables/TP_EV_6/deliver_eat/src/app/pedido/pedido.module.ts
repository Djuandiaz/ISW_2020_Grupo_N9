import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {PedidoPageRoutingModule} from './pedido-routing.module';

import {PedidoPage} from './pedido.page';
import {ModalsModule} from '../modals/modals.module';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PedidoPageRoutingModule,
        ReactiveFormsModule,
        ModalsModule
    ],
    declarations: [PedidoPage]
})
export class PedidoPageModule {
}
