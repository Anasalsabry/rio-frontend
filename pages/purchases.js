import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Typography,
  Grid,
  TableRow,
  TableCell,
  IconButton,
  Collapse,
  Box,
  Table,
  TableHead,
  TableBody,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Paper,
  TableContainer,
  Tooltip,
  TablePagination,
} from "@mui/material";
import {
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  ContentCopy as ContentCopyIcon,
} from "@mui/icons-material";
import Loading from "@/components/Loading";
import useSWR from "swr";
import { fetcher } from "@/helpers/clientAPI";
import { DateTime } from "luxon";
import { toast } from "react-toastify";

function PurchaseRow({ row }) {
  const [open, setOpen] = React.useState(false);
  const handleCopyAll = (inputCodes) => {
    var textarea = document.createElement("textarea");
    var value = "";
    for (var i = 0; i < inputCodes.length; i++) {
      value += `${inputCodes[i]}\n`;
    }
    textarea.value = value;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  };
  return (
    <>
      <TableRow
        sx={{ "& > *": { borderBottom: "unset" } }}
        hover
        onClick={() => setOpen(!open)}
        role="checkbox"
        aria-checked={open}
        selected={open}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="left">{row.product.name}</TableCell>
        <TableCell align="center">{row.qte}</TableCell>
        <TableCell align="center">{row.unit_price}</TableCell>
        <TableCell align="center">{row.total_price}</TableCell>
        <TableCell align="center">
          {DateTime.fromISO(row.created_on).toLocaleString(
            DateTime.DATETIME_MED_WITH_WEEKDAY
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <div style={{ display: "flex" }}>
                <Typography variant="h6" gutterBottom component="div">
                  Codes
                </Typography>
                <Tooltip title="Copy All">
                  <IconButton>
                    <ContentCopyIcon
                      onClick={() => {
                        // navigator.clipboard.writeText(
                        //   row.product_instances
                        //     .map((ins) => ins.code)
                        //     .join("\n")
                        // );
                        handleCopyAll(
                          row.product_instances.map((ins) => ins.code)
                        );
                        toast.success("All Codes Copied!");
                      }}
                    />
                  </IconButton>
                </Tooltip>
              </div>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Code</TableCell>{" "}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.product_instances.map((instance) => (
                    <TableRow key={instance.id}>
                      <TableCell align="center">
                        <FormControl
                          sx={{ m: 1, width: "80vw" }}
                          variant="outlined"
                        >
                          <InputLabel htmlFor={`#${instance.id}`}>
                            Code
                          </InputLabel>
                          <OutlinedInput
                            id={`#${instance.id}`}
                            value={instance.code}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="Copy code"
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      instance.code
                                    );
                                    toast.success("Code Copied!");
                                  }}
                                  edge="end"
                                >
                                  <ContentCopyIcon />
                                </IconButton>
                              </InputAdornment>
                            }
                            label="Code"
                          />
                        </FormControl>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

const Purchases = ({ authToken, isAdmin }) => {
  const router = useRouter();
  const [orders, setOrders] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { data, error, isLoading } = useSWR(
    `/orders/?skip=${page * rowsPerPage}&limit=${rowsPerPage}`,
    fetcher
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    if (!authToken) {
      router.push("/login");
    }
  }, [authToken, isAdmin, router]);

  useEffect(() => {
    if (data) setOrders(data?.results);
    if (error) toast.error(error);
  }, [error, data, router]);

  return (
    <>
      <Loading open={isLoading} />

      <Grid
        container
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Typography sx={{ mt: 3 }} gutterBottom variant="h3" component="div">
          Purchases
        </Typography>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Name</TableCell>
                <TableCell align="center">Qte</TableCell>
                <TableCell align="center">Unit Price</TableCell>
                <TableCell align="center">Total Price</TableCell>
                <TableCell align="center">Purchased At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders &&
                orders.map((order) => (
                  <PurchaseRow key={order.id} row={order} />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data?.count}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Grid>
    </>
  );
};

export default Purchases;
