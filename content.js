console.log('I am content', document.location.toString());
var isbn = document.getElementsByClassName('detail__amazon')[0].getElementsByTagName('a')[0].href.split('/')[5];
console.log(isbn);
sendBackgroundIsbn(isbn);

var city_selector = new CalilCitySelectDlg({
	'appkey' : '02e69dccae66fb1e1c4c0b5364bbfedc',
	'select_func' : on_select_city
});

function on_select_city(systemid_list, pref_name){
	console.log(systemid_list, pref_name); //FireBugで表示
    chrome.runtime.sendMessage(
        {greeting: "I am popup",
         systemid_list: systemid_list,
         pref_name: pref_name},
        function(response) {
            console.log(response.farewell);
        }
    );
}

function showTable(response){
  //This is a sample
  if (response == null) {
    response = { // this is a sample
        "Setagaya": "Available",
        "Tamagawadai": "Unavailable"
    };
  }
  var table_wrapper = document.createElement("div");
  var table = document.createElement("table");
  table_wrapper.setAttribute("class", "bm-details-side--add-border-bottom");
  table.setAttribute("class", "book-availability-table");
  table_wrapper.appendChild(table);
  
  for(var lib in response){
	  var tr = document.createElement("tr");
	  var th = document.createElement("th");
	  th.setAttribute("id", response[lib] + "_label");
	  th.innerHTML = lib;
	  var td = document.createElement("td");
	  td.setAttribute("headers", response[lib] + "_label");
	  td.innerHTML = response[lib];
	  tr.appendChild(th);
	  tr.appendChild(td);
	  table.appendChild(tr);
  }
  var amazon = document.getElementsByClassName("detail__amazon")[0];
  amazon.parentNode.insertBefore(table_wrapper, amazon);
}

function sendBackgroundIsbn(isbn) {
  console.log("sending message from content to background");
  chrome.runtime.sendMessage({
      greeting: "I am content",
      isbn: isbn
    }, function(response){
	    if(response.farewell === "goodbye") {
//		  showTable(response);
          console.log("background received isbn");
	    }else if(response.farewell === "error") {
		  console.log("can not get library information");
	    }else if(response.farewell === "initialize"){
          console.log("initialize");
          city_selector.showDlg();
	    }
    });
}

// recieve from background
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    if (request.greeting == "receiveBooks"){
      var libs_to_show ={};
      var json = request.json;
      for (isbn in json.books) { // just one isbn is contained
        for (area in json.books[isbn]) {
          var libs = json.books[isbn][area].libkey;
          for (lib in libs) {
            if (lib) {
              var availability = libs[lib];
              libs_to_show[area+lib] = availability;
            }
          }
        }
      }
      console.log(libs_to_show);
      showTable(libs_to_show);
      sendResponse({farewell: "goodbye"}); 
    } else if (request.greeting == "receiveLibrary") {
      var json = request.json;
    }
  });