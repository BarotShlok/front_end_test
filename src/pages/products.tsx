import React, { useState, useMemo, useEffect } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
  CircularProgress
} from "@mui/material";
import styled from "@emotion/styled";
import { Product, ProductDetails } from "../types/types";
import { fetchProducts, fetchProductReviewsById } from "@/service";
import CloseIcon from "@mui/icons-material/Close";

interface DiscountPercentageCellProps {
  value: number;
}

// custom Styled
const StyledTableContainer = styled(TableContainer)`
  width: 100%;
  overflow-x: auto;
  font-size: 14px;

  @media (max-width: 600px) {
    font-size: 12px;
  }
`;

const StyledTable = styled(Table)`
  min-width: 650px;
  border-collapse: collapse;
  border: 1px solid #ddd;
`;

const StyledTableHead = styled(TableHead)`
  background-color: #f5f5f5;
`;

const StyledTableCellHeader = styled(TableCell)`
  font-family: "Body-Md/Medium", sans-serif;
  font-weight: bold;
  padding: 16px;
  border: 1px solid #ddd;
`;

const StyledTableCellBody = styled(TableCell)`
  font-family: "Body-Md/Regular", sans-serif;
  font-weight: 400;
  padding: 16px;
  border: 1px solid #ddd;
`;

const StyledTableRow = styled(TableRow)`
  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
`;

const StyledDialogContent = styled(DialogContent)`
  padding: 24px;
  background-color: #fafafa;
`;

const ReviewItem = styled.div`
  padding: "16px 0";
`;

const Label = styled(Typography)`
  font-weight: 600;
  display: inline;
  margin-right: 8px;
`;

const Value = styled(Typography)`
  display: inline;
  color: #333;
`;

const StyledTypographyTitle = styled(Typography)`
  fontWeight: 600,
  margin-bottom: '8px',
`;

const StyledDialogTitle = styled(DialogTitle)`
  display: 'flex',
  justify-content: 'space-between',
  alignItems: 'center',
  padding: '16px 24px',
  border-bottom: '1px solid #ddd',
`;

const StyledIconButton = styled(IconButton)`
  color: #666;
  float: right;
  padding: 0,
  &:hover {
    color: #000;
  }
`;
interface ProductsTableProps {
  data: Product[];
}
/// product table page
const ProductsTable: React.FC<ProductsTableProps> = ({ data }) => {
  const [productData, setProductData] = useState<Product[]>([]);
  const [productDetails, setProductDetails] = useState<ProductDetails>({});
  const [productModal, setProductModal] = useState(false);

  ///useEffect for hook life cycle
  useEffect(() => {
    handleFetchProductListData();
  }, []);

  //// fetch product data from API
  const handleFetchProductListData = async () => {
    try {
      const response = await fetchProducts();
      if (response.length > 0) {
        setProductData(response);
      } else {
        setProductData([]);
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  /// fetch product data by Id and Open modal
  const handleProductReviews = async (id: number) => {
    try {
      const responseView: Product[] = await fetchProductReviewsById(id);
      const productDetail =
        Object.keys(responseView).length > 0 ? responseView : {};
      setProductDetails(productDetail);
      setProductModal(true);
    } catch (error) {
      console.error("API Error:", error);
    }
  };
  /// modal close function
  const handleClose = () => {
    setProductModal(false);
    setProductDetails({});
  };

  /// show Discount percentafe design
  const DiscountPercentageCell: React.FC<DiscountPercentageCellProps> = ({
    value
  }) => {
    let color = "#F44336";
    let borderColor = "#FFF8E1";

    if (value > 85) {
      color = "#00C853";
      borderColor = "#B9F6CA";
    } else if (value > 50) {
      color = "#FFC107";
      borderColor = "#FFF8E1";
    }

    return (
      <Box position="relative" display="inline-flex">
        <CircularProgress
          variant="determinate"
          value={value}
          style={{
            color,
            borderColor,
            borderWidth: 2,
            borderStyle: "solid",
            borderRadius: "50%"
          }}
        />
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            variant="caption"
            component="div"
            color={color}
          >{`${Math.round(value)}%`}</Typography>
        </Box>
      </Box>
    );
  };

  /// table column list
  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID"
      },
      {
        accessorKey: "title",
        header: "Title"
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <>
            {row.original.description?.length > 40
              ? row.original.description.substr(0, 40).concat("...")
              : row.original.description}
          </>
        )
      },
      {
        accessorKey: "category",
        header: "Category"
      },
      {
        accessorKey: "price",
        header: "Price"
      },
      {
        accessorKey: "discountPercentage",
        header: "Discount Percentage",
        cell: ({ row }) => (
          <DiscountPercentageCell value={row.original.discountPercentage} />
        )
      },
      {
        accessorKey: "rating",
        header: "Rating"
      },
      {
        accessorKey: "stock",
        header: "Stock"
      },
      {
        accessorKey: "tags",
        header: "Tags",
        cell: ({ row }) => <>{row.original.tags.join(", ")}</>
      },
      {
        accessorKey: "brand",
        header: "Brand"
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Button
            variant="contained"
            style={{ fontSize: "12px", fontWeight: "600", lineHeight: 1.5 }}
            onClick={() => handleProductReviews(row.original.id)}
          >
            View Reviews
          </Button>
        )
      }
    ],
    []
  );
  /// product table
  const table = useReactTable({
    data: productData,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <>
      <StyledTableContainer>
        <StyledTable>
          <StyledTableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <StyledTableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <StyledTableCellHeader key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </StyledTableCellHeader>
                ))}
              </StyledTableRow>
            ))}
          </StyledTableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <StyledTableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <StyledTableCellBody key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </StyledTableCellBody>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>

      {/* Product Reviews Modal */}
      <Dialog open={productModal} onClose={handleClose} maxWidth="md" fullWidth>
        <StyledDialogTitle>
          {productDetails?.title} Reviews
          <StyledIconButton edge="end" color="inherit" onClick={handleClose}>
            <CloseIcon />
          </StyledIconButton>
        </StyledDialogTitle>
        <StyledDialogContent>
          <ReviewItem>
            <StyledTypographyTitle variant="h6">
              <Label>Title:</Label>
              <Value>{productDetails.title}</Value>
            </StyledTypographyTitle>
            <Typography variant="body1" color="textPrimary" paragraph>
              <Label>Description:</Label>
              <Value>{productDetails.description}</Value>
            </Typography>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="body2" color="textSecondary">
                <Label>Category:</Label>
                <Value>{productDetails.category}</Value>
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <Label>Price:</Label>
                <Value>{productDetails.price}</Value>
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <Label>Discount Percentage:</Label>
                <Value>{productDetails.discountPercentage}</Value>
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="body2" color="textSecondary">
                <Label>Rating:</Label>
                <Value style={{ textAlign: "right" }}>
                  {productDetails.rating}
                </Value>
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <Label>Stock:</Label>
                <Value>{productDetails.stock}</Value>
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <Label>Tags:</Label>
                <Value style={{ textAlign: "right" }}>
                  {productDetails.tags?.join(", ")}
                </Value>
              </Typography>
            </Box>
            {productDetails.brand && (
              <Typography variant="body2" color="textSecondary">
                <Label>Brand:</Label>
                <Value>{productDetails.brand}</Value>
              </Typography>
            )}
          </ReviewItem>
        </StyledDialogContent>
      </Dialog>
    </>
  );
};

export default ProductsTable;
