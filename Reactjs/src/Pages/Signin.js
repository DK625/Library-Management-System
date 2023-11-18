import React, { useContext, useState } from 'react'
import './Signin.css'
import axios from 'axios'
import { AuthContext } from '../Context/AuthContext.js'
import Switch from '@material-ui/core/Switch';

function Signin() {
    const [isStudent, setIsStudent] = useState(true)
    const [admissionId, setAdmissionId] = useState()
    const [employeeId, setEmployeeId] = useState()
    const [password, setPassword] = useState()
    const [error, setError] = useState("")
    const { dispatch } = useContext(AuthContext)

    const API_URL = process.env.REACT_APP_API_URL

    const loginCall = async (userCredential, dispatch) => {
        dispatch({ type: "LOGIN_START" });
        try {
            const res = await axios.post(API_URL + "api/login", userCredential);
            const response = await axios.put(API_URL + "api/update_point?user_id=" + res.data.id, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': res.data.token
                }
            });
            console.log("update_point")
            console.log(response.data.data)

            if (res.data.err_code == 0)
                dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
            else setError("Wrong Password Or Username")
        }
        catch (err) {
            dispatch({ type: "LOGIN_FAILURE", payload: err })
            setError("Wrong Password Or Username")
        }
    }

    const handleForm = (e) => {
        e.preventDefault()
        isStudent
            ? loginCall({ email: admissionId, password }, dispatch)
            : loginCall({ email: employeeId, password }, dispatch)
    }

    return (
        <div className='signin-container'>
            <div className="signin-card">
                <form onSubmit={handleForm}>
                    <h2 className="signin-title"> Log in</h2>
                    <p className="line"></p>
                    {/* <div className="persontype-question">
                        <p>Are you a Staff member ?</p>
                        <Switch
                            onChange={() => setIsStudent(!isStudent)}
                            color="primary"
                        />
                    </div> */}
                    <div className="error-message"><p>{error}</p></div>
                    <div className="signin-fields">
                        <label htmlFor={isStudent ? "admissionId" : "employeeId"}> <b>{isStudent ? "Admission ID" : "Employee ID"}</b></label>
                        <input className='signin-textbox' type="text" placeholder={isStudent ? "Enter Admission ID" : "Enter Employee ID"} name={isStudent ? "admissionId" : "employeeId"} required onChange={(e) => { isStudent ? setAdmissionId(e.target.value) : setEmployeeId(e.target.value) }} />
                        <label htmlFor="password"><b>Password</b></label>
                        <input className='signin-textbox' type="password" minLength='6' placeholder="Enter Password" name="psw" required onChange={(e) => { setPassword(e.target.value) }} />
                    </div>
                    <button className="signin-button">Log In</button>
                    <a className="forget-pass" href="#home">Forgot password?</a>
                </form>
                <div className='signup-option'>
                    <p className="signup-question">Don't have an account? Contact Librarian</p>
                </div>
            </div>
        </div>
    )
}

export default Signin