import React from "react";
import { useState } from "react";
import { Input, Breadcrumb, Layout, Menu, Col, Row, Statistic, Divider } from "antd";

const { Search } = Input;
const { Header, Content, Footer } = Layout;

const dataList = [];

class DivList extends React.Component {
  constructor(props) { super(props); }

  displayForm() {
    let divs = [];
    dataList.forEach((data) => {
      divs.push(
        <div className="site-statistic-demo-card">
          <Row gutter={16}>
            <Col span={9}>
              <Statistic title="Subreddit title" value={data.title} />
            </Col>
            <Col span={12}>
              <Statistic title="Subcribers" value={data.subscribers} />
            </Col>
          </Row>
          <Divider />
          <Row gutter={16}>
            <Col span={9}>
              <Statistic title="Comments" value={data.totalComments} />
            </Col>
            <Col span={9}>
              <Statistic title="Comments per Subcribers" value={data.commentsPerSub} precision={2} />
            </Col>
            <Col span={6}>
              <Statistic title="New Comments (last 24h)" value={data.nbNewComments} precision={2} />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={9}>
              <Statistic title="Comments weekly" value={data.totalCommentsWeekly} />
            </Col>
            <Col span={9}>
              <Statistic title="Comments last week" value={data.totalCommentsWeeklyPrev} precision={2} />
            </Col>
            <Col span={6}>
              <Statistic title="Comments increase" value={data.increaseComments} precision={2} suffix="%"/>
            </Col>
          </Row>
          <Divider />
          <Row gutter={16}>
            <Col span={9}>
              <Statistic title="Posts" value={data.totalPosts} />
            </Col>
            <Col span={9}>
              <Statistic title="Posts per Subcribers" value={data.postsPerSub} precision={2} />
            </Col>
            <Col span={6}>
              <Statistic title="New Posts (last 24h)" value={data.nbNewPosts} precision={2} />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={4}>
              <Statistic title="Posts weekly" value={data.totalPostsWeekly} />
            </Col>
            <Col span={5}>
              <Statistic title="Posts weekly per Subcribers" value={data.postsPerSubWeekly} precision={2} />
            </Col>
            <Col span={4}>
              <Statistic title="Posts last week" value={data.totalPostsWeeklyPrev} precision={2} />
            </Col>
            <Col span={5}>
              <Statistic title="Posts last week per Subcribers" value={data.postsPerSubWeeklyPrev} precision={2} />
            </Col>
            <Col span={4}>
              <Statistic title="Posts increase" value={data.increasePost} precision={2} suffix="%"/>
            </Col>
          </Row>
        </div>
      );
    });
    return divs;
  }

  render() { return (<div> {this.displayForm()} </div>) }
}

export default function Home() {
  const [data, setData] = useState();

  const getData = async (keyword) => {
    const resp = await fetch(`http://localhost:8000/?param=${keyword}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    });
    const data = await resp.json();
    if (resp.ok && resp.status === 200) {
      console.log(data);
      setData(data);
      dataList.unshift(data);
      console.log(dataList);
    }
  };
  return (
    <Layout>
      <Header
        style={{
          position: "fixed",
          zIndex: 1,
          width: "100%",
        }}
      >
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          items={new Array(3).fill(null).map((_, index) => ({
            key: String(index + 1),
            label: `nav ${index + 1}`,
          }))}
        />
      </Header>
      <Content
        className="site-layout"
        style={{
          padding: "0 50px",
          marginTop: 64,
        }}
      >
        <Search
          placeholder="input search text"
          enterButton="Search"
          size="large"
          onSearch={async (value) => getData(value)}
        />

        <DivList />
      </Content>
      <Footer
        style={{
          textAlign: "center",
        }}
      >
        Ant Design ©2018 Created by Ant UED
      </Footer>
    </Layout>
  );
}
