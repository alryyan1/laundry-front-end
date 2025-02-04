
import axiosClient from '@/helpers/axios-client'
import { Service } from '@/Types/types'
import { CircularProgress, TableCell } from '@mui/material'
import React, { useEffect, useState } from 'react'

function StatsTdCellAvailableInStore({service_id,sx,total,update}) {
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
        {loading ? <CircularProgress/> : (total -  service?.sold)}
    </TableCell>
  )
}

export default StatsTdCellAvailableInStore