import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useMediaQuery,
  IconButton,
  Tooltip,
  TextField,
  Stack,
} from "@mui/material";
import { Order } from "@/Types/types";
import { StatusChip } from "./StatusShip";
import { UpdateOrderDialog } from "./UpdateOrderDialog";
import dayjs from "dayjs";
import TdCell from "@/helpers/TdCell";
import StatusSelector from "@/components/StatusSelector";
import BasicPopover from "@/components/Mypopover";
import MyDateField2 from "@/components/MYDate";
import { OrderMealsTable } from "@/components/MealChildrenTable";
import MyTableCellStatusSelector from "@/components/MyTableCellStatusSelector";
import { useTranslation } from "react-i18next";
import { OrderDetails } from "./types";
import { OrderDetailsPopover } from "@/components/OrderDetails";
import { LoadingButton } from "@mui/lab";
import axiosClient from "@/helpers/axios-client";
import DeductDialog from "@/components/DeductDialog";
import { Settings } from "lucide-react";
import SettingsDialog from "@/components/SettingsDialog";
import { CustomerForm } from "../Customer/CutomerForm";
import { useOutletContext } from "react-router-dom";
import { WhatsApp } from "@mui/icons-material";
import { toast } from "react-toastify";

interface OrderTableProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

export const OrderTable = ({ orders, setOrders }: OrderTableProps) => {
  const isMobile = useMediaQuery("(max-width:600px)"); // adjust based on screen size
  const { t } = useTranslation("orderTable");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  // const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filterById, setFilterById] = useState(null);
  const { selectedOrder, setSelectedOrder } = useOutletContext();

  const handleClose = () => {
    setOpen(false);
    setIsFormOpen(false);
  };
  const handleCloseSettingsDialog = () => {
    setOpenSettings(false);
    setSelectedOrder(null);
  };
  const deliveryHandler = (order: Order) => {
    setSelectedOrder(order);
    //  setOpen(true);
    setLoading(true);
    axiosClient
      .patch(`orders/${order.id}`, {
        status: order.status == "delivered" ? "cancelled" : "delivered",
      })
      .then(({ data }) => {
        console.log("order delivered", data);
        setOrders((prev) => {
          return prev.map((o) => (o.id === order.id ? data.order : o));
        });
      })
      .finally(() => setLoading(false));
  };
  const completeHandler = (order: Order) => {
    setSelectedOrder(order);
    //  setOpen(true);
    setLoading(true);
    axiosClient
      .patch(`orders/${order.id}`, {
        complete: 1,
      })
      .then(({ data }) => {
        console.log("order delivered", data);
        if (data.whatsapp.message == "ok") {
          toast.success(`Whatsapp sent - ${data?.whatsapp?.message}` , {
            style: { width: "200px" }, // Adjust width here
          });
        } else {
          toast.error(data?.whatsapp?.message ?? " ", {
            style: { width: "200px" }, // Adjust width here
          });
        }
        setOrders((prev) => {
          return prev.map((o) => (o.id === order.id ? data.order : o));
        });
      })
      .finally(() => setLoading(false));
  };
  orders = orders.filter((o) => {
    if (filterById) {
      return o.id.toString().includes(filterById);
    } else {
      return true;
    }
  });
  return (
    <>
      <Paper>
        <TableContainer
          sx={{
            overflowX: "auto",
            width: isMobile ? "500px" : "auto",
          }}
        >
          <Table className=" border border-collapse order-table" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "30px" }}>
                  <Tooltip title={t("orderTable.orderNumber")}>
                    <TextField
                      autoComplete="off"
                      placeholder={t("orderTable.orderNumber")}
                      onChange={(e) => {
                        setFilterById(e.target.value);
                      }}
                    />
                  </Tooltip>
                </TableCell>
                <TableCell>{t("orderTable.customer")}</TableCell>
                {/* <TableCell>{t("orderTable.area")}</TableCell> */}
                <TableCell>{t("orderTable.status")}</TableCell>
                <TableCell>{t("orderTable.total")}</TableCell>
                <TableCell width={"5%"}>{t("discount")}</TableCell>
                <TableCell width={"5%"}>{t("orderTable.paid")}</TableCell>
                <TableCell width={"5%"}>{t("remaining")}</TableCell>
                <TableCell>{t("orderTable.orderDate")}</TableCell>
                {/* <TableCell>{t("orderTable.deliveryDate")}</TableCell> */}
                <TableCell>{t("changeState")}</TableCell>
                <TableCell>{t("settings")}</TableCell>
                {/* <TableCell>{t("orderTable.deliveryLocation")}</TableCell> */}
                {/* <TableCell>{t("orderTable.notes")}</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {orders
                .filter((o) => {
                  // if (selectedOrder) {

                  //   return  o.id == selectedOrder?.id
                  // }else{
                  //   return true
                  // }
                  return true;
                })
                .map((order) => (
                  <TableRow key={order.updated_at} hover>
                    <TableCell sx={{ width: "30px" }}>
                      <BasicPopover
                        truncate={false}
                        title={order.id}
                        content={<OrderDetailsPopover order={order} />}
                      />
                    </TableCell>
                    <TableCell sx={{ textWrap: "nowrap" }}>
                      {order?.customer?.name}
                    </TableCell>
                    {/* <TableCell>{order?.customer?.area}</TableCell> */}
                    <MyTableCellStatusSelector
                      order={order}
                      setSelectedOrder={null}
                    />
                    <TableCell>{order.totalPrice.toFixed(3)}</TableCell>
                    <TdCell
                      setOrders={setOrders}
                      isNum
                      sx={{ width: "50px" }}
                      table={"orders"}
                      item={order}
                      colName={"discount"}
                    >
                      {Number(order.discount).toFixed(3)}
                    </TdCell>{" "}
                    <TdCell
                      setOrders={setOrders}
                      isNum
                      sx={{ width: "50px" }}
                      table={"orders"}
                      item={order}
                      colName={"amount_paid"}
                    >
                      {Number(order.amount_paid).toFixed(3)}
                    </TdCell>
                    <TableCell
                      sx={
                        order.totalPrice - order.discount - order.amount_paid >
                        0
                          ? { color: "red" }
                          : null
                      }
                    >
                      {(
                        order.totalPrice -
                        order.discount -
                        order.amount_paid
                      ).toFixed(3)}
                    </TableCell>
                    <TableCell sx={{ textWrap: "nowrap" }}>
                      {dayjs(new Date(order.created_at)).format(
                        "YYYY-MM-DD HH:mm A"
                      )}
                    </TableCell>
                    {/* <TableCell>
                    <MyDateField2
                      path={`orders`}
                      item={order}
                      colName="delivery_date"
                      val={order.delivery_date}
                      label={t("orderTable.deliveryDate")}
                    />
                  </TableCell> */}
                    <TableCell>
                      <Stack direction="row" gap={1}>
                        <LoadingButton
                          loading={loading}
                          onClick={() => {
                            completeHandler(order);
                          }}
                          size="small"
                          variant="contained"
                          color={order.complete ? "success" : "inherit"}
                        >
                          {t("complete")}
                        </LoadingButton>
                        <LoadingButton
                          loading={loading}
                          onClick={() => {
                            deliveryHandler(order);
                          }}
                          size="small"
                          variant="contained"
                          color={
                            order.status == "delivered" ? "error" : "inherit"
                          }
                        >
                          {order.status == "delivered"
                            ? t("cancel")
                            : t("delivery")}
                        </LoadingButton>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="اعدادات الطلب" content="اعدادات الطلب">
                        <IconButton
                          onClick={() => {
                            setSelectedOrder(order);
                            setOpenSettings(true);
                          }}
                        >
                          <Settings />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="whatsapp">
                        <IconButton
                          color={order.whatsapp ? "success" : "error"}
                        >
                          <WhatsApp />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    {/* <TableCell>{order.delivery_address}</TableCell> */}
                    {/* <TableCell>{order.notes}</TableCell> */}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        {selectedOrder && (
          <DeductDialog
            setSelectedOrder={setSelectedOrder}
            selectedOrder={selectedOrder}
            open={open}
            handleClose={handleClose}
          />
        )}
        {selectedOrder && (
          <SettingsDialog
            setOrders={setOrders}
            setIsFormOpen={setIsFormOpen}
            setSelectedOrder={setSelectedOrder}
            selectedOrder={selectedOrder}
            open={openSettings}
            handleClose={handleCloseSettingsDialog}
          />
        )}
        {selectedOrder && (
          <CustomerForm open={isFormOpen} onClose={handleClose} />
        )}
      </Paper>
    </>
  );
};
