var TableIDvalue = "my_table";
var TableLastSortedColumn = -1;

//Below function adds checkbox in header row and data rows repec.
//If you comment these two call please change SortTable parameters in Index.html
addCheckBoxToHeader();
addCheckbox();

function getRows(node) {
    var table = document.getElementById(TableIDvalue);
    var tbody = table.getElementsByTagName(node)[0];
    var rows = tbody.getElementsByTagName("tr");
    return rows;
}

function SortTable(colIndex, type) {

    var sortColumn = parseInt(colIndex);
    var type = type;
    var rows = getRows("tbody")
    var arrayOfRows = new Array();

    for (var i = 0, len = rows.length; i < len; i++) {
        arrayOfRows[i] = new Object;
        arrayOfRows[i].oldIndex = i;
        var celltext = rows[i].getElementsByTagName("td")[sortColumn].innerHTML.replace(/<[^>]*>/g, "");
        var re = type == "N" ? /[^\.\-\+\d]/g : /[^a-zA-Z0-9]/g;
        arrayOfRows[i].value = celltext.replace(re, "").substr(0, 25).toLowerCase();
    }
    if (sortColumn == TableLastSortedColumn) {
        arrayOfRows.reverse();
    }
    else {
        TableLastSortedColumn = sortColumn;
        switch (type) {
            case "N" :
                arrayOfRows.sort(CompareRowOfNumbers);
                break;
            default  :
                arrayOfRows.sort(CompareRowOfText);
        }
    }
    var newTableBody = document.createElement("tbody");
    for (var i = 0, len = arrayOfRows.length; i < len; i++) {
        newTableBody.appendChild(rows[arrayOfRows[i].oldIndex].cloneNode(true));
    }

    var table = document.getElementById(TableIDvalue);
    var tbody = table.getElementsByTagName("tbody")[0];
    table.replaceChild(newTableBody, tbody);
} // function SortTable()

function CompareRowOfText(a, b) {
    var aval = a.value;
    var bval = b.value;
    return(aval === bval ? 0 : (aval > bval ? 1 : -1));
} // function CompareRowOfText()

function CompareRowOfNumbers(a, b) {
    var aval = /\d/.test(a.value) ? parseFloat(a.value) : 0;
    var bval = /\d/.test(b.value) ? parseFloat(b.value) : 0;
    return(aval === bval ? 0 : (aval > bval ? 1 : -1));
} // function CompareRowOfNumbers()

function addCheckBoxToHeader() {
    var rows = getRows("thead");
    var chkbox = rows[0].insertCell(0);
    chkbox.innerHTML = "<input type='checkbox' name='country' value='all' onclick='toggleChecked(this)'>";
} // function addCheckBoxToHeader

function addCheckbox() {
    var rows = getRows("tbody");
    for (var i = 0, len = rows.length; i < len; i++) {
        var chkbox = rows[i].insertCell(0);
        chkbox.innerHTML = "<input type='checkbox' name='country' value='" + i + "' onclick='logSelectedData(this)'>";
    }
} // function addCheckbox

function toggleChecked(node) {
    var rows = getRows("tbody");
    for (var i = 0, len = rows.length; i < len; i++) {
        rows[i].children[0].children[0].checked = node.checked;
    }
} // function logAllData

function logSelectedData(node) {
    if (node.checked === true) {
        console.log(node.parentElement.parentElement.children[1].innerText + " selected.");

//        var jsonString = "{";
//        var childCount = node.parentElement.parentElement.childElementCount;
//        for (var i = 1; i < childCount; i++) {
//            var key = i === 1 ? "'country'" : (i === 2) ? "'area'" : "'population'";
//            jsonString += key + ":'" + node.parentElement.parentElement.children[i].innerText + "'";
//            if (i < 3)
//                jsonString += ",";
//        }
//        jsonString += "}";
//        console.log(jsonString);
    }
} // function logSelectedData

function logData() {
    var rows = getRows("tbody");
    var jsonString = "{ \"data\" : ";
    for (var i = 0, len = rows.length; i < len; i++) {
        if (rows[i].children[0].children[0].checked == true) {
            jsonString += "{";
            for (var j = 1; j < 4; j++) {
                var key = j === 1 ? "\"country\"" : (j === 2) ? "\"area\"" : "\"population\"";
                jsonString += key + ":\"" + rows[i].children[j].innerText + "\"";
                if (j < 3)
                    jsonString += ",";
            }
            jsonString += "},";
        }
    }
    jsonString = jsonString.slice(0, -1);
    jsonString += " }";
    console.log(jsonString);
}// function logData