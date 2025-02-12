"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  List,
  Radio,
  Row,
  Spin,
  Typography,
} from "antd";
import {useAppDispatch, useAppSelector} from "@/libs/hooks";
import { InputChange } from "@/libs/types/html-element";
import Link from "next/link";
import dayjs from "dayjs";
import {userApiRequest} from "@/app/fetch/user.api";
import {HttpError} from "@/libs/utils/http";
import {setNotify} from "@/libs/features/notifySlice";

export interface ProfileInput {
  _id: string;
  email: string;
  username: string;
  phone: string;
  gender: string;
  dateOfbirth: string;
}

function Profile() {
  const profile = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();
  const [uploadPhoto, setUploadPhoto] = useState<Blob>();
  const [validation, setValidation] = useState<{ [key: string]: string }>({});
  const uploadRef = useRef<HTMLInputElement>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (profile) {
      const values = {
        _id: profile._id,
        username: profile.username,
        email: profile.email,
        phone: profile.phone,
        gender: profile.gender,
        dateOfbirth: profile.dateOfbirth ? dayjs(profile.dateOfbirth) : "",
        address: profile.address,
      };
      form.setFieldsValue(values);
    }
  }, [form, profile]);

  const handleValuesChange = (
    _: Partial<ProfileInput>,
    allValues: ProfileInput,
  ) => {
    setIsChanged(Object.values(allValues).some((value) => value));
  };

  function handleUploadClick() {
    if (uploadRef.current) {
      uploadRef.current.click();
    }
  }

  async function handleUpload(e: InputChange) {
    e.preventDefault();

    const file = e.target.files[0];
    // Validate image
    try {
      if (!file) return setValidation({ file: "Tệp không tồn tại." });

      if (file.type !== "image/jpeg" && file.type !== "image/png")
        return setValidation({ file: "Tệp phải có định dạng JPGE/PNG" });

      if (file.size > 5 * 1024 * 1024)
        return setValidation({ file: "Tệp phải nhỏ hơn 3mb" });

      setUploadPhoto(file);
      return setValidation({ file: "" });
    } catch (err) {
      console.log(err);
    }
  }

  async function saveProfile(values: ProfileInput) {
      if (!token) return;
      console.log(values);
      const dob = new Date(dayjs(values.dateOfbirth).format("YYYY-MM-DD")).toISOString();
      const body = {...values, dateOfbirth: dob };
    try {
      setLoading(true)
      if (uploadPhoto) {
        const formData = new FormData();
        formData.append("file", uploadPhoto);
        await userApiRequest.updatePhoto(token, dispatch, formData)
      }
      await userApiRequest.updateProfile(token, dispatch, body);
      dispatch(setNotify({ success: 'Cập nhật thành công.' }))
      setIsChanged(false);
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
    } finally {
      setLoading(false)
    }

  }

  if (!profile) {
    return (
      <Row align={"middle"} justify={"center"} style={{ height: "100%" }}>
        <Spin></Spin>
      </Row>
    );
  }
  return (
    <Row align="top" gutter={[48, 32]}>
      <Col md={6} sm={24}>
        <Row align="middle" justify="center">
          <Col className="upload-photo-profile">
            <Row align="middle" justify="center">
              <Col md={24} style={{ textAlign: "center" }}>
                <Avatar
                  src={
                    uploadPhoto
                      ? URL.createObjectURL(uploadPhoto)
                      : profile.avatar
                  }
                  size={100}
                ></Avatar>
              </Col>
              <Col md={24} style={{ textAlign: "center" }}>
                <input
                  type="file"
                  size={60}
                  onChange={handleUpload}
                  ref={uploadRef}
                  style={{ display: "none" }}
                />
                <Button
                  className="select-img"
                  onClick={handleUploadClick}
                  style={{ margin: "16px" }}
                >
                  Chọn ảnh
                </Button>
              </Col>
              <Col md={24} style={{ textAlign: "center" }}>
                <Typography.Text type="secondary" role={"note"}>
                  Kích thước file tối đa: 5 MB <br /> Định dạng: .JPEG, .PNG
                </Typography.Text>
                {validation.file && (
                  <span style={{ color: "red", display: "block" }}>
                    {validation.file}
                  </span>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col md={18} sm={24}>
        <Typography.Title style={{ fontSize: "16px" }}>
          Thông tin tài khoản
        </Typography.Title>
        <Form
          form={form}
          wrapperCol={{
            span: 14,
          }}
          layout="vertical"
          style={{
            maxWidth: 600,
          }}
          onValuesChange={handleValuesChange}
          onFinish={(values) => saveProfile(values)}
          disabled={loading}
        >
          <Form.Item label="ID" name={"_id"}>
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Tên"
            name={"username"}
            rules={[
              {
                required: true,
                message: "Tên không thể để trống.",
              },
            ]}
          >
            <Input placeholder="Họ và Tên..." />
          </Form.Item>
          <Form.Item label="Email" name={"email"}>
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name={"phone"}
            rules={[
              {
                pattern: /^[0-9]{10,15}$/, // Adjust regex for your needs
                message: "Số điện thoại không hợp lệ.",
              },
            ]}
          >
            <Input addonBefore="+84" />
          </Form.Item>
          <Form.Item label="Ngày sinh" name={"dateOfbirth"}>
            <DatePicker format="DD/MM/YYYY"></DatePicker>
          </Form.Item>
          <Form.Item label="Giới tính" name={"gender"}>
            <Radio.Group
              name="gender"
              options={[
                {
                  value: "MALE",
                  label: "Nam",
                },
                {
                  value: "FEMALE",
                  label: "Nữ",
                },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary" disabled={!isChanged} loading={loading}>
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}

export default Profile;
