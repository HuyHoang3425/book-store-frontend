import { Button, Modal, notification } from "antd";
import CategoryTable from "./components/categoryTable";
import { useEffect, useState } from "react";
import {
  deleteCategoryById,
  getCategories,
} from "../../../../services/category.service";
import { useNavigate } from "react-router-dom";

function Category() {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCategory, setTotalCategory] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const navigate = useNavigate();

  const fetchDataCategories = async () => {
    try {
      setLoading(true);
      const res = await getCategories({ page, limit });
      setCategories(res?.data?.categories || []);
      setLimit(res?.data?.limit || 10);
      setTotalCategory(res?.data?.totalCategory || 0);
    } catch (err) {
      notification.error({
        message: err.response?.data?.message || "Lỗi lấy dữ liệu.",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDataCategories();
  }, [page]);

  const handleCancel = () => {
    setIsModalDeleteOpen(false);
    setSelectedCategoryId(null);
  };
  const handleOk = async () => {
    try {
      setLoading(true);
      const res = await deleteCategoryById(selectedCategoryId);
      if (res.statusCode === 200) {
        notification.success({
          message: "xoá danh mục thành công.",
        });
      }
      fetchDataCategories();
    } catch (err) {
      notification.error({
        message:
          err.response?.data?.message || "Xoá danh mục không thành công.",
      });
    } finally {
      setLoading(false);
      handleCancel();
    }
  };

  return (
    <div className="p-5">
      <div className="mb-5">
        <Button
          type="primary"
          onClick={() => {
            navigate("add");
          }}
        >
          Thêm Danh mục
        </Button>
      </div>
      <CategoryTable
        loading={loading}
        categories={categories}
        totalCategory={totalCategory}
        limit={limit}
        page={page}
        navigate={navigate}
        setPage={setPage}
        setIsModalDeleteOpen={setIsModalDeleteOpen}
        setSelectedCategoryId={setSelectedCategoryId}
      />

      <Modal
        title="Xác nhận xóa danh mục"
        open={isModalDeleteOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xóa danh mục này không?</p>
      </Modal>
    </div>
  );
}

export default Category;
