import { Table, Image, Tag, Space, Button, Modal } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  deleteProduct,
  getProducts,
} from "../../../../services/product.service";
import { Link, useNavigate, useOutletContext } from "react-router-dom";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { notification } = useOutletContext();

  const navigate = useNavigate();

  const showModal = (product) => {
    setIsModalOpen(true);
    setSelectedProduct(product._id);
  };
  const handleOk = async () => {
    setIsModalOpen(false);

    try {
      await deleteProduct(selectedProduct);
      notification.success({
        message: "Xoá sản phẩm thành công!",
        duration: 3,
      });
      fetchProducts(page);
    } catch {
      notification.success({
        message: "Xoá sản phẩm thất bại!",
        duration: 3,
      });
    }
    //xoá sản phẩm
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Hàm fetch products server-side
  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      // getProducts nhận object { page, limit }
      const res = await getProducts(page);
      setProducts(res.data.products || []);
      setTotalProducts(res.data.totalProducts || 0);
      setPage(page);
    } catch (err) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

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
            onClick={() => showModal(record.product)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

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

  const onClickEdit = (productId) => {
    navigate(`/admin/auth/products/edit/${productId}`, {
      state: { productId },
    });
  };

  return (
    <div className="p-4">
      <Button type="primary" className="mb-4">
        <Link to="/admin/auth/products/add">Thêm sản phẩm</Link>
      </Button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Table
        rowSelection={{ type: "checkbox" }}
        columns={columns}
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
      <Modal
        title="Xác nhận xóa sản phẩm"
        open={isModalOpen}
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
