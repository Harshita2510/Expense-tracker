const date=new Date();
var dat=document.querySelector("#date");
dat.value=date.getDate() + "/" + (date.getMonth()+1)  + "/" + date.getFullYear();
var form=document.querySelector("form");
var mop=document.querySelector("#mode-of-payment");
var inc=document.querySelector("#incomin");
var out=document.querySelector("#outgoing");
var fie=document.querySelector("#field");
var des=document.querySelector("#description");
var dis =document.querySelector("#table-body");
//array for storing data
var arr=[];



form.addEventListener('submit',function(){
    event.preventDefault();
    dis.innerHTML = ""; // Clear previously displayed rows

    //object
let entries={
    Datee:date.getDate() + "/" + (date.getMonth()+1)  + "/" + date.getFullYear(),
ModeOfPayment: mop.value,
Incoming: inc.value,
Outgoing: out.value,
Expense: fie.value,
Description : des.value
};
    arr.push(entries);

 //console.log(arr);
 arr.forEach(display);
form.reset();
 


})
function display(element){
    
    //problrm is direct esa nhi kar sakte so isliye dom manuplation add and deelte
    const elem=document.createElement("tr");
    elem.innerHTML=
   `<td> ${element.Datee}</td>
   <td> ${element.ModeOfPayment}</td>
<td> ${element.Incoming}</td>
<td> ${element.Outgoing}</td>
<td> ${element.Expense}</td>
<td> ${element.Description}</td>

   `
   dis.appendChild(elem);
}
