fetch('https://jsonplaceholder.typicode.com/users')
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        appendData(data);
    });

var mainContainer = document.getElementById("staffList");
data = []

for (var i = 0; i < data.length; i++) {
    var div = document.createElement("div");
    div.innerHTML = 'Name: ' + data[i].name;
    mainContainer.appendChild(div);
}

function appendData(data) {
    var mainContainer = document.getElementById("staffList");
    for (var i = 0; i < data.length; i++) {
        var div = document.createElement("div");
        div.innerHTML = `<img src='https://robohash.org/${data[i].id}'>` + 'Name: ' + data[i].name + "<hr>";
        mainContainer.appendChild(div);
    }
}


