import './location-update.css'
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import useLocationForm, { AddressLocation } from './useLocationForm'
import { ButtonEvent } from '@/libs/types/html-element'
import { Input, Modal } from 'antd'

export default function Location({ 
    onSave, 
    openLocation, setOpenLocation, 
    updateLoading, initAddress 
}: {
    onSave: (data: any) => Promise<void>, 
    openLocation: boolean, 
    setOpenLocation: (o: boolean) => void, 
    updateLoading: boolean, 
    initAddress: any
}) {
    const customStyle = {
        container: (prodived: any) => ({
            ...prodived,
            marginBottom: 15
        })
    }

    const { detailAddress } = initAddress ? initAddress : ''

    const [detail, setDetail] = useState(detailAddress)

    useEffect(() => {
        setDetail(detailAddress)
    }, [detailAddress])

    const {
        state,
        onCitySelect,
        onDistrictSelect,
        onWardSelect,
        onClick,
        onCancel
    } = useLocationForm(true, initAddress)

    const {
        cityOptions,
        districtOptions,
        wardOptions,
        selectedCity,
        selectedDistrict,
        selectedWard
    } = state


    const handleCancel = () => {
        setDetail(detailAddress)
        onCancel()
        setOpenLocation(false)
    }

    const saveAddress = async () => {
        await onClick(detail, onSave)
        setOpenLocation(false)
    }

    return (
        <Modal
            title="Địa chỉ giao hàng"
            open={openLocation}
            onOk={saveAddress}
            confirmLoading={updateLoading}
            onCancel={handleCancel}
        >
            <div className="address-select-container">
                <div className="address-select-item">
                    <Select
                        name="cityId"
                        key={`cityId_${(selectedCity as unknown as AddressLocation)?.value}`}
                        isDisabled={cityOptions.length === 0}
                        options={cityOptions}
                        onChange={(option) => onCitySelect(option)}
                        placeholder="Tỉnh/Thành"
                        defaultValue={selectedCity}
                        styles={customStyle}
                    />

                    <Select
                        name="districtId"
                        key={`districtId_${(selectedDistrict as unknown as AddressLocation)?.value}`}
                        isDisabled={districtOptions.length === 0}
                        options={districtOptions}
                        onChange={(option) => onDistrictSelect(option)}
                        placeholder="Quận/Huyện"
                        defaultValue={selectedDistrict}
                        styles={customStyle}
                    />

                    <Select
                        name="wardId"
                        key={`wardId_${(selectedWard as unknown as AddressLocation)?.value}`}
                        isDisabled={wardOptions.length === 0}
                        options={wardOptions}
                        placeholder="Phường/Xã"
                        onChange={(option) => onWardSelect(option)}
                        defaultValue={selectedWard}
                        styles={customStyle}
                    />
                </div>

                <Input type="text" placeholder="Số nhà, đường..."
                    value={detail || ''}
                    onChange={e => setDetail(e.target.value)}
                    className="address-detail-input" 
                />

            </div>
        </Modal>
    )
}