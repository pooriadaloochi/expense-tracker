import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export default function ExpenseTable({ rows, columns }) {
  // محاسبه جمع کل ستون مبلغ
  const totalAmount = rows.reduce(
    (sum, row) => sum + Number(row.amount || 0),
    0
  );

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <DataGrid
        style={{
          marginTop: "20px",
          width: "100%",
          height: 550,
          margin: "auto",
        }}
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{
          boxShadow: 2,
          border: 2,
          borderRadius: 2,
          borderColor: "#e0e0e0",
          "& .MuiDataGrid-cell:hover": {
            color: "#f5f5f5",
          },
          direction: "ltr",
        }}
      />

      {/* 👇 بخش نمایش جمع کل پایین جدول */}
      <Box
        sx={{
          mt: 2,
          p: 2,
          borderTop: "1px solid #ddd",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          جمع کل: {totalAmount.toLocaleString()} ریال
        </Typography>
      </Box>
    </Box>
  );
}
