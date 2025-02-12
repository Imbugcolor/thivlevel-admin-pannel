'use client'
import styles from '../products/list/productlist.module.css'
import { setNotify } from '@/libs/features/notifySlice'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { HttpError } from '@/libs/utils/http'
import { FormOutlined } from '@ant-design/icons'
import { Button, Col, Flex, Row, Select, Table, Tag, Typography } from 'antd'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { orderApiRequest } from '../fetch/order.api'
import { changeOrderPage, clearOrderFilter, getOrders, OrdersState, searchOrders, sortOrders, statusOrders } from '@/libs/features/orderSlice'
import { Order } from '@/libs/interfaces/schema/order/order.interface'
import FilterRemove from '../icons/FilterRemove'
import Search from 'antd/es/input/Search';
import Paginator from '../components/paginator/Paginator'
import { useRouter } from 'next/navigation'
import moment from 'moment'

export default function Orders() {
    const orders = useAppSelector(state => state.orders)
    const dispatch = useAppDispatch()
    const router = useRouter()
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)
    const token = useAppSelector(state => state.auth).token

    useEffect(() => {
        const fetch = async () => {
            if (!token) return;
            setLoading(true)
            setSearch(orders.filter.search || '')
            try {
                const response = await orderApiRequest.getList(token, dispatch, 10, orders.page, orders.filter)
                dispatch(getOrders({
                    data: response.payload.data,
                    total: response.payload.total,
                    page: Number(response.payload.page)
                }))
            } catch (error) {
                if (error instanceof HttpError) {
                    // Handle the specific HttpError
                    console.log("Error message:", error.message);
                    // Example: show error message to the user
                    dispatch(setNotify({ error: error.message }))
                } else {
                    // Handle other types of errors
                    console.log("An unexpected error occurred:", error);
                    dispatch(setNotify({ error: "Có lỗi xảy ra." }))
                }
            }
            finally {
                setLoading(false)
            }
        }
        fetch()
    }, [token, dispatch, orders.page, orders.filter])

    const columns = [
        {
            title: 'Mã đơn',
            dataIndex: '_id',
            key: '_id',
        },
        {
            title: 'Ngày tạo',
            key: 'createdAt',
            render: (_: string, record: Order) => (
                <Typography>
                    {new Date(record.createdAt).toLocaleDateString() + ' '
                        + moment(record.createdAt).format('LT')}
                </Typography>
            )
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'SĐT',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Tổng cộng',
            key: 'total',
            render: (_: string, record: Order) => (
                <Flex justify='center' gap={15}>
                    <Col>
                        <Typography>${record.total}</Typography>
                    </Col>
                </Flex>)
        },
        {
            title: 'Phương thức',
            key: 'method',
            render: (_: string, record: Order) => (
                <Flex justify='center' gap={15}>
                    <Col>
                        {
                            record.method === 'COD' &&
                            <Tag color="#f50">cod</Tag>
                        }
                        {
                            record.method === 'PAYPAL_CREDIT_CARD' &&
                            <Tag color="#253b80">paypal</Tag>
                        }
                        {
                            record.method === 'STRIPE_CREDIT_CARD' &&
                            <Tag color="#5a67e3">stripe</Tag>
                        }
                        {
                            record.method === 'VNPAY' &&
                            <Tag color="#108ee9">vnpay</Tag>
                        }
                    </Col>
                </Flex>)
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (_: string, record: Order) => (
                <Flex justify='center' gap={15}>
                    <Col>
                        {
                            record.status === 'Pending' &&
                            <Tag color="cyan">pending</Tag>
                        }
                        {
                            record.status === 'Processing' &&
                            <Tag color="geekblue">processing</Tag>
                        }
                        {
                            record.status === 'Shipping' &&
                            <Tag color="orange">shipping</Tag>
                        }
                        {
                            record.status === 'Delivered' &&
                            <Tag color="gold">delivered</Tag>
                        }
                        {
                            record.status === 'Completed' &&
                            <Tag color="green">completed</Tag>
                        }
                        {
                            record.status === 'Canceled' &&
                            <Tag color="red">canceled</Tag>
                        }
                    </Col>
                </Flex>)
        },
        {
            title: 'Tùy chọn',
            key: 'modify',
            render: (_: string, record: Order) => (
                <Flex justify='center' gap={15}>
                    <Col>
                        <Button
                            icon={<FormOutlined style={{ fontSize: '18px' }} />}
                            onClick={() => handleRedirectToDetail(record)}>
                        </Button>
                    </Col>
                </Flex>)
        }
    ];


    function handleRedirectToDetail(order: Order) {
        router.push(`/orders/detail/${order._id}`)
    }

    function onStatusSelectChange(value: string) {
        dispatch(statusOrders(value))
    }

    function onSortChange(value: string) {
        dispatch(sortOrders(value))
    }

    function onSearchSubmit(value: string) {
        dispatch(searchOrders(value))
    }

    function handleChangePage(num: number) {
        dispatch(changeOrderPage(num))
    }

    function handleFilterRemove() {
        dispatch(clearOrderFilter())
    }

    function onSearchChange(e: ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value);
    }

    return (
        <div className='products-list-container'>
            <div className={styles['filter-navigator']}>
                <Row gutter={[16, 16]}>
                    <Col md={14} sm={24}>
                        <Row>
                            <Col md={2} sm={3}>
                                <Button icon={<FilterRemove />} onClick={handleFilterRemove}></Button>
                            </Col>
                            <Col md={22} sm={21}>
                                <Search
                                    placeholder="input search text"
                                    onSearch={onSearchSubmit}
                                    onChange={onSearchChange}
                                    value={search}
                                    enterButton
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col md={10} sm={24}>
                        <Row gutter={[16, 16]} justify={'end'}>
                            <Col>
                                <Select
                                    onChange={onStatusSelectChange}
                                    defaultValue={""} style={{ minWidth: '152px' }}
                                    value={orders.filter.status}
                                >
                                    <Select.Option value="">Show: Tất cả</Select.Option>
                                    <Select.Option value="Pending">Pending</Select.Option>
                                    <Select.Option value="Processing">Processing</Select.Option>
                                    <Select.Option value="Shipping">Shipping</Select.Option>
                                    <Select.Option value="Delivered">Delivered</Select.Option>
                                    <Select.Option value="Completed">Completed</Select.Option>
                                    <Select.Option value="Canceled">Canceled</Select.Option>
                                </Select>
                            </Col>
                            <Col>
                                <Select
                                    onChange={onSortChange}
                                    value={orders.filter.sort}
                                    defaultValue={""}
                                    style={{ minWidth: '152px' }}
                                >
                                    <Select.Option value="-createdAt">Mới nhất</Select.Option>
                                    <Select.Option value="createdAt">Cũ nhất</Select.Option>
                                </Select>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
            <div className='table-products-list'>
                <Table
                    dataSource={orders.data}
                    columns={columns}
                    rowKey='_id'
                    pagination={false}
                    scroll={{ x: 'max-content' }}
                    loading={loading}
                />
                <Paginator<OrdersState>
                    list={orders}
                    total={orders.total}
                    callback={handleChangePage}
                />
            </div>
        </div>
    )
}
