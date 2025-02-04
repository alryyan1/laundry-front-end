import { Eye, Minus, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import {  Mealorder, Requestedchildmeal } from "../Types/types";

import {
  Slide,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import axiosClient from "@/helpers/axios-client";
interface RequestedServicesProbs {
 
    updateRequestedQuantity:(increment:boolean,requested:Requestedchildmeal) => void ;
    item:Mealorder;
    show:boolean;
    details?:boolean;
    setSelectedOrder:()=>void;
}
function RequestedServices({updateRequestedQuantity,item,show,setSelectedOrder,details=true}:RequestedServicesProbs) {
  const changeHandler = (val,requested)=>{
    axiosClient.patch(`RequestedChild/${requested.id}`,{
      count:val
    }).then(({data})=>{
        setSelectedOrder(data.order)
    })
  }

  return (
    <Slide unmountOnExit  in={show} >
          <div className="border-red-100 bg-blue-300 requested-meal p-2 rounded-md shadow-sm">
          <Table>
            <TableRow>
            <TableCell>الصنف </TableCell>
            <TableCell>السعر</TableCell>

            {/* <TableCell>الكميه</TableCell> */}
            {/* <TableCell>العدد</TableCell> */}
            {/* <TableCell>الاجمالي</TableCell> */}
            </TableRow>
            <TableBody>
              {item.requested_child_meals.map((requested) => (
                <TableRow key={requested.id}>
                  {/* <TableCell>{requested.order_meal.meal.name}</TableCell> */}
                  <TableCell>{requested.child_meal.service.name}</TableCell>
                 {details && <TableCell>{requested.child_meal.price}</TableCell>}

                  {/* <TableCell>{requested.child_meal.quantity}</TableCell> */}
                  {details &&     <TableCell className="text-center">
                    <Stack alignItems={'center'} direction={"row"} justifyContent={'center'}>
                      {/* <button
                        onClick={() => updateRequestedQuantity(false, requested)}
                        className="p-1 w-[25px] text-center bg-gray-100 rounded"
                      >
                        <Minus size={16} />
                      </button> */}
                      {/* <span className=" text-center p-1">
                        
                        <input type="text" style={{width:'50px'}}  onFocus={(event) => {
        event.target.select();
      }} onChange={(e)=>changeHandler(e.target.value,requested)} defaultValue={requested.quantity}/>

                      </span> */}
                      {/* <button
                        onClick={() => updateRequestedQuantity(true, requested)}
                        className="p-1 w-[25px] text-center bg-gray-100 rounded"
                      >
                        <Plus size={16} />
                      </button> */}
                    </Stack>
                  </TableCell>}
                  {/* {details &&     <TableCell>
                    {(requested.child_meal.price * requested.count).toFixed(3)}   
                  </TableCell>} */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        </Slide>
  )
}

export default RequestedServices