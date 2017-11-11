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
////////////////////////////////////////////////////////////////////
 function run()
    {
//        var link_arry = google_crawler();
//        link ='https://www.ptt.cc/bbs/Gossiping/M.1501340303.A.781.html';
//        data = PTT_content(link);
         chrome.tabs.create({url: "http://140.125.207.210:5000",
                             active: true,
                             index: 0   });
         //   focus();


    }




 function PTT_content(link)
    {   

    chrome.cookies.set({
    "name": "over18",
    "url": "https://www.ptt.cc",
    "value": "1"
    }
    )

//        link = link.replace('https://www.ptt.cc/','');
        url_link = 'https://www.ptt.cc/ask/over18';
        var xhr = new XMLHttpRequest();
        xhr.open( "GET", link, true); // false for synchronous request

        xhr.responseType = 'text';

 //       xhr.setRequestHeader("Cookie", "over18=1");

 //       xhr.withCredentials = true;
        xhr.onload = function () 
        {
            if (xhr.readyState === xhr.DONE) 
            {
                if (xhr.status === 200) 
                {
                    console.log(xhr.responseText);
                }
            }
        };

        xhr.send(null);

    }

    function google_crawler()
    {
    
        var queryID ='heaviest';
        var page = 0;
        var Num =10;
        var  query_url = "https://www.googleapis.com/customsearch/v1element?";
        var  language = "&hl=zh_TW";
        var  Print = "&prettyPrint=true";
        var  start ="&start="
        var  q ="&q="+queryID;
        var  sort = "&sort=date";
        var  results_num = "&num="+Num;

        var  key = "key=AIzaSyCVAXiUzRYsML1Pv6RwSG1gunmMikTzQqY";
        var  rsz ="&rsz=filtered_cse";
        var  source = "&source=gcsc&gss=.com";
        var  sig = "&sig=01d3e4019d02927b30f1da06094837dc";
        var  cx="&cx=013003672663057511130:ewkefht62rk";
        var  cse_tok = "&cse_tok=ahl74mxjun1-rdpgntn7igqyvwtn:1502359101089";


//        equestl = query_url+ key+results_num+language+Print+source+sig+start+page+cx+q+cse_tok+sort;

        theUrl = 'https://www.googleapis.com/customsearch/v1element?key=AIzaSyCVAXiUzRYsML1Pv6RwSG1gunmMikTzQqY&rsz=filtered_cse&num=10&hl=zh_TW&prettyPrint=false&source=gcsc&gss=.com&sig=01d3e4019d02927b30f1da06094837dc&cx=013003672663057511130:ewkefht62rk&q=heaviest&cse_tok=AHL74MyBbtaTdCWXWv4WwHeCLS9W:1504507386337&sort=date'

        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
        xmlHttp.send( null );
        console.log(xmlHttp.responseText);
        
        var data = JSON.parse(xmlHttp.responseText);
        var link_arry = [];
        
        try{       
           for(var i=0;i<data['results'].length;i++)
            {
            var link = data['results'][i]['unescapedUrl']
            link_arry.push(link);
            }
        
            return link_arry;
            }
            catch (e)
            {
                alert('系統繁忙中');
            }
        
    }


