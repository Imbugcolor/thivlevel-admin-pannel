'use client'
import styles from './productlist.module.css';
import { Product } from '@/app/interfaces/product/product.interface';
import { DeleteOutlined, EyeOutlined, FormOutlined } from '@ant-design/icons';
import { Col, Flex, Row, Select, Switch, Table, Tag } from 'antd';
import Search from 'antd/es/input/Search';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useState } from 'react'

const data: Product[] = [
  {
    _id: "64bf934ded0c1837dd8ee97b",
    title: "quần jean pro11qj",
    description: "Quần Jean Pro11qj",
    content: "test 3",
    price: 22,
    images: [
      {
        public_id: "mern-shop-ts/guntpjgzkqpfvlsugjhb",
        url: "https://res.cloudinary.com/vyvie-gram/image/upload/v1687699570/mern-shop-ts/guntpjgzkqpfvlsugjhb.png"
      },
      {
        public_id: "nestjs-app-images/mda6kuehzjwfzme6hdqy",
        url: "https://res.cloudinary.com/dnv2v2tiz/image/upload/v1727426837/nestjs-app-images/mda6kuehzjwfzme6hdqy.jpg"
      }
    ],
    category: {
      _id: "64bf930bed0c1837dd8ee977",
      name: "Quần Jean",
      createdAt: "2023-07-25T09:16:59.625Z",
      updatedAt: "2023-07-25T09:16:59.625Z"
    },
    variants: [
      {
        _id: "64bf934ded0c1837dd8ee97c",
        size: "L",
        color: "Đen",
        inventory: 8
      },
      {
        _id: "64bf934ded0c1837dd8ee97e",
        size: "L",
        color: "Đỏ",
        inventory: 0
      },
      {
        _id: "64bf934ded0c1837dd8ee97d",
        size: "L",
        color: "Trắng",
        inventory: 10
      }
    ],
    sold: 6,
    rating: 3.6785714285714284,
    numReviews: 28,
    isPublished: false,
    createdAt: "2023-07-25T09:18:05.296Z",
    updatedAt: "2024-10-05T15:00:49.257Z",
    product_sku: "PRO21QJ",
    isDeleted: false,
    deletedAt: "2024-10-05T14:58:37.514Z"
  }
]

export interface ProductState {
  data: Product[];
  total: number;
  page: number;
  filter: unknown;
}

export default function ProductList() {
  const [products, setProducts] = useState(data);
  const router = useRouter()

  const filterInitial = {
    category: '',
    search: '',
    sort: '',
  }

  const [filter, setFilter] = useState(filterInitial);
  const [searchInput, setSearchInput] = useState(filter.search);

  const columns = [
    {
      title: 'SKU',
      dataIndex: 'product_sku',
      key: 'product_sku',
    },
    {
      title: 'Tên',
      dataIndex: 'title',
      key: 'title',
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
          <Col><FormOutlined onClick={() => handleRedirectToUpdate(record)} style={{ fontSize: '18px' }} /></Col>
          <Col><DeleteOutlined onClick={() => handleDeleteProduct(record)} style={{ fontSize: '18px' }} /></Col>
        </Flex>)
    }
  ];

  function handleViewDetail(product: Product) {
    console.log(product);
  }

  function handleShowOrHideProduct(product: Product) {
    const updatedData = data.map(item => {
      if (item._id === product._id) {
        return { ...item, isPublished: !product.isPublished }
      }
      return item;
    })
    setProducts(updatedData);
  }

  function handleRedirectToUpdate(product: Product) {
    router.push(`/products/update/${product._id}`)
  }

  function handleDeleteProduct(product: Product) {
    const _data = data.filter(item => item._id !== product._id);
    setProducts(_data)
  }

  function onSearchChange(e: ChangeEvent<HTMLInputElement>) {
    setSearchInput(e.target.value);
  }

  function onCategoryChange(value: string) {
    const _filter = { ...filter, category: value }
    setFilter(_filter);
  }

  function onSortChange(value: string) {
    const _filter = { ...filter, sort: value }
    setFilter(_filter);
  }

  function onSearch(value: string) {
    const _filter = { ...filter, search: value }
    setFilter(_filter);
  }

  return (
    <div className='products-list-container'>
      <div className={styles['filter-navigator']}>
          <Row gutter={[16, 16]}>
            <Col md={14} sm={24}>
              <Search placeholder="input search text" onSearch={onSearch} enterButton value={searchInput} onChange={onSearchChange} />
            </Col>
            <Col md={10} sm={24}>
                <Row gutter={[16, 16]} justify={'end'}>
                  <Col>
                    <Select onChange={onCategoryChange} value={filter.category}>
                      <Select.Option value="">Show: Tất cả</Select.Option>
                    </Select>
                  </Col>
                  <Col>
                    <Select onChange={onSortChange} value={filter.sort}>
                      <Select.Option value="">Sắp xếp: Tự động</Select.Option>
                      <Select.Option value="sort=-createdAt">Mới nhất</Select.Option>
                      <Select.Option value="sort=createdAt">Cũ nhất</Select.Option>
                      <Select.Option value="sort=-sold">Best sales</Select.Option>
                      <Select.Option value="sort=-rating">Best rating</Select.Option>
                      <Select.Option value="sort=-price">Giá: Cao -&gt; Thấp</Select.Option>
                      <Select.Option value="sort=price">Giá: Thấp -&gt; Cao</Select.Option>
                    </Select>
                  </Col>
                </Row>
            </Col>
          </Row>
      </div>
      <div className='table-products-list'>
        <Table 
          dataSource={products} 
          columns={columns} rowKey='_id' 
          pagination={false} 
          scroll={{ x: 'max-content'}}
        />
        {/* <Paginator<ProductState>  
            list={products}
            total={products.total}
            callback={handleChangePage}
        /> */}
      </div>
    </div>
  )
}
