import React from 'react'
import BasicPopover from './Mypopover'
import { Stack } from '@mui/material'
import { IconButton } from '@mui/material'
import { Eye, Trash2 } from 'lucide-react'
import Incremenor from './Incremenor'
import { Mealorder } from '@/Types/types';
interface CartItemOptionsPorbs {
    setColor: (color: string) => void;
    setShow: (show: boolean) => void;
    onDelete: (item: Mealorder) => void;
    item: Mealorder;
    show: boolean;
    updateQuantity: (item: Mealorder, quantity: number) => void;
  
}
function CartItemOptionsMobile({setShow,onDelete,item,show,updateQuantity}:CartItemOptionsPorbs) {
  return (
    <BasicPopover title='options' content={<Stack>
    {/* <ColorPicker value={item.color} onChange={(e:ColorPickerChangeEvent)=>{
        setColor(e.value)
      }} /> */}
      <span className="w-16 text-center">{(item.totalPrice * item.quantity).toFixed(3) }</span>
      <IconButton color="error" onClick={() => onDelete(item)} size="small">
        <Trash2 size={18} />
      </IconButton>
      <IconButton onClick={()=>{
        setShow(!show)
      }}>
        <Eye/>
      </IconButton>

 
      <Incremenor updateQuantity={updateQuantity} requested={item} />

    </Stack>} />
  )
}

export default CartItemOptionsMobile