export interface AddressLocation {
    value: number,
    label: string
}

export interface AddressFullObject {
    city: AddressLocation,
    district: AddressLocation,
    ward: AddressLocation,
}

export interface AddressProfile extends AddressLocation {
    detailAddress: string,
}

export interface ShippingAddress extends AddressLocation {
    detailAddress: string,
}