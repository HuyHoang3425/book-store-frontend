import { Table, Tooltip, Tag, Space, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

function flattenCategories(categories, level = 0) {
  let result = [];
  for (let c of categories) {
    result.push({
      key: c._id,
      title: `${"-- ".repeat(level)}${c.title}`,
      status: c.status,
      creator: c.creator || "—",
      updater: c.updater || "—",
    });
    if (c.children && c.children.length > 0) {
      result = result.concat(flattenCategories(c.children, level + 1));
    }
  }
  return result;
}

function CategoryTable({
  categories = [],
  page = 1,
  totalCategory = 0,
  limit = 10,
  loading,
  navigate,
  setPage,
  setIsModalDeleteOpen,
  setSelectedCategoryId,
}) {
  const dataSource = flattenCategories(categories).map((c, index) => ({
    key: c.key,
    // id: c._id,
    stt: (page - 1) * limit + index + 1,
    title: c.title,
    status: c.status,
    creator: c.creator || "—",
    updater: c.updater || "—",
  }));

  const handleClickEdit = (categoryId) => {
    navigate(`/admin/auth/categories/edit/${categoryId}`, {
      state: { categoryId },
    });
  };

  const handleClickDelete = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setIsModalDeleteOpen(true);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      width: 80,
      align: "center",
    },
    {
      title: "Tên Danh mục",
      width: 400,
      dataIndex: "title",
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          <div
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "normal",
              maxWidth: 400,
            }}
          >
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      align: "center",
      render: (status) => {
        const color = status === true ? "green" : "red";
        return (
          <Tag color={color}>{status ? "Hoạt động" : "Không hoạt động"}</Tag>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleClickEdit(record.key)}
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleClickDelete(record.key)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
    {
      title: "Lịch sử",
      children: [
        {
          title: "Người tạo",
          dataIndex: "creator",
          key: "creator",
          width: "15%",
          align: "center",
        },
        {
          title: "Người cập nhật",
          dataIndex: "updater",
          key: "updater",
          width: "15%",
          align: "center",
        },
      ],
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      pagination={{
        current: page,
        pageSize: limit,
        total: totalCategory,
        showSizeChanger: false,
        onChange: (newPage) => {
          setPage(newPage);
        },
      }}
      rowClassName={() => "h-[70px] align-middle"}
    />
  );
}

export default CategoryTable;
