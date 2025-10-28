import {
  Table,
  Image,
  Tag,
  Space,
  Button,
  Modal,
  Select,
  InputNumber,
  Empty,
  Form,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { deleteProduct } from "../../../../services/product.service";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  setFilters,
  setPage,
  setSort,
} from "../../../../redux/productSlice";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [form] = Form.useForm();

  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalFilterOpen, setIsModalFilterOpen] = useState(false);

  const {
    data,
    totalProducts,
    limit,
    page,
    error,
    keyword,
    loading,
    sortKey,
    sortValue,
    isSearch,
    filters,
  } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  const { notification } = useOutletContext();

  const navigate = useNavigate();

  //fetch lấy dữ liệu sản phẩm
  const fetchDataProducts = () => {
    dispatch(fetchProducts())
      .unwrap()
      .then((data) => {
        setProducts(data.products);
      })
      .catch((err) => {
        notification.error({
          message: err?.message,
          duration: 3,
        });
      });
  };
  useEffect(() => {
    fetchDataProducts();
  }, [page, sortKey, isSearch, sortValue]);

  useEffect(() => {
    if (error) {
      notification.error({
        message: error?.message,
        duration: 3,
      });
    }
  }, [error]);

  //hàm mở modal xoá sản phẩm
  const showModalDelete = (product) => {
    setIsModalDeleteOpen(true);
    setSelectedProduct(product._id);
  };
  //hàm xác nhận xoá sản phẩm
  const handleOk = async () => {
    setIsModalDeleteOpen(false);
    try {
      await deleteProduct(selectedProduct);
      notification.success({
        message: "Xoá sản phẩm thành công!",
        duration: 3,
      });
      fetchDataProducts();
    } catch {
      notification.error({
        message: "Xoá sản phẩm thất bại!",
        duration: 3,
      });
    }
  };
  //hàm huỷ xoá sản phẩm
  const handleCancel = () => {
    setIsModalDeleteOpen(false);
  };
  //hàm chọn sửa sản phẩm
  const onClickEdit = (productId) => {
    navigate(`/admin/auth/products/edit/${productId}`, {
      state: { productId },
    });
  };

  //lọc sản phẩm
  const showModalFilter = () => {
    setIsModalFilterOpen(true);
  };
  const handleCancelFilter = () => {
    setIsModalFilterOpen(false);
  };
  //end lọc sản phẩm

  const displayData =
    data?.length > 0
      ? data
      : data?.length === 0 && keyword.trim() !== ""
      ? []
      : products;

  const emptyDescription = keyword
    ? "Không có kết quả phù hợp"
    : "Chưa có sản phẩm nào";

  //dữ liệu đưa vào bảng
  const dataSource = displayData.map((product) => ({
    key: product._id,
    title: product.title,
    authors: product.authors,
    images: product.images,
    price: product.price,
    quantity: product.quantity,
    sold: product.sold,
    status: product.status,
    product: product,
  }));
  //tiêu đề của bảng
  const columns = [
    {
      title: "Ảnh",
      dataIndex: "images",
      render: (images) => (
        <Image
          width={50}
          src={
            images && images.length > 0
              ? images[0]
              : "https://via.placeholder.com/50"
          }
          alt="Book"
        />
      ),
    },
    {
      title: "Tên sách",
      dataIndex: "title",
    },
    {
      title: "Tác giả",
      dataIndex: "authors",
      render: (authors) => (authors ? authors.join(", ") : "N/A"),
    },
    {
      title: "Giá (VNĐ)",
      dataIndex: "price",
      render: (price) => (price ? price.toLocaleString() : "N/A"),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
    },
    {
      title: "Đã bán",
      dataIndex: "sold",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => {
        let color =
          status === "available"
            ? "green"
            : status === "out-of-stock"
            ? "volcano"
            : status === "discontinued"
            ? "blue"
            : "gray";
        return <Tag color={color}>{status || "Unknown"}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => onClickEdit(record.key)}
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => showModalDelete(record.product)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const sortMap = {
    priceAsc: { sortKey: "price", sortValue: "asc" },
    priceDesc: { sortKey: "price", sortValue: "desc" },
    titleAsc: { sortKey: "title", sortValue: "asc" },
    titleDesc: { sortKey: "title", sortValue: "desc" },
  };

  const handleChangeSort = (value) => {
    dispatch(setFilters({ sort: value }));
    const sort = sortMap[value] || {};
    const sortData = {
      sortKey: sort.sortKey,
      sortValue: sort.sortValue,
    };
    dispatch(setSort(sortData));
  };

  console.log("render");
  const handleOkFilter = () => {
    console.log("chạy")
    const values = form.getFieldsValue();
    console.log("Giá trị filter:", values);
  };
  return (
    <div className="p-4">
      {/* Thanh công cụ */}
      <div className="flex items-center justify-between mb-4">
        <Button type="primary">
          <Link to="/admin/auth/products/add">Thêm sản phẩm</Link>
        </Button>

        <div className="flex gap-4">
          {/* Filter */}
          <Button onClick={showModalFilter}>
            <FilterOutlined />
            <span>Lọc</span>
          </Button>
          <Modal
            title="Bộ lọc sản phẩm"
            open={isModalFilterOpen}
            onCancel={handleCancelFilter}
            cancelButtonProps={{ style: { display: "none" } }}
            okText="Áp dụng"
            onOk={handleOkFilter}
          >
            {/* <div className="flex flex-col gap-4">
              <div>
                <p className="font-medium mb-1">Trạng thái:</p>
                <Select
                  placeholder="Chọn trạng thái"
                  style={{ width: "100%" }}
                  options={[
                    { label: "Còn hàng", value: "available" },
                    { label: "Hết hàng", value: "out-of-stock" },
                    { label: "Ngừng kinh doanh", value: "discontinued" },
                  ]}
                />
              </div>

              <div>
                <p className="font-medium mb-1">Giá:</p>
                <div className="flex gap-2">
                  <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    addonAfter="VNĐ"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                    }
                    parser={(value) => value.replace(/\D/g, "")}
                  />
                  <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    addonAfter="VNĐ"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                    }
                    parser={(value) => value.replace(/\D/g, "")}
                  />
                </div>
              </div>
            </div> */}
            <Form form={form} layout="vertical">
              <Form.Item label="Trạng thái" name="status">
                <Select
                  placeholder="Chọn trạng thái"
                  options={[
                    { label: "Còn hàng", value: "available" },
                    { label: "Hết hàng", value: "out-of-stock" },
                    { label: "Ngừng kinh doanh", value: "discontinued" },
                  ]}
                />
              </Form.Item>

              <Form.Item label="Giá">
                <div className="flex gap-2">
                  <Form.Item name="minPrice" noStyle>
                    <InputNumber
                      style={{ width: "100%" }}
                      min={0}
                      placeholder="Từ"
                      addonAfter="VNĐ"
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                      }
                      parser={(value) => value.replace(/\D/g, "")}
                    />
                  </Form.Item>
                  <Form.Item name="maxPrice" noStyle>
                    <InputNumber
                      style={{ width: "100%" }}
                      min={0}
                      placeholder="Đến"
                      addonAfter="VNĐ"
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                      }
                      parser={(value) => value.replace(/\D/g, "")}
                    />
                  </Form.Item>
                </div>
              </Form.Item>
            </Form>
          </Modal>
          {/* End Filter */}

          {/* Sort */}
          <Select
            placeholder="Sắp xếp"
            value={filters.sort}
            style={{ width: "200px" }}
            onChange={handleChangeSort}
            options={[
              { value: "priceAsc", label: "Giá từ thấp tới cao" },
              { value: "priceDesc", label: "Giá từ cao tới thấp" },
              { value: "titleAsc", label: "Tiêu đề từ A đến Z" },
              { value: "titleDesc", label: "Tiêu đề từ Z đến A" },
            ]}
          />
          {/* End Sort */}

          {/* Action */}
          <Space.Compact style={{ width: "300px" }}>
            <Select
              placeholder="Chọn hành động"
              style={{ width: "calc(100% - 100px)" }}
              allowClear
              options={[
                { value: "deleteAll", label: "🗑 Xoá tất cả" },
                { value: "available", label: "✅ Còn hàng" },
                { value: "outOfStock", label: "🚫 Hết hàng" },
                { value: "discontinued", label: "🕒 Ngừng kinh doanh" },
              ]}
            />
            <Button type="primary">Áp dụng</Button>
          </Space.Compact>
          {/* End Action */}

          {/* Restore */}
          <Button type="primary" danger>
            <DeleteOutlined />
            <span>Sản phẩm đã xoá</span>
          </Button>
          {/* End Restore */}
        </div>
      </div>
      {/*End Thanh công cụ */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Bảng */}
      <Table
        rowSelection={{ type: "checkbox" }}
        columns={columns}
        locale={{
          emptyText: <Empty description={emptyDescription} />,
        }}
        // bordered={true}
        dataSource={dataSource}
        loading={loading}
        pagination={{
          current: page,
          pageSize: limit,
          showSizeChanger: false,
          total: totalProducts,
          onChange: (newPage) => {
            dispatch(setPage(newPage));
          },
        }}
      />
      {/* End Bảng */}

      {/* Modal xác nhận xoá  */}
      <Modal
        title="Xác nhận xóa sản phẩm"
        open={isModalDeleteOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xóa sản phẩm này không?</p>
      </Modal>
      {/* End Modal xác nhận xoá  */}
    </div>
  );
}
