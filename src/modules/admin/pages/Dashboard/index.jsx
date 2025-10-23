import { Row, Col, Card, Flex } from "antd";
import SimpleChart from "../../components/charts";
import { useEffect } from "react";
import { get } from "../../../../utils/axiosApi";
function Dashboard() {
  // useEffect(() => {
  //   const fetchApi = async () => {
  //     const res = await get("http://localhost:3000/api/v1/auth/me");
  //     console.log(res)
  //   }
  //   setTimeout(() => fetchApi(),6000);
  // },[])
  // useEffect(() => {
  //   const fetchApi = async () => {
  //     const res = await get("http://localhost:3000/api/v1/auth/me");
  //     console.log(res);
  //   };
  //   setTimeout(() => fetchApi(), 6000);
  // }, []);
  // useEffect(() => {
  //   const fetchApi = async () => {
  //     const res = await get("http://localhost:3000/api/v1/auth/me");
  //     console.log(res);
  //   };
  //   setTimeout(() => fetchApi(), 6000);
  // }, []);
  return (
    <div className="p-[20px]">
      <Row gutter={[20, 20]} style={{ minHeight: "300px", marginBottom:'20px' }}>
        <Col span={5}>
          <Card className="bg-red-500 text-white h-full">nội dung 1</Card>
        </Col>
        <Col span={14}>
          {/* <Card className="bg-blue-500 text-white h-full"><SimpleChart/></Card> */}
        </Col>
        <Col span={5}>
          <Flex vertical gap={20} className="h-full">
            <Card className="bg-green-300 h-full">nội dung 3</Card>
            <Card className="bg-green-400 h-full">nội dung 4</Card>
          </Flex>
        </Col>
      </Row>

      <Row gutter={[20, 20]} className="h-[500px]">
        <Col span={16}>
          <Card className="h-full">Nội dung 5</Card>
        </Col>
        <Col span={8}>
          <Card className="h-full">Nội dung 6</Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
