import React, { useState } from "react";
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
import { authAPI } from "../../services/authAPI";
import { useNavigate } from "react-router-dom";
import { hasNumber, validateEmail } from "../../utils/helpers";

const theme = createTheme();

export default function UserSignUp() {
  const [registerError, setResgisterError] = useState({
    status: false,
    error: "",
  });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const checkNull = _.compact([
      firstName,
      lastName,
      email,
      userName,
      password,
      confirmPassword,
    ]);

    if (checkNull?.length < 5) {
      return setResgisterError({
        status: true,
        error: "Dữ liệu không được để trống",
      });
    }

    if (userName?.trim()?.length < 2) {
      return setResgisterError({
        status: true,
        error: "Tên đăng nhập không được dưới 2 kí tự",
      });
    }

    if (hasNumber(firstName) || hasNumber(lastName)) {
      return setResgisterError({
        status: true,
        error: "Họ và tên không được chứa kí tự số",
      });
    }

    if (!validateEmail(email)) {
      return setResgisterError({
        status: true,
        error: "Email không đúng định dạng",
      });
    }

    if (password?.length < 6) {
      return setResgisterError({
        status: true,
        error: "Mật khẩu cần ít nhất 6 kí tự",
      });
    }

    if (password !== confirmPassword) {
      return setResgisterError({
        status: true,
        error: "Mật khẩu nhập lại không chính xác",
      });
    }

    setResgisterError({
      status: false,
      error: "",
    });

    const registerRes = await authAPI.signup({
      firstName,
      lastName,
      email,
      userName,
      password,
    });

    if (registerRes?.success) {
      toast.success(
        "Đăng kí tài khoản thành công, bạn sẽ chuyển hướng sang trang đăng nhập sau 2 giây"
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      toast.error(registerRes?.error || "Đăng kí tài khoản thất bại");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <BackArrow />
      <Container component="main" maxWidth="xs" sx={{marginBottom: '70px'}}>
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
            Đăng ký
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="Họ"
                  autoFocus
                  onChange={(event) => setFirstName(event.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Tên"
                  name="lastName"
                  autoComplete="family-name"
                  onChange={(event) => setLastName(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  onChange={(event) => setEmail(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="userName"
                  label="Tên đăng nhập"
                  name="userName"
                  autoComplete="userName"
                  onChange={(event) => setUserName(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Mật khẩu"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={(event) => setPassword(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="comfirm_password"
                  label="Nhập lại mật khẩu"
                  type="password"
                  id="comfirm_password"
                  autoComplete="new-password"
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </Grid>
              {registerError?.status && (
                <Grid item xs={12}>
                  <p style={{ color: "red", margin: 0 }}>
                    {registerError?.error}
                  </p>
                </Grid>
              )}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Đăng ký
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Bạn đã có tài khoản? Đăng nhập
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
