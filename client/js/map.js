var maxSize = 10;
var features = [];

var image = new ol.style.Circle({
  radius: 5,
  fill: null,
  stroke: new ol.style.Stroke({color: 'red', width: 1})
});

var editStyle = new ol.style.Style({
  image: image
});

var testFeature = new ol.Feature({
	geometry: new ol.geom.Point(ol.proj.transform([-77.0, 39.0], 'EPSG:4326', 'EPSG:3857')),
  name: 'Null Island',
  population: 4000,
  rainfall: 500
});

testFeature.setStyle(editStyle);

//var editSource = new ol.source.GeoJSON({
//	object: {
//	  'type': 'GeometryCollection',
//		'crs': {
//		  'type': "name",
//		  'properties': {
//			   'name':'EPSG:3857'
//			}
//		}
//	},
//  features: features
//});
//
var editSource = new ol.source.GeoJSON({
  features: []
});

var edit = new ol.layer.Vector({
	source: editSource,
	style: editStyle
});

function updateFeatures (msg) {
  var geoJson = msg.st_asgeojson;
	var geoJsonFormat = new ol.format.GeoJSON({
	  defaultProjection: 'EPSG:4326'
	});
	var geomWGS84 = geoJsonFormat.readGeometry(geoJson);
	var geom = geomWGS84.transform('EPSG:4326','EPSG:3857');
 	var feature = new ol.Feature({
	  geometry: geom
	});
	console.log(feature);
	editSource.addFeature(feature);
}

console.log(editSource.getFeatures().length);


var baseMap = new ol.layer.Tile({
  source: new ol.source.MapQuest({layer: 'sat'})
});

var map = new ol.Map({
  target: 'map',
  layers: [	baseMap ],
  view: new ol.View({
    center: ol.proj.transform([-77.0, 39.0], 'EPSG:4326', 'EPSG:3857'),
    zoom: 4
  })
});

map.addLayer(edit);

