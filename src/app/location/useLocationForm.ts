import { CITY_PATHS } from '@/libs/utils/constants'
import { useState, useEffect } from 'react'

export interface AddressLocation {
    value: number,
    label: string
}

export interface AddressFullObject {
    city: AddressLocation,
    district: AddressLocation,
    ward: AddressLocation,
}
const FETCH_TYPES = {
    CITIES: "FETCH_CITIES",
    DISTRICTS: "FETCH_DISTRICTS",
    WARDS: "FETCH_WARDS"
}

const stateModal = {
    cityOptions: [],
    districtOptions: [],
    wardOptions: [],
    selectedCity: null,
    selectedDistrict: null,
    selectedWard: null
}

async function fetchLocationOptions(fetchType: string, locationId?: number) {
    let url
    switch (fetchType) {
        case FETCH_TYPES.CITIES:
            url = CITY_PATHS.CITIES
            break;
        case FETCH_TYPES.DISTRICTS:
            url = `${CITY_PATHS.DISTRICTS}/${locationId}.json`
            break;
        case FETCH_TYPES.WARDS:
            url = `${CITY_PATHS.WARDS}/${locationId}.json`
            break;
        default:
            return []
    }

    const res = await fetch(url)

    const data = await res.json()

    const locations = data["data"]

    return locations.map(({ id, name }: { id: number, name: string}) => ({ value: id, label: name }))
}

function setInitData(initAddress: any) {
    if (typeof initAddress === "object") {
        const { city, district, ward } = initAddress
        return {
            cityId: city?.value,
            districtId: district?.value,
            wardId: ward?.value,
        }
    } else return {
        cityId: 278,
        districtId: 617,
        wardId: 63,
    }
}

async function fetchInitialData(initAddress: any) {
    // (await axios.get(PATHS.LOCATION)).data
    const { cityId, districtId, wardId } = setInitData(initAddress)
    const [cities, districts, wards] = await Promise.all([
        fetchLocationOptions(FETCH_TYPES.CITIES),
        fetchLocationOptions(FETCH_TYPES.DISTRICTS, cityId),
        fetchLocationOptions(FETCH_TYPES.WARDS, districtId)
    ])

    return {
        cityOptions: cities,
        districtOptions: districts,
        wardOptions: wards,
        selectedCity: cities.find((c: AddressLocation) => c.value === cityId),
        selectedDistrict: districts.find((d: AddressLocation) => d.value === districtId),
        selectedWard: wards.find((w: AddressLocation) => w.value === wardId)
    }
}

function useLocationForm(shouldFetchInitialLocation: any, initData: any) {
    const [state, setState] = useState(stateModal)
    const { selectedCity, selectedDistrict } = state;
    const [callback, setCallback] = useState(false)


    useEffect(() => {
        let isCancelled = false;
        (async function () {
            if (shouldFetchInitialLocation && typeof initData === 'object') {
                const initialData = await fetchInitialData(initData)
                if (!isCancelled) setState(initialData)
            } else {
                const options = await fetchLocationOptions(FETCH_TYPES.CITIES)
                setState({ ...stateModal, cityOptions: options })
            }
        })()

        return () => {
            isCancelled = true;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initData, callback])

    useEffect(() => {
        (async function () {
            if (!selectedCity) return;
            const options = await fetchLocationOptions(
                FETCH_TYPES.DISTRICTS,
                (selectedCity as AddressLocation).value
            )
            setState({ ...state, districtOptions: options })
        })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCity])

    useEffect(() => {
        (async function () {
            if (!selectedDistrict) return;
            const options = await fetchLocationOptions(
                FETCH_TYPES.WARDS,
                (selectedDistrict as AddressLocation).value
            )
            setState({ ...state, wardOptions: options })
        })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDistrict])

    function onCitySelect(option: any) {
        if (option !== selectedCity) {
            setState({
                ...state,
                districtOptions: [],
                wardOptions: [],
                selectedCity: option,
                selectedDistrict: null,
                selectedWard: null
            })
        }
    }

    function onDistrictSelect(option: any) {
        if (option !== selectedDistrict) {
            setState({
                ...state,
                wardOptions: [],
                selectedDistrict: option,
                selectedWard: null
            })
        }
    }

    function onWardSelect(option: any) {
        setState({ ...state, selectedWard: option })
    }

    function onCancel() {
        setCallback(!callback)
    }

    async function onClick(detailAddressValue: any, onSave: any) {
        const addressObject = {
            detailAddress: detailAddressValue,
            city: state.selectedCity,
            district: state.selectedDistrict,
            ward: state.selectedWard
        }

        if (state.selectedCity === null || state.selectedDistrict === null || state.selectedWard === null) {
            return { message: 'Please select your location address'}
        } else {
            await onSave(addressObject)
        }

        // console.group("Address")
        // console.log("City: ", state.selectedCity);
        // console.log("District: ", state.selectedDistrict);
        // console.log("Ward: ", state.selectedWard);
        // console.log("Detail address: ", detailAddressValue);
        // console.groupEnd();
    }



    return {
        state,
        onCitySelect,
        onDistrictSelect,
        onWardSelect,
        onClick,
        onCancel
    }
}

export default useLocationForm