'use client'
import styles from './create-product.module.css';
import { DeleteOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, Row, Select, Space, Switch, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { RcFile, UploadFile } from 'antd/es/upload';
import React, { ChangeEvent, useState } from 'react'

export default function CreateProduct() {
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<RcFile[]>([]);
  const [colors, setColors] = useState<string[]>([''])
  const [sizes, setSizes] = useState<string[]>([''])
  const [inStockApplyToAll, setInStockApplyToAll] = useState<number | string>('');
  const [inventory, setInventory] = useState(
    colors.flatMap(color => sizes.map(size => ({ color, size, quantity: 0 })))
  );

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
    },
    onRemove: (file: UploadFile) => {
      if (fileList.some((item) => item.uid === file.uid)) {
        setFileList((fileList) =>
          fileList.filter((item) => item.uid !== file.uid)
        );
        return true;
      }
      return false;
    }
  }

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    console.log(e?.fileList);
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
      onFinish={(values) => console.log(values)}
    >
      <Form.Item
        label="Mã sản phẩm"
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
        label="Tên sản phẩm"
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
        <InputNumber placeholder='$ Giá tiền ($USD)' />
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
          <Select.Option value="demo">Demo</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="Mô tả" name={'description'}>
        <TextArea rows={4} placeholder='Mô tả sản phẩm...' />
      </Form.Item>
      <Form.Item label="Nội dung" name={'content'}>
        <TextArea rows={4} placeholder='Nội dung chi tiết...' />
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
        <Upload listType="picture-card" multiple {...uploadProps} fileList={fileList}>
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
            <Button type='text' onClick={applyToAll}>Áp dụng cho tất cả</Button>
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
