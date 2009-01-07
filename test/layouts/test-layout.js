function setActiveStyleSheet(title) {
   var i, a, main;
   for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
     if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) {
       a.disabled = true;
       if(a.getAttribute("title") == title) a.disabled = false;
     }
   }
}
function listAlternateStyleSheets() {
   for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
     if(a.getAttribute("rel").indexOf("alt") != -1 && a.getAttribute("title")) {		       
	   document.write(" <a href='#' onclick='setActiveStyleSheet(this.title)' title='"+a.getAttribute("title")+"'>"+a.getAttribute("title")+"</a> |");		       
     }
   }
}
function listTestPages() {
	
	var pages = new Array(	'test-label-alignment.html',
							'test-label-alignment-rtl.html',
							'test-field-hints.html',
							'test-inline-layout.html',
							'test-repeat-layout.html',
							'test-grid-layout.html',
							'test-page-layout.html',
							'test-validation-layout.html'
						  );
	
	for(i=0; i<pages.length; i++) {
		document.write(" <a href='"+pages[i]+"'>"+pages[i].match(/^test-([^\.]*).html$/)[1]+"</a> |");		       		     
	}
	
}