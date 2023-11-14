import React, { useContext, useEffect, useState } from 'react'
import "../AdminDashboard.css"
import axios from "axios"
import { Dropdown } from 'semantic-ui-react'
import '../../MemberDashboard/MemberDashboard.css'
import moment from "moment"
import { AuthContext } from '../../../../Context/AuthContext'


function Return() {

    const API_URL = process.env.REACT_APP_API_URL
    const { user } = useContext(AuthContext)

    const [allTransactions, setAllTransactions] = useState([])
    const [ExecutionStatus, setExecutionStatus] = useState(null) /* For triggering the tabledata to be updated */

    const [allMembersOptions, setAllMembersOptions] = useState(null)
    const [borrowerId, setBorrowerId] = useState(null)


    //Fetching all Members
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


    /* Getting all active transactions */
    useEffect(() => {
        const getAllTransactions = async () => {
            try {
                const response = await axios.get(API_URL + "api/transactions")
                const res = response.data.data.sort((a, b) => Date.parse(a.to_date) - Date.parse(b.to_date))
                setAllTransactions(res)
                console.log("Okay")
                setExecutionStatus(null)
            }
            catch (err) {
                console.log(err)
            }
        }
        getAllTransactions()
    }, [API_URL, ExecutionStatus])


    const returnBook = async (transactionId) => {
        try {
            const response = await axios.put(API_URL + "api/transactions?id=" + transactionId, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': user.token
                }
            });
            const res = response.data.data.sort((a, b) => Date.parse(a.to_date) - Date.parse(b.to_date))
            setAllTransactions(res)

            setExecutionStatus("Completed");
            alert("Book returned to the library successfully")
        }
        catch (err) {
            console.log(err)
        }
    }

    const convertToIssue = async (transactionId) => {
        try {
            setExecutionStatus("Completed");
            alert("Book issued succesfully 🎆")
        }
        catch (err) {
            console.log(err)
        }
    }


    return (
        <div>
            <div className='semanticdropdown returnbook-dropdown'>
                <Dropdown
                    placeholder='Select Member'
                    fluid
                    search
                    selection
                    value={borrowerId}
                    options={allMembersOptions}
                    onChange={(event, data) => setBorrowerId(data.value)}
                />
            </div>
            <p className="dashboard-option-title">Issued</p>
            <table className="admindashboard-table">
                <tr>
                    <th>Book Name</th>
                    <th>Borrower Name</th>
                    <th>From Date</th>
                    <th>To Date</th>
                    <th></th>
                </tr>
                {
                    allTransactions?.filter((data) => {
                        if (borrowerId === null) {
                            return data.transaction_type === "Issued" && data.status === "Active"
                        }
                        else {
                            const borrowerIdNumber = parseInt(borrowerId, 10);
                            return data.borrower_id === borrowerIdNumber && data.transaction_type === "Issued" && data.status === "Active"
                        }
                    }).map((data, index) => {
                        return (
                            <tr key={index}>
                                <td>{data.book_name}</td>
                                <td>{data.borrower_name}</td>
                                <td>{data.from_date}</td>
                                <td>{data.to_date}</td>
                                <td><button onClick={() => { returnBook(data.id) }}>Return</button></td>
                            </tr>
                        )
                    })
                }
            </table>
            <p className="dashboard-option-title">Reserved</p>
            <table className="admindashboard-table">
                <tr>
                    <th>Book Name</th>
                    <th>Borrower Name</th>
                    <th>From Date</th>
                    <th>To Date</th>
                    <th>Return Date</th>
                    <th></th>
                </tr>
                {
                    allTransactions?.filter((data) => {
                        if (borrowerId === null) {
                            return data.transaction_type === "Reserved"
                        }
                        else {
                            const borrowerIdNumber = parseInt(borrowerId, 10);
                            return data.borrower_id === borrowerIdNumber && data.transaction_type === "Reserved"
                        }
                    }).map((data, index) => {
                        return (
                            <tr key={index}>
                                <td>{data.book_name}</td>
                                <td>{data.borrower_name}</td>
                                <td>{data.from_date}</td>
                                <td>{data.to_date}</td>
                                <td>{data.return_date}</td>
                                {/* <td><button onClick={() => { convertToIssue(data._id) }}>Convert</button></td> */}
                            </tr>
                        )
                    })
                }
            </table>
        </div>
    )
}

export default Return
