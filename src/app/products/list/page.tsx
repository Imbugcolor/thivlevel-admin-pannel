'use client'
import { useAppDispatch, useAppSelector } from '@/libs/hooks';
import styles from './productlist.module.css';
import { Product } from '@/libs/interfaces/schema/product/product.interface';
import { DeleteOutlined, EyeOutlined, FormOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Flex, Popconfirm, Row, Select, Switch, Table, Tag, Typography } from 'antd';
import Search from 'antd/es/input/Search';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useEffect, useState } from 'react'
import Paginator from '@/app/components/paginator/Paginator';
import { changePage, filterCategory, getProducts, removeAllFilter, searchProducts, sortProducts } from '@/libs/features/productSlice';
import { productsApiRequest } from '@/app/fetch/product.api';
import { HttpError } from '@/libs/utils/http';
import { setNotify } from '@/libs/features/notifySlice';
import FilterRemove from '@/app/icons/FilterRemove';

export interface ProductState {
  data: Product[];
  total: number;
  page: number;
  filter: unknown;
}

export default function ProductList() {
  const products = useAppSelector(state => state.products)
  const categories = useAppSelector(state => state.categories)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      setSearch(products.filter.search || '')
      try {
        const response = await productsApiRequest.getProducts(10, products.page, products.filter)
        dispatch(getProducts({
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
  }, [dispatch, products.page, products.filter])

  const columns = [
    {
      title: 'SKU',
      dataIndex: 'product_sku',
      key: 'product_sku',
    },
    {
      title: 'Tên',
      key: 'title',
      render: (_: string, record: Product) => (
        <Flex justify='flex-start' align='center'>
          <Avatar src={record.images[0].url} size={'default'} />
          <Typography.Text>{record.title}</Typography.Text>
        </Flex>
      )
    },
    {
      title: 'Danh mục',
      dataIndex: ["category", "name"],
      key: 'category',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isPublished',
      key: 'isPublished',
      render: (status: string) => <Tag color={status ? "success" : 'error'}>{status ? 'Đang bán' : 'Dừng bán'}</Tag>,
    },
    {
      title: 'Chi tiết',
      key: 'view',
      render: (_: string, record: Product) => (
        <Flex justify='center'>
          <EyeOutlined onClick={() => handleViewDetail(record)} style={{ fontSize: '18px' }} />
        </Flex>
      )
    },
    {
      title: 'Ẩn/hiện',
      key: 'show',
      render: (_: string, record: Product) => (<Switch checked={record.isPublished} onChange={() => handleShowOrHideProduct(record)} />)
    },
    {
      title: 'Tùy chọn',
      key: 'modify',
      render: (_: string, record: Product) => (
        <Flex justify='center' gap={15}>
          <Col>
            <Button 
              icon={<FormOutlined style={{ fontSize: '18px' }} />} 
              onClick={() => handleRedirectToUpdate(record)}>
            </Button>
          </Col>
          <Col>
            <Popconfirm
              title="Xoá sản phẩm"
              description="Bạn có chắc muốn xóa sản phẩm này không?"
              onConfirm={() => handleDeleteProduct(record)}
              icon={
                <QuestionCircleOutlined
                  style={{
                    color: 'red',
                  }}
                />
              }
            >
              <Button icon={<DeleteOutlined style={{ fontSize: '18px' }} />}></Button>
            </Popconfirm>
          </Col>
        </Flex>)
    }
  ];

  function handleViewDetail(product: Product) {
    console.log(product);
  }

  function handleShowOrHideProduct(product: Product) {

  }

  function handleRedirectToUpdate(product: Product) {
    router.push(`/products/update/${product._id}`)
  }

  async function handleDeleteProduct(product: Product) {
    console.log(product);
  }

  async function onCategoryChange(value: string) {
    dispatch(filterCategory(value))
  }

  function onSortChange(value: string) {
    dispatch(sortProducts(value))
  }

  function onSearch(value: string) {
    dispatch(searchProducts(value))
  }

  function handleChangePage(num: number) {
    dispatch(changePage(num))
  }

  function handleFilterRemove() {
    dispatch(removeAllFilter())
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
              <Col>
                <Select
                  onChange={onCategoryChange}
                  defaultValue={""} style={{ minWidth: '152px' }}
                  value={products.filter.category}
                >
                  <Select.Option value="">Show: Tất cả</Select.Option>
                  {
                    categories.data.map(cate => (
                      <Select.Option key={cate._id} value={cate._id}>{cate.name}</Select.Option>
                    ))
                  }
                </Select>
              </Col>
              <Col>
                <Select
                  onChange={onSortChange}
                  value={products.filter.sort}
                  defaultValue={""}
                  style={{ minWidth: '152px' }}
                >
                  <Select.Option value="">Sắp xếp: Tự động</Select.Option>
                  <Select.Option value="-createdAt">Mới nhất</Select.Option>
                  <Select.Option value="createdAt">Cũ nhất</Select.Option>
                  <Select.Option value="-sold">Best sales</Select.Option>
                  <Select.Option value="-rating">Best rating</Select.Option>
                  <Select.Option value="-price">Giá: Cao -&gt; Thấp</Select.Option>
                  <Select.Option value="price">Giá: Thấp -&gt; Cao</Select.Option>
                </Select>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <div className='table-products-list'>
        <Table
          dataSource={products.data}
          columns={columns} rowKey='_id'
          pagination={false}
          scroll={{ x: 'max-content' }}
          loading={loading}
        />
        <Paginator<ProductState>
          list={products}
          total={products.total}
          callback={handleChangePage}
        />
      </div>
    </div>
  )
}
