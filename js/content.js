
/*
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
*/

const dom_listenser=(idName,mutationHandler)=>{
        let target = document.querySelector(idName);
        let config = { attributes: true, childList: true, characterData: true,subtree:true};
        let observer = new MutationObserver(mutationHandler);
        observer.observe(target, config);
};

const hide_result = ()=>{
	let hide = document.getElementsByClassName('gsc-webResult gsc-result');
	for(let i=0;i<hide.length;i++){
		hide[i].style.display = 'none';
	}
}

const display = (post_info)=>{
	let result= document.getElementsByClassName('gsc-webResult gsc-result');
	let post_num = post_info.num;

	result[post_num].querySelector('a.gs-title').innerText = post_info.tittle;
	result[post_num].querySelector('a.gs-title').href = post_info.href;
	result[post_num].querySelector('.gs-bidi-start-align.gs-visibleUrl.gs-visibleUrl-long').innerText = "作者："+post_info.author+"    "+"IP："+post_info.ip+"時間:"+post_info.time;
	if(post_info.is_author==true){
		result[post_num].querySelector('div.gs-snippet').innerText = post_info.content_text;
	}
	else if(post_info.push.length>0){
		result[post_num].querySelector('div.gs-snippet').innerText = "";
		for(let i=0;i<post_info.push.length;i++){
			result[post_num].querySelector('div.gs-snippet').innerText += (post_info.push[i].content+post_info.push[i].time);
			console.log(result[post_num].querySelector('div.gs-snippet').innerText);
		}
	}
	
	for(let x in post_info.push){
		console.log(x);
	}
}

dom_listenser ('body',(mutations)=>{
    mutations.forEach(async(mutation)=>{
	for(let i=0;i<mutation.addedNodes.length;i++){
		if(mutation.addedNodes[i].className=='gsc-webResult gsc-result'){
			//hide_result();
			let keywords = document.getElementById('gs_tti50').lastChild.value;
			try{
				let result =mutation.addedNodes[i].querySelector('a.gs-title').href;
				
				let PTT = new crawl_PTT(result,keywords);
				let post = await PTT.crawl();
				let post_info = PTT.analysis(post);
				console.log(post_info);
				display(post_info);
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

	async crawl(){	

		let href = this.href;
		let xhr = function() {
			return new Promise((resolve, reject) => {
				let xhr = new XMLHttpRequest();
				xhr.responseType = 'document';
		    	xhr.onreadystatechange = function() {
					if (xhr.readyState === 4) {
						if (xhr.status >= 200 && xhr.status < 300) {
							let response;
							try {
								response = xhr.response;
							} 
							catch (e) {
								reject(e);
							}
							if (response) {
								resolve(response, xhr.status, xhr);
							}
						} 
						else {
							reject(xhr);
						}
					}
				};
				xhr.open('GET', href, true);
		    	xhr.send(null);
			});
		};
		let post = await xhr();
		return post;
	}

	analysis(post){
	
		let post_detail="",
			board="",
			author="",
			is_author,
			tittle="",
			time="",
			content="",
			content_text="",
			push=[],
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
			author = author.split("(")[0].trim();
			if(author == this.keywords){
				is_author = true;
			}
			else{
				is_author = false;
			}
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
					push.push({'push_num':i,'content':push_content,'time':push_time});
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
			'is_author':is_author,
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
//		console.log(this.post_info);
		return this.post_info
	}
}

