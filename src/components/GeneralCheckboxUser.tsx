import axiosClient from '@/helpers/axios-client';
import { Checkbox } from '@mui/material';
import React from 'react'

function GeneralCheckboxUser({setUpdater,selectedUser,setSelectedUser,isChecked,route_id,sub_route_id=null,path='routes'}) {
    const [checked, setChecked] = React.useState(isChecked);

    const handleChange = (event) => {
      setChecked(event.target.checked);
      axiosClient.patch(path,{add:event.target.checked,route_id:route_id,user_id:selectedUser.id,sub_route_id}).then(({data})=>{
        console.log(data,'setChecked')
        setSelectedUser(data.user)
        setUpdater((prev)=>prev+1)
   
      })
    };
  return (
    <Checkbox  checked={checked}  onChange={handleChange}/>
  )
}

export default GeneralCheckboxUser