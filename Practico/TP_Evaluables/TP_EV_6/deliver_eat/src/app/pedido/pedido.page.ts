import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { EntregaComponent } from '../modals/entrega/entrega.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debug } from 'util';
import { Router } from '@angular/router';
import { File } from '@ionic-native/file';
import { sanitizeDOMString } from '@ionic/core/dist/types/utils/sanitization';
import { RecoleccionComponent } from '../modals/recoleccion/recoleccion.component';
import { 
    GoogleMaps,
    GoogleMap,
    GoogleMapsEvent,
    Marker,
    GoogleMapsAnimation,
    MyLocation
  } from "@ionic-native/google-maps";

@Component({
    selector: 'app-pedido',
    templateUrl: './pedido.page.html',
    styleUrls: ['./pedido.page.scss'],
})
export class PedidoPage implements OnInit {
    map: GoogleMap;
    loading: any;
    public form: FormGroup;
    public picToView: string = null;
    public descProducto: string = null;
    public productos = [{
        nombre: 'Papas fritas',
        src: 'papas.jpg'
    }, {
        nombre: 'Hamburguesa',
        src: 'hamburguesa.jpg'
    }];
    public direccion: any;
    public direccionLocal: any;
    fileUrl: any = null;
    respData: any;
    constructor(public modalController: ModalController,
        public alertController: AlertController,
        private router: Router,
        private fb: FormBuilder
    ) {

    }

    ngOnInit() {
        this.form = this.fb.group({
            monto: [''],
            nombreApellido: [''],
            numeroTarjeta: [''],
            codigoSeg: [''],
            vencimiento: [''],
            formaPago: [''],
            fechaEntregaSegment: ['now'],
            fechaEntrega: [''],
            horaEntrega: [''],
        });
        //this.initMap();
    }

    async entregaModal() {
        const modal = await this.modalController.create({
            component: EntregaComponent,
            componentProps: {
                direccion: this.direccion
            }
        });

        await modal.present();
        const { data } = await modal.onWillDismiss();
        this.direccion = data;
    }

    async localModal() {
        const modal = await this.modalController.create({
            component: RecoleccionComponent,
            componentProps: {
                direccionLocal: this.direccionLocal
            }
        });

        await modal.present();
        const { data } = await modal.onWillDismiss();
        this.direccionLocal = data;
    }

    confirm() {
        const arrayError = this.validateMessages();
        if (arrayError.length) {
            this.alertError(arrayError);
        } else {
            this.router.navigate(['success']);
        }
    }

    validateMessages() {
        console.log(this.descProducto);
        const messages = [];
        const formValue = this.form.value;
        if(!this.picToView && !this.descProducto){
            messages.push('Debe incluir una descripcion o imagen del producto.')
        }
        if (!this.productos.length) {
            messages.push('Debe incluir al menos un producto');
        }
        if (!this.direccionLocal) {
            messages.push('Debe agregar una dirección del local donde se desea realizar el pedido');
        }
        if (!this.direccion) {
            messages.push('Debe agregar una dirección de entrega');
        }
        if (!formValue.formaPago) {
            messages.push('Debe elegir una forma de pago');
        }
        if (formValue.formaPago === 'efectivo' && !formValue.monto) {
            messages.push('Cargar el monto de pago');
        }
        if (formValue.formaPago === 'tarjeta') {
            const regex = /^(\d\s?){15,16}$/;
            if (!regex.test(formValue.numeroTarjeta)) {
                messages.push('Número de tarjeta inválido');
            }
            if (!formValue.numeroTarjeta.toString().startsWith('4')) {
                messages.push('Debe ingresar una tarjeta VISA');
            }
            if (!formValue.nombreApellido) {
                messages.push('Cargar el titular de la tarjeta');
            }
            if (!formValue.numeroTarjeta) {
                messages.push('Cargar el número de la tarjeta');
            }
            if (!formValue.vencimiento) {
                messages.push('Cargar el vencimiento de la tarjeta');
            }
            if (formValue.codigoSeg && formValue.codigoSeg.toString().split('').length > 3) {
                messages.push('El código de seguridad debe tener 3 dígitos');
            }
            if (!formValue.codigoSeg) {
                messages.push('Cargar el código de seguridad de la tarjeta');
            }
        }
        if (formValue.fechaEntregaSegment !== 'now') {
            if (!formValue.fechaEntrega) {
                messages.push('Agregar la fecha de entrega.');
            }
            if (!formValue.horaEntrega) {
                messages.push('Agregar la hora de entrega.');
            }
        }
        return messages;
    }

    async alertError(messages) {
        let itemsList = ``;
        messages.map((item) => {
            itemsList += `<li>${item}</li>`;
        });
        const message = `<ul style="padding: 1rem;">${itemsList}</ul>`;
        const alert = await this.alertController.create({
            header: 'Atención!',
            message,
            buttons: ['Aceptar']
        });
        await alert.present();
    }

    uploadFile(evt:any) {
        if (evt.target.files && evt.target.files[0] && evt.target.files[0].size/1024/1024 < 5) {
          let reader = new FileReader();
          reader.onload = (evt:any) => {
            this.picToView = evt.target.result;
          }
          reader.readAsDataURL(evt.target.files[0]);  // to trigger onload
        }
        else if(evt.target.files[0].size/1024/1024 > 5){
            alert( 
                "El archivo es demasiado grande, debe ser menor a 5 MB"); 
        }
        let fileList: FileList = evt.target.files;  
        let file: File = fileList[0];
      }
}