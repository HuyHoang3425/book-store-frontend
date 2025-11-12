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
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { configOption } from "../../../../helpers/products.helper";
import {
  addCategory,
  getCategories,
} from "../../../../services/category.service";
import { useNavigate } from "react-router-dom";

function AddCategory() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  const fetchDataCategories = async () => {
    try {
      setLoading(true);
      const res = await getCategories();
      setCategories(res?.data?.categories || []);
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
  }, []);

  //form submit
  const handleFinish = async (values) => {
    try {
      setLoading(true);
      await addCategory(values);
      notification.success({
        message: "Tạo danh mục thành không.",
        duration: 3,
      });
      form.resetFields();
      navigate("/admin/auth/categories");
    } catch (err) {
      console.log("Err", err.response);
      notification.error({
        message:
          err.response?.data.message || "Tạo danh mục không thành không.",
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
                  <Select allowClear options={configOption(categories)} />
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
              Tạo mới
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
}

export default AddCategory;
