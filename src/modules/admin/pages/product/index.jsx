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
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  deleteProduct,
  getProducts,
} from "../../../../services/product.service";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalFilterOpen, setIsModalFilterOpen] = useState(false);

  const {
    data: searchData,
    error: searchError,
    query,
    loading: searchLoading,
  } = useSelector((state) => state.search);

  const { notification } = useOutletContext();

  const navigate = useNavigate();

  // Hàm fetch products
  const fetchProducts = async (page = 1, sortKey, sortValue) => {
    setLoading(true);
    try {
      const res = await getProducts(page, sortKey, sortValue);
      setProducts(res.data.products || []);
      setTotalProducts(res.data.totalProducts || 0);
      setPage(page);
    } catch (err) {
      setError(err.response?.data || "Lỗi lấy dữ liệu sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  //fetch lấy dữ liệu sản phẩm
  useEffect(() => {
    fetchProducts(1);
  }, []);

  //hàm mở modal xoá sản phẩm
  const showModalDelete = (product) => {
    setIsModalDeleteOpen(true);
    setSelectedProduct(product._id);
  };
  //hàm xác nhận xoá sản phẩm
  const handleOk = async () => {
    setIsModalDeleteOpen(false);
    try {
      setLoading(true);
      await deleteProduct(selectedProduct);
      notification.success({
        message: "Xoá sản phẩm thành công!",
        duration: 3,
      });
      fetchProducts(page);
      setLoading(false);
    } catch {
      notification.success({
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

  if (searchError) {
    notification.error({
      message: searchError,
      duration: 3,
    });
    return;
  }

  const displayData =
    searchData?.length > 0
      ? searchData
      : searchData?.length === 0 && query !== ""
      ? []
      : products;

  const emptyDescription =
    displayData.length === 0 && query !== ""
      ? "Không có kết quả"
      : displayData.length === 0
      ? "Không có dữ liệu"
      : null;

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
    const sort = sortMap[value] || {};
    fetchProducts(1, sort.sortKey, sort.sortValue);
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
          >
            <div className="flex flex-col gap-4">
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
            </div>
          </Modal>
          {/* End Filter */}

          {/* Sort */}
          <Select
            defaultValue="Sắp xếp"
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
          pageSize: 10,
          showSizeChanger: false,
          total: totalProducts,
          onChange: (newPage) => fetchProducts(newPage),
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
