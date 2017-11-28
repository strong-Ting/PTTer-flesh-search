

const dom_listenser=(idName,mutationHandler)=>{
        let target = document.querySelector(idName);
        let config = { attributes: true, childList: true, characterData: true,subtree:true};
        let observer = new MutationObserver(mutationHandler);
        observer.observe(target, config);
};

dom_listenser('body',(mutations)=>{
	mutations.forEach((mutation)=>{
		if(mutation.target.tagName == 'SPAN'){
			console.log(mutation.addedNodes.length);
			for(let i=0;i<mutation.addedNodes.length;i++){
				console.log(mutation.addedNodes[i].querySelector('.q11.b0'));
			}
		}
	});
});
