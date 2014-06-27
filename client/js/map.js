var map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.MapQuest({layer: 'sat'})
    })
    ],
    view: new ol.View({
      center: ol.proj.transform([-77.0, 39.0], 'EPSG:4326', 'EPSG:3857'),
      zoom: 4
    })
});
