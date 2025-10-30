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
  message,
  Tooltip,
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
  updateProductByAction,
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
    actions,
    setActions,
  } = useContext(SearchContext);

  const [form] = Form.useForm();
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalFilterOpen, setIsModalFilterOpen] = useState(false);
  const [isModalDeleteAllOpen, setIsModalDeleteAllOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

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
    fetchDataProducts();
  }, [page, filters]);

  useEffect(() => {
    if (products.length === 0 && page > 1) {
      setPage((page) => page - 1);
    }
  }, [products]);

  useEffect(() => {
    if (isSearch) {
      fetchDataProducts();
      setIsSearch(false);
    }
  }, [isSearch]);

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
    console.log(values);
    updateFilters({
      status: values.status || null,
      minPrice: values.minPrice || null,
      maxPrice: values.maxPrice || null,
    });
    setPage(1);
    setIsModalFilterOpen(false);
  };

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
      width: 70,
      render: (images) => (
        <Image
          width={50}
          height={70}
          style={{
            objectFit: "cover",
          }}
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
      width: 150,
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          <div
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "normal",
            }}
          >
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Tác giả",
      dataIndex: "authors",
      width: 150,
      ellipsis: true,
      render: (authors) => {
        const text = authors ? authors.join(", ") : "N/A";
        return (
          <Tooltip placement="topLeft" title={text}>
            <div
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "normal",
              }}
            >
              {text}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: "Giá (VNĐ)",
      dataIndex: "price",
      width: 120,
      render: (price) => (price ? price.toLocaleString() : "N/A"),
    },
    {
      title: "Số lượng",
      width: 100,
      dataIndex: "quantity",
    },
    {
      title: "Đã bán",
      width: 100,
      dataIndex: "sold",
    },
    {
      title: "Trạng thái",
      width: 100,
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
    {
      title: "Lịch sử",
      width: 200,
      dataIndex: "history",
      render: () => (
        <>
          <div>Huy hoàng - Cập nhật</div>
          <div>30/10/2025</div>
        </>
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
  const rowSelection = {
    type: "checkbox",
    selectedRowKeys,
    onChange: (newSelectedRowKeys, selectedRows) => {
      setSelectedRowKeys(newSelectedRowKeys);
      console.log(newSelectedRowKeys);
      setActions((pre) => ({
        ...pre,
        ids: newSelectedRowKeys,
      }));
    },
  };
  const handleChangeAction = (value) => {
    setActions((pre) => ({
      ...pre,
      action: value,
    }));
  };
  const executeAction = async () => {
    try {
      setLoading(true);
      const res = await updateProductByAction(actions);

      notification.success({
        message: res.data?.message || "Thực hiện hành động thành công.",
        duration: 3,
      });

      setSelectedRowKeys([]);
      setActions({
        ids: [],
        action: null,
      });

      await fetchDataProducts();
    } catch (err) {
      notification.error({
        message: err?.message || "Lỗi thực hiện hành động.",
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };
  const handleClickAction = async () => {
    // Validate trước
    if (!actions.action) {
      notification.warning({
        message: "Vui lòng chọn hành động!",
        duration: 3,
      });
      return;
    }

    if (!actions.ids || actions.ids.length === 0) {
      notification.warning({
        message: "Vui lòng chọn ít nhất một sản phẩm!",
        duration: 3,
      });
      return;
    }

    if (actions.action === "delete-all") {
      setIsModalDeleteAllOpen(true);
      return;
    }

    await executeAction();
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
              value={actions.action}
              onChange={handleChangeAction}
              allowClear
              options={[
                { value: "delete-all", label: "🗑 Xoá tất cả" },
                { value: "available", label: "✅ Còn hàng" },
                { value: "out-of-stock", label: "🚫 Hết hàng" },
                { value: "discontinued", label: "🕒 Ngừng kinh doanh" },
              ]}
            />
            <Button
              type="primary"
              onClick={handleClickAction}
              disabled={!actions.action || selectedRowKeys.length === 0}
            >
              Áp dụng
            </Button>
          </Space.Compact>

          {/* Restore */}
          <Button
            type="primary"
            danger
            onClick={() => {
              navigate(`/admin/auth/products/restore`);
            }}
          >
            <DeleteOutlined />
            <span>Sản phẩm đã xoá</span>
          </Button>
        </div>
      </div>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        rowClassName={() => "h-[70px] align-middle"}
        locale={{
          emptyText: (
            <Empty
              description={
                keyword ? "không tìm thấy sản phẩm" : "không có dữ liệu"
              }
            />
          ),
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

      <Modal
        title="Xác nhận xóa sản phẩm"
        open={isModalDeleteAllOpen}
        onOk={async () => {
          setIsModalDeleteAllOpen(false);
          await executeAction();
        }}
        onCancel={() => setIsModalDeleteAllOpen(false)}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xóa tất cả sản phẩm đang được chọn không?</p>
      </Modal>
    </div>
  );
}
