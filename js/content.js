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

	let result= document.querySelector('.gsc-results.gsc-webResult').querySelectorAll('.gs-webResult.gs-result');  
	let post_num = post_info.num;

	if(post_info.author && post_info.href && post_info.ip &&post_info.title &&post_info.time){

		let title = result[post_num].querySelector('a.gs-title');
		title.innerText = post_info.title;
		title.href = post_info.href;
		title.target = '_blank'; //open link on new tab

		let details_class = 'gs-bidi-start-align gs-visibleUrl gs-visibleUrl-long';
		let style = `white-space:pre; position: relative;`;
		let style_right = `position: absolute; top:0px; left:250px `;

		let author = document.createElement('div');
		author.className = details_class;
		author.innerText = '作者:'+post_info.author;
		author.style = style;

		let board = document.createElement('div');
		board.className = details_class;
		board.innerText ='看板:'+post_info.board;
		board.style = style_right;
		author.appendChild(board);

		let time = document.createElement('div');
		time.className = details_class;
		time.innerText = '時間:'+post_info.time;
		time.style = style;

		let ip = document.createElement('div');
		ip.className = details_class;
		ip.innerText = 'IP:'+post_info.ip;
		ip.style = style;

		result[post_num].querySelector('.gsc-url-top').appendChild(author);
		result[post_num].querySelector('.gsc-url-top').appendChild(time);
		result[post_num].querySelector('.gsc-url-top').appendChild(ip);
		

//		result[post_num].querySelector('.gs-bidi-start-align.gs-visibleUrl.gs-visibleUrl-long').innerText = "作者："+post_info.author+"    "+"IP："+post_info.ip+"時間:"+post_info.time;
	}

	let content = result[post_num].querySelector('div.gs-snippet');
	if(post_info.is_author==true){

		let details = document.createElement('details');
		let p = document.createElement('p');
		let summary = document .createElement('summary');
		let p_more = document.createElement('p');

		let wrap_content = 	post_info.content_text.match(/.*\n/ig); //get the array that content of wrap
		console.log(wrap_content);

		let i =0;
		let display_rows =6;
		while( i<wrap_content.length){
			if(i<display_rows){
				if(wrap_content[i] == "\n" && !p.innerText){  //dele wrap on article begins
					display_rows++;
				}
				else{
					p.innerText += wrap_content[i];
				}
			}
			else{
				p_more.innerText+=wrap_content[i];
			}
			i++;
		}

		summary.innerText = "更多"

		content.innerText = '';
		content.appendChild(p);

		details.appendChild(p_more);
		details.appendChild(summary);

		if(p_more.innerText){
			content.appendChild(details);
		}

		
		console.log(post_info.content_text.length);
	}
	else if(post_info.push.length>0){
		content.innerText = "";
		for(let i=0;i<post_info.push.length;i++){
			content.innerText += (post_info.push[i].push_tag+post_info.keywords+post_info.push[i].content+post_info.push[i].time);
		}
	}
	else{
		content.innerText = "無符合搜尋ID的發言";
	}
	
}

const display_error= (error)=>{
	
	let href = error.responseURL;
	
	let result= document.querySelector('.gsc-results.gsc-webResult').querySelectorAll('.gs-webResult.gs-result');  


	for(let i=0;i<result.length;i++){

		let title =result[i].querySelector('a.gs-title');

		if(href == title.href){

			title.target = '_blank'; //open link on new tab
			let wraning = document.createElement('wraning');
			wraning.innerText = "錯誤訊息："+error.status;
			wraning.style = 
				` background-color: #f44336;
				color: white;` ;
			result[i].querySelector('.gsc-url-top').appendChild(wraning);
		}	
	}
	
}

dom_listenser ('body',(mutations)=>{
    mutations.forEach(async(mutation)=>{
		for(let i=0;i<mutation.addedNodes.length;i++){
			if(mutation.addedNodes[i].className=='gsc-webResult gsc-result'){
				//hide_result();
				let keywords,
					href;
				try{
					keywords = document.getElementById('gs_tti50').lastChild.value;
					href = mutation.addedNodes[i].querySelector('a.gs-title').href;
					
				}
				catch(e){
					console.log(e);
				}

				try{
					let PTT = new crawl_PTT(href,keywords);
					let post = await PTT.crawl();
					let post_info = PTT.analysis(post);
					console.log(post_info);
					display(post_info);
				}
				catch(e){
					console.log(e);
					display_error(e);
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
		if(!href.includes('https')){
			href = href.replace('http','https') ;
		}
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
			title="",
			time="",
			content="",
			content_text="",
			push=[],
			ip="",
			num="";

		let custom_search = document.querySelector('.gsc-results.gsc-webResult').querySelectorAll('.gsc-thumbnail-inside');    
		for(let i=0;i<custom_search.length;i++){
			if(custom_search[i].querySelector('a.gs-title').href==this.href){
				num = i;
			}
		}

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
			title = post_detail[1].getElementsByClassName('article-meta-value')[0].innerText;
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
				if(push_id.replace(/\s+/g,"") ==this.keywords)
				{
					let push_content = push_sel[i].getElementsByClassName('f3 push-content')[0].innerText;
					let push_time = push_sel[i].getElementsByClassName('push-ipdatetime')[0].innerText;
					let push_tag = push_sel[i].getElementsByClassName('push-tag')[0].innerText;
					/*
					console.log('///////////////////////////////');
					console.log(push_content+push_time);
					console.log('///////////////////////////////');
*/
					push.push({'push_num':i,'push_tag':push_tag,'content':push_content,'time':push_time});
				}
			}
		}catch(e){
			console.log(num +':'+ e);
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


		
		this.post_info ={
			'num':num,
			'author':author,
			'is_author':is_author,
			'board':board,
			'title':title,
			'time':time,
			'href':this.href,
			'content_text':content_text,
			'push':push,
			'ip':ip,
			'keywords':this.keywords
		};
		
/*
		console.log('作者：'+author);
		console.log('看板：'+board);
		console.log('標題：'+title);
		console.log('時間：'+time);
*/
//		console.log(this.post_info);
		return this.post_info
	}
}

