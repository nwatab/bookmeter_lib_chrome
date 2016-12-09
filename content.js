function showTable(response){
  //This is a sample
  var response = { // this is a sample
  	libkey: {
		"Setagaya": "Available",
		"Tamagawadai": "Unavailable"
	}
  };
  var table_wrapper = document.createElement("div");
  var table = document.createElement("table");
  table_wrapper.setAttribute("class", "bm-details-side--add-border-bottom");
  table.setAttribute("class", "book-availability-table");
  table_wrapper.appendChild(table);
  
  for(var lib in response.libkey){
	  var tr = document.createElement("tr");
	  var th = document.createElement("th");
	  th.setAttribute("id", response.libkey[lib] + "_label");
	  th.innerHTML = lib;
	  var td = document.createElement("td");
	  td.setAttribute("headers", response.libkey[lib] + "_label");
	  td.innerHTML = response.libkey[lib];
	  tr.appendChild(th);
	  tr.appendChild(td);
	  table.appendChild(tr);
  }
  var amazon = document.getElementsByClassName("detail__amazon")[0];
  amazon.parentNode.insertBefore(table_wrapper, amazon);
}

function sendLinksToBackground(isbn) {
  console.log("sending message from content to background");
  chrome.runtime.sendMessage({
      greeting: "I am content",
      isbn: isbn
    }, showTable);
}

//window.onload = function() {
  console.log("content script loaded window", document.location.toString());
//  var inn = document.getElementById("main_right").getElementsByClassName("inner")[1].children[1]; for older ui
  var action__items = document.getElementsByClassName('action__items')[0];
  var t = document.createTextNode("Ohayooo");
  var isbn = document.location.href.split('/')[4];
  //action__items.appendChild(t);


  console.log(isbn);
  sendLinksToBackground(isbn);
//};
