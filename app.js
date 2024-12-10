
// ============================= DISSOLVE TITLE ==============================

window.onscroll = function() {dissolve()};

function dissolve() {
    let scrollPosition = window.pageYOffset;
    // console.log(scrollPosition);

    if (scrollPosition > 600 || (scrollPosition > 300 && screen.width < 600)) {
        target = document.getElementById('target');
        target.classList.add('clicked');
    }
    else {
        target = document.getElementById('target');
        target.classList.remove('clicked');
    }
}

// ================================ OPIS OSEB =================================

let imena = document.querySelectorAll('h2');
let opisi = document.querySelectorAll('.opisOsebe')

// imena.forEach(el => el.addEventListener('click', naslov));   	
imena.forEach(el => el.addEventListener('click', toggleText));
opisi.forEach(el => el.addEventListener('click', toggleText));


function naslov(id, zakasnitev) {

    if (zakasnitev === true) {
        setTimeout(function(){imena[id].classList.toggle('clicked');}, 500);
    }
    else {
        imena[id].classList.toggle('clicked');
    }
}

function ponastavi(event) {
    // alert(event.target)
    toggleText(event)
}

function toggleText(event) {
    
    var id = event.target.id;

    if (opisi[id].classList.contains('activeBesedilo')) {
        opisi[id].classList.toggle('activeBesedilo'); 
        naslov(id, true)
        // setTimeout(function() {opisi[id].classList.toggle('active')}, 500);
        // opisi[id].style.opacity = "0";
    }
    else {            
        naslov(id, false);          
        setTimeout(function(){opisi[id].classList.toggle('activeBesedilo');}, 500); 
        // opisi[id].classList.toggle('active');                                  
        // opisi[id].style.opacity = "1";
        // setTimeout(function() {opisi[id].classList.toggle('active')}, 500);
    }
}