'use client'

import React from 'react';
import { Layout } from 'antd';
import { Card, Row, Col, Statistic } from 'antd';
import { Typography } from 'antd';
import ChatWindow from '../chat-interface/ChatWindow';

const { Content } = Layout;
const { Title } = Typography;

const AgentDashboard = () => {
  return (
    <Layout className="agent-dashboard">
      <Content style={{ padding: '24px' }}>
        <Title level={2}>Agent Dashboard</Title>
        
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Active Chats"
                value={3}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Completed Chats"
                value={25}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Average Response Time"
                value={2.5}
                suffix="min"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Satisfaction Rate"
                value={98}
                suffix="%"
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
        </Row>

        <Row style={{ marginTop: '24px' }}>
          <Col span={24}>
            <ChatWindow />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default AgentDashboard; 