import{j as e}from"./index-DIRXQF6L.js";import{z as i}from"./App-B3mPTGL-.js";import{C as h}from"./check-BQsP6Qkv.js";/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=[["rect",{width:"20",height:"12",x:"2",y:"6",rx:"2",key:"9lu3g6"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}],["path",{d:"M6 12h.01M18 12h.01",key:"113zkx"}]],y=i("banknote",x);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=[["rect",{width:"20",height:"14",x:"2",y:"5",rx:"2",key:"ynyp8z"}],["line",{x1:"2",x2:"22",y1:"10",y2:"10",key:"1b3vmo"}]],u=i("credit-card",p);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=[["rect",{width:"14",height:"20",x:"5",y:"2",rx:"2",ry:"2",key:"1yt0o3"}],["path",{d:"M12 18h.01",key:"mhygvu"}]],b=i("smartphone",k),j=({value:o,onChange:c,disabled:s=!1,labels:t})=>{const d=[{id:"card",icon:u,title:t.cardPayment,description:t.cardPaymentDescription},{id:"fawry",icon:y,title:t.fawryPayment,description:t.fawryPaymentDescription},{id:"wallet",icon:b,title:t.walletPayment,description:t.walletPaymentDescription}];return e.jsx("div",{className:"mt-4 space-y-3",role:"radiogroup","aria-label":t.paymentMethods,children:d.map(({id:n,icon:l,title:m,description:a})=>{const r=o===n;return e.jsxs("button",{type:"button",role:"radio","aria-checked":r,onClick:()=>c(n),disabled:s,className:`flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition ${r?"border-main bg-[#F0FAF8] ring-2 ring-main/10":"border-[#DFE8E6] bg-white hover:border-main/40 hover:bg-[#FBFDFC]"}`,children:[e.jsx("span",{className:`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${r?"bg-main text-white":"bg-[#EEF5F6] text-main"}`,children:e.jsx(l,{size:20,"aria-hidden":"true"})}),e.jsxs("span",{className:"min-w-0 flex-1",children:[e.jsx("span",{className:"block text-sm font-semibold text-black-blue",children:m}),a?e.jsx("span",{className:"mt-1 block text-xs leading-5 text-[#7B8583]",children:a}):null]}),e.jsx("span",{className:`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${r?"border-main bg-main text-white":"border-[#C9D5D2] bg-white"}`,"aria-hidden":"true",children:r?e.jsx(h,{size:13,strokeWidth:3}):null})]},n)})})};export{y as B,j as P};
