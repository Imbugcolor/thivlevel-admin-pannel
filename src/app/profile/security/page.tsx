"use client";
import React, { useState } from "react";
import { Button, Col, Form, Input, Row, Typography } from "antd";
import { useAppDispatch, useAppSelector } from "@/libs/hooks";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  KeyOutlined,
  LockOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {userApiRequest} from "@/app/fetch/user.api";
import {HttpError} from "@/libs/utils/http";
import {setNotify} from "@/libs/features/notifySlice";

interface changePasswordsInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

function Security() {
  const [form] = Form.useForm();
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [currentToggle, setCurrentToggle] = useState(false);
  const [newToggle, setNewToggle] = useState(false);
  const [confirmToggle, setConfirmToggle] = useState(false);

  async function changePassword(values: changePasswordsInput) {
    if (!token) return;
    const body = { old_password: values.currentPassword, new_password: values.newPassword };
    try {
        setLoading(true);
        await userApiRequest.updatePassword(token, dispatch, body)
        dispatch(setNotify({ success: 'Thay đổi mật khẩu thành công.' }))
        form.resetFields();
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
    } finally {
        setLoading(false);
    }
  }

  const togglePasswordInput = (
    toggleValue: boolean,
    toggleSet: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    return toggleValue ? (
      <EyeInvisibleOutlined
        style={{
          fontSize: 16,
          color: "#1677ff",
        }}
        onClick={() => {
          toggleSet(false);
        }}
      />
    ) : (
      <EyeOutlined
        style={{
          fontSize: 16,
          color: "#1677ff",
        }}
        onClick={() => {
          toggleSet(true);
        }}
      />
    );
  };
  return (
    <Row>
      <Col md={24} lg={24}>
        <Typography.Text style={{ fontWeight: "bold", fontSize: "18px" }}>
          Bảo mật tài khoản
        </Typography.Text>
      </Col>

      <Col md={24} lg={24} style={{ marginTop: "16px" }}>
        <Typography.Text style={{ fontWeight: "bold", fontSize: "16px" }}>
          Mật khẩu
        </Typography.Text>
        <Typography.Paragraph>
          Thay đổi mật khẩu bất cứ khi nào bạn nhận thấy tài khoản của mình bị
          xâm phạm.
        </Typography.Paragraph>
        <Form
          disabled={loading}
          form={form}
          onFinish={(values) => changePassword(values)}
          wrapperCol={{
            span: 14,
          }}
          layout="vertical"
        >
          <Form.Item
            label="Mật khẩu hiện tại"
            name={"currentPassword"}
            rules={[
              {
                required: true,
                message: "Trường này không thể để trống.",
              },
            ]}
          >
            <Input
              addonBefore={<LockOutlined />}
              suffix={togglePasswordInput(currentToggle, setCurrentToggle)}
              type={currentToggle ? 'text' : 'password'}
              placeholder="Mật khẩu hiện tại..."
              style={{
                maxWidth: 330,
              }}
            />
          </Form.Item>
          <Form.Item
            label="Mật khẩu mới"
            name={"newPassword"}
            dependencies={["currentPassword"]}
            rules={[
              {
                required: true,
                message: "Trường này không thể để trống.",
              },
              {
                min: 6,
                message: "Mật khẩu phải có ít nhất 6 ký tự.",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("currentPassword") !== value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "Mật khẩu mới và mật khẩu hiện tại không thể giống nhau.",
                    ),
                  );
                },
              }),
            ]}
          >
            <Input
              addonBefore={<KeyOutlined />}
              suffix={togglePasswordInput(newToggle, setNewToggle)}
              type={newToggle ? 'text' : 'password'}
              placeholder="Mật khẩu mới..."
              style={{
                maxWidth: 330,
              }}
            />
          </Form.Item>
          <Form.Item
            label="Xác nhận mật khẩu"
            name={"confirmPassword"}
            dependencies={["newPassword"]}
            rules={[
              {
                required: true,
                message: "Trường này không thể để trống.",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp."),
                  );
                },
              }),
            ]}
          >
            <Input type={confirmToggle ? 'text' : 'password'}
              addonBefore={<ReloadOutlined />}
              suffix={togglePasswordInput(confirmToggle, setConfirmToggle)}
              placeholder="Xác nhận lại mật khẩu..."
              style={{
                maxWidth: 330,
              }}
            />
          </Form.Item>
          <Form.Item>
            <Button htmlType='submit' type="primary" disabled={loading}>
              Thay đổi
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}

export default Security;
