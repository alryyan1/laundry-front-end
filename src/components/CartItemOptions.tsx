import { IconButton } from '@mui/material'
import { Eye, Trash2 } from 'lucide-react'
import React from 'react'
import Incremenor from './Incremenor'
import { Mealorder, Order } from '@/Types/types';
import { ColorPicker, ColorPickerChangeEvent } from 'primereact/colorpicker';
interface CartItemOptionsPorbs {
    setColor: (color: string) => void;
    setShow: (show: boolean) => void;
    onDelete: (item: Mealorder) => void;
    item: Mealorder;
    show: boolean;
    updateQuantity: (item: Mealorder, quantity: number) => void;
    selectedOrder:Order;
    setSelectedOrder:()=>void
  
}
function CartItemOptions({setSelectedOrder,setShow,onDelete,item,show,updateQuantity,selectedOrder,setColor}:CartItemOptionsPorbs) {
  return (
    <div className="flex items-center  ">
    <ColorPicker  value={item?.color} onChange={(e:ColorPickerChangeEvent)=>{
        setColor(e.value)
      }} />
      <span className="w-16 text-center">{(item.totalPrice + (item.quantity * item.price)).toFixed(3) }</span>
      <IconButton disabled={selectedOrder.order_confirmed} color="error" onClick={() => onDelete(item)} size="small">
        <Trash2 size={18} />
      </IconButton>
      <IconButton onClick={()=>{
        setShow(!show)
      }}>
        <Eye/>
      </IconButton>

      <input  disabled={selectedOrder.order_confirmed} onFocus={(event) => {
        event.target.select();
      }} defaultValue={item.quantity} onChange={(e)=>{
        updateQuantity(e.target.value, item)
      }} style={{width:'50px'}} ></input>

    </div>
  )
}

export default CartItemOptions