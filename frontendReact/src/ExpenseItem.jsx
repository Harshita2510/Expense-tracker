import "tailwindcss";
import React from "react";
import './index.css';


const ExpenseItem=(props)=>{
return ( <table className=" w-full table-fixed border-[3px] border-purple-700 border-collapse ">
            <thead >
                <tr >
                <th>Date</th>
                <th> mode of payment</th>
                <th>
                    incomin
                </th>
                <th>
                    outgoing
                </th>
                <th>
                    field
                </th>
                <th>
                    description
                </th>
                </tr>
            </thead>
            <tbody > 
            
                {props.k.map((element,index)=>{
                    return(
                    <tr key={index} className=" w-full table-fixed border-[3px] border-purple-700 border-collapse pt-20px text-center
">
                         <td> {element.Datee}</td>
   <td> {element.ModeOfPayment}</td>
   <td> {element.Incoming}</td>
<td> {element.Outgoing}</td>
<td> {element.Expense}</td>
<td> {element.Description}</td>



                    </tr>)
                    })}
    
            </tbody>
            <tfoot >
                <tr id="table-foot">

                </tr>
            </tfoot>
            </table>
)
       
}
export default ExpenseItem