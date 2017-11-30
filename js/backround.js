chrome.commands.onCommand.addListener(function(command)
{
    if (command == 'reload_extension') {
        chrome.runtime.reload();   
    }
    if (command == 'query') {
    }
});

const cookie_check = ()=>{

	const cookie_get = ()=>{
		chrome.cookies.get({
			'url':'https://www.ptt.cc','name':'over18'
		},(Cookie)=>{ 
			(Cookie == null || Cookie.value == 0)?cookie_set():console.log('cookie have');
			});
	}

	const cookie_set = ()=>{
		 chrome.cookies.set({
    	"name": "over18",
    	"url": "https://www.ptt.cc",
    	"value": "1"
    	},()=>{console.log('cookie add')});
	}

	cookie_get();
}

cookie_check();

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {  
	console.log(message);		      
	sendResponse('background');  
});

/*
const send_ID = (ID) ={
	chrome.tabs.query({url:"https://strong-ting.github.io/PTTer-flesh-search/"}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {id: ID}, function(response) {
		console.log(response);
		});
	});
}

*/



