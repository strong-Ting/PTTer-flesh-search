

const main = (data)=>{
    for(var i=0;i<data.length;i++){
        console.log(data[i].querySelector('a.gs-title').href);
    }
}

//because not load page in one time,some data can't get.the function to wait the data load
const query_load = (sel) =>{
    const query =()=>{
        let data = document.querySelectorAll(sel);
        if(data.length!=0){
 //           clearInterval(num);
            main(data);
        }
    }
    query();
}
//let num = setInterval("query_load('.gsc-webResult.gsc-result')",100);


const dom_listenser=(idName,mutationHandler)=>{
        let target = document.querySelector(idName);
        let config = { attributes: true, childList: true, characterData: true,subtree:true};
        let observer = new MutationObserver(mutationHandler);
        observer.observe(target, config);
};


dom_listenser ('body',(mutations)=>{
    mutations.forEach((mutation)=>{
	for(let i=0;i<mutation.addedNodes.length;i++){
		if(mutation.addedNodes[i].className=='gsc-webResult gsc-result'){
			let result =mutation.addedNodes[i].querySelector('a.gs-title').href;
			console.log(result);
			let con = new crawl_PTT(result);
			con.crawl();
		}
	}
	});
});

class crawl_PTT{
	constructor(href){
		this.href = href;
		this.post_info ={};
	}

	crawl(){
		let xhr = new XMLHttpRequest();
		xhr.open('GET',this.href,true);
		xhr.responseType = 'document';

		xhr.onload = ()=>{
			if(xhr.readyState === xhr.DONE){
				if(xhr.status === 200){
					this.analysis(xhr.response);
				}
			}
		}
		xhr.send(null);
	}

	analysis(post){

		let post_detail = post.getElementsByClassName('article-metaline');

		let board = post.getElementsByClassName('article-metaline-right')[0].getElementsByClassName('article-meta-value')[0].innerText;

		let author = post_detail[0].getElementsByClassName('article-meta-value')[0].innerText;

		let tittle = post_detail[1].getElementsByClassName('article-meta-value')[0].innerText;
		let time = post_detail[2].getElementsByClassName('article-meta-value')[0].innerText;

		let content = post.getElementById('main-content');
		
		for(var i=0;i<content.childNodes.length;i++){
/*
			if(content.childNodes[i].nodeName == 'DIV' || content.childNodes[i].nodeName=='span'){
				content.removeChild(content.childNodes[i]);	
			}*/
			if(content.childNodes[i].nodeName == '#text'){
				console.log(content.childNodes[i].data);
			}
			else if( content.childNodes[i].nodeName == 'A'){
				console.log(content.childNodes[i].innerHTML);
			}
		}
/*
		let content_span = content.getElementsByTagName('span');
		
		let content_div = content.getElementsByTagName('div');

		for(let i=0;i<content_span.length;i++){
			content_span[i].parentNode.removeChild(content_span[i]);
		}

		for(let i=0;i<content_div.length;i++){
			content_div[i].parentNode.removeChild(content_div[i]);
		}
*/

		let push = content.getElementsByClassName('push');
		this.post_info ={'author':author,'board':board,'tittle':tittle,'time':time,'href':this.href};
		
//		console.log(content.innerText);

		console.log('作者：'+author);
		console.log('看板：'+board);
		console.log('標題：'+tittle);
		console.log('時間：'+time);
		console.log(this.post_info);

	}
}

