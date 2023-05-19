import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  TextareaAutosize,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BOOK_CATEGORY, USER_INFO_KEY } from "../../utils/contants";
import storage from "../../firebase";
import _ from "lodash";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { bookAPI } from "../../services/bookAPI";
import { parseJSON } from "../../utils/helpers";

function formatDate(date) {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

export default function ViewBook(props) {
  const [pageState, setPageState] = useState(props?.pageState || "view");
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    description: "",
    release_date: "2023-05-18",
    page: 0,
    category: "",
    image: "",
  });
  const [image, setImage] = useState("");
  const { bookId } = useParams();
  const userData = parseJSON(localStorage.getItem(USER_INFO_KEY));
  const navigate = useNavigate();

  const getBookInfo = async () => {
    try {
      const response = await bookAPI.getBookById(bookId);
      setBookData({
        ...response?.payload,
        release_date: formatDate(
          response?.payload?.release_date || "2023-05-18"
        ),
      });
      setImage(response?.payload?.image || "");
    } catch (error) {
      console.log("book info error >>> ", error);
    }
  };

  useEffect(() => {
    if (!userData?._id) {
      navigate("/login");
    }

    if (pageState === "view" && bookId) {
      getBookInfo();
    }
  }, []);

  const handleCreate = async () => {
    const { title, author, release_date } = bookData;

    const checkNull = _.compact([title, author, release_date]);

    if (checkNull?.length < 3) {
      return toast.error("Dữ liệu không được bỏ trống");
    }

    if (typeof bookData.image !== "string") {
      const imageName = "book-image-" + new Date().getTime();
      const storageRef = ref(storage, imageName);

      const updateImageRes = await uploadBytes(storageRef, bookData.image);
      if (updateImageRes) {
        const pathReference = ref(storage, imageName);
        const url = await getDownloadURL(pathReference);
        bookData.image = url;
      } else {
        return toast.error("Không thể tải hình ảnh, Vui lòng thử lại sau");
      }
    }

    const response = await bookAPI.createBook(bookData);
    if (response?.success) {
      return toast.success("Thêm sách thành công");
    }

    return toast.error("Thêm sách thất bại");
  };

  const handleEdit = async () => {
    const { title, author, release_date } = bookData;

    const checkNull = _.compact([title, author, release_date]);

    if (checkNull?.length < 3) {
      return toast.error("Dữ liệu không được bỏ trống");
    }

    if (typeof bookData.image !== "string") {
      const imageName = "book-image-" + new Date().getTime();
      const storageRef = ref(storage, imageName);

      const updateImageRes = await uploadBytes(storageRef, bookData.image);
      if (updateImageRes) {
        const pathReference = ref(storage, imageName);
        const url = await getDownloadURL(pathReference);
        bookData.image = url;
      } else {
        return toast.error("Không thể tải hình ảnh, Vui lòng thử lại sau");
      }
    }

    const response = await bookAPI.updateBook(bookData, bookId);
    if (response?.success) {
      return toast.success("Sửa sách thành công");
    }

    return toast.error("Sửa sách thất bại");
  };

  return (
    <div
      style={{ padding: "80px", background: "#f0f0f0" }}
      className="viewbook-frame"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div style={{ fontSize: "26px", fontWeight: 500, color: "gray" }}>
            {pageState === "edit"
              ? "Sửa"
              : pageState === "view"
              ? "Xem"
              : "Tạo mới"}{" "}
            sách
          </div>
        </Grid>
        <Grid item xs={12} md={7}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="title"
                required
                fullWidth
                id="title"
                label="Tiêu đề"
                autoFocus
                disabled={pageState === "view"}
                value={bookData.title}
                onChange={(event) =>
                  setBookData({ ...bookData, title: event.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="author"
                label="Tác giả"
                name="author"
                disabled={pageState === "view"}
                value={bookData.author}
                autoComplete="family-name"
                onChange={(event) =>
                  setBookData({ ...bookData, author: event.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <div>Mô tả</div>
              <TextareaAutosize
                defaultValue={bookData.description}
                aria-label="minimum height"
                minRows={10}
                placeholder="Nhập mô tả"
                disabled={pageState === "view"}
                style={{
                  width: "97%",
                  marginTop: "10px",
                  padding: "10px",
                  borderColor: "#B9B9B9",
                  fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
                  fontSize: "16px",
                }}
                onChange={(event) =>
                  setBookData({ ...bookData, description: event.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="release_date"
                required
                fullWidth
                id="release_date"
                disabled={pageState === "view"}
                label="Ngày phát hành"
                autoFocus
                value={bookData.release_date}
                type="date"
                onChange={(event) =>
                  setBookData({ ...bookData, release_date: event.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="page"
                label="Số trang"
                name="page"
                type="number"
                disabled={pageState === "view"}
                value={bookData.page}
                autoComplete="family-name"
                onChange={(event) =>
                  setBookData({ ...bookData, page: event.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Thể loại</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={bookData?.category}
                  label="Quyền"
                  disabled={pageState === "view"}
                  onChange={(event) =>
                    setBookData({ ...bookData, category: event.target.value })
                  }
                >
                  {BOOK_CATEGORY?.map((categoryItem, categoryIndex) => {
                    return (
                      <MenuItem
                        key={`role-item-${categoryIndex}`}
                        value={categoryItem?.key}
                      >
                        {categoryItem?.label}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={0} md={1}></Grid>
        <Grid
          item
          xs={12}
          md={4}
          sx={{ paddingTop: "0 !important" }}
          style={{ paddingTop: "0 !important" }}
        >
          <div style={{ marginTop: "5px" }}>
            <Grid
              item
              xs={12}
              sx={{ paddingTop: "0 !important" }}
              style={{ paddingTop: "0 !important" }}
            >
              <TextField
                defaultValue=""
                id="post-title"
                variant="filled"
                style={{ marginTop: 11 }}
                type="file"
                disabled={pageState === "view"}
                onChange={(event) => {
                  setBookData({ ...bookData, image: event.target.files[0] });
                  const file = event.target.files[0];
                  const fileReader = new FileReader();
                  fileReader.addEventListener("load", () => {
                    setImage(fileReader.result);
                  });
                  fileReader.readAsDataURL(file);
                }}
              />
            </Grid>
            {image.length > 0 ? (
              <Grid item xs={12}>
                <img
                  style={{
                    width: "100%",
                    marginTop: "30px",
                    border: "1px solid gray",
                    minWidth: "100%",
                    minHeight: "300px",
                  }}
                  src={image}
                  alt="image-avatar"
                />
              </Grid>
            ) : (
              <></>
            )}
          </div>
        </Grid>
        <Grid item xs={12}>
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
              gap: "20px",
            }}
          >
            <Button
              variant="contained"
              onClick={() => {
                if (pageState === "view") setPageState("edit");
                if (pageState === "create") handleCreate();
                if (pageState === "edit") handleEdit();
              }}
              sx={{ width: pageState !== "edit" ? "20%" : "auto" }}
            >
              {pageState === "edit"
                ? "Lưu"
                : pageState === "view"
                ? "Sửa sách"
                : "Tạo mới"}
            </Button>
            {pageState === "edit" ? (
              <Button
                variant="contained"
                color="error"
                onClick={() => setPageState("view")}
              >
                Huỷ
              </Button>
            ) : (
              <></>
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
