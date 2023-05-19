import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import BackArrow from "../../components/BackArrow";
import _ from "lodash";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../services/authAPI";
import { USER_INFO_KEY } from "../../utils/contants";

const theme = createTheme();

export default function UserLogin() {
  const [loginError, setLoginError] = React.useState({
    status: false,
    error: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userName = data.get("userName");
    const password = data.get("password");
    const checkNull = _.compact([userName, password]);

    if (checkNull.length < 2) {
      setLoginError({ status: true, error: "Dữ liệu không được để trống" });
      return;
    }

    const loginRes = await authAPI.login({ userName, password });

    if (loginRes?.success) {
      const payload = loginRes?.payload;

      localStorage.setItem(
        USER_INFO_KEY,
        JSON.stringify({
          email: payload?.email,
          type: payload?.type,
          _id: payload?._id,
        })
      );

      toast.success(
        "Bạn đã đăng nhập thành công, chuyển hướng sang trang chính sau 2 giây"
      );

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } else {
      toast.error(
        loginRes?.error || "Bạn đã đăng nhập thất bại, vui lòng thử lại sau"
      );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <BackArrow />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Đăng nhập
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  id="userName"
                  name="userName"
                  required
                  fullWidth
                  label="Tên đăng nhập"
                  placeholder="Nhập vào tên đăng nhập"
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  id="password"
                  name="password"
                  required
                  fullWidth
                  label="Mật khẩu"
                  placeholder="Nhập vào mật khẩu"
                  type={"password"}
                />
              </Grid>
              {loginError?.status && (
                <Grid item xs={12}>
                  <p style={{ color: "red", margin: 0 }}>{loginError?.error}</p>
                </Grid>
              )}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Đăng nhập
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Bạn chưa có tài khoản? Đăng kí"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
