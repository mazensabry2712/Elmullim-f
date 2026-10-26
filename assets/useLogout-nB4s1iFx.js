import{z as l,k as g,l as p,q as c,v as y}from"./App-A0coSxz-.js";import{r as m}from"./index-DedRE2uL.js";import{a as f}from"./authCopy-OBRKmvh-.js";/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]],x=l("log-out",k),b=()=>{const o=g(),t=p(),{mutateAsync:e,isPending:u}=f();return{performLogout:m.useCallback(async()=>{const s=c.getToken(),r=c.getRole();let a,n;try{s&&r&&(a=await e({token:s,role:r}))}catch(i){n=i}finally{o(y()),t("/login",{replace:!0})}return{response:a,error:n}},[o,e,t]),isPending:u}};export{x as L,b as u};
