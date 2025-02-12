'use client'
import Location from '@/app/location/Location'
import styles from './order-detail.module.css'
import { orderApiRequest, UpdateOrder } from '@/app/fetch/order.api'
import { setNotify } from '@/libs/features/notifySlice'
import { getOrder, updateOrder, updateStatus } from '@/libs/features/orderDetailSlice'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { ShippingAddress } from '@/libs/interfaces/schema/address.interface'
import { Order } from '@/libs/interfaces/schema/order/order.interface'
import { HttpError } from '@/libs/utils/http'
import { UnknowAvatar } from '@/libs/utils/unknow-avatar'
import { CheckCircleOutlined, ClockCircleOutlined, DownOutlined, MailOutlined, PhoneOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { Avatar, Badge, Button, Card, Col, Dropdown, Flex, Form, Modal, Popconfirm, Radio, RadioChangeEvent, Row, Space, Tag, Typography } from 'antd'
import moment from 'moment'
import 'moment/locale/vi'
moment.locale('vi')
import React, { useEffect, useState } from 'react'
import ContactUpdate from '../../contact-update/ContactUpdate'

export default function OrderDetail({ params }: { params: { id: string } }) {
    const token = useAppSelector(state => state.auth).token
    const order = useAppSelector(state => state.orderDetail)
    const [loading, setLoading] = useState(false)
    const [orderDetail, setOrderDetail] = useState<Order>()
    const [status, setStatus] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [open, setOpen] = useState(false)
    const dispatch = useAppDispatch()

    const [address, setAddress] = useState<ShippingAddress | string>('')
    const [updateLoading, setUpdateLoading] = useState(false)
    const [openLocation, setOpenLocation] = useState(false)
    const [openContact, setOpenContact] = useState(false)
    const [contact, setContact] = useState<{ name: string, phone: string }>({ name: '', phone: '' })

    const saveChangeOrder = async (payload: UpdateOrder) => {
        if (!token) return;
        try {
            setUpdateLoading(true)
            await orderApiRequest.update(token, dispatch, params.id, payload)
            dispatch(updateOrder({ id: params.id, ...payload }))
        } catch (error) {
            if (error instanceof HttpError) {
                // Handle the specific HttpError
                console.log("Error message:", error.message);
                // Example: show error message to the user
                dispatch(setNotify({ error: error.message }))
            } else {
                // Handle other types of errors
                console.log("An unexpected error occurred:", error);
                dispatch(setNotify({ error: "An unexpected error occurred" }))
            }
        } finally {
            setUpdateLoading(false)
        }
    }

    const onContactUpdateSave = async (name: string, phone: string) => {
        await saveChangeOrder({ name, phone })
    }

    const items = [
        {
            label: <>
                <Form onFinish={() => handleSaveChangeStatus()}
                    disabled={loading}>
                    <Form.Item>
                        <Flex vertical gap="middle">
                            <Radio.Group onChange={onStatusChange} defaultValue="Pending" value={status}>
                                <Radio.Button value="Pending">chờ xử lý</Radio.Button>
                                <Radio.Button value="Processing">đang xử lý</Radio.Button>
                                <Radio.Button value="Shipping">đang giao</Radio.Button>
                                <Radio.Button value="Delivered">đã giao</Radio.Button>
                                <Radio.Button value="Completed">thành công</Radio.Button>
                                <Radio.Button value="Canceled">hủy</Radio.Button>
                            </Radio.Group>
                        </Flex>
                    </Form.Item>
                    {
                        status !== orderDetail?.status &&
                        <Form.Item>
                            <Button htmlType='submit' type='primary'>Lưu</Button>
                        </Form.Item>
                    }
                </Form></>,
            key: '0',
        }
    ]
    const handleOpenChange = (nextOpen: boolean, info: {
        source: "trigger" | "menu";
    }) => {
        if (info.source === 'trigger' || nextOpen) {
            setOpen(nextOpen);
        }
    };
    useEffect(() => {
        if (!params.id) return;
        if (token) {
            const fetchData = async () => {
                try {
                    if (order.data_cached.every(item => item._id !== params.id)) {
                        setLoading(true)
                        const res = await orderApiRequest.getOne(token, dispatch, params.id)
                        dispatch(getOrder(res.payload))
                        setOrderDetail(res.payload)
                        setStatus(res.payload.status)
                        setAddress(res.payload.address)
                        setContact({ name: res.payload.name, phone: res.payload.phone })
                        setLoading(false)
                    } else {
                        const order_cached = order.data_cached.find((data: Order) => data._id === params.id)
                        setOrderDetail(order_cached)
                        setStatus(order_cached?.status || '')
                        setAddress(order_cached?.address || '')
                        setContact({ name: order_cached?.name || '', phone: order_cached?.phone || '' })
                    }
                } catch (error) {
                    if (error instanceof HttpError) {
                        // Handle the specific HttpError
                        console.log("Error message:", error.message);
                        // Example: show error message to the user
                        dispatch(setNotify({ error: error.message }))
                    } else {
                        // Handle other types of errors
                        console.log("An unexpected error occurred:", error);
                        dispatch(setNotify({ error: "An unexpected error occurred" }))
                    }
                }
            }
            fetchData()
        }
    }, [token, params.id, dispatch, order.data_cached])

    const showModal = (callback: () => Promise<void>) => {
        return Modal.confirm({
            title: 'Xác nhận thành công.',
            content: 'Xác nhận đã thanh toán cho đơn hàng này?',
            onOk: () => callback(),
            footer: (_, { OkBtn, CancelBtn }) => (
                <>
                    <CancelBtn />
                    <OkBtn />
                </>
            ),
        });
    };

    const confirmCanceledModal = (callback: () => Promise<void>) => {
        return Modal.confirm({
            title: 'Xác nhận hủy.',
            content: 'Xác nhận hủy đơn hàng này? Các phương thức thanh toán trước sẽ được hoàn lại.',
            onOk: () => callback(),
            footer: (_, { OkBtn, CancelBtn }) => (
                <>
                    <CancelBtn />
                    <OkBtn />
                </>
            ),
        });
    };

    const updateOrderStatus = async () => {
        if (!token) return;
        try {
            await orderApiRequest.updateStatus(token, dispatch, params.id, { status })
            dispatch(updateStatus({ id: params.id, status }))
            if (isModalOpen) setIsModalOpen(false);
        } catch (error) {
            if (error instanceof HttpError) {
                // Handle the specific HttpError
                console.log("Error message:", error.message);
                // Example: show error message to the user
                dispatch(setNotify({ error: error.message }))
            } else {
                // Handle other types of errors
                console.log("An unexpected error occurred:", error);
                dispatch(setNotify({ error: "An unexpected error occurred" }))
            }
        }
    }

    const handleSaveChangeStatus = async () => {
        if (status === 'Completed') {
            showModal(updateOrderStatus)
        } else if (status === 'Canceled') {
            confirmCanceledModal(updateOrderStatus)
        } else {
            await updateOrderStatus()
        }
    }

    const saveAddress = async (data: ShippingAddress) => {
        setAddress(data)
        await saveChangeOrder({ address: data })
    }

    function onStatusChange(e: RadioChangeEvent) {
        setStatus(e.target.value)
    }

    return (
        <div className={styles['order-detail-container']}>
            <Space>
                <Typography.Text style={{ fontWeight: 'bold' }}>#{orderDetail?._id}</Typography.Text>
                <Typography.Text>{moment(orderDetail?.createdAt).format('LLLL')}</Typography.Text>
                {
                    orderDetail?.isPaid ?
                        <Tag icon={<CheckCircleOutlined />} color="success">
                            đã thanh toán
                        </Tag> :
                        <Tag icon={<ClockCircleOutlined />} color="default">
                            chưa thanh toán
                        </Tag>
                }
                {
                    orderDetail?.status === 'Pending' &&
                    <Tag color="cyan">chờ xử lý</Tag>
                }
                {
                    orderDetail?.status === 'Processing' &&
                    <Tag color="processing">đang xử lý</Tag>
                }
                {
                    orderDetail?.status === 'Shipping' &&
                    <Tag color="warning">đang giao</Tag>
                }
                {
                    orderDetail?.status === 'Delivered' &&
                    <Tag color="lime">đã giao</Tag>
                }
                {
                    orderDetail?.status === 'Completed' &&
                    <Tag color="success">thành công</Tag>
                }
                {
                    orderDetail?.status === 'Canceled' &&
                    <Tag color="default">đã hủy</Tag>
                }
            </Space>
            {
                (orderDetail?.status !== 'Completed' && orderDetail?.status !== 'Canceled') &&
                <div className={styles['change-status-dropdown']}>
                    <Dropdown
                        menu={{
                            items,
                        }}
                        onOpenChange={handleOpenChange}
                        open={open}
                    >
                        <a onClick={(e) => e.preventDefault()}>
                            <Space>
                                Trạng thái
                                <DownOutlined />
                            </Space>
                        </a>
                    </Dropdown>
                </div>
            }
            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                <Col lg={16} md={14} sm={24}>
                    <Card
                        title='Sản phẩm'
                    >
                        {
                            orderDetail?.items.map(item => (
                                <div key={item._id} style={{ width: '100%' }} className={styles['order-item']}>
                                    <Row justify='space-between'
                                        align='middle'
                                        gutter={[16, 16]}
                                        className={styles['order-item-container']}>
                                        <Col span={4}>
                                            <Badge count={item.quantity}>
                                                <Avatar shape="square" size="large" src={item.productId.images[0].url} />
                                            </Badge>
                                        </Col>
                                        <Col span={10}>
                                            <Typography.Text style={{ display: 'block', color: '#1677FF' }}>{item.productId.title}</Typography.Text>
                                            <Typography.Text style={{ color: '#666666' }}>SKU: {item.productId.product_sku}</Typography.Text>
                                        </Col>
                                        <Col span={6} style={{ textAlign: 'center' }}>
                                            <Typography.Text>${item.price}</Typography.Text> x <Typography.Text>{item.quantity}</Typography.Text>
                                        </Col>
                                        <Col span={4} style={{ textAlign: 'end' }}>
                                            <Typography.Text>${item.total}</Typography.Text>
                                        </Col>
                                    </Row>
                                </div>
                            ))
                        }
                    </Card>
                    <Card title='Thanh toán' style={{ margin: '16px 0' }}>
                        <div className={styles['order-payment-list']}>
                            <Flex className={styles['order-payment-item']} justify='space-between'>
                                <Typography.Text>Tổng sản phẩm: </Typography.Text>
                                <Typography.Text>${orderDetail?.total}</Typography.Text>
                            </Flex>
                            <Flex className={styles['order-payment-item']} justify='space-between'>
                                <Typography.Text>Giảm giá: </Typography.Text>
                                <Typography.Text>-$0</Typography.Text>
                            </Flex>
                            <Flex className={styles['order-payment-item']} justify='space-between'>
                                <Typography.Text>Phí vận chuyển: </Typography.Text>
                                <Typography.Text>$0</Typography.Text>
                            </Flex>
                            <Flex className={styles['order-payment-item']} justify='space-between'>
                                <Typography.Text>Thuế: 0%</Typography.Text>
                                <Typography.Text>$0</Typography.Text>
                            </Flex>
                            <Flex className={styles['order-payment-item']} justify='space-between'>
                                <Typography.Text style={{ fontWeight: 'bold' }}>
                                    Tổng thanh toán:
                                </Typography.Text>
                                <Typography.Text style={{ fontWeight: 'bold' }}>
                                    ${orderDetail?.total}
                                </Typography.Text>
                            </Flex>
                        </div>
                        <div className={styles['order-payment-method']}>
                            <Flex justify='space-between'>
                                <Typography.Text>
                                    Phương thức thanh toán:
                                </Typography.Text>
                                <Typography.Text>
                                    {orderDetail?.method}
                                </Typography.Text>
                            </Flex>
                        </div>
                    </Card>
                </Col>
                <Col lg={8} md={10} sm={24}>
                    <Card
                        title='Khách hàng'
                        extra={
                            <Avatar
                                src={orderDetail?.user.avatar || UnknowAvatar}
                                size='default'
                            />
                        }
                    >
                        <Typography.Text style={{ color: '#1677FF' }}>
                            {orderDetail?.name}
                        </Typography.Text>
                    </Card>
                    <Card title='Thông tin liên lạc'
                        extra={
                            <Typography.Link onClick={() => setOpenContact(true)}
                            >Chỉnh sửa</Typography.Link>
                        }
                        style={{ marginTop: '16px' }}
                    >
                        <Typography.Text
                            style={{ display: 'block', color: '#1677FF' }}
                        >
                            <MailOutlined style={{ marginRight: '10px' }}
                            />
                            {orderDetail?.email}
                        </Typography.Text>
                        <Typography.Text style={{ color: '#1677FF' }}>
                            <PhoneOutlined style={{ marginRight: '10px' }}
                            />{orderDetail?.phone}
                        </Typography.Text>
                    </Card>
                    <Card title='Địa chỉ giao hàng'
                        extra={
                            <Typography.Link
                                onClick={() => setOpenLocation(true)}
                            >Chỉnh sửa
                            </Typography.Link>
                        } style={{ marginTop: '16px' }}>
                        <Typography.Text>
                            {
                                orderDetail?.address &&
                                (orderDetail?.address.detailAddress) + ', '
                                + orderDetail?.address.ward?.label + ', '
                                + orderDetail?.address.district?.label + ', '
                                + orderDetail?.address.city?.label
                            }
                        </Typography.Text>
                    </Card>
                    <Location onSave={saveAddress}
                        openLocation={openLocation}
                        setOpenLocation={setOpenLocation}
                        updateLoading={updateLoading}
                        initAddress={address}
                    />
                    <ContactUpdate
                        openContact={openContact}
                        setOpenContact={setOpenContact}
                        updateLoading={updateLoading}
                        onSave={onContactUpdateSave}
                        contact={contact}
                        setContact={setContact}
                    />
                </Col>
            </Row>
        </div>
    )
}
