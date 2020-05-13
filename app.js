const beerList = document.querySelector('#beer-list');
const form = document.querySelector('#add-beer-form');

// create element and render beer

function renderBeer(doc) {
    let li = document.createElement('li');
    let name = document.createElement('span');
    let brewery = document.createElement('span');
    let alcohol = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id)
    name.textContent = doc.data().name;
    brewery.textContent = doc.data().brewery;
    alcohol.textContent = doc.data().alcohol;
    cross.textContent = 'x';

    li.appendChild(name);
    li.appendChild(brewery);
    li.appendChild(alcohol);
    li.appendChild(cross);

    beerList.appendChild(li);

    //deleting data 
    
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('beers').doc(id).delete();
    })
}

// getting data

// db.collection('beers').orderBy('name').get().then((snapshot) => {
//    snapshot.docs.forEach(doc => {
//        renderBeer(doc);
//    })
// });        //take time to do, so a promise


// If we want to make queries 
//
// db.collection('beers').where('alcohol','<',4).get().then((snapshot) => { 
//    snapshot.docs.forEach(doc => {
//        renderBeer(doc);
//    })
//  });  

// To update 
//
//  db.collection('beers').doc(idhere).update({
//   name: ' ' 
// })
//
// we can use .set but it will overwrite all the doc and if we forget properties
// they are not there.




//saving data 

form.addEventListener('submit',(e) => {
    e.preventDefault(); //do not refresh the page
    db.collection('beers').add({
        name: form.name.value,
        brewery: form.brewery.value,
        alcohol: form.alcohol.value
    });
    form.name.value = '';
    form.brewery.value = '';
    form.alcohol.value = '';
});


// real-time listener 

db.collection('beers').orderBy('brewery').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        console.log(change.doc.data());
        if(change.type == 'added') {
            renderBeer(change.doc);
        } else if (change.type == 'removed') {
            let li = beerList.querySelector('[data-id=' + change.doc.id + ']');
            beerList.removeChild(li);
        }    
        
    });
});