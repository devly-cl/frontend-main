import { AfterViewInit, Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef }                                          from '@angular/material/dialog';
import { IEvent }                                                                 from '@modules/admin/home/interface/event.interface';
import { MatButton, MatIconButton }                                               from '@angular/material/button';
import { GoogleMapsModule }                                                       from '@angular/google-maps';
import { MatIcon }                                                                from '@angular/material/icon';
import { LeafletMouseEvent, map, Map, marker, tileLayer }                         from 'leaflet';
import { DateTime }                                                               from 'luxon';
import { DEFAULT_DATETIME_TIME_OPTIONS }                                          from '@core/constants';

@Component({
    selector   : 'app-event-modal',
    standalone : true,
    imports: [
        MatButton,
        GoogleMapsModule,
        MatIcon,
        MatIconButton,
    ],
    templateUrl: './event-modal.component.html',
    styleUrls  : [ './event-modal.component.scss' ],
})
export class EventModalComponent implements OnInit, AfterViewInit {
    @Input() public event: IEvent = this._data.event;
    neededMaps: boolean = false;
    leafletMap: Map;
    protected readonly DateTime = DateTime;
    protected readonly DEFAULT_DATETIME_TIME_OPTIONS = DEFAULT_DATETIME_TIME_OPTIONS;
    @ViewChild('map') private mapContainer: ElementRef<HTMLElement>;

    constructor(@Inject(MAT_DIALOG_DATA) private _data: { event: IEvent }, private _matDialogRef: MatDialogRef<EventModalComponent>) {}

    ngOnInit(): void {
        if (this._data.event.url?.some((url) => url.platform === 'maps')) {
            this.neededMaps = true;
        }
    }

    ngAfterViewInit(): void {
        this._data.event.url.forEach((url) => {
            if (url.platform === 'maps') {
                const initialState = {lng: url.longitude, lat: url.latitude, zoom: 17};

                this.leafletMap = map(this.mapContainer.nativeElement).setView(
                    [ initialState.lat, initialState.lng ],
                    initialState.zoom
                );

                const isRetina = window.devicePixelRatio > 1;
                const baseUrl = 'https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=3dd80fef8eff420593405a01b0bfa621';
                const retinaUrl = 'https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}@2x.png?apiKey=3dd80fef8eff420593405a01b0bfa621';
                const tileLayerUrl = isRetina ? retinaUrl : baseUrl;

                tileLayer(tileLayerUrl, {
                    attribution: '&sdot;',
                    maxZoom    : 20,
                }).addTo(this.leafletMap);

                marker([ url.latitude, url.longitude ]).addTo(this.leafletMap);

                this.leafletMap.on('click', this.onMapClick);
                //@TODO : Delete this const and console.log
                const lat = marker([ url.latitude, url.longitude ]).getLatLng();
            }
        });
    }

    onMapClick(event: LeafletMouseEvent): void {
        const lat = event.latlng;
        console.log('Latitud: ', lat);
    }

    closeDialog(): void {
        this._matDialogRef.close();
    }
}
