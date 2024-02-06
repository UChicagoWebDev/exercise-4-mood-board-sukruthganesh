const bing_api_endpoint = "https://api.bing.microsoft.com/v7.0/images/search";
const bing_api_key = BING_API_KEY

function reqListener(request) {
  if(request.status >= 200 && request.status < 300) {
    let searchpreview = document.getElementById("resultsImageContainer");
    let suggestions = document.getElementsByClassName("suggestions")[0];
    json_obj = request.response;
    for(let i=0; i<json_obj.value.length; i++){   
      const newDiv = document.createElement("div", { class: "resultImage" });
      img = new Image();
      img.src = json_obj.value[i].contentUrl
      newDiv.appendChild(img)
      newDiv.addEventListener("click", () => addImgtoBoard(json_obj.value[i].contentUrl));
      searchpreview.appendChild(newDiv)
    }
    const h3 = document.createElement("h3");
    const ul = document.createElement("ul");
    h3.appendChild(document.createTextNode('Suggested Searches'));
    suggestions.appendChild(h3);
    suggestions.appendChild(ul);
    for(let i=0; i<json_obj.relatedSearches.length; i++){   
      let li = document.createElement("li");
      li.appendChild(document.createTextNode(json_obj.relatedSearches[i].displayText));
      li.addEventListener("click", (event) => {document.querySelector(".search input").value = event.target.innerText; runSearch()});
      ul.appendChild(li)
    }
  }
}

function addImgtoBoard(url) {
  console.log(url);
  let board = document.getElementById("board");
  const newDiv = document.createElement("div", { class: "savedImage" });
  img = new Image();
  img.src = url;
  newDiv.appendChild(img);
  board.appendChild(newDiv);
}

function runSearch() {

  // TODO: Clear the results pane before you run a new search
  document.getElementById("resultsImageContainer").innerHTML = "";
  document.getElementsByClassName("suggestions")[0].innerHTML = "";
  searchKey = document.querySelector(".search input").value;

  openResultsPane();

  // TODO: Build your query by combining the bing_api_endpoint and a query attribute
  //  named 'q' that takes the value from the search bar input field.

  if(!searchKey) {
    return false;
  }

  let request = new XMLHttpRequest();
  request.addEventListener("load", reqListener);
  request.open("GET", bing_api_endpoint + "?q=" + searchKey);
  request.responseType = 'json';
  request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);
  request.addEventListener("load", () => reqListener(request))
  request.send();

  // TODO: Construct the request object and add appropriate event listeners to
  // handle responses. See:
  // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_XMLHttpRequest
  //
  //   - You'll want to specify that you want json as your response type
  //   - Look for your data in event.target.response
  //   - When adding headers, also include the commented out line below. See the API docs at:
  // https://docs.microsoft.com/en-us/bing/search-apis/bing-image-search/reference/headers
  //   - When you get your responses, add elements to the DOM in #resultsImageContainer to
  //     display them to the user
  //   - HINT: You'll need to ad even listeners to them after you add them to the DOM
  //
  // request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);

  // TODO: Send the request

  return false;  // Keep this; it keeps the browser from sending the event
                  // further up the DOM chain. Here, we don't want to trigger
                  // the default form submission behavior.
}

function openResultsPane() {
  // This will make the results pane visible.
  document.querySelector("#resultsExpander").classList.add("open");
}

function closeResultsPane() {
  // This will make the results pane hidden again.
  document.querySelector("#resultsExpander").classList.remove("open");
}

// This will 
document.querySelector("#runSearchButton").addEventListener("click", runSearch);
document.querySelector(".search input").addEventListener("keypress", (e) => {
  if (e.key == "Enter") {runSearch()}
});

document.querySelector("#closeResultsButton").addEventListener("click", closeResultsPane);
document.querySelector("body").addEventListener("keydown", (e) => {
  if(e.key == "Escape") {closeResultsPane()}
});
