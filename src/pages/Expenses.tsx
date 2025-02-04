import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import AddCostForm from "@/components/forms/cost";
import axiosClient from "@/helpers/axios-client";
import { useAuthContext } from "@/contexts/stateContext";
import { Cost } from "@/Types/types";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { webUrl } from "@/helpers/constants";

function CashDenos() {
  const { t } = useTranslation('cost'); // Use the translation hook for dynamic text
  const { data, setData, deleteItem } = useAuthContext();
  const [loading,setLoading] = useState(false);
  const searchHandler = () => {
    setLoading(true);
    const firstDayjs = firstDate.format("YYYY/MM/DD");
    const secondDayjs = secondDate.format("YYYY/MM/DD");
    axiosClient
      .post(`getAllCosts`, {
        first: firstDayjs,
        second: secondDayjs,
      })
      .then(({ data }) => {
        console.log(data);
        setData(data);
    
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const [firstDate, setFirstDate] = useState(dayjs(new Date()));
  const [secondDate, setSecondDate] = useState(dayjs(new Date()));
  useEffect(() => {
    document.title = t("cash_denominations"); // Dynamic page title
  }, [t]);

  useEffect(() => {
    axiosClient.post<Cost[]>(`getAllCosts`,{
      date : dayjs(new Date()).format('YYYY-MM-DD'),
    }).then(({ data }) => {
      setData(data);
    });
  }, []);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item lg={3} xs={12}>
          <AddCostForm />
        </Grid>
        <Grid item lg={8} xs={12}>
        <Stack direction={"row"} alignItems={'center'} justifyContent={"space-between"}>
            <Box>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateField
                  format="YYYY-MM-DD"
                  onChange={(val) => {
                    setFirstDate(val);
                  }}
                  defaultValue={dayjs(new Date())}
                  sx={{ m: 1 }}
                  label="From"
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateField
                  format="YYYY-MM-DD"

                  onChange={(val) => {
                    setSecondDate(val);
                  }}
                  defaultValue={dayjs(new Date())}
                  sx={{ m: 1 }}
                  label="To"
                />
              </LocalizationProvider>
              <LoadingButton
                onClick={searchHandler}
                loading={loading}
                sx={{ mt: 2 }}
                size="medium"
                variant="contained"
              >
                Go
              </LoadingButton>
            </Box>
        

            <Button
            variant="contained"
              href={`${webUrl}cost?first=${firstDate.format(
                "YYYY/MM/DD"
              )}&second=${secondDate.format("YYYY/MM/DD")}`}
            >
              PDF
            </Button>
          </Stack>
          <Box sx={{ p: 1 }}>
            <Typography variant="h6" textAlign={"center"}>
              {t("expenses")} {/* Translated 'المصروفات' */}
            </Typography>
            <Table size="small" style={{ direction: "rtl" }}>
              <TableHead>
                <TableRow>
                  <TableCell>{t("description")}</TableCell>
                  <TableCell>{t("category")}</TableCell>
                  <TableCell>{t("date")}</TableCell>
                  <TableCell>{t("amount")}</TableCell>
                  <TableCell>{t("delete")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((cost: Cost) => (
                  <TableRow key={cost.id}>
                    <TableCell>{cost.description}</TableCell>
                    <TableCell>{cost?.cost_category?.name}</TableCell>
                    <TableCell>{dayjs(cost?.created_at).format('YYYY-MM-DD')}</TableCell>
                    <TableCell>{cost.amount}</TableCell>
                    <TableCell>
                      <LoadingButton
                        onClick={() => {
                          axiosClient.delete(`costs/${cost.id}`).then(({ data }) => {
                            deleteItem(data.data);
                          });
                        }}
                      >
                        {t("delete")}
                      </LoadingButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default CashDenos;
