import React from "react";
let Dashboard = (props) =>{
    let a=  props.ke.map(e=>e.Incoming).reduce(add,0);
    let b=props.ke.map(ek=>ek.Outgoing).reduce(add,0);
    function add(accumulator,ele){
    let q=(parseInt(accumulator)|| 0)+(parseInt(ele)|| 0);
return q;
}
    return <> 
    <h4>Incoming</h4>
   {a}
    <h4>outgoing</h4>
     {b}
    <h4>total</h4>
    {a-b}
    </>
}
export default Dashboard