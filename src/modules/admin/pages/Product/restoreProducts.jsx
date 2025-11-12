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
  Tooltip,
  Dropdown,
} from "antd";
import {
  DeleteOutlined,
  FilterOutlined,
  RetweetOutlined,
} from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import {
  deleteProduct,
  destroyProduct,
  getRestoreProducts,
  restoreProduct,
  updateProductByAction,
} from "../../../../services/product.service";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { SearchContext } from "../../contexts/searchContext";

function RestoreProducts() {
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
  const [isModalRestoreOpen, setIsModalRestoreOpen] = useState(false);
  const [isModalDestroyOpen, setIsModalDestroyOpen] = useState(false);
  const [isModalDestroyAllOpen, setIsModalDestroyAllOpen] = useState(false); // Modal mới
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isModalFilterOpen, setIsModalFilterOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const { notification } = useOutletContext();
  const navigate = useNavigate();

  const fetchDataProducts = async () => {
    try {
      setLoading(true);
      const res = await getRestoreProducts({
        page,
        keyword: keyword.trim(),
        ...filters,
      });
      const { products, limit, totalProducts } = res.data;
      setProducts(products || []);
      setLimit(limit || 0);
      setTotalProducts(totalProducts || 0);
    } catch (err) {
      notification.error({
        message:
          err.response?.data?.message ||
          "Tải danh sách sản phẩm đã xoá thất bại!",
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

  //filter
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
      title: "STT",
      dataIndex: "stt",
      width: 40,
      render: (text, record, index) => (page - 1) * limit + index + 1,
    },
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
      align: "center",
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
      width: 100,
      align: "center",
      render: (_, record) => {
        const items = [
          {
            key: "restore",
            label: "Khôi phục",
            icon: <RetweetOutlined />,
            onClick: () => {
              setSelectedProductId(record.key);
              setIsModalRestoreOpen(true);
            },
          },
          {
            key: "delete-forever",
            label: "Xoá vĩnh viễn",
            icon: <DeleteOutlined />,
            onClick: () => {
              setSelectedProductId(record.key);
              setIsModalDestroyOpen(true);
            },
          },
        ];

        return (
          <Dropdown menu={{ items }} placement="right" arrow>
            <Button type="primary">Hành động</Button>
          </Dropdown>
        );
      },
    },
    {
      title: "Lịch sử",
      width: 200,
      dataIndex: "history",
      render: () => (
        <>
          <div>Huy hoàng - Xoá</div>
          <div>30/10/2025</div>
        </>
      ),
    },
  ];

  //sort
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

  const getSortValue = () => {
    const { sortKey, sortValue } = filters;
    if (sortKey === "price" && sortValue === "asc") return "priceAsc";
    if (sortKey === "price" && sortValue === "desc") return "priceDesc";
    if (sortKey === "title" && sortValue === "asc") return "titleAsc";
    if (sortKey === "title" && sortValue === "desc") return "titleDesc";
    return undefined;
  };

  //action
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

  const handleClickAction = async () => {
    if (!actions.action) {
      notification.warning({
        message: "Vui lòng chọn hành động!",
        duration: 3,
      });
      return;
    }

    // Nếu là xóa vĩnh viễn tất cả, mở modal xác nhận
    if (actions.action === "delete-all-forever") {
      if (!actions.ids || actions.ids.length === 0) {
        notification.warning({
          message: "Vui lòng chọn ít nhất một sản phẩm!",
          duration: 3,
        });
        return;
      }
      setIsModalDestroyAllOpen(true);
      return;
    }

    if (!actions.ids || actions.ids.length === 0) {
      notification.warning({
        message: "Vui lòng chọn ít nhất một sản phẩm!",
        duration: 3,
      });
      return;
    }

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
        message: err.response?.data?.message || "Lỗi thực hiện hành động.",
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    try {
      setIsModalRestoreOpen(false);
      setLoading(true);
      await restoreProduct(selectedProductId);
      notification.success({
        message: "Khôi phục sản phẩm thành công.",
        duration: 3,
      });
      await fetchDataProducts();
    } catch (err) {
      notification.error({
        message:
          err.response?.data?.message || "Lỗi Không thể khôi phục sản phẩm.",
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDestroy = async () => {
    try {
      setIsModalDestroyOpen(false);
      setLoading(true);
      await destroyProduct(selectedProductId);
      notification.success({
        message: "Sản phẩm đã được xoá vĩnh viễn thành công.",
        duration: 3,
      });
      await fetchDataProducts();
    } catch (err) {
      notification.error({
        message:
          err.response?.data?.message ||
          "Lỗi Không thể xoá vĩnh viễn sản phẩm.",
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý xóa vĩnh viễn tất cả
  const handleDestroyAll = async () => {
    try {
      setIsModalDestroyAllOpen(false);
      setLoading(true);
      const res = await updateProductByAction(actions);

      notification.success({
        message: res.data?.message || "Xóa vĩnh viễn sản phẩm thành công.",
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
        message:
          err.response?.data?.message ||
          "Lỗi không thể xóa vĩnh viễn sản phẩm.",
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-end mb-4">
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
                { value: "restore-all", label: "🔁 Khôi phục" },
                {
                  value: "delete-all-forever",
                  label: "🗑 Xoá tất cả vĩnh viễn",
                },
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
        </div>
      </div>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        locale={{
          emptyText: <Empty description={"Không có sản phẩm đã xoá"} />,
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

      {/* Modal khôi phục 1 sản phẩm */}
      <Modal
        open={isModalRestoreOpen}
        onOk={handleRestore}
        onCancel={() => {
          setIsModalRestoreOpen(false);
          setSelectedProductId(null);
        }}
        title="Khôi phục sản phẩm"
        cancelText="Huỷ"
        okText="Khôi phục"
      >
        <p>Bạn có chắc chắn muốn khôi phục sản phẩm này không?</p>
      </Modal>

      {/* Modal xóa vĩnh viễn 1 sản phẩm */}
      <Modal
        open={isModalDestroyOpen}
        onOk={handleDestroy}
        onCancel={() => {
          setIsModalDestroyOpen(false);
          setSelectedProductId(null);
        }}
        title="Xoá vĩnh viễn sản phẩm"
        okText="Xoá"
        cancelText="Huỷ"
        okButtonProps={{ danger: true }}
      >
        <p>
          Sản phẩm sẽ bị xoá vĩnh viễn và không thể khôi phục. Bạn có chắc
          không?
        </p>
      </Modal>

      {/* Modal xóa vĩnh viễn nhiều sản phẩm - MỚI */}
      <Modal
        open={isModalDestroyAllOpen}
        onOk={handleDestroyAll}
        onCancel={() => setIsModalDestroyAllOpen(false)}
        title="Xóa vĩnh viễn nhiều sản phẩm"
        okText="Xóa tất cả"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <div>
          <p className="mb-2">
            <strong style={{ color: "#ff4d4f" }}>Cảnh báo nghiêm trọng!</strong>
          </p>
          <p>
            Bạn đang thực hiện xóa vĩnh viễn{" "}
            <strong>{actions.ids?.length || 0}</strong> sản phẩm.
          </p>
          <p style={{ marginTop: "8px" }}>
            Các sản phẩm này sẽ bị xóa hoàn toàn và{" "}
            <strong>KHÔNG THỂ KHÔI PHỤC</strong>.
          </p>
          <p style={{ marginTop: "8px" }}>Bạn có chắc chắn muốn tiếp tục?</p>
        </div>
      </Modal>
    </div>
  );
}

export default RestoreProducts;
