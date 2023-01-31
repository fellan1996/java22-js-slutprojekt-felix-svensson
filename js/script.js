const textInput = document.getElementById('search-bar');
const numInput = document.getElementById('amount');
const formBtn = document.getElementById('form-btn');
const imgContainerDiv = document.getElementById('img-or-error-container');
let counterForTextErrorSize = 0;

//to show the error even if the page is reloaded
showErrorWrongAmount();

/* HOW THE FILE IS SORTED FROM HERE
1. Eventlisteners
2. Good functions (called if all went well)
3. Error functions
*/

// this eventlistener fixes a small bug
numInput.addEventListener('mousedown', () => {
    numInput.focus();
    setTimeout(showErrorWrongAmount, 500);
});
// helps the user know if the amount he/she entered is ok or not
numInput.addEventListener('keydown', () =>
    setTimeout(showErrorWrongAmount, 500)
);
formBtn.addEventListener('click', event => {
    event.preventDefault();
    //The two rows below prevents double-clicking the formBtn
    formBtn.disabled = 'disabled';
    setTimeout(() => { formBtn.disabled = ''; }, 500);
    
    imgContainerDiv.innerHTML = '';
    //removes an error paragraph if it exists
    document.getElementById('error-search-bar') != null ? document.getElementById('error-search-bar').remove() : '';
    textInput.value === '' ? showErrorTextInputWasNull() : fetchImages();
});





//Good functions below
function fetchImages() {
    const sortSetting = document.getElementById('priority');
    counterForTextErrorSize = 0;
    let numInputValue = numInput.value === '' ? '1' : numInput.value;
    const flickrApiUrl = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=1cdfcddf832c77d10077262bc0c6aec0&text=${textInput.value}&sort=${sortSetting.value}&per_page=${numInputValue}&format=json&nojsoncallback=1`;
    const promiseObj = fetch(flickrApiUrl);
    promiseObj.then(getResponse).then(getData).catch(displayError);
}
function getResponse(response) {
    if (response.status >= 200 && response.status < 300) {
        return response.json();
    } else {
        throw 'fetch failed';
    }
}
function getData(dataObj) {
    const photoArr = dataObj.photos.photo;

    if (photoArr.length === 0) {
        showErrorNoImg()
    } else if (photoArr.length < numInput.value && photoArr.length <= 500) {
        showErrorNotEnoughImages(photoArr.length);
        displayImages(photoArr);
    } else {
        displayImages(photoArr);
    }
}
function displayImages(photoArr) {
    const chosenSize = document.getElementById('img-size').value;

    for (let i = 0; i < photoArr.length; i++) {
        const anchorElement = document.createElement('a');
        const img = document.createElement('img');
        const id = photoArr[i].id
        const server = photoArr[i].server;
        const secret = photoArr[i].secret;
        const photoURL = `https://live.staticflickr.com/${server}/${id}_${secret}_${chosenSize}.jpg`;

        anchorElement.href = photoURL;
        anchorElement.target = '_blank';
        img.src = photoURL;
        
        imgContainerDiv.append(anchorElement);
        anchorElement.append(img);
    }
}





// below are the error-functions
function displayError(errorObj) {
    if (errorObj.message.includes('NetworkError')) {
        imgContainerDiv.prepend('Something went wrong. Make sure you are connected to the internet and please try again later');
    } else {
        imgContainerDiv.prepend('Something went wrong. Please try again later');
    }
    console.log(errorObj.message);
}
function showErrorNoImg() {
    const errorMessage = `Unfortunately there are no images matching the search: ${textInput.value}`;
    imgContainerDiv.innerText = errorMessage;
    textInput.value = '';
}
function showErrorNotEnoughImages(availableImgs) {
    const errorMessage = `Unfortunately there are only ${availableImgs} images matching the search: ${textInput.value}`;
    const notEnoughErrorP = document.createElement('p');
    notEnoughErrorP.innerText = errorMessage;
    imgContainerDiv.append(notEnoughErrorP);
}
function showErrorTextInputWasNull() {
    const errorMessage = 'Please enter text in the search bar below';
    const textErrorP = document.createElement('p');
    textErrorP.innerText = errorMessage;
    textInput.before(textErrorP);
    textErrorP.id = 'error-search-bar';
    textErrorP.style.fontSize = `${0.5 + 0.1 * counterForTextErrorSize}em`;
    textErrorP.style.color = '#970505';
    counterForTextErrorSize++;
}
function showErrorWrongAmount() {
    //prevents duplicates of the same message
    const temporaryP = document.getElementById('error-number');
    temporaryP != null ? temporaryP.remove() : '';

    const NumErrorP = document.createElement('p');
    NumErrorP.id = 'error-number';
    NumErrorP.style.cssText = "font-size: 0.5rem; margin: 0.6em 0.1em 0 0.5em;";
    if (parseInt(numInput.value) > 500) {
        numInput.style.color = 'red';
        numInput.before(NumErrorP);
        NumErrorP.innerText = 'easy there tiger! no need to go above 500';
    } else if (parseInt(numInput.value) < 0) {
        NumErrorP.innerText = 'Ummm... whatcha doin? Pump that number up!';
        numInput.style.color = 'red';
        numInput.before(NumErrorP);
    } else {
        NumErrorP.innerText = '';
        numInput.style.color = 'black';
    }
}