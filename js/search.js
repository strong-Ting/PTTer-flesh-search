
const search = (ID)=>{
	document.getElementById('gs_tti50').lastChild.value =  ID;
	document.getElementsByClassName('gsc-search-button gsc-search-button-v2')[0].click();
}


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {  
	console.log(message);	
	search(message.ID);
	sendResponse('search');  
});
