
const search = (ID)=>{
	try{
		document.getElementById('gs_tti50').lastChild.value =  ID;
		document.getElementsByClassName('gsc-search-button gsc-search-button-v2')[0].click();
	}
	catch(e){
		console.log(ID);
	//	alert(ID);
		setTimeout("search('"+ID+"');",50);
	}
}


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {  
	console.log(message);	
	try{
		search(message.ID);
		sendResponse('search');  
	}
	catch(e){
		alert('oops have someting wrong');
		console.log(e);
	}
});
