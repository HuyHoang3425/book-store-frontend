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
import { useContext, useEffect, useState } from "react";
import {
  deleteProduct,
  getProducts,
} from "../../../../services/product.service";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { SearchContext } from "../../contexts/searchContext";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [limit, setLimit] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(false);

  const {
    keyword,
    isSearch,
    setIsSearch,
    page,
    setPage,
    filters,
    updateFilters,
    resetFilters,
  } = useContext(SearchContext);

  const [form] = Form.useForm();
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalFilterOpen, setIsModalFilterOpen] = useState(false);

  const { notification } = useOutletContext();
  const navigate = useNavigate();

  const fetchDataProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts({
        page,
        keyword: keyword.trim(),
        ...filters, // Spread tất cả filters vào API
      });
      const { products, limit, totalProducts } = res.data;
      setProducts(products || []);
      setLimit(limit || 0);
      setTotalProducts(totalProducts || 0);
    } catch (err) {
      notification.error({
        message: err?.message || "Tải danh sách sản phẩm thất bại!",
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSearch) {
      fetchDataProducts();
      setIsSearch(false);
    }
  }, [isSearch]);

  // Gọi API khi filters thay đổi
  useEffect(() => {
    fetchDataProducts();
  }, [page, filters]);

  useEffect(() => {
    fetchDataProducts();
  }, []);

  const showModalDelete = (product) => {
    setIsModalDeleteOpen(true);
    setSelectedProduct(product._id);
  };

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

  const handleCancel = () => {
    setIsModalDeleteOpen(false);
  };

  const onClickEdit = (productId) => {
    navigate(`/admin/auth/products/edit/${productId}`, {
      state: { productId },
    });
  };

  const showModalFilter = () => {
    // Set giá trị hiện tại vào form
    form.setFieldsValue({
      status: filters.status,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    });
    setIsModalFilterOpen(true);
  };

  const handleCancelFilter = () => {
    setIsModalFilterOpen(false);
  };

  const handleOkFilter = () => {
    const values = form.getFieldsValue();
    updateFilters({
      status: values.status || null,
      minPrice: values.minPrice || null,
      maxPrice: values.maxPrice || null,
    });
    setPage(1);
    setIsModalFilterOpen(false);
  };

  const emptyDescription = "không có dữ liệu.";

  const dataSource = products.map((product) => ({
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
    const sort = sortMap[value];
    if (!sort) return;
    updateFilters({
      sortKey: sort.sortKey,
      sortValue: sort.sortValue,
    });
    setPage(1);
  };

  const handleClearSort = () => {
    updateFilters({
      sortKey: null,
      sortValue: null,
    });
  };

  // Tính toán value cho Sort dropdown
  const getSortValue = () => {
    const { sortKey, sortValue } = filters;
    if (sortKey === "price" && sortValue === "asc") return "priceAsc";
    if (sortKey === "price" && sortValue === "desc") return "priceDesc";
    if (sortKey === "title" && sortValue === "asc") return "titleAsc";
    if (sortKey === "title" && sortValue === "desc") return "titleDesc";
    return undefined;
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <Button type="primary">
          <Link to="/admin/auth/products/add">Thêm sản phẩm</Link>
        </Button>

        <div className="flex gap-4">
          {/* Filter */}
          <Button onClick={showModalFilter}>
            <FilterOutlined />
            <span>Lọc</span>
            {/* Badge hiển thị số filter đang active */}
            {(filters.status || filters.minPrice || filters.maxPrice) && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-500 text-white rounded-full">
                {
                  [filters.status, filters.minPrice, filters.maxPrice].filter(
                    Boolean
                  ).length
                }
              </span>
            )}
          </Button>

          <Modal
            title="Bộ lọc sản phẩm"
            open={isModalFilterOpen}
            onCancel={handleCancelFilter}
            onOk={handleOkFilter}
            okText="Áp dụng"
            cancelText="Hủy"
          >
            <Form form={form} layout="vertical">
              <Form.Item label="Trạng thái" name="status">
                <Select
                  placeholder="Chọn trạng thái"
                  allowClear
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

          {/* Sort */}
          <Select
            placeholder="Sắp xếp"
            value={getSortValue()}
            style={{ width: "200px" }}
            onChange={handleChangeSort}
            allowClear
            onClear={handleClearSort}
            options={[
              { value: "priceAsc", label: "Giá từ thấp tới cao" },
              { value: "priceDesc", label: "Giá từ cao tới thấp" },
              { value: "titleAsc", label: "Tiêu đề từ A đến Z" },
              { value: "titleDesc", label: "Tiêu đề từ Z đến A" },
            ]}
          />

          {/* Button Clear All Filters */}
          {(filters.sortKey ||
            filters.status ||
            filters.minPrice ||
            filters.maxPrice) && (
            <Button
              onClick={() => {
                resetFilters();
                form.resetFields();
              }}
              danger
            >
              Xóa bộ lọc
            </Button>
          )}

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

          {/* Restore */}
          <Button type="primary" danger>
            <DeleteOutlined />
            <span>Sản phẩm đã xoá</span>
          </Button>
        </div>
      </div>

      <Table
        rowSelection={{ type: "checkbox" }}
        columns={columns}
        locale={{
          emptyText: <Empty description={emptyDescription} />,
        }}
        dataSource={dataSource}
        loading={loading}
        pagination={{
          current: page,
          pageSize: limit,
          showSizeChanger: false,
          total: totalProducts,
          onChange: (newPage) => {
            setPage(newPage);
          },
        }}
      />

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
    </div>
  );
}
