import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'modal-entrega',
    templateUrl: './entrega.component.html',
    styleUrls: ['./entrega.component.scss']
})
export class EntregaComponent implements OnInit {

    @Input()
    public direccion;
    form: FormGroup;

    ciudades = ['Alta gracia',
        'Anisacate',
        'Berrotaran',
        'Carlos Paz',
        'Córdoba',
        'Embalse',
        'La Bolsa',
        'Los Aromos',
        'Los Gigantes',
        'Leones',
        'Pilar',
        'Rio Segundo',
        'Villa Maria',
    ];

    constructor(private fb: FormBuilder,
        public modalController: ModalController) {
    }

    ngOnInit() {
        this.ciudades.sort();
        this.form = this.fb.group({
            calle: [this.direccion ? this.direccion.calle : '', Validators.compose([Validators.required])],
            numero: [this.direccion ? this.direccion.numero : '', Validators.compose([Validators.required])],
            ciudad: [this.direccion ? this.direccion.ciudad : '', Validators.compose([Validators.required])],
            referencia: [this.direccion ? this.direccion.referencia : ''],

        });
    }

    async close() {
        if (this.form.valid) {
            await this.modalController.dismiss(this.form.value);
        } else {
            this.form.get('calle').markAsDirty();
            this.form.get('numero').markAsDirty();
            this.form.get('ciudad').markAsDirty();
        }
    }
}
