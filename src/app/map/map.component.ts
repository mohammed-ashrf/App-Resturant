import { Component, OnInit } from '@angular/core';
import * as L  from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  private map : L.Map;
  private centroid: L.LatLngExpression = [30.607445692756873, 31.001678693382505]; //sheben el-kom
  private initMap(): void {
    this.map = L.map('mapid', {
      center: this.centroid,
      zoom: 13
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
    });
    tiles.addTo(this.map);
    var marker = L.marker([30.602689478643327, 31.00428201827206]);
    marker.addTo(this.map);
    var circle = L.circle([30.602689478643327, 31.00428201827206], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 500
    });
    circle.addTo(this.map);
    marker.bindPopup("<b>Hello world!</b><br>I'm Mohammed younis.").openPopup();
    circle.bindPopup("this my area.");
    // var popup = L.popup();
    // function onMapClick(e) {
    //     popup
    //         .setLatLng(e.latlng)
    //         .setContent("You clicked the map at " + e.latlng.toString())
    //         .openOn(this.map);
    // }

    function onMapClick(e) {
      alert("You clicked the map at " + e.latlng);
    }
  
    this.map.on('click', onMapClick);

  }
  constructor() { }

  ngOnInit() {
    this.initMap();
  }

}
