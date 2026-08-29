import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosInstance';

const Address = () => {

    const [fullname, setFullname] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postal, setPostal] = useState('');
    const [country, setCountry] = useState('');
    const [addressType, setAddressType] = useState('home');
    const [isDefault, setIsDefault] = useState(false);

    const [addresses, setAddresses] = useState([]);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const [editingId, setEditingId] = useState(null)
    const [showForm, setShowForm] = useState(false)


    // =========================
    // GET ADDRESSES
    // =========================

    const getAddresses = async () => {

        try {

            const response = await axiosInstance.get('/addresses/');

            console.log(
                'get addresses ======>',
                response.data
            );

            setAddresses(response.data);

        } catch (error) {

            console.log(
                'Get address error ======>',
                error.response?.data
            );
        }
    };


    useEffect(() => {
        getAddresses();
    }, []);


    // =========================
    // ADD ADDRESS
    // =========================

    const handleAddAddress = async (e) => {

        e.preventDefault();

        setLoading(true);
        setErrors({});
        setSuccess(false);

        const addressData = {
            full_name: fullname,
            phone: mobileNumber,
            address_type: addressType,
            address_line_1: addressLine1,
            address_line_2: addressLine2,
            city: city,
            state: state,
            postal_code: postal,
            country: country,
            is_default: isDefault
        };

        try {
          if (editingId) {
            const response = await axiosInstance.patch(`/addresses/${editingId}/`, addressData);
            console.log("Address update=======>", response.data)
          } else {
            const response = await axiosInstance.post(
                '/addresses/',
                addressData
            );

            console.log(
                'Address added ======>',
                response.data
            );

          }

            
            setSuccess(true);

            // Refresh addresses
            getAddresses();

            // Clear form
            setFullname('');
            setMobileNumber('');
            setAddressLine1('');
            setAddressLine2('');
            setCity('');
            setState('');
            setPostal('');
            setCountry('');
            setAddressType('home');
            setIsDefault(false);

        } catch (error) {

            console.log(
                'Add address error ======>',
                error.response?.data
            );

            setErrors(
                error.response?.data || {
                    detail: 'Something went wrong'
                }
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================
    // CHANGE DEFAULT ADDRESS
    // =========================

    const handleDefaultChange = async (id) => {

        try {

            await axiosInstance.patch(
                `/addresses/${id}/`,
                {
                    is_default: true
                }
            );

            // Update frontend immediately
            setAddresses(prev =>
                prev.map(address =>
                    address.id === id
                        ? { ...address, is_default: true }
                        : { ...address, is_default: false }
                )
            );

        } catch (error) {

            console.log(
                'Default address error ======>',
                error.response?.data
            );
        }
    };

    const handleDeleteAddress = async (id) => {
      const confirmDelete = window.confirm(
        "Are you shure you want to delete this address?"
      )
      if (!confirmDelete) {
        return;
      }
      try{
        await axiosInstance.delete(`/addresses/${id}/`)

        setAddresses(prev =>
          prev.filter(address => address.id !==id)
        )
      }catch (error) {
        console.log("Delete address error====>", error.response?.data)
      }
    } 

    const handleEditAddress = (address) => {
      setEditingId(address.id)

      setFullname(address.full_name)
      setMobileNumber(address.phone)
      setAddressType(address.address_type)
      setAddressLine1(address.address_line_1)
      setAddressLine2(address.address_line_2)
      setCity(address.city)
      setState(address.state)
      setPostal(address.postal_code)
      setCountry(address.country)
      setIsDefault(address.is_default)

      setShowForm(true)

    }


    return (

        <div className="container my-5">

            <div className="row g-4 align-items-start">

                {/* =========================
                    ADDRESS LIST
                ========================= */}

                <div className="col-md-5">

                    <h3 className="mb-4">
                        My Addresses
                    </h3>

                    {addresses.length === 0 ? (

                        <div className="alert alert-light">
                            No addresses added yet.
                        </div>

                    ) : (

                        addresses.map((address) => (

                            <div
                                className="card mb-4 shadow-sm border-0 bg-light"
                                key={address.id}
                            >

                                <div className="card-header border-0 d-flex justify-content-between align-items-center">

                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="defaultAddress"
                                        checked={address.is_default}
                                        onChange={() =>
                                            handleDefaultChange(address.id)
                                        }
                                    />

                                    <label className="form-check-label ms-2">
                                        {address.is_default
                                            ? 'Default address'
                                            : 'Set as default'}
                                    </label>
                                    <div className="d-flex gap-2">

                                        <button
                                            type="button"
                                            alt="edit"
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => handleEditAddress(address)}
                                        >
                                            <i class="bi bi-pencil-square"></i>
                                        </button>

                                        <button
                                            type="button"
                                            alt="delete"
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDeleteAddress(address.id)}
                                        >
                                            <i class="bi bi-trash"></i>
                                        </button>

                                    </div>
                                    

                                </div>
                               


                                <div className="card-body p-3">

                                    <h5 className="text-capitalize">
                                        {address.address_type}
                                    </h5>

                                    <p className="card-text mb-0">

                                        <strong>
                                            {address.full_name}
                                        </strong>

                                        <br />

                                        {address.address_line_1}

                                        {address.address_line_2 && (
                                            <>
                                                <br />
                                                {address.address_line_2}
                                            </>
                                        )}

                                        <br />

                                        {address.city}, {address.state}

                                        <br />

                                        {address.postal_code}, {address.country}

                                        <br />

                                        Phone: {address.phone}

                                    </p>

                                </div>

                            </div>

                        ))
                    )}

                </div>


                {/* =========================
                    ADD ADDRESS FORM
                ========================= */}

                <div className="col-md-7">

                    <form
                        className="shadow p-4 bg-light rounded-3"
                        onSubmit={handleAddAddress}
                    >

                        <h3 className="text-center mb-4">
                            Add your shipping address
                        </h3>


                        {/* SUCCESS */}

                        {success && (
                            <div className="alert alert-success">
                                Address added successfully!
                            </div>
                        )}


                        {/* ERROR */}

                        {errors.detail && (
                            <div className="alert alert-danger">
                                {errors.detail}
                            </div>
                        )}


                        {/* FULL NAME */}

                        <div className="mb-3">

                            <label className="form-label">
                                Full Name
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Your full name"
                                value={fullname}
                                onChange={(e) =>
                                    setFullname(e.target.value)
                                }
                            />

                        </div>


                        {/* PHONE */}

                        <div className="mb-3">

                            <label className="form-label">
                                Mobile Number
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Your mobile number"
                                value={mobileNumber}
                                onChange={(e) =>
                                    setMobileNumber(e.target.value)
                                }
                            />

                        </div>


                        {/* ADDRESS TYPE */}

                        <div className="mb-3">

                            <label className="form-label d-block">
                                Address Type
                            </label>

                            <div className="form-check form-check-inline">

                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="addressType"
                                    value="home"
                                    checked={addressType === 'home'}
                                    onChange={(e) =>
                                        setAddressType(e.target.value)
                                    }
                                />

                                <label className="form-check-label">
                                    Home
                                </label>

                            </div>


                            <div className="form-check form-check-inline">

                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="addressType"
                                    value="work"
                                    checked={addressType === 'work'}
                                    onChange={(e) =>
                                        setAddressType(e.target.value)
                                    }
                                />

                                <label className="form-check-label">
                                    Work
                                </label>

                            </div>


                            <div className="form-check form-check-inline">

                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="addressType"
                                    value="other"
                                    checked={addressType === 'other'}
                                    onChange={(e) =>
                                        setAddressType(e.target.value)
                                    }
                                />

                                <label className="form-check-label">
                                    Other
                                </label>

                            </div>

                        </div>


                        {/* ADDRESS LINE 1 */}

                        <div className="mb-3">

                            <label className="form-label">
                                Building / Apartment / Flat
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="House / Flat number"
                                value={addressLine1}
                                onChange={(e) =>
                                    setAddressLine1(e.target.value)
                                }
                            />

                        </div>


                        {/* ADDRESS LINE 2 */}

                        <div className="mb-3">

                            <label className="form-label">
                                Nearby Landmark
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nearby place"
                                value={addressLine2}
                                onChange={(e) =>
                                    setAddressLine2(e.target.value)
                                }
                            />

                        </div>


                        {/* CITY */}

                        <div className="mb-3">

                            <label className="form-label">
                                City
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Your city"
                                value={city}
                                onChange={(e) =>
                                    setCity(e.target.value)
                                }
                            />

                        </div>


                        {/* STATE */}

                        <div className="mb-3">

                            <label className="form-label">
                                State
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Your state"
                                value={state}
                                onChange={(e) =>
                                    setState(e.target.value)
                                }
                            />

                        </div>


                        {/* POSTAL */}

                        <div className="mb-3">

                            <label className="form-label">
                                Postal Code
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Postal code"
                                value={postal}
                                onChange={(e) =>
                                    setPostal(e.target.value)
                                }
                            />

                        </div>


                        {/* COUNTRY */}

                        <div className="mb-3">

                            <label className="form-label">
                                Country
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Your country"
                                value={country}
                                onChange={(e) =>
                                    setCountry(e.target.value)
                                }
                            />

                        </div>


                        {/* DEFAULT */}

                        <div className="form-check mb-3">

                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={isDefault}
                                onChange={(e) =>
                                    setIsDefault(e.target.checked)
                                }
                            />

                            <label className="form-check-label">
                                Set as default
                            </label>

                        </div>


                        {/* SUBMIT */}

                        <button
                            type="submit"
                            className="text-light btn w-100"
                            style={{
                                backgroundColor: '#A3572A'
                            }}
                            disabled={loading}
                        >

                            {loading
                                ? 'Adding...'
                                : 'Add Address'}

                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
};

export default Address;