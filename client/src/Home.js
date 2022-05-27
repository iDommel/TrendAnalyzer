import React from "react";
import { useState } from "react";
import { Input, Breadcrumb, Layout, Menu } from "antd";

const { Search } = Input;
const { Header, Content, Footer } = Layout;

export default function Home() {
  const [data, setData] = useState();

  const getData = async (keyword) => {
    const resp = await fetch(`http://localhost:5000/?param=${keyword}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    });
    const data = await resp.json();
    if (resp.ok && resp.status === 200) {
      console.log(data);
      setData(data);
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
        <p>{JSON.stringify(data)}</p>
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
