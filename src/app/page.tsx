'use client'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import React, { useEffect, useState } from 'react'
import Iframe from 'react-iframe'
import { orderApiRequest } from './fetch/order.api'
import { HttpError } from '@/libs/utils/http'
import { setNotify } from '@/libs/features/notifySlice'
import { USDollar } from '@/libs/utils/func'
import { InboxOutlined, SkinOutlined } from '@ant-design/icons'
import { Card, Col, Row, Space } from 'antd'

export default function Home() {
  const token = useAppSelector(state => state.auth).token
  const totalProduct = useAppSelector(state => state.products).total || 0
  const [totalOrders, setTotalOrders] = useState(0);
  const dispatch = useAppDispatch()
  const [totalRevenue, setTotalRevenue] = useState(0)

  useEffect(() => {
    if (token) {
      const fetch = async () => {
        try {
          const res1 = orderApiRequest.getTotalRevenue(token, dispatch)
          const res2 = orderApiRequest.getList(token, dispatch)

          const response = await Promise.all([res1, res2])
          const totalRevenue = response[0].payload
          const totalOrders = response[1].payload.total
          setTotalRevenue(totalRevenue)
          setTotalOrders(totalOrders)
        } catch (error) {
          if (error instanceof HttpError) {
            console.log(error.message)
            dispatch(setNotify({ error: error.message }))
          } else {
            console.log("An unexpected error occurred:", error);
            dispatch(setNotify({ error: "An unexpected error occurred" }))
          }
        }
      }
      fetch()
    }
  }, [token, dispatch])

  return (
    <div className='charts-wrapper'>
      <div className='chart mb-2'>
        <Row justify={'space-between'} gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Card title='Doanh thu'>
              <Space>
                <div>
                  <span className='icon-bg primary-bg'>$</span>
                </div>
                <span>{USDollar.format(totalRevenue)}</span>
              </Space>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card title='Đơn hàng'>
              <Space>
                <div>
                  <span className='icon-bg success-bg'><InboxOutlined style={{ color: '#0f5132' }} /></span>
                </div>
                <span>{totalOrders}</span>
              </Space>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card title='Sản phẩm'>
              <Space>
                <div>
                  <span className='icon-bg warning-bg'><SkinOutlined style={{ color: '#664d03' }} /></span>
                </div>
                <span>{totalProduct}</span>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>

      <div className='chart mb-2'>
        <Row justify={'space-between'} gutter={[16, 16]}>
          <Col lg={12} md={12} sm={24} xs={24}>
            <div className='card-chart-body'>
              <div>
                <Iframe
                  url="https://charts.mongodb.com/charts-nestjs-app-mvmdqoj/embed/charts?id=d546779e-f2fd-4855-a12e-0820ac9220cb&maxDataAge=1800&theme=light&autoRefresh=true"
                  width="100%"
                  height="380px"
                  styles={{ background: '#FFFFFF', border: '1px solid #f0f0f0'}}
                  id=""
                  className=""
                  display="block"
                  position="relative"
                />
              </div>
            </div>
          </Col>
          <Col lg={12} md={12} sm={24} xs={24}>
            <div className='card-chart-body'>
              <div>
                <Iframe
                  url="https://charts.mongodb.com/charts-nestjs-app-mvmdqoj/embed/charts?id=c920fbea-f5f2-412f-a874-baf4b3a06511&maxDataAge=1800&theme=light&autoRefresh=true"
                  width="100%"
                  height="380px"
                  styles={{ background: '#FFFFFF', border: '1px solid #f0f0f0' }}
                  id=""
                  className=""
                  display="block"
                  position="relative"
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div className='chart'>
        <Row>
          <Col span={24}>
            <div className='card-chart-body'>
              <div>
                <Iframe
                  url="https://charts.mongodb.com/charts-nestjs-app-mvmdqoj/embed/charts?id=2ddc2534-5c4f-40c9-b405-524e454395ae&maxDataAge=1800&theme=light&autoRefresh=true"
                  width="100%"
                  height="380px"
                  styles={{ background: '#FFFFFF', border: '1px solid #f0f0f0'}}
                  id=""
                  className=""
                  display="block"
                  position="relative"
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}