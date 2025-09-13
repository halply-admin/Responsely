(function(){"use strict";const s={WIDGET_URL:"https://responsely-widget.vercel.app",DEFAULT_POSITION:"bottom-right"},h=`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
</svg>`,w=`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="18" y1="6" x2="6" y2="18"></line>
  <line x1="6" y1="6" x2="18" y2="18"></line>
</svg>`;(function(){let r=null,e=null,t=null,c=!1,a="#3b82f6",l=null,d=s.DEFAULT_POSITION;const p=document.currentScript;if(p)l=p.getAttribute("data-organization-id"),d=p.getAttribute("data-position")||s.DEFAULT_POSITION;else{const i=document.querySelectorAll('script[src*="embed"]'),o=Array.from(i).find(n=>n.hasAttribute("data-organization-id"));o&&(l=o.getAttribute("data-organization-id"),d=o.getAttribute("data-position")||s.DEFAULT_POSITION)}if(!l){console.error("Responsely Widget: data-organization-id attribute is required");return}function g(i,o=.35){i=i.replace("#","");const n=parseInt(i,16),T=n>>16&255,k=n>>8&255,S=n&255;return`rgba(${T}, ${k}, ${S}, ${o})`}function v(i){var o;t&&(a=i,t.style.background=a,t.style.boxShadow=`0 4px 24px ${g(a)}`,r&&((o=r.contentWindow)==null||o.postMessage({type:"updateCSSVariable",payload:{primaryColor:i}},"*")))}function f(){document.readyState==="loading"?document.addEventListener("DOMContentLoaded",m):m()}function m(){t=document.createElement("button"),t.id="echo-widget-button",t.innerHTML=h,t.style.cssText=`
      position: fixed;
      ${d==="bottom-right"?"right: 20px;":"left: 20px;"}
      bottom: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: ${a};
      color: white;
      border: none;
      cursor: pointer;
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 24px ${g(a)};
      transition: all 0.2s ease;
    `,t.addEventListener("click",I),t.addEventListener("mouseenter",()=>{t&&(t.style.transform="scale(1.05)")}),t.addEventListener("mouseleave",()=>{t&&(t.style.transform="scale(1)")}),document.body.appendChild(t),e=document.createElement("div"),e.id="echo-widget-container",e.style.cssText=`
      position: fixed;
      ${d==="bottom-right"?"right: 20px;":"left: 20px;"}
      bottom: 90px;
      width: 400px;
      height: 600px;
      max-width: calc(100vw - 40px);
      max-height: calc(100vh - 110px);
      z-index: 999998;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
      display: none;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.3s ease;
    `,r=document.createElement("iframe"),r.src=E(),r.style.cssText=`
      width: 100%;
      height: 100%;
      border: none;
    `,r.allow="microphone; clipboard-read; clipboard-write",e.appendChild(r),document.body.appendChild(e),window.addEventListener("message",y)}function E(){const i=new URLSearchParams;return i.append("organizationId",l),`${s.WIDGET_URL}?${i.toString()}`}function y(i){if(i.origin!==new URL(s.WIDGET_URL).origin)return;const{type:o,payload:n}=i.data;switch(o){case"close":u();break;case"resize":n.height&&e&&(e.style.height=`${n.height}px`);break;case"updatePrimaryColor":n.primaryColor&&v(n.primaryColor);break}}function I(){c?u():b()}function b(){e&&t&&(c=!0,e.style.display="block",setTimeout(()=>{e&&(e.style.opacity="1",e.style.transform="translateY(0)")},10),t.innerHTML=w)}function u(){e&&t&&(c=!1,e.style.opacity="0",e.style.transform="translateY(10px)",setTimeout(()=>{e&&(e.style.display="none")},300),t.innerHTML=h,t.style.background=a)}function x(){window.removeEventListener("message",y),e&&(e.remove(),e=null,r=null),t&&(t.remove(),t=null),c=!1}function L(i){x(),i.organizationId&&(l=i.organizationId),i.position&&(d=i.position),a="#3b82f6",f()}window.EchoWidget={init:L,show:b,hide:u,destroy:x},f()})()})();
