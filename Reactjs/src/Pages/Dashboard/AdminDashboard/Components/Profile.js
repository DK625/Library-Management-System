import React, { useContext, useEffect, useState } from 'react'
import "../AdminDashboard.css"
import axios from "axios"
import { Dropdown } from 'semantic-ui-react'
import '../../MemberDashboard/MemberDashboard.css'
import moment from "moment"
import { AuthContext } from '../../../../Context/AuthContext'

function Profile() {

    const API_URL = process.env.REACT_APP_API_URL

    const [allMembersOptions, setAllMembersOptions] = useState(null)
    const [memberId, setMemberId] = useState(null)
    const [memberDetails, setMemberDetails] = useState(null)
    const { user } = useContext(AuthContext)

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

                setAllMembersOptions(response.data.users.map((member) => (
                    {
                        value: `${member?.id}`,
                        text: `${member?.member_type === "Student" ?
                            `${member?.name} - ${member?.admission_id}` :
                            `${member?.name} - ${member?.admission_id}`}`,
                        value_detail: member
                    }
                )))
            }
            catch (err) {
                console.log(err)
            }
        }
        getMembers()
    }, [API_URL])



    useEffect(() => {
        const getMemberDetails = async () => {
            if (allMembersOptions && allMembersOptions.length > 0) {
                const borrower = allMembersOptions.find(member => parseInt(member.value, 10) === user.id);
                if (borrower) {
                    setMemberDetails(borrower.value_detail);
                }
            }
        }

        getMemberDetails();
    }, [allMembersOptions])
    //  gọi lại khi giá trị allMembersOptions thay đổi

    const calculateAge = (dob) => {
        const currentDate = moment();
        const birthDate = moment(dob, 'MM/DD/YYYY');
        return currentDate.diff(birthDate, 'years');
    };

    return (
        <div>
            <div style={{}}>
                <div className="member-profile-content" id="profile@member" style={{}}>
                    <div className="user-details-topbar">
                        <img className="user-profileimage" src="./assets/images/Profile.png" alt=""></img>
                        <div className="user-info">
                            <p className="user-name">{memberDetails?.name}</p>
                            <p className="user-id">{memberDetails?.member_type === "Student" ? memberDetails?.admission_id : memberDetails?.admission_id}</p>
                            <p className="user-email">{memberDetails?.email}</p>
                            <p className="user-phone">{memberDetails?.mobile_number}</p>
                        </div>
                    </div>
                    <div className="user-details-specific">
                        <div className="specific-left">
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <p style={{ display: "flex", flex: "0.5", flexDirection: "column" }}>
                                    <span style={{ fontSize: "18px" }}>
                                        <b>Age</b>
                                    </span>
                                    <span style={{ fontSize: "16px" }}>
                                        {calculateAge(memberDetails?.dob)}
                                    </span>
                                </p>
                                <p style={{ display: "flex", flex: "0.5", flexDirection: "column" }}>
                                    <span style={{ fontSize: "18px" }}>
                                        <b>Gender</b>
                                    </span>
                                    <span style={{ fontSize: "16px" }}>
                                        {memberDetails?.gender}
                                    </span>
                                </p>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
                                <p style={{ display: "flex", flex: "0.5", flexDirection: "column" }}>
                                    <span style={{ fontSize: "18px" }}>
                                        <b>DOB</b>
                                    </span>
                                    <span style={{ fontSize: "16px" }}>
                                        {memberDetails?.dob}
                                    </span>
                                </p>
                                <p style={{ display: "flex", flex: "0.5", flexDirection: "column" }}>
                                    <span style={{ fontSize: "18px" }}>
                                        <b>Address</b>
                                    </span>
                                    <span style={{ fontSize: "16px" }}>
                                        {memberDetails?.address}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="specific-right">
                            <div style={{ display: "flex", flexDirection: "column", flex: "0.5" }}>
                                <p style={{ fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}><b>Points</b></p>
                                <p style={{ fontSize: "25px", fontWeight: "500", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "15px" }}>
                                    {memberDetails?.points}</p>
                            </div>
                            <div className="dashboard-title-line"></div>
                            <div style={{ display: "flex", flexDirection: "column", flex: "0.5" }}>
                                <p style={{ fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}><b>Fine</b></p>
                                <p style={{ fontSize: "25px", fontWeight: "500", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "15px" }}>
                                    {memberDetails?.fine}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="member-activebooks-content" id="activebooks@member">
                    <p style={{ fontWeight: "bold", fontSize: "22px", marginTop: "22px", marginBottom: "22px" }}>Issued</p>
                    <table className="activebooks-table">
                        <tr>
                            <th>S.No</th>
                            <th>Book-Name</th>
                            <th>From Date</th>
                            <th>To Date</th>
                        </tr>
                        {
                            memberDetails?.transactions?.filter((data) => {
                                return data.transaction_type === "Issued"
                            }).map((data, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{data.book_name}</td>
                                        <td>{data.from_date}</td>
                                        <td>{data.to_date}</td>
                                    </tr>
                                )
                            })
                        }
                    </table>
                </div>

                <div className="member-reservedbooks-content" id="reservedbooks@member">
                    <p style={{ fontWeight: "bold", fontSize: "22px", marginTop: "22px", marginBottom: "22px" }}>Reserved</p>
                    <table className="activebooks-table">
                        <tr>
                            <th>S.No</th>
                            <th>Book-Name</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Return Date</th>
                        </tr>
                        {
                            memberDetails?.transactions?.filter((data) => {
                                return data.transaction_type === "Reserved"
                            }).map((data, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{data.book_name}</td>
                                        <td>{data.from_date}</td>
                                        <td>{data.to_date}</td>
                                        <td>{data.return_date}</td>
                                    </tr>
                                )
                            })
                        }
                    </table>
                </div>
                {/* <div className="member-history-content" id="history@member">
                    <p style={{ fontWeight: "bold", fontSize: "22px", marginTop: "22px", marginBottom: "22px" }}>History</p>
                    <table className="activebooks-table">
                        <tr>
                            <th>S.No</th>
                            <th>Book-Name</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Return Date</th>
                        </tr>
                        {
                            memberDetails?.prevTransactions?.map((data, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{data.bookName}</td>
                                        <td>{data.fromDate}</td>
                                        <td>{data.toDate}</td>
                                        <td>{data.returnDate}</td>
                                    </tr>
                                )
                            })
                        }
                    </table>
                </div> */}
            </div>
        </div>
    )
}

export default Profile
