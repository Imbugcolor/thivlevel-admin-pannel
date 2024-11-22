'use client'
import { Variant } from '@/libs/interfaces/schema/variant/variant.interface';
import styles from './create-product.module.css';
import { DeleteOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, Row, Select, Space, Switch, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { RcFile, UploadFile } from 'antd/es/upload';
import React, { ChangeEvent, useState } from 'react'
import ReactQuill from 'react-quill';
import { useAppDispatch, useAppSelector } from '@/libs/hooks';
import { setNotify } from '@/libs/features/notifySlice';
import { HttpError } from '@/libs/utils/http';
import { uploadApiRequest } from '@/app/fetch/upload.api';
import { productsApiRequest } from '@/app/fetch/product.api';

interface CreateProductInput {
  category: string
  content: string
  description: string
  images: RcFile[]
  isPublished?: boolean
  price: number
  product_sku: string
  title: string
}
interface UploadedImage {
  uid: string;
  public_id: string;
  url: string;
}

export default function CreateProduct() {
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<RcFile[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [colors, setColors] = useState<string[]>([''])
  const [sizes, setSizes] = useState<string[]>([''])
  const [inStockApplyToAll, setInStockApplyToAll] = useState<number | string>('');
  const [inventory, setInventory] = useState(
    colors.flatMap(color => sizes.map(size => ({ color, size, quantity: 0 })))
  );
  const dispatch = useAppDispatch()
  const token = useAppSelector(state => state.auth).token
  const categories = useAppSelector(state => state.categories).data
  const [loading, setLoading] = useState(false)
  const validateFileType = (
    { type, name }: RcFile,
    allowedTypes?: string | string[]
  ) => {
    if (!allowedTypes || allowedTypes.length < 1) {
      return true;
    }

    if (type) {
      return allowedTypes.includes(type);
    }
  };

  const validateFileSize = ({ size }: RcFile, limit: number) => {
    if (size > limit) {
      return false;
    }
    return true;
  }

  const uploadProps = {
    beforeUpload: (file: RcFile, fileList: RcFile[]) => {
      setFileList((prev) => [...prev, ...fileList])
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        dispatch(setNotify({ error: 'You can only upload JPG/PNG files.' }));
        return Upload.LIST_IGNORE;
      }
      const isAllowedSize = validateFileSize(file, 5 * 1024 * 1024)
      if (!isAllowedSize) {
        dispatch(setNotify({ error: 'File cannot exceed 5mb.' }));
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    onRemove: async (file: UploadFile) => {
      const uploadedImage = uploadedImages.find(image => image.uid === file.uid)
      if (token && uploadedImage && fileList.some((item) => item.uid === file.uid)) {
        try {
          const public_ids = [uploadedImage.public_id]
          await uploadApiRequest.destroyImages(token, dispatch, public_ids)
          setFileList((fileList) =>
            fileList.filter((item) => item.uid !== file.uid)
          );
          setUploadedImages((uploaded) => uploaded.filter((item) => item.uid !== file.uid))
          return true;
        } catch (error) {
          if (error instanceof HttpError) {
            console.log("Error message:", error.message);
            dispatch(setNotify({ error: error.message }))
            return false
          } else {
            console.log("An unexpected error occurred:", error);
            dispatch(setNotify({ error: "An unexpected error occurred" }))
            return false
          }
        }
      }
      return false;
    }
  }

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const addColor = () => {
    const newColors = [...colors, ''];
    setColors(newColors);
    // Synchronize form fields with the new sizes
    const fields: { [key: string]: string } = {};
    newColors.forEach((color, index) => {
      fields[`color-${index}`] = color;
    });
    form.setFieldsValue(fields);
  }

  const handleOnChangeColorInput = (e: ChangeEvent<HTMLInputElement>, idx: number) => {
    const newColors = colors.map((cl, index) => {
      return index === idx ? cl = e.target.value : cl
    })

    setColors(newColors)
  }

  const removeColor = (idx: number) => {
    const newColors = colors.filter((_, index) => index !== idx)
    setColors(newColors)
    if (newColors.length === 0) {
      // Reset the form if all sizes are removed
      form.resetFields();
    } else {
      // Otherwise, synchronize form fields with the new sizes
      const fields: { [key: string]: string } = {};
      newColors.forEach((color, index) => {
        fields[`color-${index}`] = color;
      });
      form.setFieldsValue(fields);
    }
  }

  // Add new size
  const addSize = () => {
    const newSizes = [...sizes, ''];
    setSizes(newSizes);
    // Synchronize form fields with the new sizes
    const fields: { [key: string]: string } = {};
    newSizes.forEach((size, index) => {
      fields[`size-${index}`] = size;
    });
    form.setFieldsValue(fields);
  };


  const handleOnChangeSizeInput = (e: ChangeEvent<HTMLInputElement>, idx: number) => {
    const newSizes = sizes.map((size, index) => {
      return index === idx ? size = e.target.value : size
    })

    setSizes(newSizes)
  }

  const removeSize = (idx: number) => {
    const newSizes = sizes.filter((_, index) => index !== idx);
    setSizes(newSizes);
    if (newSizes.length === 0) {
      // Reset the form if all sizes are removed
      form.resetFields();
    } else {
      // Otherwise, synchronize form fields with the new sizes
      const fields: { [key: string]: string } = {};
      newSizes.forEach((size, index) => {
        fields[`size-${index}`] = size;
      });
      form.setFieldsValue(fields);
    }
  }

  const handleOnChangeInputInventory = (e: ChangeEvent<HTMLInputElement>, color: string, size: string) => {
    const newValue = parseInt(e.target.value) || 0;
    console.log(newValue)
    if (inventory.find(item => item.color == color && item.size == size)) {
      // Update the specific product variation
      setInventory((prevInventory) =>
        prevInventory.map(item =>
          item.color === color && item.size === size
            ? { ...item, quantity: newValue }
            : item
        )
      );
    } else {
      // Update the inventory object directly using color-size as a key
      setInventory((prevInventory) => ([
        ...prevInventory,
        { color, size, quantity: newValue }
      ]));
    }
  }

  const applyToAll = () => {
    if (colors.length > 0 && sizes.length > 0) {
      if (inStockApplyToAll) {
        setInventory([])
        colors.forEach(color => {
          sizes.forEach(size => {
            setInventory((prevInventory) => ([
              ...prevInventory,
              { color, size, quantity: parseInt(inStockApplyToAll as string) }
            ]));
          })
        })
      }
    }
  }

  const handleCreateProductSubmit = async (values: CreateProductInput) => {
    if (!token) return;
    const variants: Variant[] = []

    colors.forEach(color => {
      sizes.forEach(size => {
        const quantity = inventory.find(item => item.color == color && item.size == size)?.quantity || 0
        const variant: Variant = { size, color, inventory: quantity }
        variants.push(variant)
      })
    })

    try {
      setLoading(true)
      const images = uploadedImages.map(uploaded => {
        return { url: uploaded.url, public_id: uploaded.public_id }
      })
      const body = {
        product_sku: values.product_sku,
        title: values.title,
        price: Number(values.price),
        description: values.description,
        content: values.content,
        category: values.category,
        variants,
        images,
        isPublished: values.isPublished ? true : false,
      }

      await productsApiRequest.create(token, dispatch, body)

      dispatch(setNotify({ success: 'Tạo sản phẩm thành công' }))
      setColors([])
      setSizes([])
      setUploadedImages([])
      setInStockApplyToAll('')
      form.resetFields()

    } catch (error) {
      if (error instanceof HttpError) {
        // Handle the specific HttpError
        console.log("Error message:", error.message);
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

  // Custom upload request for backend
  const customRequest = async ({ file, onSuccess, onError }: any) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await uploadApiRequest.uploadImage(formData);
      setUploadedImages((prev) =>
        [...prev, {
          uid: file.uid,
          public_id: response.payload.public_id,
          url: response.payload.url
        }]
      )
      onSuccess?.('Upload successful');
    } catch (error) {
      if (error instanceof HttpError) {
        // Handle the specific HttpError
        console.log("Error message:", error.message);
        onError?.(error.message);
      } else {
        // Handle other types of errors
        console.log("An unexpected error occurred:", error);
        onError?.("An unexpected error occurred");
      }
    }
  };

  return (
    <Form
      form={form}
      labelCol={{
        span: 4,
      }}
      wrapperCol={{
        span: 14,
      }}
      layout="horizontal"
      style={{
        maxWidth: 600,
      }}
      onFinish={(values) => handleCreateProductSubmit(values)}
      disabled={loading}
    >
      <Form.Item
        label="Mã SP"
        name={'product_sku'}
        rules={[
          {
            required: true,
            message: "Mã sản phẩm không thể để trống.",
          },
        ]}
      >
        <Input placeholder='SKU' />
      </Form.Item>
      <Form.Item
        label="Tên SP"
        name={'title'}
        rules={[
          {
            required: true,
            message: "Tên sản phẩm không thể để trống.",
          },
        ]}
      >
        <Input placeholder='Tên sản phẩm...' />
      </Form.Item>
      <Form.Item label="Giá tiền" name={'price'} rules={[
        {
          type: "number",
          required: true,
          message: "Giá tiền không thể để trống.",
        },
      ]}>
        <InputNumber placeholder='$ Giá tiền ($USD)' addonAfter="$" />
      </Form.Item>
      <Form.Item
        label="Danh mục"
        name={'category'}
        rules={[
          {
            required: true,
            message: "Danh mục không thể để trống.",
          },
        ]}
      >
        <Select>
          {
            categories.map(item => (
              <Select.Option key={item._id} value={item._id}>{item.name}</Select.Option>
            ))
          }
        </Select>
      </Form.Item>
      <Form.Item label="Mô tả" name={'description'}>
        <TextArea rows={4} placeholder='Mô tả sản phẩm...' />
      </Form.Item>
      <Form.Item 
        label="Nội dung" 
        name={'content'} 
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <ReactQuill />
        {/* <TextArea rows={4} placeholder='Nội dung chi tiết...' /> */}
      </Form.Item>
      <Form.Item label="Ẩn/hiện" valuePropName="checked" name={'isPublished'}>
        <Switch />
      </Form.Item>
      <Form.Item
        label="Upload"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        name={'images'}
        rules={[
          {
            required: true,
            message: "Hình ảnh không thể để trống.",
          },
          {
            validator: (_, fileList) => {
              return new Promise((resolve, reject) => {
                let count = 0;
                let message = '';
                if (!fileList) {
                  return reject('Chưa chọn hình ảnh.')
                }
                fileList.forEach((file: RcFile) => {
                  const isAllowedType = validateFileType(file, ["image/png", "image/jpeg"]);
                  const isAllowedSize = validateFileSize(file, 5 * 1024 * 1024)
                  if (!isAllowedType) {
                    message = `${fileList[0].name} không đúng định dạng.`
                    return count++
                  }
                  if (!isAllowedSize) {
                    message = `${fileList[0].name} đã vượt quá 5mb.`
                    return count++
                  }
                })
                if (count > 0) {
                  return reject(message)
                }
                return resolve('Upload thành công.')
              })
            }
          }
        ]}
      >
        <Upload
          listType="picture-card"
          multiple
          {...uploadProps}
          fileList={fileList}
          customRequest={customRequest}
        >
          <button
            style={{
              border: 0,
              background: 'none',
            }}
            type="button"
          >
            <PlusOutlined />
            <div
              style={{
                marginTop: 8,
              }}
            >
              Upload
            </div>
          </button>
        </Upload>
      </Form.Item>
      <Form.Item label="Biến thể">
        <Form.Item label={
          <p style={{ minWidth: '80px', textAlign: 'left' }}>Màu sắc</p>}
        >
          <div className="color-options">
            {
              colors.length > 0 && colors.map((color, idx) => (
                <div key={idx} className="color-input" style={{ marginBottom: '10px' }}>
                  <Row align={'middle'} gutter={[16, 16]}>
                    <Col>
                      <Form.Item name={`color-${idx}`} rules={[
                        { required: true },
                        () => ({
                          validator(_, value) {
                            const duplicates = colors.filter(
                              (item, index) => item === value && index !== idx
                            );
                            if (duplicates.length > 0) {
                              return Promise.reject(`color-${idx + 1} is duplicated.`);
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                        initialValue={color}
                        noStyle>
                        <Input
                          type="text"
                          value={color}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => handleOnChangeColorInput(e, idx)}
                          placeholder="Màu sắc: (đen, trắng, vv...)"
                          showCount
                          maxLength={20}
                        />
                      </Form.Item>
                    </Col>
                    <Col>
                      {
                        idx !== 0 &&
                        <DeleteOutlined onClick={() => removeColor(idx)} />
                      }
                    </Col>
                  </Row>
                </div>
              ))
            }
            <div className='add-option'
              onClick={addColor}
              style={{ marginBottom: '10px', cursor: 'pointer' }}>
              <PlusCircleOutlined /> Thêm màu sắc
            </div>
          </div>
        </Form.Item>

        <Form.Item label={
          <p style={{ minWidth: '80px', textAlign: 'left' }}>Kích thước</p>}>
          <div className="size-options">
            {
              sizes.length > 0 && sizes.map((size, idx) => (
                <div key={idx} className="size-input" style={{ marginBottom: '10px' }}>
                  <Row align={'middle'} gutter={[16, 16]}>
                    <Col>
                      <Form.Item name={`size-${idx}`} rules={[
                        { required: true },
                        () => ({
                          validator(_, value) {
                            const duplicates = sizes.filter(
                              (item, index) => item === value && index !== idx
                            );
                            if (duplicates.length > 0) {
                              return Promise.reject(`size-${idx + 1} is duplicated.`);
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                        initialValue={size}
                        noStyle>
                        <Input
                          type="text"
                          value={size}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => handleOnChangeSizeInput(e, idx)}
                          placeholder="Kích thước: (S, M, L,...)"
                          showCount
                          maxLength={20}
                        />
                      </Form.Item>
                    </Col>
                    <Col>
                      {
                        idx !== 0 &&
                        <DeleteOutlined onClick={() => removeSize(idx)} />
                      }
                    </Col>
                  </Row>
                </div>
              ))
            }
            <div className='add-option'
              onClick={addSize}
              style={{ marginBottom: '10px', cursor: 'pointer' }}
            >
              <PlusCircleOutlined /> Thêm kích cỡ
            </div>
          </div>
        </Form.Item>
        <div className={styles.variantsList}>
          <label className='p-0 mb-2' htmlFor="">Danh sách các biến thể: </label>
          <Space>
            <Input
              type="number"
              name="stock"
              value={inStockApplyToAll}
              onChange={(e) => setInStockApplyToAll(e.target.value)}
              placeholder="Số lượng trong kho"
              min={0}
            />
            <Button className={styles.applyToAllBtn} type='text' onClick={applyToAll}>Áp dụng cho tất cả</Button>
          </Space>

          <table className={styles.variants}>
            <thead className="table-header">
              <tr>
                <th>Màu sắc</th>
                <th>Kích thước</th>
                <th>Số lượng</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {
                sizes.length > 0 && colors.length > 0 && colors.map((color, colorIndex) => (
                  <React.Fragment key={colorIndex}>
                    <tr>
                      <th rowSpan={sizes.length + 1}>{color}</th>
                    </tr>
                    {
                      sizes.length > 0 && sizes.map((size, sizeIndex) => (
                        <tr key={sizeIndex}>
                          <td>{size}</td>
                          <td>
                            <div>
                              <Input
                                type="number"
                                placeholder="Nhập số lượng"
                                value={
                                  inventory.find(
                                    item => item.color === color && item.size === size
                                  )?.quantity || ''
                                }
                                min={0}
                                onChange={(e) => handleOnChangeInputInventory(e, color, size)}
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    }
                  </React.Fragment>
                ))
              }
            </tbody>
          </table>
        </div>
      </Form.Item>
      <Form.Item>
        <Button htmlType='submit' type='primary'>Tạo mới</Button>
      </Form.Item>
    </Form>
  );
}
