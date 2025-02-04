import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axiosClient from "@/helpers/axios-client";
import { useAuthContext } from "@/contexts/stateContext";
import { Cost, Service } from "@/Types/types";
import { useBeforeUnload } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { useServiceStore } from "./ServiceStore";
import TdCell from "@/helpers/TdCell";
import DepositDialog from "@/components/DepositDialog";

function Services() {
  useEffect(() => {
    document.title = "الخدمات -";
  }, []);

  const {serviceList,addService,fetchData} = useServiceStore()
  const [update, setUpdate] = useState(0);
  useEffect(() => {
    fetchData()
  }, [update]);

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<Service>();

  const submitHandler = (data) => {
    addService(data);
    
  };
    const [selectedService, setSelectedService] = useState<Service|null>(null);
    const [showAddDepositDialog, setShowAddDepositDialog] = useState(false);
    const handleClose = () => {
      setShowAddDepositDialog(false);
      setUpdate((u) => u + 1);
    };
  
  return (
    <>
      <Grid container spacing={2}>
        <Grid item lg={3} xs={12}>
          <form onSubmit={handleSubmit(submitHandler)}>
            <TextField
             autoComplete="off"
             size="small"

              {...register("name", {
                required: {
                  value: true,
                  message: "الحقل مطلوب",
                },
              })}
              fullWidth
              label=" اسم الصنف"
              variant="outlined"
              name="name"
              error={errors.name != null}
              helperText={errors.name?.message}
              required
            />
            <Button sx={{mt:1}} fullWidth variant="contained" color="primary" type="submit">
              حفظ
            </Button>
          </form>
        </Grid>

        <Grid item lg={8} xs={12}>
          <Box sx={{ p: 1 }}>
            <Typography variant="h6" textAlign={"center"}>
              الخدمات
            </Typography>
            <Table size="small" style={{ direction: "rtl" }}>
              <TableHead>
                <TableRow>
                  <TableCell>اسم  </TableCell>
                  {/* <TableCell>سعر المنتج  </TableCell> */}
                  {/* <TableCell>الكميه المتوفره في المخزن  </TableCell> */}
                  {/* <TableCell>اضافه  </TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {serviceList.map((service: Service) => {
                  return (
                    <TableRow key={service.id}>
                      <TdCell item={service} colName={'name'}  table={`services`}>{service.name}</TdCell>
                      {/* <TdCell sx={{width:'50px'}} item={service} colName={'price'}  table={`services`}>{service.price}</TdCell> */}
                      {/* <TableCell>{service.inventory}</TableCell> */}
                      
                      {/* <TableCell>
                        
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => {
                            // handleAddCost(service);
                            setShowAddDepositDialog(true);
                            setSelectedService(service);
                          }}
                        >
                           اضافه كميه
                        </Button>
                   
                      </TableCell> */}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {selectedService && <DepositDialog
        update
        service={selectedService}
        open={showAddDepositDialog}
        handleClose={handleClose}
      />}
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default Services;
