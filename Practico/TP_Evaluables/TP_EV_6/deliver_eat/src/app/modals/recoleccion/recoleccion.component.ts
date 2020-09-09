import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  GoogleMapsAnimation,
  MyLocation
} from "@ionic-native/google-maps";
import { Platform, LoadingController, ToastController } from "@ionic/angular";

@Component({
  selector: 'modal-recoleccion',
  templateUrl: './recoleccion.component.html',
  styleUrls: ['./recoleccion.component.scss']
})

export class RecoleccionComponent implements OnInit {

  map: GoogleMap;
  loading: any;
  @Input()
  public direccionLocal;
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

  constructor(
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private platform: Platform,
    private googleMaps: GoogleMaps,
    private fb: FormBuilder,
    public modalController: ModalController) {
  }

  async ngOnInit() {
    this.ciudades.sort();
    this.form = this.fb.group({
      calle: [this.direccionLocal ? this.direccionLocal.calle : '', Validators.compose([Validators.required])],
      numero: [this.direccionLocal ? this.direccionLocal.numero : '', Validators.compose([Validators.required])],
      ciudad: [this.direccionLocal ? this.direccionLocal.ciudad : '', Validators.compose([Validators.required])],
      referencia: [this.direccionLocal ? this.direccionLocal.referencia : ''],

    });
    await this.platform.ready();
    await this.loadMap();
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

  loadMap() {
    this.map = GoogleMaps.create("map_canvas", {
      camera: {
        target: {
          lat: -31.417,
          lng: -64.183
        },
        zoom: 18,
        tilt: 30
      }
    });
  }


  async localizar() {
    this.map.clear();
    this.loading = await this.loadingCtrl.create({
      message: "Espera por favor..."
    });

    // Presentamos el componente creado en el paso anterior
    await this.loading.present();

    this.map
      .getMyLocation()
      .then((location: MyLocation) => {
        this.loading.dismiss();
        this.map.animateCamera({
          target: location.latLng,
          zoom: 17,
          tilt: 30
        });

        let marker: Marker = this.map.addMarkerSync({
          title: "Estoy aquí!",
          position: location.latLng,
          animation: GoogleMapsAnimation.BOUNCE
        });

        marker.showInfoWindow();
        marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
          this.showToast("clicked!");
        });
      })
      .catch(error => {
        this.loading.dismiss();
        this.showToast(error.error_message);
      });

    this.map.one(GoogleMapsEvent.MAP_READY)
    .then(() => {
      console.log('Map is ready!');

      this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe(
        (data) => {
          alert("Click MAP");
        }
      );
    });
  }

  async showToast(mensaje) {
    let toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000,
      position: "bottom"
    });

    toast.present();
  }




}