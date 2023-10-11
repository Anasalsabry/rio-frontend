import React, { useEffect, useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Grid,
  Modal,
  Box,
  TextField,
} from "@mui/material";
import { fetcher } from "@/helpers/clientAPI";
import Loading from "@/components/Loading";
import { toast } from "react-toastify";
import useSWR from "swr";
import API from "@/helpers/API";
import { Router, useRouter } from "next/router";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90vw",
  maxWidth: "500px",
  bgcolor: "background.default",
  boxShadow: 10,
  borderRadius: 1,
  p: 4,
  pb: 2,
  color: "text.primary",
};

const ProductPurachase = ({ open, product, setSelectedProduct }) => {
  const [qte, setQte] = useState(1);
  const router = useRouter();
  const handlePurchase = (e) => {
    e.preventDefault();
    const purchasePromise = API.post(`/products/${product?.id}`, { qte });
    toast.promise(purchasePromise, {
      pending: "Purchasing...",
      success: {
        render: ({ data }) => {
          return `Purchase successful`;
        },
      },
      error: {
        render: ({ data: err }) => {
          console.error(err);
          return err?.response?.status === 404
            ? "Error: Product not found."
            : err?.response?.data?.detail;
        },
      },
    });
    purchasePromise
      .then(() =>
        setTimeout(() => {
          router.push("/purchases");
        }, 100)
      )
      .catch((err) => console.error(err));
  };
  return (
    <Modal
      open={open}
      onClose={(e) => {
        e.preventDefault();
        setSelectedProduct(null);
      }}
      aria-labelledby="Product"
      aria-describedby="modal-modal-description"
    >
      {product ? (
        <>
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h5"
              color="text.primary"
            >
              {`Purchase: ${product.name}`}
            </Typography>
            <div>
              <hr
                color="#386073"
                style={{
                  width: "100%",
                  marginBlock: "1rem",
                }}
              />
            </div>
            <Grid container spacing={3}>
              <Grid item xs="6" md="8">
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  {`Price per Unit: $${product.price}`}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  {`Total Price: $${product.price * qte}`}
                </Typography>
              </Grid>
              <Grid sx={{ mt: 2 }} item xs="6" md="4">
                <TextField
                  id="outlined-number"
                  label={`Quantity`}
                  // label={`Quantity (${product.count} max)`}
                  type="number"
                  value={qte}
                  onChange={({ target: { value } }) => setQte(value)}
                  // onChange={({ target: { value } }) =>
                  //   value <= product.count && value > 0 && setQte(value)
                  // }
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-end" sx={{ mt: 1 }}>
              <Grid item>
                <Button
                  color="success"
                  size="large"
                  variant="outlined"
                  // disabled={product.count < 1}
                  onClick={handlePurchase}
                >
                  Purchase
                </Button>
              </Grid>
            </Grid>
          </Box>
        </>
      ) : (
        <></>
      )}
    </Modal>
  );
};

const Products = ({ authToken, isAdmin }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { data, error, isLoading } = useSWR("/products/", fetcher);
  const router = useRouter();

  useEffect(() => {
    if (!authToken) {
      router.push("/login");
    }
  }, [authToken, isAdmin, router]);
  

  useEffect(() => {
    if (data) setProducts(data);
    if (error) toast.error(error);
  }, [error, data,router]);
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
          Products
        </Typography>
        <ProductPurachase
          open={Boolean(selectedProduct)}
          product={selectedProduct}
          setSelectedProduct={setSelectedProduct}
        />
        <Grid
          sx={{ marginBlock: "1rem" }}
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          container
          spacing={3}
        >
          {products.map((product) => (
            <Grid key={product.id} item xs={12} md={6} lg={2}>
              <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                  sx={{ height: 200, objectFit: "cover" }}
                  image={"https://rio-panel.com/api/"+product.image_url}
                  title="Product"
                />
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.category && product.category.title}
                  </Typography>
                  <Typography variant="h4" color="#859900" sx={{ mt: 3 }}>
                    {`$${product.price}`}
                  </Typography>
                  {/* <Typography
                    variant="body2"
                    color={product.count > 0 ? "text.secondary" : "#dc322f"}
                  >
                    {product.count > 0 ? `${product.count} left` : "SOLD OUT"}
                  </Typography> */}
                </CardContent>
                <CardActions sx={{ justifyContent: "center" }}>
                  <Button
                    color="success"
                    size="large"
                    variant="outlined"
                    // disabled={product.count < 1}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedProduct(product);
                    }}
                  >
                    Purchase
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  );
};

export default Products;
