/*
//Date
*/
var options_box_date = document.getElementById("options_box_date");

var today_date = new Date().getDate();
var year = new Date().getFullYear();
//get month mulai dari 0 sampe 11, 0 = January, 11 = December
var month = new Date().getMonth();
var lastDay = new Date(year, month + 1, 0).getDate();
var nextMonthFirstDay = new Date(year, month + 2, 1).getDate();
var nextMonthLastDay = new Date(year, month + 2, 0).getDate();

for (today_date; today_date <= lastDay; today_date++) {
    var date = new Date(year, month, today_date);
    date.setDate(date.getDate());
    date = String(date);
    var words = date.split(' ');
    var words_date = words.slice(0, 3);
    var date_modified = words_date.join(' ');

    let div = document.createElement('div');
    let input = document.createElement('input');
    let label = document.createElement('label');
    div.className = "option";
    input.className = "radio";
    input.setAttribute("type", "radio");
    input.setAttribute("name", "date");
    input.value = date_modified;
    label.innerHTML = date_modified;

    div.appendChild(input);
    div.appendChild(label);

    options_box_date.appendChild(div);
}

for (nextMonthFirstDay; nextMonthFirstDay <= nextMonthLastDay; nextMonthFirstDay++) {
    var date = new Date(year, month + 1, nextMonthFirstDay);
    date.setDate(date.getDate());
    date = String(date);
    var words = date.split(' ');
    var words_date = words.slice(0, 3);
    var date_modified = words_date.join(' ');

    let div = document.createElement('div');
    let input = document.createElement('input');
    let label = document.createElement('label');
    div.className = "option";
    input.className = "radio";
    input.setAttribute("type", "radio");
    input.setAttribute("name", "date");
    input.value = date_modified;
    label.innerHTML = date_modified;

    div.appendChild(input);
    div.appendChild(label);

    options_box_date.appendChild(div);
}

/*
//HTML
*/
const selectedAll = document.querySelectorAll(".selected");

const options_box_sport = document.getElementById("options_box_sport");
const optionsListSport = options_box_sport.querySelectorAll(".option");
let selected_word = "";

selectedAll.forEach(selected => {
    const optionsContainer = selected.previousElementSibling;
    const optionsList = optionsContainer.querySelectorAll(".option");
    const select_box1 = document.getElementById("select-box1");
    const select_box2 = document.getElementById("select-box2");
    const selected_time = document.getElementById("selected_time");
    const selected_date = document.getElementById("selected_date");
    const option_date = document.getElementById("option_date");
    selected_date.innerHTML = option_date.querySelector("label").innerHTML;

    selected.addEventListener("click", () => {
        if (optionsContainer.classList.contains("active")) {
            optionsContainer.classList.remove("active");
        } else {
            let currentActive = document.querySelector(".options-box.active");

            if (currentActive) {
                currentActive.classList.remove("active");
            }

            optionsContainer.classList.add("active");
        }
    });

    select_box1.addEventListener("click", () => {
        if (selected_date.innerHTML === "All Date") {
            select_box2.style.pointerEvents = "none";
            selected_time.innerHTML = "All Time";
            select_box2.style.opacity = "0.7";
        } else {
            select_box2.style.pointerEvents = "unset";
            select_box2.style.opacity = "1";
        }
    })

    select_box2.addEventListener("click", () => {
        if (selected_date.innerHTML === "All Date") {
            select_box2.style.pointerEvents = "none";
            selected_time.innerHTML = "All Time";
            select_box2.style.opacity = "0.7";
        } else {
            select_box2.style.pointerEvents = "unset";
            select_box2.style.opacity = "1";
        }
    })

    optionsList.forEach(o => {
        o.addEventListener("click", () => {
            selected.innerHTML = o.querySelector("label").innerHTML;
            optionsContainer.classList.remove("active");
            // window.alert(selected_word)
            // db.collection('match').where('sport', '==', selected_word).get().then((snapshot) => {
            //     snapshot.docs.forEach(doc => {
            //         renderMatch(doc);
            //     })
            // })
        });
    });
})

/*
//FIREBASE 
*/
const matchList = document.getElementById("display_items");

//Create elements and render Match
function renderMatch(doc) {
    let li = document.createElement('li');
    let div = document.createElement('div');
    let event_name = document.createElement('span');
    let sport = document.createElement('span');
    let time = document.createElement('span');
    let location = document.createElement('span');
    let address = document.createElement('span');

    li.setAttribute("data-id", doc.id);
    event_name.textContent = "Event name: " + doc.data().event_name;
    sport.textContent = "Sport: " + doc.data().sport;
    time.textContent = "Time: " + doc.data().time;
    location.textContent = "Location: " + doc.data().location;
    address.textContent = "Address: " + doc.data().address;

    li.appendChild(event_name);
    li.appendChild(sport);
    li.appendChild(time);
    li.appendChild(location);
    li.appendChild(address);

    matchList.appendChild(li);
}

// optionsListSport.forEach(o => {
//     o.addEventListener("click", () => {
//         selected_word = o.querySelector("input").value;
//         var child = matchList.lastElementChild;  
//         while (child) { 
//             matchList.removeChild(child); 
//             child = matchList.lastElementChild; 
//         } 
//         db.collection('match').where('sport', '==', selected_word).get().then((snapshot) => {
//             snapshot.docs.forEach(doc => {
//                 renderMatch(doc);
//             })
//         })
//     });
// });


/*
//Real Time Data
*/

// db.collection('match').orderBy('time').onSnapshot(snapshot => {
//     let changes = snapshot.docChanges();
//     changes.forEach(change => {
//         if(change.type == "added"){
//             renderMatch(change.doc);
//         } else if (change.type == "removed"){
//             let li = matchList.querySelector('[data-id=' + change.doc.id + ']');
//             matchList.removeChild(li);
//         }
//     })
// })
// let list_time = ["15:00"]

optionsListSport.forEach(o => {
    o.addEventListener("click", () => {
        selected_word = o.querySelector("input").value;
        var child = matchList.lastElementChild;
        while (child) {
            matchList.removeChild(child);
            child = matchList.lastElementChild;
        }
        db.collection('match').where('sport', '==', selected_word).onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if (change.type == "added") {
                    renderMatch(change.doc);
                } else if (change.type == "removed") {
                    let li = matchList.querySelector('[data-id=' + change.doc.id + ']');
                    matchList.removeChild(li);
                }
            })
        })
    });
});