import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";

import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Button,
  DatePicker,
  InputNumber,
  Select,
  Spin,
} from "antd";
import {
  addProduct,
  editProduct,
  getProductById,
} from "../../../../services/product.service";
import { Editor } from "@tinymce/tinymce-react";
import { useNavigate, useOutletContext, useLocation } from "react-router-dom";
import UploadImages from "../../components/UploadImages";
import { uploadImages } from "../../../../services/upload.service";

const AddProduct = () => {
  const [fileList, setFileList] = useState([]);
  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const editorRef = useRef(null);
  const navigate = useNavigate();
  const { notification } = useOutletContext();

  const [form] = Form.useForm();

  const location = useLocation();
  const { productId } = location.state;

  //gọi api lấy thông tin sản phẩm
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(productId);
        setProduct(data.data.product);
        setLoading(false);
      } catch (e) {
        notification.error({
          message: "Lỗi khi lấy thông tin sản phẩm!",
          duration: 3,
        });
      }
    };
    fetchProduct();
  }, [productId]);

  //gán thông tin vào các ô nhập
  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        title: product.title,
        authors: product.authors || [],
        publisher: product.publisher,
        publishingYear: product.publishingYear
          ? dayjs(`${product.publishingYear}`, "YYYY")
          : null,
        price: product.price,
        quantity: product.quantity,
        language: product.language,
        ISBN: product.ISBN,
        size: product.size,
        page: product.page,
        format: product.format,
        weight: product.weight,
      });

      if (product.images && product.images.length > 0) {
        const mappedFiles = product.images.map((url, index) => ({
          uid: `-${index}`,
          name: `image-${index}.jpg`,
          status: "done",
          url, // ảnh có sẵn từ backend
        }));
        setFileList(mappedFiles);
      }
    }
  }, [product, form]);

  //gán description vào tinymce
  useEffect(() => {
    if (product?.description && editorRef.current) {
      editorRef.current.setContent(product.description);
    }
  }, [product, isEditorReady]);

  const onReset = () => {
    form.resetFields();
  };

  const upload = async () => {
    const formData = new FormData();
    let check = false;
    const images = [];
    if (fileList.length > 0) {
      fileList.forEach((file) => {
        console.log(file);
        if (file.originFileObj) {
          formData.append("images", file.originFileObj);
          check = true;
        } else {
          images.push(file.url);
        }
      });
    }
    if (check) {
      try {
        setLoading(true)
        const data = await uploadImages(formData);
        if (data.data.length > 0) {
          data.data.forEach((file) => {
            images.push(file);
          });
        }
      } catch {
        notification.error({
          message: "Tải ảnh thất bại!",
          duration: 3,
        });
      }
    }
    return images;
  };

  const onFinish = async (values) => {
    const images = await upload();
    const data = Object.fromEntries(
      Object.entries({
        title: values.title,
        description: editorRef.current?.getContent(),
        images,
        authors: values.authors,
        publisher: values.publisher,
        publishingYear: values.publishingYear?.year(),
        language: values.language,
        ISBN: values.ISBN,
        size: values.size,
        page: values.page,
        format: values.format,
        quantity: values.quantity,
        price: values.price,
        weight: values.weight,
      }).filter(
        ([_, v]) => v !== undefined && v !== null && v !== "" && v !== 0
      )
    );

    //lọc chỉ lấy dữ liệu mới
    Object.entries(data).forEach(([key, value]) => {
      const oldValue = product[key];
      if (Array.isArray(value) && Array.isArray(oldValue)) {
        const sameArray =
          value.length === oldValue.length &&
          value.every((v, i) => v === oldValue[i]);

        if (sameArray) {
          delete data[key];
        }
      } else if (value === oldValue) {
        delete data[key];
      }
    });

    try {
      setLoading(true);
      await editProduct(data, productId);
      setFileList([]);
      editorRef.current?.setContent("");
      notification.success({
        message: "Cập nhật sản phẩm thành công!",
        duration: 3,
      });
      onReset();
      navigate("/admin/auth/products");
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Cập nhật sản phẩm thất bại!",
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Spin spinning={loading} size="large" tip="Đang xử lý...">
      <div className="w-full h-full p-[20px]">
        {/* {loading && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(255, 255, 255, 0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
            }}
          >
            <Spin size="large" tip="Đang xử lý..." />
          </div>
        )} */}
        <Form
          layout="vertical"
          onFinish={onFinish}
          disabled={loading}
          form={form}
        >
          <Card title="Thông tin chính" style={{ marginBottom: "20px" }}>
            <Form.Item
              label="Tên sản phẩm"
              name="title"
              rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Tác giả"
              name="authors"
              rules={[{ required: true, message: "Vui lòng nhập tên tác giả!" }]}
            >
              <Select
                mode="tags"
                style={{ width: "100%" }}
                placeholder="Nhập và nhấn Enter để thêm tác giả"
                tokenSeparators={[","]}
                open={false}
              />
              {/* <Input /> */}
            </Form.Item>

            <Row gutter={10}>
              <Col span={16}>
                <Form.Item
                  label="Nhà sản xuất"
                  name="publisher"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên nhà sản xuất!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Năm sản xuất"
                  name="publishingYear"
                  rules={[
                    { required: true, message: "Vui lòng nhập năm sản xuất!" },
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();
                        if (value.year() > new Date().getFullYear()) {
                          return Promise.reject(new Error("Năm không hợp lệ!"));
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <DatePicker picker="year" style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={10}>
              <Col span={16}>
                <Form.Item
                  label="Giá"
                  name="price"
                  rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    addonAfter="VNĐ"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                    }
                    parser={(value) => value.replace(/\D/g, "")}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Số lượng" name="quantity" initialValue={1}>
                  <InputNumber style={{ width: "100%" }} min={1} />
                </Form.Item>
              </Col>
            </Row>

            {/* Upload ảnh */}
            <Form.Item
              label="Ảnh mô tả"
              name="images"
              rules={[
                {
                  required: true,
                  validator: () => {
                    if (fileList.length === 0) {
                      return Promise.reject("Vui lòng tải ít nhất 1 ảnh!");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <UploadImages fileList={fileList} setFileList={setFileList} />
            </Form.Item>

            <Form.Item label="Mô tả sản phẩm">
              <Editor
                apiKey="51z3p8d88kp6nuwphkdvo1g4pitq3jmkec066ptcf7owit2l"
                onInit={(evt, editor) => {
                  editorRef.current = editor;
                  setIsEditorReady(true);
                }}
                init={{
                  resize: false,
                  height: 300,
                  menubar: false,
                  plugins: [
                    "advlist", // danh sách nâng cao miễn phí
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "help",
                    "wordcount",
                  ],
                  toolbar:
                    "undo redo | image | preview | bold italic backcolor | " +
                    "alignleft aligncenter alignright alignjustify | " +
                    "bullist numlist | outdent indent | removeformat | code table help",
                  placeholder: "Mô tả sản phẩm...",
                }}
              />
            </Form.Item>
          </Card>

          <Card title="Thông tin bổ sung" style={{ marginBottom: "20px" }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Ngôn ngữ" name="language">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="ISBN" name="ISBN">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Kích thước" name="size">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Số trang" name="page">
                  <InputNumber style={{ width: "100%" }} min={1} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Định dạng" name="format">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Trọng lượng" name="weight">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Spin>
  );
};

export default AddProduct;
