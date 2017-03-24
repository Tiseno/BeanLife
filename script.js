'use strict';

var map
function initMap() {
  // Setup the splash screen
  var standby = getElement('stand-by')
  var plusses = 0
  // Very important splash screen function
  setInterval(function() {
    if (plusses == 4) {
      standby.innerHTML = "Stand by"
      plusses = 0
    } else {
      standby.innerHTML = standby.innerHTML + "."
    }
    plusses++
  }, 200)

  // Get UI elements
  var tilt = getElement('tilt')
  var zoom = getElement('zoom')
  var roadmap = getElement('roadmap')
  var satellite = getElement('satellite')
  var hybrid = getElement('hybrid')
  var terrain = getElement('terrain')
  var marker = getElement('marker')
  var markers = [marker, getElement('marker-2'), getElement('marker-3'), getElement('marker-4')]
  var markerContainer = getElement('marker-container')
  var clearMarkersButton = getElement('clear-markers-button')

  marker.addEventListener('dragstart', function(p) {
    marker.classList = ['dragging']
  })

  marker.addEventListener('dragend', function(p) {
    // Calculate new position
    var screen = getElement('map')
    var offsetX = (screen.clientWidth - p.clientX)/screen.clientWidth
    var offsetY = (screen.clientHeight - p.clientY)/screen.clientHeight
    var minLat = map.getBounds().f.f
    var diffLat = map.getBounds().f.b - minLat
    var minLng = map.getBounds().b.f
    var diffLng = map.getBounds().b.b - minLng
    var lat = minLat + diffLat * offsetY
    var lng = minLng + diffLng * offsetX
    var newPos = {lat: lat, lng: lng}
    createMarker(newPos, false)

    // Run conveyor-belt animations
    for (var i in markers) {
      var m = markers[i];
      m.classList.remove('marker-' + i)
      m.classList.remove('map-marker-queue-animation')
      void m.offsetWidth
    }
    for (var i in markers) {
      var m = markers[i];
      m.classList.add('marker-' + i)
      m.classList.add('map-marker-queue-animation')
    }
    marker.classList.remove('dragging')
    // Save marker in local storage
    savedMarkers.push(newPos)
    localStorage.setItem('markers', JSON.stringify(savedMarkers))
  })

  // Set up the map
  var kth = {lat: 59.3498092, lng: 18.0684758}
  map = new google.maps.Map(getElement('map'), {
    center: kth,
    zoom: 18,
    mapTypeId: 'satellite',
    disableDefaultUI: true,
    heading: 90,
    tilt: 0
  })
  setMapType('roadmap', map)()

  // Set up saved markers
  var markerReferences = []
  var savedMarkers = JSON.parse(localStorage.getItem('markers')) || []
  for (var m of savedMarkers) {
    createMarker(m, true)
  }

  function clearMarkers() {
    var image = {
      url: 'http://rs651.pbsrc.com/albums/uu236/416o/explosion.gif~c200',
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(40, 25)
    }
    for (var img of markerReferences) {
      img.setIcon(image)
    }
    setTimeout(function() {
      for (var m of markerReferences) {
        m.setMap(null);
      }
      savedMarkers = []
      localStorage.setItem('markers', "[]")
    }, 810)
  }

  function createMarker(pos, animated) {
    var image = {
      url: 'http://orlando5.pbworks.com/f/1361545324/animated%20salmon.gif',
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(40, 25)
    }
    var newMarker = new google.maps.Marker({
      map: map,
      draggable: false,
      animation: animated ? google.maps.Animation.DROP : null,
      position: pos,
      optimized: false,
      icon: image
    })
    markerReferences.push(newMarker)
  }

  onClick(clearMarkersButton, function() {
    clearMarkers()
  })

  zoom.value = map.getZoom()
  map.addListener('zoom_changed', function() {
    zoom.value = map.getZoom()
  })

  var mousePosition = {lat: 0, lng:0}
  map.addListener('mousemove', function(e) {
    mousePosition.lat = e.latLng.lat()
    mousePosition.lng = e.latLng.lng()
  })

  // Set up the custom UI controls
  onClick(roadmap, setMapType('roadmap', map))
  onClick(satellite, setMapType('satellite', map))
  onClick(hybrid, setMapType('hybrid', map))
  onClick(terrain, setMapType('terrain', map))

  var tilted = false
  onClick(tilt, function() {
    tilted = !tilted
    map.setTilt(tilted ? 45 : 0)
    tilted ? tilt.classList.add('slanted') : tilt.classList.remove('slanted')
  })
  onInput(zoom, function() {
    map.setZoom(zoom.value - 0)
  })
}

function setMapType(type, map) {
  return function() {
    map.setMapTypeId(type)
    var types = ['satellite', 'hybrid', 'terrain', 'roadmap']
    for (var t of types) {
      getElement(t).classList.remove('active')
    }
    getElement(type).classList.add('active')
  }
}

function onInput(el, body) {
  el.addEventListener('input', body)
}

function onClick(el, body) {
  el.addEventListener('click', body)
}

function getElement(id) {
  return document.getElementById(id)
}

