export interface BookmarkletOptions {
  apiEndpoint: string;
  tokenKey?: string;
}

export interface ClaimBookmarkletOptions {
  apiEndpoint: string;
  enableOnSelect?: boolean;
}

// Base class for all bookmarklets
abstract class BaseBookmarklet {
  protected apiEndpoint: string;
  
  constructor(apiEndpoint: string) {
    this.apiEndpoint = apiEndpoint;
  }
  
  abstract getBookmarkletCode(minified?: boolean): string;
  
  getBookmarkletURI(): string {
    return `javascript:${this.getBookmarkletCode(true)}`;
  }
  
  protected minify(code: string): string {
    return code
      .replace(/\/\/.*$/gm, '') // Remove single-line comments
      .replace(/\/\*[\s\S]*?\*\/|/g, '') // Remove multi-line comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/\s*([{}();,:])\s*/g, '$1') // Remove space around symbols
      .trim();
  }
}

// General claim extraction bookmarklet
export class ClaimExtractionBookmarklet extends BaseBookmarklet {
  private enableOnSelect: boolean;
  
  constructor(options: ClaimBookmarkletOptions) {
    super(options.apiEndpoint);
    this.enableOnSelect = options.enableOnSelect ?? false;
  }
  
  getBookmarkletCode(minified = true): string {
    const code = `(function(){
      function getSelectedContent(){
        var selection=window.getSelection();
        var container=document.createElement("div");
        for(var i=0;i<selection.rangeCount;i++){
          var range=selection.getRangeAt(i);
          var fragment=range.cloneContents();
          container.appendChild(fragment);
        }
        var links=container.getElementsByTagName("a");
        for(var i=links.length-1;i>=0;i--){
          var link=links[i];
          var text=link.textContent;
          var href=link.getAttribute("href");
          if(href&&href!==text){
            link.replaceWith(text+" ("+href+")");
          }
        }
        return container.innerText.trim().replace(/\\s+/g," ");
      }
      
      ${this.enableOnSelect ? `
      document.addEventListener("mouseup",function(){
        var currentPageUrl=window.location.href;
        var selectedText=getSelectedContent();
        if(selectedText.length>0){
          var confirmSend=confirm("Selected text: \\""+selectedText+"\\". Do you want to send this text?");
          if(confirmSend){
            fetch("${this.apiEndpoint}",{
              method:"POST",
              headers:{"Content-Type":"application/json"},
              body:JSON.stringify({text:selectedText,source_url:currentPageUrl})
            })
            .then(response=>response.json())
            .then(data=>{alert("Text sent successfully!");})
            .catch(error=>{console.log("Error:",error);alert("Failed to send text.");});
          }
        }
      });
      ` : `
      var currentPageUrl=window.location.href;
      var selectedText=getSelectedContent();
      if(selectedText.length===0){
        alert("Please select some text first!");
        return;
      }
      var confirmSend=confirm("Selected text: \\""+selectedText+"\\". Do you want to send this text?");
      if(confirmSend){
        fetch("${this.apiEndpoint}",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({text:selectedText,source_url:currentPageUrl})
        })
        .then(response=>response.json())
        .then(data=>{alert("Text sent successfully!");})
        .catch(error=>{console.log("Error:",error);alert("Failed to send text.");});
      }
      `}
    })();`;
    
    return minified ? this.minify(code) : code;
  }
}

// Dynamic loader bookmarklet (loads script from server)
export class DynamicLoaderBookmarklet extends BaseBookmarklet {
  getBookmarkletCode(minified = true): string {
    const code = `(function(){
      if(window._bookmarkletLoaded){
        alert('LinkedClaims already active!');
        return;
      }
      window._bookmarkletLoaded=true;
      const s=document.createElement('script');
      s.src='${this.apiEndpoint}/bookmarklet.js?t='+new Date().getTime();
      s.onerror=function(){
        alert('Error loading LinkedClaims. Please try again.');
        window._bookmarkletLoaded=false;
      };
      document.body.appendChild(s);
    })();`;
    
    return minified ? this.minify(code) : code;
  }
}
