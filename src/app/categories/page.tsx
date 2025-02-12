'use client'
import { createCategory, deleteCategory, updateCategory } from '@/libs/features/categorySlice'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { Category } from '@/libs/interfaces/schema/category/category.interface'
import { HttpError } from '@/libs/utils/http'
import React, { useState } from 'react'
import { categoryApiRequest } from '../fetch/category.api'
import { setNotify } from '@/libs/features/notifySlice'
import { Button, Card, Col, Flex, Form, Input, Modal, Popconfirm, Row } from 'antd'
import { DeleteOutlined, FormOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import Meta from 'antd/es/card/Meta'

export default function Categories() {
  const [form] = Form.useForm()
  const token = useAppSelector(state => state.auth).token
  const categories = useAppSelector(state => state.categories).data
  const dispatch = useAppDispatch()
  const [category, setCategory] = useState('')
  const [onEdit, setOnEdit] = useState<Category | null>(null)
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const editCategory = (category: Category) => {
    setOnEdit(category)
    setCategory(category.name)
    form.setFieldValue('category', category.name)
    setOpenCreateModal(true)
  }

  const handleSubmit = async (values: { category: string }) => {
    if (!token || !values.category) return;
    try {
      if (onEdit) {
        setLoading(true)
        const res = await categoryApiRequest.update(token, dispatch, onEdit._id, { name: values.category })
        dispatch(updateCategory(res.payload))
        setOnEdit(null)
        form.setFieldValue('category', '')
        setCategory('')
        dispatch(setNotify({ success: "Cập nhật thành công." }))
      } else {
        const res = await categoryApiRequest.create(token, dispatch, { name: values.category })
        dispatch(createCategory(res.payload))
        form.setFieldValue('category', '')
        setCategory('')
        dispatch(setNotify({ success: "Tạo thành công." }))
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
    } finally {
      setLoading(false)
    }
  }

  const handledeleteCategory = async (category: Category) => {
    if (!token) return;
    try {
      const res = await categoryApiRequest.delete(token, dispatch, category._id)
      dispatch(deleteCategory(category._id))
      console.log(res.payload)
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

  const onCreateNew = () => {
    form
      .validateFields()
      .then(async (values) => {
        await handleSubmit(values);
        setOpenCreateModal(false)
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  }

  const handleCancel = () => {
    if (onEdit) {
      setOnEdit(null)
      setCategory('')
      form.setFieldValue('category', '')
    } else {
      setCategory('')
      form.setFieldValue('category', '')
    }
    setOpenCreateModal(false);
  }

  return (
    <>
      <Flex className='content-header'>
        <h2 style={{ marginRight: '16px' }}>Danh mục sản phẩm</h2>
        <Button 
          type='default' 
          onClick={() => setOpenCreateModal(true)} 
          icon={<PlusOutlined />}>
        </Button>
      </Flex>
      <div className="categories-wrapper" style={{ marginTop: '16px' }}>
        <div className="categories">
          <Modal
            title={onEdit ? "Cập nhật danh mục" : "Thêm danh mục"}
            open={openCreateModal}
            onOk={onCreateNew}
            confirmLoading={loading}
            onCancel={handleCancel}
          >
            <Form style={{ margin: '16px 0' }} form={form} layout='vertical'>
              <Form.Item
                label='Tên danh mục'
                name='category'
                rules={[{ required: true, message: 'Không thể để trống.' }]}
              >
                <Input placeholder='Tên danh mục...' />
              </Form.Item>
            </Form>
          </Modal>

          <Row gutter={[16, 16]}>
            {
              categories.map(category => (
                <Col key={category._id} lg={8} md={12} sm={24}>
                  <Card
                    actions={[
                      <Button key="config"
                        icon={<FormOutlined style={{ fontSize: '18px' }} />}
                        onClick={() => editCategory(category)}
                      ></Button>,
                      <Popconfirm key='delete'
                        title="Xoá sản phẩm"
                        description="Bạn có chắc muốn xóa sản phẩm này không?"
                        onConfirm={() => handledeleteCategory(category)}
                        icon={
                          <QuestionCircleOutlined
                            style={{
                              color: 'red',
                            }}
                          />
                        }
                      >
                        <Button icon={<DeleteOutlined style={{ fontSize: '18px' }} />}></Button>
                      </Popconfirm>,
                    ]}
                  >
                    <Meta
                      title={category.name}
                    />
                  </Card>
                </Col>
              ))
            }
          </Row>
        </div>
      </div>
    </>
  )
}