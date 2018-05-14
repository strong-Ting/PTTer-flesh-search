console.log("m work");

const dom_listenser=(idName,mutationHandler)=>{
	let target = document.querySelector(idName);
    let config = { attributes: true, childList: true, characterData: true,subtree:true};
    let observer = new MutationObserver(mutationHandler);
    observer.observe(target, config);
};


let clickFlag = 0;

dom_listenser ('body',(mutations)=>{
    mutations.forEach(async(mutation)=>{
		let target = mutation.target;
		let added = mutation.addedNodes;
		if(target.id.includes("hdtb-tls") && clickFlag<1){
			document.querySelector("#"+target.id).click();
			clickFlag++;
			document.querySelectorAll("div.mn-hd-txt")[1].click();
			document.querySelectorAll("li#qdr_y")[0].lastChild.click();
		}


	});
});


