// ==UserScript==
// @name     Unfix
// @version  0.1
// @grant    none
// @run-at   document-start
// ==/UserScript==

// Global vars

var fixedCollector = undefined;


// Uncomment the following line if you want to move all fixed-position elements to a container in the beginning of the document:
// fixedCollector = addFixedCollector();

// Functions

function removeFixed(eCollector, elements) {
  const es = Array.from(elements).filter((e) => {
    const pos = window.getComputedStyle(e).position;
    return pos == 'fixed' || pos == 'sticky';
  });
  for(const e of es) {
    if(eCollector) {
    	e.parentNode.removeChild(e);
  		eCollector.appendChild(e);
    }
    e.style.position = 'static !important';
    e.style = "position: static !important";
  }
  if(es.length > 0) {
  	console.log("Moved " + es.length.toString() + " fixed elements.");
  }
}

function mutationCallback(mutationList, observer) {
  for (const mutation of mutationList) {
    if (mutation.type === 'childList') {
      const children = Array.from(mutation.addedNodes).filter((e) => { !fixedCollector.contains(e) });
      removeFixed(fixedCollector, children);
    } else if (mutation.type === 'attributes') {
      removeFixed(fixedCollector, [mutation.target]);
    }
  }
}

function addFixedCollector() {
	const e = document.createElement("div");
  document.body.insertBefore(e, document.body.firstChild);
  //e.style.maxHeight = "300px";
  e.style.overflow = "auto";
  e.style.width = "100%";
  return e;
}


// Main

// Script is run at document-start, but we can only start removing elements
// once the document has completed loading. 
window.addEventListener('load', (e)=>{
	removeFixed(fixedCollector, document.querySelectorAll('*'));
  // The following is in case we race with some other script that executes code on load.
  window.setTimeout(() => { removeFixed(fixedCollector, document.querySelectorAll('*')); }, 500);
});

// The observer is registered at document-start, taking care of anything
// modified by scripts.
const observer = new MutationObserver(mutationCallback);
const observerConfig = { attributes: true, childList: true, subtree: true };
observer.observe(document, observerConfig);


/* Timeout-based solution if the above is too resource-intensive: */

/*var mutationQueue = [];
const observer = new MutationObserver( (l, o) => {mutationQueue.push(...l) });
const observerConfig = { attributes: true, childList: true, subtree: true };

window.setInterval(() => {
  mutationQueue.push(...observer.takeRecords());
  if(mutationQueue.length > 0) {
  	mutationCallback(mutationQueue, observer);
  }
  mutationQueue = [];
}, 200);*/
