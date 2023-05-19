import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Stack, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomPopover from "../../../components/CustomPopover";
import { bookAPI } from "../../../services/bookAPI";
import { dateTimeConverter, parseJSON } from "../../../utils/helpers";
import { USER_INFO_KEY } from "../../../utils/contants";
import { useNavigate } from "react-router-dom";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

const columns = [
  { id: "_id", label: "Mã", minWidth: 150, align: "center" },
  {
    id: "title",
    label: "Tiêu đề",
    minWidth: 170,
    align: "center",
  },
  {
    id: "author",
    label: "Tác giả",
    minWidth: 170,
    align: "left",
  },
  {
    id: "category",
    label: "Thể loại",
    minWidth: 170,
    maxWidth: 200,
    align: "left",
  },
  {
    id: "release_date",
    label: "Ngày phát hành",
    minWidth: 170,
    align: "center",
  },
  {
    id: "page",
    label: "Số trang",
    minWidth: 170,
    align: "center",
  },
  {
    id: "action",
    label: "Thao tác",
    minWidth: 170,
    align: "center",
  },
];

export default function ListBook() {
  const [listBook, setlistBook] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [popoverId, setPopoverId] = useState("");
  const userData = parseJSON(localStorage.getItem(USER_INFO_KEY));
  const navigate = useNavigate();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getListBook = async () => {
    try {
      const categoryRes = await bookAPI.getAllBook();
      if (categoryRes?.success) {
        setlistBook(categoryRes?.payload?.book || []);
      }
    } catch (error) {
      console.log("get list category error >>> ", error);
    }
  };

  useEffect(() => {
    getListBook();
  }, []);

  const deleteBookData = async (bookId) => {
    try {
      const deleteRes = await bookAPI.deleteBook(bookId);
      if (deleteRes?.success) {
        toast.success("Xoá sách thành công");
        getListBook();
        setPopoverId("");
      } else {
        toast.error(deleteRes?.error?.message || "Xoá sách thất bại");
      }
    } catch (error) {
      toast.error("Xoá sách thất bại");
    }
  };

  return (
    <>
      <Stack
        flexWrap={"nowrap"}
        flexDirection="row"
        justifyContent={"space-between"}
        sx={{ marginBottom: "20px" }}
      >
        <Typography
          component="h2"
          variant="h6"
          color="primary"
          gutterBottom
          sx={{ textAlign: "left" }}
        >
          Quản lí sách
        </Typography>
        {userData?._id ? (
          <div>
            <Button
              variant="contained"
              onClick={() => {
                navigate("/create");
              }}
            >
              Thêm mới
            </Button>
          </div>
        ) : (
          <></>
        )}
      </Stack>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {listBook
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.id === "action" ? (
                              userData?._id ? (
                                <Stack
                                  flexDirection={"row"}
                                  justifyContent="center"
                                >
                                  <CustomPopover
                                    open={popoverId === row?._id}
                                    onClose={() => setPopoverId("")}
                                    handleSubmit={() =>
                                      deleteBookData(row?._id)
                                    }
                                    noti="Bạn có chắc chắn muốn xoá sách này không?"
                                  >
                                    <Button
                                      color="error"
                                      sx={{
                                        height: "30px",
                                        padding: 0,
                                        width: "fit-content",
                                        minWidth: "30px",
                                      }}
                                      variant="text"
                                      onClick={() => {
                                        if (popoverId === row?._id) {
                                          setPopoverId("");
                                        } else {
                                          setPopoverId(row?._id);
                                        }
                                      }}
                                    >
                                      <DeleteIcon />
                                    </Button>
                                  </CustomPopover>
                                  <Button
                                    sx={{
                                      height: "30px",
                                      padding: 0,
                                      width: "fit-content",
                                      minWidth: "30px",
                                    }}
                                    variant="text"
                                    onClick={() => {
                                      navigate(`/view/${row?._id}`);
                                    }}
                                  >
                                    <RemoveRedEyeIcon />
                                  </Button>
                                </Stack>
                              ) : (
                                <></>
                              )
                            ) : column.id === "_id" ? (
                              <div
                                style={{
                                  textAlign: "center",
                                  color: "red",
                                  fontWeight: "bold",
                                }}
                              >
                                {value}
                              </div>
                            ) : column.id === "title" ? (
                              <div style={{ fontWeight: 600 }}>{value}</div>
                            ) : column.id === "release_date" ? (
                              <div>{dateTimeConverter(value)}</div>
                            ) : (
                              value
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={listBook.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}
