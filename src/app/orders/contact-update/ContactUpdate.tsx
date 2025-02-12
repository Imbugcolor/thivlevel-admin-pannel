import { Form, Input, Modal } from 'antd'
import React from 'react'

export default function ContactUpdate({
    openContact, setOpenContact, updateLoading, onSave, contact, setContact
}:
    {
        openContact: boolean,
        setOpenContact: (_o: boolean) => void,
        updateLoading: boolean,
        onSave: (name: string, phone: string) => Promise<void>,
        contact: { name: string, phone: string },
        setContact: ({ name, phone }: { name: string, phone: string }) => void,
    }) {

    const [form] = Form.useForm();

    const saveContact = async () => {
        form
            .validateFields()
            .then(async (values) => {
                await onSave(values.name, values.phone);
                setOpenContact(false)
            })
            .catch((info) => {
                console.log("Validate Failed:", info);
            });
    };

    const handleCancel = () => {
        form.resetFields();
        setOpenContact(false)
    }

    return (
        <Modal
            title="Thông tin liên hệ"
            open={openContact}
            onOk={saveContact}
            confirmLoading={updateLoading}
            onCancel={handleCancel}
        >
            <div>
                <Form form={form} initialValues={contact} layout='vertical'>
                    <Form.Item
                        label="Tên khách hàng"
                        name="name"
                        rules={[
                            {
                                required: true,
                            }
                        ]}
                    >
                        <Input type="text" placeholder="Tên..." />
                    </Form.Item>
                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                            {
                                required: true,
                            },
                            () => ({
                                validator(_, value) {
                                    if (value.length !== 10) {
                                        return Promise.reject(`Phone number invalid.`);
                                    }
                                    return Promise.resolve();
                                },
                            })
                        ]}
                    >
                        <Input type="text" 
                            placeholder="Số điện thoại..." 
                            addonBefore={
                                <Form.Item name="prefix" noStyle>
                                    <label>+84</label>
                                </Form.Item>
                            } 
                        />
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    )
}
