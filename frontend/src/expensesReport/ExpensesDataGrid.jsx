import { Button, Modal, Popover, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { useCallback, useEffect, useRef, useState } from "react";
import { fetchJSON } from "../api";
import AddNewExpense from "./AddNewExpense";
import ExpenseTable from "./ExpenseTable";
import Summary from "./Summary";

export default function ExpensesDataGrid() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const anchorEl = useRef(null);
  const [openPopover, setOpenPopover] = useState(false);
  const deleteId = useRef(null);

  const getRows = useCallback(async () => {
    try {
      const data = await fetchJSON("expenses");
      setRows(data);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    }
  }, []);

  const deleteUser = async () => {
    if (deleteId.current == null) return;
    await fetchJSON(`expenses/${deleteId.current}`, {
      method: "DELETE",
    });
    deleteId.current = null;
    setOpenPopover(false);
    getRows();
  };

  const columns = [
    { field: "id", headerName: "شناسه", width: 70 },
    {
      field: "category",
      headerName: "گروه",
      width: 130,
      flex: 1.5,
      minWidth: 130,
    },
    {
      field: "amount",
      headerName: "مبلغ",
      width: 100,
      flex: 1.5,
      minWidth: 100,
      renderCell: (params) => {
        const amount = Number(params.value).toLocaleString("fa-IR");
        return `${amount} ریال`;
      },
    },
    { field: "description", headerName: "توضیحات", flex: 3, minWidth: 150 },
    { field: "date", headerName: "تاریخ", flex: 1.5, minWidth: 120 },
    {
      field: "actions",
      type: "actions",
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<img src="/trash.png" alt="Delete" width={25} height={25} />}
          label="حذف"
          onClick={() => {
            deleteId.current = params.id;
            setOpenPopover(true);
          }}
        />,
      ],
    },
  ];

  useEffect(() => {
    getRows();
  }, [getRows]);

  const handleSubmit = async (newExpense) => {
    await fetchJSON("expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newExpense),
    });
    setOpen(false);
    getRows();
  };

  return (
    <Paper
      sx={{
        width: "100%",
        height: "97dvh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingTop: "20px",
        spacing: 2,
        gap: 2,
      }}
    >
      <Stack
        sx={{
          width: "35%",
          boxShadow: 2,
          border: 1,
          borderRadius: 2,
          borderColor: "#e0e0e0",
        }}
      >
        <Summary rows={rows} />
      </Stack>
      <Stack
        sx={{
          width: "65%",
          height: "91dvh",
          padding: "20px",
          marginLeft: "20px",
          borderRadius: 2,
          boxShadow: 2,
          border: "1px solid #e0e0e0",
          display: "flex",
          flexDirection: "column",
          alignItems: "end",
        }}
      >
        <Button
          onClick={() => setOpen(true)}
          variant="contained"
          sx={{ width: "200px", height: "40px" }}
        >
          اضافه هزینه جدید
        </Button>

        <ExpenseTable rows={rows} columns={columns} />
      </Stack>

      <Modal open={open} onClose={() => setOpen(false)} closeAfterTransition>
        <AddNewExpense onSubmit={handleSubmit} onClose={() => setOpen(false)} />
      </Modal>
      <Popover
        open={openPopover}
        anchorEl={anchorEl}
        onClose={() => {
          deleteId.current = null;
          setOpenPopover(false);
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Typography sx={{ p: 2 }}>آیا از حذف این مورد مطمئن هستید؟</Typography>
        <Stack
          direction="row"
          spacing={2}
          sx={{ p: 2 }}
          display="flex"
          justifyContent="space-between"
        >
          <Button variant="contained" color="error" onClick={deleteUser}>
            حذف
          </Button>
          <Button
            variant="outlined"
            onClick={() => setOpenPopover(false)}
            sx={{ marginRight: "auto" }}
          >
            انصراف
          </Button>
        </Stack>
      </Popover>
    </Paper>
  );
}
