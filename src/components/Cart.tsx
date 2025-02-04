import React, { useEffect, useState } from "react";
import { Meal, Mealorder, Order, Requestedchildmeal } from "@/Types/types";
import axiosClient from "@/helpers/axios-client";
import { LoadingButton } from "@mui/lab";
import "./../magicCard.css";
import { Box, Stack } from "@mui/system";
import CartItem from "./CartItem";
import { Plus, ShoppingCart } from "lucide-react";
import { Autocomplete, Button, Divider, TextField, Typography } from "@mui/material";
import { Notes } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";

interface CartProps {
  selectedOrder: Order;
  setSelectedOrder: (order) => void;
  printHandler: () => void;
}

function Cart({ selectedOrder, setSelectedOrder, printHandler }: CartProps) {
  const { t } = useTranslation("cart"); // Using the i18n translation hook
  const [colName, setColName] = useState("");
  const [selectedMeal,setSelectedMeal]= useState<Meal|null>(null)
  const [val, setVal] = useState("");


  const updateMealOrderQuantity = (count: number, item: Mealorder) => {
    axiosClient
      .patch(`orderMeals/${item.id}`, {
        quantity: count,
      })
      .then(({ data }) => {
        setSelectedOrder(data.order);
      });
  };

  const orderUpdateHandler = () => {
    axiosClient
      .patch(`orders/${selectedOrder.id}`, {
        order_confirmed: 1,
      })
      .then(({ data }) => {
        if (data.status) {
          axiosClient.post(`orderConfirmed/${selectedOrder.id}`);
          printHandler();
        }
        setSelectedOrder(data.order);
        // setTimeout(() => {
        //   setSelectedOrder(null);
        // }, 300);
      });
  };

  const orderItemUpdateHandler = (val, orderMeal, colName = "delivery_fee") => {
    axiosClient
      .patch(`orders/${orderMeal.id}`, {
        [colName]: val,
      })
      .then(({ data }) => {
        setSelectedOrder(data.order);
      });
  };
 
  useEffect(() => {
    if (colName !='') {
          const timer = setTimeout(() => {
      orderItemUpdateHandler(val, selectedOrder, colName);
    }, 400);
    return () => clearTimeout(timer);
    }

  }, [val]);
  const mealOrderHandler = ()=>{
      axiosClient.post('orderMeals',{
        order_id:selectedOrder?.id,
        meal_id:selectedMeal?.id,
        quantity:1,
        price:selectedMeal?.price
      }).then(({data})=>{
        setSelectedOrder(data.order)
        // setMealOrder(data.mealOrder)
          // console.log(data)
      })
   }
   const {meals} = useOutletContext()
  return (
    <div className="cart-items-div flex justify-center  ">
      <Stack
        className="shadow-lg overflow-auto h-[calc(100vh-200px)]"
        direction={"column"}
        // justifyContent={"space-between"}
        sx={{
          p: 2,
        }}
        gap={1}
      >
        <Stack direction={'row'} gap={1}>
          <Autocomplete onChange={(e,val)=>{
            setSelectedMeal(val)
          }} fullWidth getOptionLabel={(op)=>op.name} renderInput={(params)=>{
          return <TextField label='المنتجات' {...params}/>
        }}  options={meals}/>
        <Button disabled={selectedOrder?.order_confirmed} onClick={()=>{
          mealOrderHandler()
        }} variant="contained"><Plus/></Button>
        </Stack>
        
        <Typography variant="h4" textAlign={'center'}>الطلبات</Typography>
        <div className="space-y-4 mb-6 grid">
          {selectedOrder.meal_orders.map((item) => {
            const isMultible = item.quantity > 1 ? "" : "";
            return (
              <CartItem
               selectedOrder={selectedOrder}
                updateRequestedQuantity={updateMealOrderQuantity}
                setSelectedOrder={setSelectedOrder}
                updateQuantity={updateMealOrderQuantity}
                isMultible={isMultible}
                item={item}
              />
            );
          })}
        </div>

       {selectedOrder.meal_orders.length > 0 &&  <div>
          <Box>
            <TextField
              autoComplete="off"
              variant="standard"
              fullWidth
              label={t("notes")}
              key={selectedOrder.id}
              onChange={(e) => {
                setColName("notes");
                setVal(e.target.value);
              }}
              defaultValue={selectedOrder.notes}
            ></TextField>
          </Box>
          <Box>
            <TextField
              autoComplete="off"
              variant="standard"
              fullWidth
              label={t("delivery_address")}
              key={selectedOrder.id}
              onChange={(e) => {
                setColName("delivery_address");


                setVal(e.target.value);
              }}
              defaultValue={selectedOrder.delivery_address}
            ></TextField>
          </Box>
          <div className="space-y-2 text-sm mb-6 mt-4">
            <Stack direction={"row"} gap={2} justifyContent={'space-around'}>
              <Stack direction={"column"} gap={1}>
                <span className="text-gray-600">{t("total_amount")}</span>
                <span className="text-gray-900">
                  {selectedOrder.totalPrice.toFixed(3)}
                </span>
              </Stack>



              <Stack direction={'column'}>
                <span className="text-gray-600">{t("paid")}</span>
                <span className="text-gray-900">
                  {selectedOrder.amount_paid.toFixed(3)}
                </span>
              </Stack >
              <Stack direction={'column'}>
                <span className="text-gray-600">{t("discount")}</span>
                <span className="text-gray-900">
                  {selectedOrder.discount.toFixed(3)}
                </span>
              </Stack >
              <Stack direction={'column'}>
             {selectedOrder.is_delivery && <span className="text-gray-900">
              <span className="text-gray-600">{t("delivery_fee")}</span>
                <TextField
                 onFocus={(event) => {
                  event.target.select();
                }}
                  type="number"
                  key={selectedOrder.id}
                  variant="standard"
                  sx={{ width: "50px", direction: "ltr" }}
                  onChange={(e) => {
                    orderItemUpdateHandler(e.target.value, selectedOrder);
                  }}
                  defaultValue={selectedOrder.delivery_fee}
                ></TextField>
                <span>{t("currency_OMR")}</span>
              </span> }
              </Stack >
            </Stack>

          
          </div>
          <Box className="flex justify-center">
            <LoadingButton
              disabled={selectedOrder.order_confirmed}
              onClick={orderUpdateHandler}
              variant="contained"
              sx={{}}
            >
              {t("confirm_order")}
            </LoadingButton>
          </Box>
        </div>}
      </Stack>
    </div>
  );
}

export default Cart;
