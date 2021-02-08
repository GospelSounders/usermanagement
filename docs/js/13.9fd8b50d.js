(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[13],{e00e:function(e,t,o){"use strict";o.r(t);var r=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("q-page",{attrs:{padding:""}},[o("q-dialog",{attrs:{"transition-show":"rotate","transition-hide":"rotate"},model:{value:e.createProjectDialog,callback:function(t){e.createProjectDialog=t},expression:"createProjectDialog"}},[o("q-card",{staticClass:"bg-secondary text-white"},[o("q-card-section",{staticClass:"text-center text-h3"},[o("div",{staticClass:"text-subtitle2"},[e._v("Create New Project")])]),o("q-separator",{attrs:{dark:""}}),o("q-card-section",[o("q-form",{ref:"newProjectForm",staticClass:"col q-gutter-md text-white",on:{submit:e.createProject,reset:e.onReset}},[o("q-input",{attrs:{filled:"",type:"text",label:"Project Name",hint:"Project Name","lazy-rules":"",rules:[function(e){return e&&e.length>0||"Please enter project name"}]},on:{input:e.repoNameFromProject,keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.submit(t)}},model:{value:e.project,callback:function(t){e.project=t},expression:"project"}}),o("q-select",{attrs:{clearable:"","use-input":"",filled:"",options:e.applications,label:"Application","lazy-rules":"",rules:[function(e){return e&&e.length>0||"Please select application"}]},on:{input:e.repoNameFromApplication,filter:e.filterFn},model:{value:e.application,callback:function(t){e.application=t},expression:"application"}}),o("q-input",{attrs:{disable:"",filled:"",type:"text",label:"Repo",hint:"Repo","lazy-rules":"",rules:[function(e){return e&&e.length>0||"Please project name"}]},on:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.submit(t)}},model:{value:e.repo,callback:function(t){e.repo=t},expression:"repo"}}),o("div",{staticClass:"col"},[o("q-btn",{attrs:{label:"Create",type:"submit",color:"primary"}}),o("q-btn",{staticClass:"q-ml-sm",attrs:{label:"Reset",type:"reset",color:"primary",flat:""}})],1)],1)],1)],1)],1),o("div",{staticClass:"row"},[o("q-list",{staticClass:"col",attrs:{bordered:"",highlight:""}},[o("q-item-label",{attrs:{header:""}},[o("div",{staticClass:"row"},[e._v("\n          Projects\n          "),o("q-space"),o("q-btn",{attrs:{flat:""}},[o("q-icon",{attrs:{color:"primary",name:"refresh",side:""},on:{click:function(t){return e.fetchProjects()}}})],1),o("q-btn",{attrs:{flat:""}},[o("q-icon",{attrs:{color:"primary",name:"add_circle",side:""},on:{click:function(t){e.createProjectDialog=!0}}})],1)],1)]),e._l(e.projects,(function(t,r){return o("q-item",{key:r},[o("q-item-section",{attrs:{avatar:""}},[o("q-icon",{attrs:{color:"primary",name:"security"}})],1),o("q-item-section",[e._v(e._s(t))]),o("q-item-section",{attrs:{side:"",clickable:""},on:{click:function(o){return e.deleteProject(t)}}},[o("q-icon",{attrs:{name:"delete",color:"red"}})],1)],1)}))],2)],1)],1)},s=[],a=(o("c975"),o("26e9"),o("e6cf"),o("5319"),o("ddb0"),o("cf57"));o("bc3a");const i=o("1712").to,n=o("ff00"),c=n,l=o("547a").default,{Octokit:p}=o("1af2"),u=o("e350").default,m=new u;var h={name:"Projects",components:{},async created(){m.on("error",this.loadList),m.emit("error"),l.setSettings({TBURL:n["TB_URL"]}),l.setSettings(n);let[e,t]=await i(l.isLoggedIn());e?window.location.assign("#/"):[e,t]=await i(this.fetchProjects())},beforeDestroy(){m.removeListener("error",this.loadList)},data(){return{project:"",repo:"",projects:[],createProjectDialog:!1,applications:[],allApplications:[],application:""}},methods:{filterFn(e,t){t(""!==e?()=>{const t=e.toLowerCase();this.applications=this.allApplications.filter((e=>e.toLowerCase().indexOf(t)>-1))}:()=>{this.applications=this.allApplications})},onReset(){this.application="",this.project=""},submit(){this.$refs.newProjectForm.submit()},alert(e){alert(e)},async createProject(){return new Promise((async(e,t)=>{if(""===this.project)return this.$q.notify({type:"negative",message:"Project cannot be blank"}),t("project cannot be blank");this.working=!0,this.showCustom("creating project");let[o,r]=await i(l.createProject(this.project,this.application,this.repo));this.working=!1,o?(this.$q.notify({type:"negative",message:o.msg||o}),e(!1)):(console.log(r),this.projects=r.projects,this.project="")}))},async fetchProjects(){return new Promise((async(e,t)=>{this.working=!0,this.showCustom("fetching projects");let[o,r]=await i(l.fetchProjects());this.working=!1,o?(this.$q.notify({type:"negative",message:o}),e(!1)):(this.projects=r.projects,e(r.projects))}))},async deleteProject(e){return new Promise((async(t,o)=>{let[r,s]=await i(this.confirm(`Are you sure you want to delete ${e}`,"Delete Project"));return r?t(!1):(this.working=!0,this.showCustom("deleting project"),[r,s]=await i(l.deleteProject(e)),this.working=!1,r?(console.log(r),this.$q.notify({type:"negative",message:r.msg||r}),t(!1)):(this.projects=s.projects,void t(s.projects)))}))},async confirm(e,t="Confirm"){return new Promise(((o,r)=>{this.$q.dialog({title:t,message:e,cancel:!0,persistent:!0}).onOk((()=>o(!0))).onOk((()=>o(!0))).onCancel((()=>r(!0))).onDismiss((()=>r(!0)))}))},showCustom(e="",t="",o=0){const r=this.$q.dialog({title:e,message:t,progress:{spinner:a["a"],color:"primary"},persistent:!0,ok:!1});let s,i,n=o;r.update({message:`${n} secs`});const c=()=>{clearInterval(s),clearInterval(i),r.hide()};i=setInterval((()=>{o>0?(n--,0===n&&c()):n++,r.update({message:`${n} secs`})}),1e3),s=setInterval((()=>{!1===this.working&&c()}),500)},async loadList(){return new Promise((async(e,t)=>{this.working=!0,this.showCustom("Loading");c.CORS_PROXY,c.LISTURL;const o=new p({});let r=c.LISTURL.split("/").reverse(),s=r[0],a=r[2],n=r[3],[l,u]=await i(o.request(`GET /repos/${n}/${a}/contents/${s}`,{owner:n,repo:a,path:s}));this.working=!1,l?(this.working=!0,this.showCustom("Error. Going to refresh.","",5),setTimeout((()=>{this.working=!1,m.emit("error")}),5e3)):this.listLoaded(JSON.parse(atob(u.data.content)))}))},listLoaded(e){let t=[];for(let o in e){e[o];t.push(o)}this.allApplications=[...t],this.applications=[...this.allApplications]},repoNameFromProject(e){this.repoNameFromApplication(e)},repoNameFromApplication(e){this.repo=`${(this.project||"").toLowerCase().replace(".","-").replace(" ","-")}.${(this.application||"").toLowerCase().replace(".","-").replace(" ","-")}.gsp`}}},d=h,f=o("2877"),g=o("9989"),w=o("24e8"),j=o("f09f"),y=o("a370"),b=o("eb85"),k=o("0378"),P=o("27f9"),q=o("ddd8"),C=o("9c40"),v=o("1c1c"),L=o("0170"),$=o("2c91"),x=o("0016"),Q=o("66e5"),I=o("4074"),_=o("eebe"),R=o.n(_),S=Object(f["a"])(d,r,s,!1,null,null,null);t["default"]=S.exports;R()(S,"components",{QPage:g["a"],QDialog:w["a"],QCard:j["a"],QCardSection:y["a"],QSeparator:b["a"],QForm:k["a"],QInput:P["a"],QSelect:q["a"],QBtn:C["a"],QList:v["a"],QItemLabel:L["a"],QSpace:$["a"],QIcon:x["a"],QItem:Q["a"],QItemSection:I["a"]})}}]);