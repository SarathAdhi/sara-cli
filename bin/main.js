import a from"figlet";import{promptOptions as b}from"./common/promptOptions.js";import{installFramework as c}from"./installFramework.js";import d from"gradient-string";export const main=async e=>{a("Sara CLI",function(b,a){console.log(d.pastel.multiline(a))}),await new Promise(a=>setTimeout(a,1e3));let{framework:f}=await b([{name:"framework",message:"Which framework would you like to use?",type:"list",choices:["React js","Next js"]},]);"React js"===f?c("react",e):c("next",e)}