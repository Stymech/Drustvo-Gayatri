document.addEventListener("DOMContentLoaded", function() {
    const besediloElement = document.querySelector('.besedilo');
    const textElement = document.querySelector('.text-center');

    besediloElement.addEventListener('click', function(event) {
        consol.log('Besedilo je bilo kliknjeno');
        const clickedElement = event.target;

        // Check if the clicked element is a link or contains a link
        if (clickedElement.tagName === 'A' || clickedElement.closest('a')) {
            console.log('Link was clicked');
            // Add your code here to handle link click
        } else {
            console.log('Text was clicked');
            // Add your code here to handle text click
        }
    });
    besediloElement.addEventListener('text', function(event) {
        consol.log('Text je bilo kliknjeno');
        const clickedElement = event.target;

        // Check if the clicked element is a link or contains a link
        if (clickedElement.tagName === 'A' || clickedElement.closest('a')) {
            console.log('Link was clicked');
            // Add your code here to handle link click
        } else {
            console.log('Text was clicked');
            // Add your code here to handle text click
        }
    });
});


// Define latitude, longitude and zoom level
const latitude = 46.19455195346911;
const longitude = 13.727996349334717;
const zoom = 13;

var mymap = L.map('mapWrap');

// Add initial marker & popup window
var mmr = L.marker([0,0]);
mmr.bindPopup('0,0');
mmr.addTo(mymap);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {
    foo: 'bar',
    attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}
).addTo(mymap);

// Set lat lng position and zoom level of map 
mmr.setLatLng(L.latLng(latitude, longitude));
mymap.setView([latitude, longitude], zoom);

// Set marker onclick event
mmr.on('click', openPopupWindow);

// Marker click event handler
function openPopupWindow(e) {
    mmr.setPopupContent('Zatolmin 59, 5220 Tolmin').openPopup();
}