import axiosClient from "@/helpers/axios-client";
import TdCell from "@/helpers/TdCell";
import { ChildMeal, Meal } from "@/Types/types";
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Table,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Download, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import React from "react";

interface MealTableDataProps {
  data: ChildMeal[];
  setSelectedMeal: (d) => void;
  selectedMeal: Meal;
}

function MealChildrenTable({
  data,
  setSelectedMeal,
  selectedMeal,
}: MealTableDataProps) {
  const { t } = useTranslation('mealChildrenTable');

  const onDelete = (meal: ChildMeal) => {
    axiosClient.delete(`childMeals/${meal.id}`).then(({ data }) => {
      setSelectedMeal(data.data);
    });
  };

  return (
    <>
      <Tooltip title={t("add_services")}>
        <IconButton
          onClick={() => {
            axiosClient
              .post(`defineServices/${selectedMeal.id}`)
              .then(({ data }) => {
                setSelectedMeal(data.data);
              });
          }}
        >
          <Download />
        </IconButton>
      </Tooltip>

      <Table style={{ direction: "ltr" }} size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t("name")}</TableCell>
            <TableCell>{t("price")}</TableCell>
            <TableCell>-</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((meal) => (
            <TableRow key={meal.id}>
              <TdCell item={meal} colName="name" table="childMeals">
                {meal.service.name}
              </TdCell>
              <TdCell
                sx={{ width: "50px" }}
                item={meal}
                colName="price"
                isNum
                table="childMeals"
              >
                {meal.price}
              </TdCell>
              <TableCell>
                <IconButton
                  color="error"
                  onClick={() => onDelete(meal)}
                  size="small"
                >
                  <Trash2 size={18} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

export function MealChildrenTableMobile({
  data,
  setSelectedMeal,
  selectedMeal,
}: MealTableDataProps) {
  const { t } = useTranslation();

  const onDelete = (meal: ChildMeal) => {
    axiosClient.delete(`childMeals/${meal.id}`).then(({ data }) => {
      setSelectedMeal(data.data);
    });
  };

  return (
    <>
      <Tooltip title={t("add_services")}>
        <IconButton
          onClick={() => {
            axiosClient
              .post(`defineServices/${selectedMeal.id}`)
              .then(({ data }) => {
                setSelectedMeal(data.data);
              });
          }}
        >
          <Download />
        </IconButton>
      </Tooltip>

      <Table style={{ direction: "ltr" }} size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t("name")}</TableCell>
            <TableCell>{t("price")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((meal) => (
            <TableRow key={meal.id}>
              <TdCell item={meal} colName="name" table="childMeals">
                {meal.name}
              </TdCell>
              <TdCell
                sx={{ width: "60px", textAlign: "center" }}
                item={meal}
                colName="price"
                table="childMeals"
              >
                {meal.price}
              </TdCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

export default MealChildrenTable;
