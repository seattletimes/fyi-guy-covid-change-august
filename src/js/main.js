//load our custom elements
require("component-leaflet-map");
require("component-responsive-frame");

//get access to Leaflet and the map
var element = document.querySelector("leaflet-map");
var L = element.leaflet;
var map = element.map;


var ich = require("icanhaz");
var templateFile = require("./_popup.html");
ich.addTemplate("popup", templateFile);

const data = require("./aug10.geo.json");

const mapElement = document.querySelector("leaflet-map");

  var zoomLevel = (document.getElementById("map").offsetWidth > 500) ? 10 : 9;

  var L = mapElement.leaflet;
  var map = mapElement.map;

  map.scrollWheelZoom.disable();

  map.setView(new L.LatLng(47.5, -122.2), zoomLevel);

  var focused = false;

  orangeArray = ['#FAE2C1', '#F4BD6E', '#ED8A52', '#E34D32', '#B22118'];
  orangeBlueArray = ['#447a9a', '#89b1ca', '#bfe0f5', 'gray', '#F4BD6E', '#ED8A52'];

  var arrayLegend = {
    Aug10_change_pos_array: [-3.0, -1.50, -0.09, 0.09, 1.5],
    Aug10_Pos_test_per_july27_aug10_array: [3,6,9,12],
    pos_change: "Aug10_change_pos",
    tests_pos: "Aug10_Pos_test_per_july27_aug10"
  };

  var commafy = s => (s * 1).toLocaleString().replace(/\.0+$/, "");

  data.features.forEach(function(f) {
    ["Aug10_Pos_test_per_july27_aug10", "Aug10_Pos_test_per_july13_july27"].forEach(function(prop) {
      f.properties[prop] = (f.properties[prop] * 100).toFixed(1);
    });
    ["Aug10_tests", "Aug10_positives"].forEach(function(prop) {
      f.properties[prop] = commafy ((f.properties[prop]));
    });
  });


  var onEachFeature = function(feature, layer) {
    layer.bindPopup(ich.popup(feature.properties))
    layer.on({
      mouseover: function(e) {
        layer.setStyle({ weight: 2, fillOpacity: 1 });
      },
      mouseout: function(e) {
        if (focused && focused == layer) { return }
        layer.setStyle({ weight: 1, fillOpacity: 0.7 });
      }
    });
  };


  const colorBlocks = document.querySelectorAll('.color');
  const lastBlocks = document.querySelectorAll('.lastBlock');
  var pos_neg = document.querySelectorAll('.decrease, .increase');




  var getColor = function(d, array) {
    var value = d;
    var thisArray = arrayLegend[array];
    let chosenColorArray = (array === "Aug10_Pos_test_per_july27_aug10_array") ? orangeArray : orangeBlueArray;

    array === "Aug10_Pos_test_per_july27_aug10_array" ? lastBlocks.forEach(el => el.style.display = 'none') : lastBlocks.forEach(el => el.style.display = 'block');
    array === "Aug10_Pos_test_per_july27_aug10_array" ? pos_neg.forEach(el => el.classList.add('hide')) : pos_neg.forEach(el => el.classList.remove('hide'));


    for (let h = 0; h < colorBlocks.length; h++) {
        colorBlocks[h].style.backgroundColor = chosenColorArray[h];
    }

    if (typeof value == "string") {
      value = Number(value.replace(/,/, ""));
    }
    if (typeof value != "undefined") {
      return value >= thisArray[4] ? chosenColorArray[5] :
             value >= thisArray[3] ? chosenColorArray[4] :
      		   value >= thisArray[2] ? chosenColorArray[3] :
             value >= thisArray[1] ? chosenColorArray[2] :
             value >= thisArray[0]  ? chosenColorArray[1] :
             chosenColorArray[0] ;
    } else {
      return "gray"
    }
  };


  var geojson = L.geoJson(data, {
    onEachFeature: onEachFeature
  }).addTo(map);



  function restyleLayer(propertyName) {

    geojson.eachLayer(function(featureInstanceLayer) {
        var propertyValue = featureInstanceLayer.feature.properties[propertyName];
        var colorArray = propertyName + "_array";

        // Your function that determines a fill color for a particular
        // property name and value.
        var myFillColor = getColor(propertyValue, colorArray);

        featureInstanceLayer.setStyle({
            fillColor: myFillColor,
            opacity: .25,
            color: '#000',
            fillOpacity: 0.7,
            weight: 1
        });
    });
}

restyleLayer(arrayLegend.pos_change);

const startSel = document.getElementById("pos_change");
startSel.classList.add("active");



var onEachFeature = function(feature, layer) {
  layer.bindPopup(ich.popup(feature.properties))
};

 map.scrollWheelZoom.disable();



 var filterMarkers = function(clickedID) {
   hideSpans();
   var chosenSpans = legendContainer.getElementsByClassName(clickedID);
   showSpans(chosenSpans);

   for (var i = 0; i < filterButtons.length; i++) {
     filterButtons[i].classList.remove("active");
   }
   var selectedID = document.getElementById(clickedID);
   selectedID.classList.add("active");
   var myID = arrayLegend[clickedID];

   restyleLayer(myID);
 }


 var filterButtons = document.getElementsByClassName("button");
 var legendContainer = document.getElementById("legendCon");
 var allSpans = legendContainer.getElementsByTagName('span');
 var lastColor = document.getElementById("last");

 var hideSpans = function() {
   for (var i = 0; i < allSpans.length; i++) {
     allSpans[i].classList.add("hide");
   }
 };

 var showSpans = function(spanClass) {
   for (var i = 0; i < spanClass.length; i++) {
     spanClass[i].classList.remove("hide");
   }
 };


hideSpans();
var tests_posSpans = legendContainer.getElementsByClassName('pos_change');

showSpans(tests_posSpans);


 for (var i = 0; i < filterButtons.length; i++) {
    let thisID = filterButtons[i].getAttribute("id");
    filterButtons[i].addEventListener('click', () => filterMarkers(thisID), false);
}
