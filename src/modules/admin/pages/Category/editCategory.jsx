import {
  Button,
  Card,
  Col,
  Form,
  Input,
  notification,
  Row,
  Select,
  Spin,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import {
  addCategory,
  eidtCategoryById,
  getCategories,
  getCategoryById,
} from "../../../../services/category.service";
import { editProductById } from "../../../../services/product.service";
import {
  configOptionEditCategory,
} from "../../../../helpers/category.helper";

function EditCategory() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const { categoryId } = location.state;

  // const fetchDataCategories = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await getCategories();
  //     setCategories(res?.data?.categories || []);
  //   } catch (err) {
  //     notification.error({
  //       message: err.response?.data?.message || "Lỗi lấy dữ liệu.",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   fetchDataCategories();
  //   fetchDataCategoryById();
  // }, []);

  // const fetchDataCategoryById = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await getCategoryById(categoryId);
  //     form.setFieldsValue({
  //       title: res.data.title,
  //       parentId: res.data.parentId,
  //       status: res.data.status,
  //     });
  //     setCategory(res.data);
  //   } catch (err) {
  //     notification.error({
  //       message: err.response?.data?.message || "Lỗi lấy dữ liệu.",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resCategories, resCategory] = await Promise.all([
          getCategories(),
          getCategoryById(categoryId),
        ]);

        const categoryData = resCategory.data;
        const categoriesData = resCategories?.data?.categories || [];

        setCategories(categoriesData);
        setCategory(categoryData);

        form.setFieldsValue({
          title: categoryData.title,
          parentId: categoryData.parentId,
          status: categoryData.status,
        });
      } catch (err) {
        notification.error({
          message: err.response?.data?.message || "Lỗi lấy dữ liệu.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  //form submit
  const handleFinish = async (values) => {
    Object.entries(values).forEach(([key, value]) => {
      const oldData = category[key];
      if (oldData === value) delete values[key];
    });
    try {
      setLoading(true);
      if(Object.keys(values).length !== 0){
         await eidtCategoryById(categoryId, values);
      }
      notification.success({
        message: "Cập nhật danh mục thành không.",
        duration: 3,
      });
      navigate("/admin/auth/categories");
    } catch (err) {
      console.log("Err", err.response);
      notification.error({
        message:
          err.response?.data.message || "Cập nhật danh mục không thành không.",
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-5">
      <Spin size="large" spinning={loading}>
        <Form
          layout="vertical"
          disabled={loading}
          form={form}
          onFinish={handleFinish}
        >
          <Card title="Nội dung chính">
            <Row gutter={16}>
              <Col span={10}>
                <Form.Item
                  name="title"
                  label="Tiêu đề danh mục"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên danh mục sản phẩm!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item name="parentId" label="Danh mục sản phẩm cha">
                  <Select
                    allowClear
                    options={configOptionEditCategory(categories, categoryId)}
                  />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="status" label="Trạng thái" initialValue={true}>
                  <Select
                    options={[
                      { value: true, label: "Hoạt động" },
                      { value: false, label: "Không hoạt động" },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="mt-5">
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
}

export default EditCategory;
