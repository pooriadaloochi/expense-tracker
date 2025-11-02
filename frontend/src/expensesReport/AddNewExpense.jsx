import {
  Alert,
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import * as React from "react";
import { CloseIcon } from "../assets/icons/CloseIcon";
import NumberFormatTextField from "./NumberFormatTextField";

const ALL_CATEGORIES = [
  "خوراک و پوشاک",
  "مسافرت",
  "سرگرمی",
  "بهداشت",
  "آموزش",
  "خانه",
];

export default function AddNewExpense({ onSubmit, onClose }) {
  const [values, setValues] = React.useState({
    category: "",
    amount: "",
    description: "",
    date: "",
  });
  const [errors, setErrors] = React.useState({});
  const [toast, setToast] = React.useState({
    open: false,
    msg: "",
    severity: "success",
  });

  const handleChange = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (!values.category) er.category = "گروه هزینه را انتخاب کنید.";
    if (!values.amount) er.amount = "مبلغ را وارد کنید.";
    else if (isNaN(Number(values.amount)) || Number(values.amount) <= 0)
      er.amount = "مبلغ باید عددی بزرگتر از صفر باشد.";
    if (!values.date) er.date = "تاریخ را وارد کنید.";

    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...values,
      amount: Number(values.amount),
      submittedAt: new Date().toISOString(),
    };

    try {
      if (typeof onSubmit === "function") {
        onSubmit(payload);
      } else {
        console.log("Expense payload →", payload);
      }
      setToast({ open: true, msg: "Expense submitted!", severity: "success" });
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        msg: "خطا در ارسال هزینه. دوباره تلاش کنید.",
        severity: "error",
      });
    }
  };

  const handleReset = () => {
    setValues({
      category: "",
      amount: "",
      description: "",
      date: "",
    });
    setErrors({});
  };

  return (
    <Box
      sx={{ p: { xs: 1, sm: 2 }, display: "flex", justifyContent: "center" }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3 },
          width: "100%",
          maxWidth: 760,
          position: "relative",
        }}
      >
        {/* X Button for Closing */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
          }}
          size="small"
        >
          <CloseIcon />
        </IconButton>

        <form onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              ثبت هزینه جدید
            </Typography>
            <Typography variant="body2" color="text.secondary">
              لطفا اطلاعات مربوط به هزینه را وارد کنید. فیلدهای علامت‌گذاری شده
            </Typography>

            <Grid container spacing={2} width="100%">
              <Grid item width="100%">
                <TextField
                  label="گروه هزینه *"
                  select
                  name="category"
                  fullWidth
                  value={values.category}
                  onChange={handleChange("category")}
                  error={Boolean(errors.category)}
                  helperText={errors.category}
                >
                  {ALL_CATEGORIES.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item width="100%">
                <NumberFormatTextField
                  label="مبلغ *"
                  name="amount"
                  value={values.amount}
                  onChange={handleChange("amount")}
                  error={errors.amount}
                  helperText={errors.amount}
                />
              </Grid>

              <Grid item width="100%">
                <TextField
                  label="توضیحات"
                  fullWidth
                  name="description"
                  multiline
                  minRows={2}
                  value={values.description}
                  onChange={handleChange("description")}
                />
              </Grid>

              <Grid item width="100%">
                <TextField
                  label="تاریخ *"
                  type="date"
                  name="date"
                  fullWidth
                  value={values.date}
                  onChange={handleChange("date")}
                  error={Boolean(errors.date)}
                  helperText={errors.date}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            {/* Buttons */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              gap={3}
              justifyContent="flex-start"
            >
              <Button variant="contained" type="submit">
                ثبت هزینه
              </Button>

              <Button variant="contained" onClick={handleReset}>
                پاک کردن فرم
              </Button>

              <Button variant="contained" color="error" onClick={onClose}>
                انصراف
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
