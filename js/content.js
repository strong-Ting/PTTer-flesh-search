

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
			let hide = document.getElementsByClassName('gsc-webResult gsc-result');
			for(let i=0;i<hide.length;i++){
				//hide[i].style.display = 'none';
			}
			let keywords = document.getElementById('gs_tti50').lastChild.value;
			try{
				let result =mutation.addedNodes[i].querySelector('a.gs-title').href;
				
				let c = new crawl_PTT(result,keywords);
				c.crawl();
			}
			catch(e){
				console.log(e);
				console.log(mutation);
			}
		}
	}
	});
});

/*
document.getElementById('gs_tti50').child.addEventListener('input', function (evt) {
//	    console.log(this.value);
});
*/

class crawl_PTT{
	constructor(href,keywords){
		this.href = href;
		this.post_info ={};
		this.keywords = keywords;
	}

	crawl(){	
		let xhr = new XMLHttpRequest();
		xhr.open('GET',this.href,true);
		xhr.responseType = 'document';

		xhr.onreadystatechange = ()=>{
			if(xhr.readyState === xhr.DONE){
				if(xhr.status === 200){
					//this.analysis(xhr.response);
					//return xhr.response
					console.log(xhr.response);
				}
			}
		}
		xhr.send(null);
	}

	analysis(post){
	
		let post_detail="",
			board="",
			author="",
			tittle="",
			time="",
			content="",
			content_text="",
			push={},
			ip="",
			num="";
		try{
			post_detail = post.getElementsByClassName('article-metaline');
		}catch(e){
			console.log(e);
		}
		
		try{
			board = post.getElementsByClassName('article-metaline-right')[0].getElementsByClassName('article-meta-value')[0].innerText;
		}catch(e){

			console.log(e);
		}

		try{
			author = post_detail[0].getElementsByClassName('article-meta-value')[0].innerText;
		}catch(e){

			console.log(e);
		}

		try{
			tittle = post_detail[1].getElementsByClassName('article-meta-value')[0].innerText;
		}catch(e){

			console.log(e);
		}

		try{
			time = post_detail[2].getElementsByClassName('article-meta-value')[0].innerText;
		}catch(e){

			console.log(e);
		}

		try{
			content = post.getElementById('main-content');
			content_text ="";
			for(let i=0;i<content.childNodes.length;i++){
				if(content.childNodes[i].nodeName == '#text'){
					content_text = content_text+content.childNodes[i].data;
				}
				else if( content.childNodes[i].nodeName == 'A'){
					content_text = content_text + content.childNodes[i].innerHTML;
				}
			}
		}catch(e){
			console.log(e);
		}
		
		try{
			let push_sel = content.getElementsByClassName('push');
			for(let i=0;i<push_sel.length;i++){
				let push_id = push_sel[i].getElementsByClassName('f3 hl push-userid')[0].innerText;
				if(push_id==this.keywords)
				{
					let push_content = push_sel[i].getElementsByClassName('f3 push-content')[0].innerText;
					let push_time = push_sel[i].getElementsByClassName('push-ipdatetime')[0].innerText;
/*
					console.log('///////////////////////////////');
					console.log(push_content+push_time);
					console.log('///////////////////////////////');
*/
					push[i] = {'content':push_content,'time':push_time};
				}
			}
		}catch(e){
			console.log(e);
		}

		try{
			let ip_sel = post.getElementsByClassName('f2');
			let reg = /[0-9]*\.[0-9]*\.[0-9]*\.[0-9]*/;
			for(let i=0;i<ip_sel.length;i++){
				let ip_match = ip_sel[i].innerText.match('※ 發信站:');
				if(ip_match != null){
					let ip_reg = ip_sel[i].innerText.match(reg);
					if(ip_reg!=null)
					{
						ip=ip_reg[0];
					}
				}
			}
		}catch(e){
			console.log(e);
		}

		let custom_search =document.getElementsByClassName('gsc-webResult gsc-result');
		for(let i=0;i<custom_search.length;i++){
			if(custom_search[i].querySelector('a.gs-title').href==this.href){
				num = i;
			}
		}
		
		this.post_info ={
			'num':num,
			'author':author,
			'board':board,
			'tittle':tittle,
			'time':time,
			'href':this.href,
			'content_text':content_text,
			'push':push,
			'ip':ip
		};
		
/*
		console.log('作者：'+author);
		console.log('看板：'+board);
		console.log('標題：'+tittle);
		console.log('時間：'+time);
*/
		console.log(this.post_info);
		return this.post_info
	}
}

