import DepositDialog from "@/components/DepositDialog";
import axiosClient from "@/helpers/axios-client";
import { useCategoryStore } from "@/stores/CategoryStore";
import {
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { Stack } from "@mui/system";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCustomerStore } from "./Customer/useCustomer";
import { Customer } from "@/Types/types";
import DeductDialogStats from "@/components/DeductDialogStats";
import StatsTdCell from "./StatsTdCell";
import StatsTdCellAvailableInStore from "./StatsTdCellAvailableInStore";
import StatsTdCellSales from "./StatsTdCellSales";

function Stats() {
  const { t } = useTranslation('stats'); // Using the i18n hook for translations
  const [searchQuery, setSearchQuery] = useState("");
  const [search, setSearch] = useState("");
  let [data, setData] = useState([]);
  const [childName, setChildName] = useState("");
  const [mealName, setMealName] = useState("");
  const [childId, setChildId] = useState(null);
  const [update, setUpdate] = useState(0);
  const [showAddDepositDialog, setShowAddDepositDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const {fetchData ,customers} = useCustomerStore()
    useEffect(() => {
      fetchData();
    }, [update]);
  const handleClose = () => {
    setShowAddDepositDialog(false);
    setUpdate((u) => u + 1);
  };

  useEffect(() => {
    axiosClient.post(`orderMealsStats?date=${searchQuery}`,{
      customer:selectedCustomer?.id
    }).then(({ data }) => {
      setData(data);
    });
  }, [searchQuery, update,selectedCustomer]);

  data = data.filter((d) => {
    return (
      d.childName.toLowerCase().includes(search.toLowerCase()) ||
      d.mealName.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer>
        <Stack sx={{ mt: 1, mb: 1 }} direction="row" spacing={2}>
          {/* <input
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            type="date"
          /> */}
          <TextField
            label={t("search")} // Translated label for 'Search'
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            size="small"
          />
          <Stack direction={'row'} gap={1}>
                   {customers.filter((c)=>c.is_store).map((s) => (
                <Chip
                  sx={{fontFamily:'cairo'}}
                  color={s.id === selectedCustomer?.id ? "primary" : "default"}
                  variant={s.id === selectedCustomer?.id ? "filled" : "outlined"}
                  key={s.id}
                  onClick={() => setSelectedCustomer(s)}
                  label={s.name} // Translate statuses
                />
              ))}
                </Stack>
        </Stack>

        <Table sx={{fontSize:'24px'}} size="small" className="order-table" stickyHeader>
          <TableHead>
            <TableRow>
              {/* <TableCell sx={{fontSize:'24px'}}>{t("meal_name")}</TableCell> */}
              <TableCell sx={{fontSize:'24px'}} >{t("child_name")}</TableCell>
              <TableCell sx={{fontSize:'24px'}}>{t("requested_quantity")}</TableCell>
              <TableCell sx={{fontSize:'24px'}}>{t("available_quantity")}</TableCell>
              <TableCell sx={{fontSize:'24px'}}>{t("deducted_quantity")}</TableCell>
              <TableCell sx={{fontSize:'24px'}}>{t("net_quantity")}</TableCell>
              <TableCell sx={{fontSize:'24px'}}>{t("remaining_quantity")}</TableCell>
              <TableCell sx={{fontSize:'24px'}}>{t("add_quantity")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((info, index) => {
              let remaining = info.totalDeposit - info.totalQuantity;
              return (
                <TableRow
                  key={index}
                  className={`hover:bg-slate-200 ${
                    remaining < 0 ? "" : "bg-green-300"
                  }`}
                >
                  {/* <TableCell sx={{fontSize:'24px'}}>{info.mealName}</TableCell> */}
                  <TableCell sx={{fontSize:'24px'}}>{info.childName}</TableCell>
                  <TableCell sx={{fontSize:'24px'}}>{info.totalQuantity}</TableCell>
                  <StatsTdCell customer={selectedCustomer} update={update} sx={{fontSize:'24px'}} service_id={info.serviceId}></StatsTdCell>
                  <StatsTdCellAvailableInStore  update={update} sx={{fontSize:'24px'}} service_id={info.serviceId} total={info.totalQuantity}></StatsTdCellAvailableInStore>
                  <TableCell sx={{fontSize:'24px'}}>{info.totalDeposit - info.totalQuantity}</TableCell>
                  <StatsTdCellSales  update={update} sx={{fontSize:'24px'}} service_id={info.serviceId} price={info.totalQuantity}></StatsTdCellSales>

                  <TableCell sx={{fontSize:'24px'}}>
                    <Button
                     disabled={selectedCustomer == null}
                      variant="contained"
                      size="small"
                      className="hover:bg-slate-600 hover:text-white"
                      onClick={() => {
                        setShowAddDepositDialog(true);
                        setChildId(info.serviceId);
                        setChildName(info.childName);
                        setMealName(info.mealName);
                      }}
                    >
                      <Plus />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
     {selectedCustomer && <DeductDialogStats
        update
        name={childName}
        customer={selectedCustomer}
        service_id={childId}
        open={showAddDepositDialog}
        handleClose={handleClose}
      />}
    </Paper>
  );
}

export default Stats;
