import axiosClient from '@/helpers/axios-client'
import { Service } from '@/Types/types'
import { CircularProgress, TableCell } from '@mui/material'
import React, { useEffect, useState } from 'react'

function StatsTdCell({service_id,sx,update,customer}) {
    const [service,setService] = useState<Service|null>()
    const [loading,setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
        axiosClient.get(`service/${service_id}`).then(({data})=>{
            setService(data)
            setLoading(false)
        })
    },[update])
  return (
    <TableCell sx={sx}>
        {loading ? <CircularProgress/> : service?.deducts.filter((d)=>{
            if (customer) {
                return d.customer_id == customer.id
            }else{
                return true
            }
        }).reduce((prev,curr)=> prev + curr.quantity,0)}
    </TableCell>
  )
}

export default StatsTdCell