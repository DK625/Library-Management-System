import React, { useContext, useEffect, useState } from 'react'
import "../AdminDashboard.css"
import axios from "axios"
import { Dropdown, Modal, Button, Form } from 'semantic-ui-react';
import '../../MemberDashboard/MemberDashboard.css'
import moment from "moment"
import { AuthContext } from '../../../../Context/AuthContext'

function GetMember() {

    const API_URL = process.env.REACT_APP_API_URL

    const [allMembersOptions, setAllMembersOptions] = useState(null)
    const [memberId, setMemberId] = useState(null)
    const [memberDetails, setMemberDetails] = useState(null)
    const { user } = useContext(AuthContext)
    const [rechargeModalVisible, setRechargeModalVisible] = useState(false);
    const [rechargeAmount, setRechargeAmount] = useState(0);
    const [rechargeType, setRechargeType] = useState('money');

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
            if (memberId !== null) {
                try {
                    const borrower = allMembersOptions.find(member => member.value === memberId);
                    if (borrower) {
                        setMemberDetails(borrower.value_detail);
                    }
                }
                catch (err) {
                    console.log("Error in fetching the member details")
                }
            }
        }
        getMemberDetails()
    }, [API_URL, memberId, allMembersOptions])

    const calculateAge = (dob) => {
        const currentDate = moment();
        const birthDate = moment(dob, 'MM/DD/YYYY');
        return currentDate.diff(birthDate, 'years');
    };

    const handleRecharge = () => {
        setRechargeModalVisible(true);
    };

    const closeRechargeModal = () => {
        setRechargeModalVisible(false);
    };

    const handleRechargeAmountChange = (e) => {
        setRechargeAmount(e.target.value);
    };

    // const submitRecharge = async () => {
    //     try {
    //         // Gọi API để xử lý nạp điểm/ nạp tiền
    //         // Cần thêm logic xử lý trên server để cập nhật thông tin nạp điểm của thành viên
    //         // Sau khi giao dịch thành công, đóng modal và cập nhật lại thông tin thành viên
    //         // Ví dụ:
    //         // const response = await axios.post(API_URL + 'api/recharge', {
    //         //   memberId: memberDetails.id,
    //         //   amount: rechargeAmount,
    //         // });

    //         // Tùy thuộc vào API trả về, có thể thêm xử lý đích sau khi nạp điểm thành công
    //         // Ví dụ:
    //         // if (response.data.success) {
    //         //   // Cập nhật lại thông tin thành viên
    //         //   setMemberDetails(response.data.updatedMember);
    //         //   // Đóng modal
    //         //   closeRechargeModal();
    //         // }
    //     } catch (error) {
    //         console.error('Error during recharge:', error);
    //     }
    // };

    const submitRecharge = async () => {
        try {
            // Thực hiện kiểm tra loại nạp tiền hoặc nạp điểm
            // if (rechargeType === 'money') {
            //     const amount = parseFloat(rechargeAmount);
            //     if (!isNaN(amount) && amount % 1000 === 0) {
            //         // Thực hiện nạp tiền
            //         const response = await axios.put(API_URL + "api/recharge?id=" + memberId, {

            //         }, {
            //             headers: {
            //                 'Content-Type': 'application/json',
            //                 'Authorization': user.token
            //             }
            //         });
            //         setAllMembersOptions(response.data.users.map((member) => (
            //             {
            //                 value: `${member?.id}`,
            //                 text: `${member?.member_type === "Student" ?
            //                     `${member?.name} - ${member?.admission_id}` :
            //                     `${member?.name} - ${member?.admission_id}`}`,
            //                 value_detail: member
            //             }
            //         )))
            //         alert('Nạp tiền thành công');
            //     } else {
            //         alert('Số tiền không hợp lệ, phải là bội số của 1000');
            //     }
            // } else if (rechargeType === 'point') {
            //     // Kiểm tra số điểm là số nguyên
            //     const points = parseInt(rechargeAmount, 10);
            //     if (!isNaN(points)) {
            //         // Thực hiện nạp điểm
            //         // Gọi API hoặc xử lý nạp điểm tại đây
            //         alert('Nạp điểm thành công');
            //     } else {
            //         alert('Số điểm không hợp lệ');
            //     }
            // }
            let requestData;

            if (rechargeType === 'money') {
                const amount = parseFloat(rechargeAmount);
                if (isNaN(amount) || amount % 1000 !== 0) {
                    alert('Số tiền không hợp lệ, phải là bội số của 1000');
                    return;
                }
                requestData = { type: 'money', value: amount };
            } else if (rechargeType === 'point') {
                const points = parseInt(rechargeAmount, 10);
                if (isNaN(points)) {
                    alert('Số điểm không hợp lệ');
                    return;
                }
                requestData = { type: 'point', value: points };
            } else {
                alert('Loại nạp không hợp lệ');
                return;
            }

            // Gọi API để nạp tiền hoặc điểm
            const response = await axios.put(`${API_URL}api/recharge?id=${memberId}`, requestData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': user.token
                }
            });
            setAllMembersOptions(response.data.data.map((member) => (
                {
                    value: `${member?.id}`,
                    text: `${member?.member_type === "Student" ?
                        `${member?.name} - ${member?.admission_id}` :
                        `${member?.name} - ${member?.admission_id}`}`,
                    value_detail: member
                }
            )))
            closeRechargeModal();
        } catch (error) {
            console.error('Error during recharge:', error);
        }
    };

    return (
        <div>
            <div className='semanticdropdown getmember-dropdown'>
                <Dropdown
                    placeholder='Select Member'
                    fluid
                    search
                    selection
                    value={memberId}
                    options={allMembersOptions}
                    onChange={(event, data) => setMemberId(data.value)}
                />
            </div>
            <div style={memberId === null ? { display: "none" } : {}}>
                <div className="member-profile-content" id="profile@member" style={memberId === null ? { display: "none" } : {}}>
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

                    <button onClick={handleRecharge} className="recharge-button">Nạp Điểm / Nạp Tiền</button>

                </div>

                <div className="member-activebooks-content" id="activebooks@member">
                    <p style={{ fontWeight: "bold", fontSize: "22px", marginTop: "22px", marginBottom: "22px" }}>Issued</p>
                    <table className="activebooks-table">
                        <tr>
                            <th>S.No</th>
                            <th>Book-Name</th>
                            <th>From Date</th>
                            <th>To Date</th>
                            <th>Book Status</th>
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
                                        <td>{data.status}</td>
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
            </div>
            <Modal open={rechargeModalVisible} onClose={closeRechargeModal}>
                <Modal.Header>Nạp Điểm / Nạp Tiền</Modal.Header>
                <Modal.Content style={{ marginTop: '30px', textAlign: 'center' }}>
                    <Form>
                        <Form.Field>
                            <label>Loại Nạp:</label>
                            <Dropdown
                                placeholder='Chọn loại nạp'
                                fluid
                                selection
                                options={[
                                    { key: 'money', text: 'Nạp Tiền', value: 'money' },
                                    { key: 'point', text: 'Nạp Điểm', value: 'point' },
                                ]}
                                onChange={(event, data) => setRechargeType(data.value)}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Số Tiền / Điểm:</label>
                            <input placeholder="Nhập số tiền hoặc số điểm" onChange={handleRechargeAmountChange} />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={closeRechargeModal}>Hủy</Button>
                    <Button primary onClick={submitRecharge}>
                        Xác Nhận
                    </Button>
                </Modal.Actions>
            </Modal>

        </div>
    )
}

export default GetMember
