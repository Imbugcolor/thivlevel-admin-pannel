"use client";
import React, {ChangeEvent, useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "@/libs/hooks";
import {useRouter} from "next/navigation";
import {HttpError} from "@/libs/utils/http";
import {setNotify} from "@/libs/features/notifySlice";
import {Avatar, Button, Col, Flex, Popconfirm, Row, Select, Switch, Table, Tag, Typography} from "antd";
import {DeleteOutlined, EyeOutlined, FormOutlined, QuestionCircleOutlined} from "@ant-design/icons";
import styles from '@/app/users/users.module.css'
import FilterRemove from "@/app/icons/FilterRemove";
import Search from "antd/es/input/Search";
import Paginator from "@/app/components/paginator/Paginator";
import {userAdminApiRequest} from "@/app/fetch/user.admin.api";
import {changeUserPage, clearUserFilter, getUsers, searchUsers, sortUsers, UsersState} from "@/libs/features/userSlice";
import {User} from "@/libs/interfaces/schema/user.interface";

const Users = () => {
    const users = useAppSelector(state => state.users)
    const dispatch = useAppDispatch()
    const router = useRouter()
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)
    const token = useAppSelector(state => state.auth).token

    useEffect(() => {
        const fetch = async () => {
            if (token) {
                setLoading(true)
                setSearch(users.filter.search || '')
                try {
                    const response = await userAdminApiRequest.getUsers(token, dispatch, 10, users.page, users.filter)
                    dispatch(getUsers({
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
        }
        fetch()
    }, [dispatch, users.page, users.filter, token])

    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
        },
        {
            title: 'Tên người dùng',
            key: 'username',
            render: (_: string, record: User) => (
                <Flex justify='flex-start' align='center'>
                    <Avatar src={record.avatar} size={'default'} />
                    <Typography.Text style={{ marginLeft: '6px' }}>{record.username}</Typography.Text>
                </Flex>
            )
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            // render: (status: string) => <Tag color={status ? "success" : 'error'}>{status ? 'Đang bán' : 'Dừng bán'}</Tag>,
        },
        {
            title: 'Chi tiết',
            key: 'view',
            render: (_: string, record: User) => (
                <Flex justify='center'>
                    <EyeOutlined onClick={() => handleViewDetail(record)} style={{ fontSize: '18px' }} />
                </Flex>
            )
        },
        {
            title: 'Tùy chọn',
            key: 'modify',
            render: (_: string, record: User) => (
                <Flex justify='center' gap={15}>
                    <Col>
                        <Button
                            icon={<FormOutlined style={{ fontSize: '18px' }} />}
                            onClick={() => handleRedirectToUpdate(record)}>
                        </Button>
                    </Col>
                    {/*<Col>*/}
                    {/*    <Popconfirm*/}
                    {/*        title="Chặn người dùng."*/}
                    {/*        description="Bạn có chắc muốn xóa sản phẩm này không?"*/}
                    {/*        onConfirm={() => handleDeleteProduct(record)}*/}
                    {/*        icon={*/}
                    {/*            <QuestionCircleOutlined*/}
                    {/*                style={{*/}
                    {/*                    color: 'red',*/}
                    {/*                }}*/}
                    {/*            />*/}
                    {/*        }*/}
                    {/*    >*/}
                    {/*        <Button icon={<DeleteOutlined style={{ fontSize: '18px' }} />}></Button>*/}
                    {/*    </Popconfirm>*/}
                    {/*</Col>*/}
                </Flex>)
        }
    ];

    function handleViewDetail(user: User) {
        console.log(user);
    }

    function handleRedirectToUpdate(user: User) {
        router.push(`/users/update/${user._id}`)
    }

    // async function handleDeleteProduct(product: Product) {
    //     if (!token) return;
    //     try {
    //         await productsApiRequest.delete(token, dispatch, product._id)
    //         dispatch(deleteProductAction(product._id))
    //     } catch (error) {
    //         if (error instanceof HttpError) {
    //             console.log("Error message:", error.message);
    //             dispatch(setNotify({ error: error.message }))
    //         } else {
    //             console.log("An unexpected error occurred:", error);
    //             dispatch(setNotify({ error: "Có lỗi xảy ra." }))
    //         }
    //     }
    // }

    function onSortChange(value: string) {
        dispatch(sortUsers(value))
    }

    function onSearch(value: string) {
        dispatch(searchUsers(value))
    }

    function handleChangePage(num: number) {
        dispatch(changeUserPage(num))
    }

    function handleFilterRemove() {
        dispatch(clearUserFilter())
    }

    function onSearchChange(e: ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value);
    }

    return (
        <div className='users-list-container'>
            <div className={styles['filter-navigator']}>
                <Row gutter={[16, 16]}>
                    <Col md={14} sm={24}>
                        <Row>
                            <Col md={2} sm={3}>
                                <Button icon={<FilterRemove />} onClick={handleFilterRemove}></Button>
                            </Col>
                            <Col md={22} sm={21}>
                                <Search
                                    placeholder="Nhập từ khóa tìm kiếm"
                                    onSearch={onSearch}
                                    onChange={onSearchChange}
                                    value={search}
                                    enterButton
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col md={10} sm={24}>
                        <Row gutter={[16, 16]} justify={'end'}>
                            {/*<Col>*/}
                            {/*    <Select*/}
                            {/*        onChange={onCategoryChange}*/}
                            {/*        defaultValue={""} style={{ minWidth: '152px' }}*/}
                            {/*        value={products.filter.category}*/}
                            {/*    >*/}
                            {/*        <Select.Option value="">Show: Tất cả</Select.Option>*/}
                            {/*        {*/}
                            {/*            categories.data.map(cate => (*/}
                            {/*                <Select.Option key={cate._id} value={cate._id}>{cate.name}</Select.Option>*/}
                            {/*            ))*/}
                            {/*        }*/}
                            {/*    </Select>*/}
                            {/*</Col>*/}
                            <Col>
                                <Select
                                    onChange={onSortChange}
                                    value={users.filter.sort}
                                    defaultValue={""}
                                    style={{ minWidth: '152px' }}
                                >
                                    <Select.Option value="">Sắp xếp: Tự động</Select.Option>
                                    <Select.Option value="-createdAt">Mới nhất</Select.Option>
                                    <Select.Option value="createdAt">Cũ nhất</Select.Option>
                                </Select>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
            <div className='table-users-list'>
                <Table
                    dataSource={users.data}
                    columns={columns} rowKey='_id'
                    pagination={false}
                    scroll={{ x: 'max-content' }}
                    loading={loading}
                />
                <Paginator<UsersState>
                    list={users}
                    total={users.total}
                    callback={handleChangePage}
                />
            </div>
        </div>
    );
};

export default Users;