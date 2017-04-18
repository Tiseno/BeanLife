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
  var goFish = getElement('go-fishing')
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

  function startDraggingFish() {
    marker.classList = ['dragging']
  }
  marker.addEventListener('dragstart', startDraggingFish)
  marker.addEventListener('touchstart', function() {
    draggingFish.style.visibility = 'hidden'
    startDraggingFish()
  })
  var draggingFish = getElement('drag-marker');
  marker.addEventListener('touchmove', function(e) {
    draggingFish.style.top = (e.targetTouches[0].clientY - 10) + "px"
    draggingFish.style.left = (e.targetTouches[0].clientX - 20) + "px"
    void draggingFish.offsetWidth
  })
  marker.addEventListener('dragend', function(p) {
    dropFish(p.clientX, p.clientY)
  })
  marker.addEventListener('touchend', function(p) {
    var touches = p.changedTouches[0]
    dropFish(touches.clientX, touches.clientY)
    draggingFish.style.visibility = 'visibility'
  })
  function dropFish(clientX, clientY) {
    // Calculate new position
    var screen = getElement('map')
    var offsetX = (screen.clientWidth - clientX)/screen.clientWidth
    var offsetY = (screen.clientHeight - clientY)/screen.clientHeight
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
  }

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

  var favoriteFishingSpotLocation = {lat: 59.3318168, lng: 18.0770316}
  var favoriteFishingSpot = new google.maps.Marker({
    position: favoriteFishingSpotLocation,
    map: map,
  });

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

  zoom.value = map.getZoom()
  map.addListener('zoom_changed', function() {
    zoom.value = map.getZoom()
  })

  // Set up the custom UI controls
  onClick(clearMarkersButton, clearMarkers)
  onClick(roadmap, setMapType('roadmap', map))
  onClick(satellite, setMapType('satellite', map))
  onClick(hybrid, setMapType('hybrid', map))
  onClick(terrain, setMapType('terrain', map))
  onClick(goFish, function() {
    map.setCenter(favoriteFishingSpotLocation)
    clearElements(goFish)
  })

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

window.onload = function() {
  if (navigator.geolocation) {
    console.log('Attempting to get the user\'s location')
    setTimeout(function() {
      var geoSuccess = function(position) {
        console.log('pos', position)
        var coords = position.coords
        var userPos = {lat: coords.latitude, lng: coords.longitude }
        map.setCenter(userPos)
      }
      var geoError = function(error) {
        console.log('User denied location')
        switch(error.code) {
          case error.TIMEOUT:
            showNudgeBanner()
            break
        }
      }
      navigator.geolocation.getCurrentPosition(geoSuccess, geoError)
    }, 2000)
  } else {
    console.log('geolocation not available')
  }
}

function setMapType(type, map) {
  return function() {
    map.setMapTypeId(type)
    clearElements(type)
  }
}

function clearElements(type) {
  var types = ['satellite', 'hybrid', 'terrain', 'roadmap', 'go-fishing']
  for (var t of types) {
    getElement(t).classList.remove('active')
  }
  getElement(type).classList.add('active')
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

