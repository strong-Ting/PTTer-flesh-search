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

chrome.runtime.onMessage.addListener((message, sender, sendResponse)=> {  
	console.log(message);		      
//	send_ID(message.ID);
	open_window(message.ID);
		sendResponse('background');  
});

const open_window =(ID)=>{
	chrome.tabs.create({url:"https://strong-ting.github.io/PTTer-flesh-search/"},
		(tabs)=>{
			console.log(tabs);
	//		send_ID(tabs.id,ID);
			chrome.tabs.executeScript(tabs.id,{runAt:"document_idle",file:'js/search.js'},(result)=>{
				console.log(result);
				send_ID(tabs.id,ID);
		});
	}); 	

}

const send_ID = (tab_id,ID) =>{
	let url = "https://strong-ting.github.io/PTTer-flesh-search/";
	chrome.tabs.sendMessage(tab_id,{ID:ID},(response)=>{
		console.log(response);
	});
}



