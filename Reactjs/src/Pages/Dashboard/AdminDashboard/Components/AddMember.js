import React, { useContext, useEffect, useState } from 'react'
import "../AdminDashboard.css"
import axios from "axios"
import { Dropdown } from 'semantic-ui-react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import { AuthContext } from '../../../../Context/AuthContext'

function AddMember() {

    const API_URL = process.env.REACT_APP_API_URL
    const [isLoading, setIsLoading] = useState(false)

    const [userFullName, setUserFullName] = useState(null)
    const [admissionId, setAdmissionId] = useState(null)
    const [employeeId, setEmployeeId] = useState(null)
    const [address, setAddress] = useState(null)
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [mobileNumber, setMobileNumber] = useState(null)
    const [recentAddedMembers, setRecentAddedMembers] = useState([])
    const [userType, setUserType] = useState(null)
    const [gender, setGender] = useState(null)
    const [age, setAge] = useState(null)
    const [dob, setDob] = useState(null)
    const [dobString, setDobString] = useState(null)
    const { user } = useContext(AuthContext)
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);


    const genderTypes = [
        { value: "Male", text: "Male" },
        { value: "Female", text: "Female" }
    ]

    const userTypes = [
        { value: 'Staff', text: 'Staff' },
        { value: 'Student', text: 'Student' }
    ]

    //Add a Member
    const addMember = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        if (confirmPassword !== null & userFullName !== null && userType !== null && dobString !== null && gender !== null && address !== null && mobileNumber !== null && email !== null && password !== null) {
            const userData = {
                // userType: userType,
                name: userFullName,
                admission_id: admissionId || employeeId,
                // employeeId: employeeId,
                dob: dobString,
                gender: gender,
                address: address,
                mobile_number: mobileNumber,
                email: email,
                password: password,
                comfirm_password: confirmPassword,
                role_id: userType === 'Student' ? 0 : 1
            }
            try {
                const response = await axios.post(API_URL + "api/sign_up", userData)
                // if (recentAddedMembers.length >= 5) {
                //     recentAddedMembers.splice(-1)
                // }
                setRecentAddedMembers([response.data.user, ...recentAddedMembers])
                setUserFullName(null)
                setUserType("Student")
                setAdmissionId(null)
                setEmployeeId(null)
                setAddress(null)
                setMobileNumber(null)
                setEmail(null)
                setPassword(null)
                setGender(null)
                setAge(null)
                setDob(null)
                setDobString(null)
                alert("Member Added")
            }
            catch (err) {
                console.log(err)
            }
        }
        else {
            alert("All the fields must be filled")
        }
        setIsLoading(false)
    }

    //Fetch Members
    useEffect(() => {
        const getMembers = async () => {
            try {
                const response = await axios.get(API_URL + "api/get_all_member?type=all", {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': user.token
                    }
                });

                const all_members = response.data.users

                setRecentAddedMembers(all_members);
            } catch (err) {
                console.log(err);
            }
        };
        getMembers()
    }, [API_URL])

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        // Kiểm tra xem password và confirm password có giống nhau không
        setPasswordsMatch(e.target.value === confirmPassword);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        // Kiểm tra xem password và confirm password có giống nhau không
        setPasswordsMatch(e.target.value === password);
    };

    return (
        <div>
            <p className="dashboard-option-title">Add a Member</p>
            <div className="dashboard-title-line"></div>
            <form className="addmember-form" onSubmit={addMember}>
                <div className='semanticdropdown'>
                    <Dropdown
                        placeholder='User Type'
                        fluid
                        selection
                        options={userTypes}
                        onChange={(event, data) => setUserType(data.value)}
                    />
                </div>
                <label className="addmember-form-label" htmlFor="userFullName">Full Name<span className="required-field">*</span></label><br />
                <input className="addmember-form-input" type="text" name="userFullName" value={userFullName} required onChange={(e) => setUserFullName(e.target.value)}></input><br />

                <label className="addmember-form-label" htmlFor={userType === "Student" ? "admissionId" : "employeeId"}>{userType === "Student" ? "Admission Id" : "Employee Id"}<span className="required-field">*</span></label><br />
                <input className="addmember-form-input" type="text" value={userType === "Student" ? admissionId : employeeId} required onChange={(e) => { userType === "Student" ? setAdmissionId(e.target.value) : setEmployeeId(e.target.value) }}></input><br />

                <label className="addmember-form-label" htmlFor="mobileNumber">Mobile Number<span className="required-field">*</span></label><br />
                <input className="addmember-form-input" type="text" value={mobileNumber} required onChange={(e) => setMobileNumber(e.target.value)}></input><br />

                <label className="addmember-form-label" htmlFor="gender">Gender<span className="required-field">*</span></label><br />
                <div className='semanticdropdown'>
                    <Dropdown
                        placeholder='User Type'
                        fluid
                        selection
                        value={gender}
                        options={genderTypes}
                        onChange={(event, data) => setGender(data.value)}
                    />
                </div>


                <label className="addmember-form-label" htmlFor="dob">Date of Birth<span className="required-field">*</span></label><br />
                <DatePicker
                    className="date-picker"
                    placeholderText="MM/DD/YYYY"
                    selected={dob}
                    onChange={(date) => { setDob(date); setDobString(moment(date).format("MM/DD/YYYY")) }}
                    dateFormat="MM/dd/yyyy"
                />

                <label className="addmember-form-label" htmlFor="address">Address<span className="required-field">*</span></label><br />
                <input className="addmember-form-input address-field" value={address} type="text" required onChange={(e) => setAddress(e.target.value)}></input><br />

                <label className="addmember-form-label" htmlFor="email">Email<span className="required-field">*</span></label><br />
                <input className="addmember-form-input" type="email" value={email} required onChange={(e) => setEmail(e.target.value)}></input><br />


                <div>
                    <label className="addmember-form-label" htmlFor="password">Password<span className="required-field">*</span></label><br />
                    <input
                        className="addmember-form-input"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                    /><br />

                    <label className="addmember-form-label" htmlFor="confirmPassword">Confirm Password<span className="required-field">*</span></label><br />
                    <input
                        className="addmember-form-input"
                        type="password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                    /><br />

                    {!passwordsMatch && <p style={{ color: 'red' }}>Passwords do not match</p>}
                </div>
                <input className="addmember-submit" type="submit" value="SUBMIT" disabled={isLoading} ></input>

            </form>
            <p className="dashboard-option-title">Add a Member</p>
            <div className="dashboard-title-line"></div>
            <table className='admindashboard-table'>
                <tr>
                    <th>S.No</th>
                    <th>Member Name</th>
                    <th>Member Email</th>
                    <th>Mobile Number</th>
                    <th>Gender</th>
                    <th>Date of Birth</th>
                    <th>Admission ID</th>
                    <th>Address</th>
                    <th>Points</th>
                    <th>Member Type</th>
                </tr>
                {
                    recentAddedMembers.map((member, index) => {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{member.name}</td>
                                <td>{member.email}</td>
                                <td>{member.mobile_number}</td>
                                <td>{member.gender}</td>
                                <td>{member.dob}</td>
                                <td>{member.admission_id}</td>
                                <td>{member.address}</td>
                                <td>{member.points}</td>
                                <td>{member.member_type}</td>
                            </tr>
                        )
                    })
                }
            </table>
        </div>
    )
}

export default AddMember
