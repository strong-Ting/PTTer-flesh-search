//add css
(()=>{
	let add_style = document.createElement('style');
	add_style.type = 'text/css';
	add_style.innerHTML =`
.push {
    color: #ff0;
	background-color: transparent;
}
`
	document.head.appendChild(add_style);
})();


const dom_listenser=(idName,mutationHandler)=>{
	let target = document.querySelector(idName);
    let config = { attributes: true, childList: true, characterData: true,subtree:true};
    let observer = new MutationObserver(mutationHandler);
    observer.observe(target, config);
};


dom_listenser('body',(mutations)=>{
	mutations.forEach((mutation)=>{
		let target =mutation.target;
		let added = mutation.addedNodes;
		if(target.tagName == 'SPAN'){
			try{
				for(let i=0;i<added.length;i++){
					let push = added[i].querySelector('.q11.b0');
					if(push){
						let ID = push.innerText;
						let reg = /^[a-zA-Z]{1}[A-Za-z0-9]{2,12}/;   	
						if(ID.match(reg)){
							push.className = "push";
							push.setAttribute('role','button');
							push.onclick = ()=>{search(ID);};
						}
						else{
							console.log(ID);
						}
					}
				}
			}
			catch(e){
				console.log(added);
			}
		}
	});
});

const search =(ID)=>{


	chrome.runtime.sendMessage({ID:ID}, 
		(response)=> {  
  			console.log(response);  
	});

}
