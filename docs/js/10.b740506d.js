(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[10],{d804:function(e,t,n){"use strict";n.r(t);var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("q-page",{attrs:{padding:""}},[""!==e.helpText?n("q-markdown",[e._v("\n"+e._s(e.helpText)+"\n")]):e._e()],1)},s=[];n("e6cf"),n("ddb0"),n("cf57");const o=n("bc3a"),l=n("1712").to,c=n("ff00"),r=n("547a").default;var d={name:"Help",components:{},async created(){r.setSettings({TBURL:c["TB_URL"]}),r.setSettings(c);let[e,t]=await l(r.isLoggedIn());e?window.location.assign("#/"):([e,t]=await l(o.get("https://raw.githubusercontent.com/GospelSounders/usermanagement/master/README.md")),t&&(this.helpText=t.data),console.log(this.helpText))},data(){return{helpText:""}},methods:{}},i=d,p=n("2877"),u=n("9989"),g=n("eebe"),h=n.n(g),w=Object(p["a"])(i,a,s,!1,null,null,null);t["default"]=w.exports;h()(w,"components",{QPage:u["a"]})}}]);