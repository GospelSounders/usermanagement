(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[11],{1:function(e,t){},10:function(e,t){},2:function(e,t){},3:function(e,t){},4:function(e,t){},5:function(e,t){},"547a":function(e,t,o){"use strict";o.r(t);o("e6cf"),o("ddb0");var n=o("9523"),s=o.n(n);const r=o("1712").to,i=o("bc3a"),a=o("1232").default,c=o("4556"),l=o("e350").default;console.log(l);class u extends l{constructor(){var e;super(),e=this,s()(this,"settings",{}),s()(this,"setSettings",(e=>{for(let t in e){let o=e[t];this.settings[t]=o}})),s()(this,"setToken",(e=>{let t=e.token,o=e.refreshToken;window.localStorage.setItem("tbTokenGSAC",t),window.localStorage.setItem("tbRefreshTokenGSAC",o)})),s()(this,"logout",(()=>{window.localStorage.removeItem("tbTokenGSAC"),window.localStorage.removeItem("tbRefreshTokenGSAC"),this.jwt_token=null})),s()(this,"login",(async function(t){return new Promise((async function(o,n){let s=`${e.settings.TBURL}/auth/login`,[a,c]=await r(i.post(s,t));return a?n(a):o(c.data)}))})),s()(this,"getToken",(async function(t,o){return new Promise((async function(t,n){let s=`${e.settings.TBURL}/auth/token`,[a,c]=await r(i.post(s,{refreshToken:o},{headers:{"Content-Type":"application/json","X-Authorization":"Bearer "+o}}));return a?n(a):t(c.data)}))})),s()(this,"isLoggedIn",(async function(){return new Promise((async function(t,o){let n=localStorage.getItem("tbTokenGSAC");if(!n)return o("missing token");let s=a(n);console.log(s),e.userId=s.userId,e.jwt_token=n;let i=s.exp;if(!i)return o("missing token expiry");let c=localStorage.getItem("tbRefreshTokenGSAC");i=parseInt(i),(new Date).getTime();{let[t,s]=await r(e.getToken(n,c));if(t)return o("could not find token");e.setToken(s),n=s.token}return t(n)}))})),s()(this,"fetchRoles",(async function(){return new Promise((async function(t,o){let[n,s]=await r(e.sendSaveTeletry({type:"roles",action:"get"}));if(n)return o(n);t(s)}))})),s()(this,"fetchProjects",(async function(){return new Promise((async function(t,o){let[n,s]=await r(e.sendSaveTeletry({type:"projects",action:"get"}));if(n)return o(n);t(s)}))})),s()(this,"whoAmI",(async function(){return new Promise((async function(t,o){let[n,s]=await r(e.readUserData());if(console.log("WHOAMI"),n)return o(n);t(s)}))})),s()(this,"fetchUsers",(async function(){return new Promise((async function(t,o){let[n,s]=await r(e.whoAmI());if(n)return o(n);let a,c=s.authority;if("TENANT_ADMIN"===c){let t=`${e.settings.TBURL}/tenant/customers?customerTitle=GS Publications`;if([n,s]=await r(i.get(t,{headers:{"Content-Type":"application/json","X-Authorization":"Bearer "+e.jwt_token}})),n)return o(n);a=s.data.id.id}else console.log("i am a customer...."),console.log(s),a=s.customerId.id;if(console.log("CUSTOMER ID",a),[n,s]=await r(e.sendSaveTeletry({type:"users",action:"get",customerId:a})),n)return o(n.msg||n);t(s)}))})),s()(this,"createRole",(async function(t){return new Promise((async function(o,n){let[s,i]=await r(e.sendSaveTeletry({type:"roles",action:"create",role:t}));if(s)return n(s);o(i)}))})),s()(this,"createUser",(async function(t,o){let{user:n,firstName:s,lastName:i,password:a}=t;return console.log("PPPPPPPPPPPPPPPPPPPPp"),new Promise((async function(t,c){console.log("step1...");let[l,u]=await r(e.sendSaveTeletry({type:"users",action:"create",user:n,firstName:s,lastName:i,password:a},o));if(l)return console.log("REJECTED========"),console.log(l),c(l);if(o){if(console.log("NEVER WAITING"),[l,u]=await r(e.checkSuccessfulCreateUser(n,a)),l)return c(l);t(u)}else{console.log("result from creating user");let o=JSON.parse(JSON.stringify(u));if(console.log(u),0===Object.keys(u).length){if([l,u]=await r(e.login({username:n,password:a})),l)return c("Registration failed. Please try submitting the form again");t({})}else t(o)}}))})),s()(this,"checkSuccessfulCreateUser",(async function(t,o){return new Promise((async function(n,s){let i=(new Date).getTime();console.log("starting for sure...");const a=async function(){console.log("here.....");let l=c({length:20,type:"url-safe"});return e.once(l,a),new Promise((async function(c,u){let[p,f]=await r(e.login({username:t,password:o}));if(p){console.log(p.data);let o=(new Date).getTime(),n=o-i;n<=1e4?e.emit(l):(e.removeListener(l,a),s(`Error creating account. Probably ${t} already exists`),u("Timed out"))}if(void 0!==f)return console.log(f),e.removeListener(l,a),c(f.data),n(f.data);{let t=(new Date).getTime(),o=t-i;o<=1e4?e.emit(l):(e.removeListener(l,a),s("Error creating account. Probably ${user} already exists"),u("Timed out"))}}))};await r(a())}))})),s()(this,"deleteUser",(async function(t){return new Promise((async function(o,n){console.log("STARGINT TO DELETE");let[s,i]=await r(e.sendSaveTeletry({type:"users",action:"delete",user:t}));if(s)return console.log("REJECTED========"),console.log(s),n(s);let a=JSON.parse(JSON.stringify(i));console.log(i),o(a)}))})),s()(this,"getActivationLink",(async function(t,o){return new Promise((async function(n,s){let a=`${e.settings.TBURL}/user/${t}/activationLink`,[c,l]=await r(i.get(`${e.settings.JSONPROXY}?path=${a}`,{headers:{"Content-Type":"application/json","X-Authorization":"Bearer "+o}}));if(c)return s(c);n(l.data)}))})),s()(this,"createProject",(async function(t,o,n){return new Promise((async function(o,n){let[s,i]=await r(e.sendSaveTeletry({type:"projects",action:"create",project:t}));if(console.log("adhkjashdkhasdk"),s)return n(s);console.log("RETURNED..."),console.log(i),o(i)}))})),s()(this,"deleteRole",(async function(t){return new Promise((async function(o,n){let[s,i]=await r(e.sendSaveTeletry({type:"roles",action:"delete",role:t}));if(s)return n(s);o(i)}))})),s()(this,"deleteProject",(async function(t){return new Promise((async function(o,n){let[s,i]=await r(e.sendSaveTeletry({type:"projects",action:"delete",project:t}));if(s)return n(s);o(i)}))})),s()(this,"createApplication",(async function(t){return new Promise((async function(o,n){let[s,i]=await r(e.sendSaveTeletry({type:"applications",action:"create",application:t}));if(console.log("adhkjashdkhasdk"),s)return n(s);console.log("RETURNED..."),console.log(i),o(i)}))})),s()(this,"fetchApplications",(async function(){return new Promise((async function(t,o){let[n,s]=await r(e.sendSaveTeletry({type:"applications",action:"get"}));if(n)return o(n);t(s)}))})),s()(this,"deleteApplication",(async function(t){return new Promise((async function(o,n){let[s,i]=await r(e.sendSaveTeletry({type:"applications",action:"delete",application:t}));if(s)return n(s);o(i)}))})),s()(this,"readUserData",(async function(){return new Promise((async function(t,o){let n=`${e.settings.TBURL}/auth/user`,[s,a]=await r(i.get(n,{headers:{"Content-Type":"application/json","X-Authorization":"Bearer "+e.jwt_token}}));return s?o(s):t(a.data)}))})),s()(this,"sendSaveTeletry",(async function(t,o=!1){return t.userId||(t.userId=e.userId),t.jwt_token||e.jwt_token&&(t.jwt_token=e.jwt_token),t.rqId||(t.rqId=c({length:20,type:"url-safe"})),console.log("step2"),console.log({data:t}),new Promise((async function(n,s){let a=e.settings.PUBLIC_DEVICE_ACCESS_TOKEN;console.log(e.settings);let l=e.settings.CORS_PROXY,u=`${e.settings.TBURL}/v1/${a}/telemetry`;console.log(t);let[p,f]=await r(i.post(`${l}/${u}`,t,{headers:{"Content-Type":"application/json"}}));if(console.log("ERRED......"),console.log(p),console.log(f),p)return s(p);if(o)return console.log("NO WAITING.."),n(!0);let d=t.rqId,g=(new Date).getTime();const h=async function(){return new Promise((async function(t,o){let[i,a]=await r(e.readUserData()),l=c({length:20,type:"url-safe"});if(e.once(l,h),i)console.log(i.status),console.log(i.response.data.status),console.log(i.data),console.log(i),e.removeListener(l,h),401===i.response.data.status?(console.log("---------160"),t({}),n({})):(console.log("---------1601"),o(i),s(i));else if(void 0===a.additionalInfo)s("Unknown error occured"),o("Unknown error occured");else{let r=a.additionalInfo.responses;if(r&&r[d]){console.log("---------167");let i=r[d];return console.log(i),i.msg.error?(e.removeListener(l,h),o(i.msg.error),s(i.msg.error)):(console.log("returned...."),console.log(i.msg),n(i.msg),t(!0),console.log("after resolve....."),e.removeListener(l,h),n(i.msg))}{let t=(new Date).getTime(),n=t-g;n<=12e4?(console.log(n,d),e.emit(l)):(e.removeListener(l,h),s("timed out"),o("timed out"))}}}))};await r(h())}))}))}}const p=new u;t["default"]=p},6:function(e,t){},7:function(e,t){},8:function(e,t){},9:function(e,t){},e00e:function(e,t,o){"use strict";o.r(t);var n=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("q-page",{attrs:{padding:""}},[o("q-dialog",{attrs:{"transition-show":"rotate","transition-hide":"rotate"},model:{value:e.createProjectDialog,callback:function(t){e.createProjectDialog=t},expression:"createProjectDialog"}},[o("q-card",{staticClass:"bg-secondary text-white"},[o("q-card-section",{staticClass:"text-center text-h3"},[o("div",{staticClass:"text-subtitle2"},[e._v("Create New Project")])]),o("q-separator",{attrs:{dark:""}}),o("q-card-section",[o("q-form",{ref:"newProjectForm",staticClass:"col q-gutter-md text-white",on:{submit:e.createProject,reset:e.onReset}},[o("q-input",{attrs:{filled:"",type:"text",label:"Project Name",hint:"Project Name","lazy-rules":"",rules:[function(e){return e&&e.length>0||"Please enter project name"}]},on:{input:e.repoNameFromProject,keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.submit(t)}},model:{value:e.project,callback:function(t){e.project=t},expression:"project"}}),o("q-select",{attrs:{clearable:"","use-input":"",filled:"",options:e.applications,label:"Application","lazy-rules":"",rules:[function(e){return e&&e.length>0||"Please select application"}]},on:{input:e.repoNameFromApplication,filter:e.filterFn},model:{value:e.application,callback:function(t){e.application=t},expression:"application"}}),o("q-input",{attrs:{disable:"",filled:"",type:"text",label:"Repo",hint:"Repo","lazy-rules":"",rules:[function(e){return e&&e.length>0||"Please project name"}]},on:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.submit(t)}},model:{value:e.repo,callback:function(t){e.repo=t},expression:"repo"}}),o("div",{staticClass:"col"},[o("q-btn",{attrs:{label:"Create",type:"submit",color:"primary"}}),o("q-btn",{staticClass:"q-ml-sm",attrs:{label:"Reset",type:"reset",color:"primary",flat:""}})],1)],1)],1)],1)],1),o("div",{staticClass:"row"},[o("q-list",{staticClass:"col",attrs:{bordered:"",highlight:""}},[o("q-item-label",{attrs:{header:""}},[o("div",{staticClass:"row"},[e._v("\n          Projects\n          "),o("q-space"),o("q-btn",{attrs:{flat:""}},[o("q-icon",{attrs:{color:"primary",name:"refresh",side:""},on:{click:function(t){return e.fetchProjects()}}})],1),o("q-btn",{attrs:{flat:""}},[o("q-icon",{attrs:{color:"primary",name:"add_circle",side:""},on:{click:function(t){e.createProjectDialog=!0}}})],1)],1)]),e._l(e.projects,(function(t,n){return o("q-item",{key:n},[o("q-item-section",{attrs:{avatar:""}},[o("q-icon",{attrs:{color:"primary",name:"security"}})],1),o("q-item-section",[e._v(e._s(t))]),o("q-item-section",{attrs:{side:"",clickable:""},on:{click:function(o){return e.deleteProject(t)}}},[o("q-icon",{attrs:{name:"delete",color:"red"}})],1)],1)}))],2)],1)],1)},s=[],r=(o("c975"),o("26e9"),o("e6cf"),o("5319"),o("ddb0"),o("cf57"));o("bc3a");const i=o("1712").to,a=o("ff00"),c=a,l=o("547a").default,{Octokit:u}=o("1af2"),p=o("e350").default,f=new p;var d={name:"Projects",components:{},async created(){f.on("error",this.loadList),f.emit("error"),l.setSettings({TBURL:a["TB_URL"]}),l.setSettings(a);let[e,t]=await i(l.isLoggedIn());e?window.location.assign("#/"):[e,t]=await i(this.fetchProjects())},beforeDestroy(){f.removeListener("error",this.loadList)},data(){return{project:"",repo:"",projects:[],createProjectDialog:!1,applications:[],allApplications:[],application:""}},methods:{filterFn(e,t){t(""!==e?()=>{const t=e.toLowerCase();this.applications=this.allApplications.filter((e=>e.toLowerCase().indexOf(t)>-1))}:()=>{this.applications=this.allApplications})},onReset(){this.application="",this.project=""},submit(){this.$refs.newProjectForm.submit()},alert(e){alert(e)},async createProject(){return new Promise((async(e,t)=>{if(""===this.project)return this.$q.notify({type:"negative",message:"Project cannot be blank"}),t("project cannot be blank");this.working=!0,this.showCustom("creating project");let[o,n]=await i(l.createProject(this.project,this.application,this.repo));this.working=!1,o?(this.$q.notify({type:"negative",message:o.msg||o}),e(!1)):(console.log(n),this.projects=n.projects,this.project="")}))},async fetchProjects(){return new Promise((async(e,t)=>{this.working=!0,this.showCustom("fetching projects");let[o,n]=await i(l.fetchProjects());this.working=!1,o?(this.$q.notify({type:"negative",message:o}),e(!1)):(this.projects=n.projects,e(n.projects))}))},async deleteProject(e){return new Promise((async(t,o)=>{let[n,s]=await i(this.confirm(`Are you sure you want to delete ${e}`,"Delete Project"));return n?t(!1):(this.working=!0,this.showCustom("deleting project"),[n,s]=await i(l.deleteProject(e)),this.working=!1,n?(console.log(n),this.$q.notify({type:"negative",message:n.msg||n}),t(!1)):(this.projects=s.projects,void t(s.projects)))}))},async confirm(e,t="Confirm"){return new Promise(((o,n)=>{this.$q.dialog({title:t,message:e,cancel:!0,persistent:!0}).onOk((()=>o(!0))).onOk((()=>o(!0))).onCancel((()=>n(!0))).onDismiss((()=>n(!0)))}))},showCustom(e="",t="",o=0){const n=this.$q.dialog({title:e,message:t,progress:{spinner:r["a"],color:"primary"},persistent:!0,ok:!1});let s,i,a=o;n.update({message:`${a} secs`});const c=()=>{clearInterval(s),clearInterval(i),n.hide()};i=setInterval((()=>{o>0?(a--,0===a&&c()):a++,n.update({message:`${a} secs`})}),1e3),s=setInterval((()=>{!1===this.working&&c()}),500)},async loadList(){return new Promise((async(e,t)=>{this.working=!0,this.showCustom("Loading");c.CORS_PROXY,c.LISTURL;const o=new u({});let n=c.LISTURL.split("/").reverse(),s=n[0],r=n[2],a=n[3],[l,p]=await i(o.request(`GET /repos/${a}/${r}/contents/${s}`,{owner:a,repo:r,path:s}));this.working=!1,l?(this.working=!0,this.showCustom("Error. Going to refresh.","",5),setTimeout((()=>{this.working=!1,f.emit("error")}),5e3)):this.listLoaded(JSON.parse(atob(p.data.content)))}))},listLoaded(e){let t=[];for(let o in e){e[o];t.push(o)}this.allApplications=[...t],this.applications=[...this.allApplications]},repoNameFromProject(e){this.repoNameFromApplication(e)},repoNameFromApplication(e){this.repo=`${(this.project||"").toLowerCase().replace(".","-").replace(" ","-")}.${(this.application||"").toLowerCase().replace(".","-").replace(" ","-")}.gsp`}}},g=d,h=o("2877"),m=o("9989"),y=o("24e8"),w=o("f09f"),P=o("a370"),j=o("eb85"),k=o("0378"),T=o("27f9"),v=o("ddd8"),b=o("9c40"),S=o("1c1c"),C=o("0170"),I=o("2c91"),L=o("0016"),R=o("66e5"),q=o("4074"),E=o("eebe"),A=o.n(E),N=Object(h["a"])(g,n,s,!1,null,null,null);t["default"]=N.exports;A()(N,"components",{QPage:m["a"],QDialog:y["a"],QCard:w["a"],QCardSection:P["a"],QSeparator:j["a"],QForm:k["a"],QInput:T["a"],QSelect:v["a"],QBtn:b["a"],QList:S["a"],QItemLabel:C["a"],QSpace:I["a"],QIcon:L["a"],QItem:R["a"],QItemSection:q["a"]})},e350:function(e,t,o){"use strict";o.r(t);o("c975"),o("a434");class n{constructor(){this.events={}}on(e,t){return"object"!==typeof this.events[e]&&(this.events[e]=[]),this.events[e].push(t),()=>this.removeListener(e,t)}removeListener(e,t){if("object"===typeof this.events[e]){const o=this.events[e].indexOf(t);o>-1&&this.events[e].splice(o,1)}}emit(e,...t){"object"===typeof this.events[e]&&this.events[e].forEach((e=>e.apply(this,t)))}once(e,t){const o=this.on(e,((...e)=>{o(),t.apply(this,e)}))}}t["default"]=n},ff00:function(e){e.exports=JSON.parse('{"TB_URL":"https://demo.thingsboard.io/api","PUBLIC_DEVICE_ACCESS_TOKEN":"9sE9Z86OdYsynyCJKjnq","CORS_PROXY":"https://cors.cseco.co.ke","JSONPROXY":"https://jsonproxy.cseco.co.ke","LISTURL":"https://raw.githubusercontent.com/GospelSounders/applications-list/master/applications.json"}')}}]);