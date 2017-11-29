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
						push.className = "push";
						push.setAttribute('role','button');
						push.onclick = ()=>{window.open('https://www.google.com');}
					}
				}
			}
			catch(e){
				console.log(added);
			}
		}
	});
});
