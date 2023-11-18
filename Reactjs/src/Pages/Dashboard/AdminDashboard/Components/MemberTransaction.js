import React, { useContext, useEffect, useState } from 'react'
import "../AdminDashboard.css"
import axios from "axios"
import { AuthContext } from '../../../../Context/AuthContext'
import { Dropdown } from 'semantic-ui-react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment"

function MemberTransaction() {

    const API_URL = process.env.REACT_APP_API_URL
    const [isLoading, setIsLoading] = useState(false)
    const { user } = useContext(AuthContext)

    const [borrowerId, setBorrowerId] = useState("")
    const [borrowerDetails, setBorrowerDetails] = useState([])
    const [bookId, setBookId] = useState("")
    const [recentTransactions, setRecentTransactions] = useState([])
    const [allMembers, setAllMembers] = useState([])
    const [allBooks, setAllBooks] = useState([])

    const [fromDate, setFromDate] = useState(null)
    const [fromDateString, setFromDateString] = useState(null)

    const [toDate, setToDate] = useState(null)
    const [toDateString, setToDateString] = useState(null)

    const transactionTypes = [
        // { value: 'Reserved', text: 'Reserve' },
        { value: 'Issued', text: 'Issue' }
    ]

    const [transactionType, setTransactionType] = useState("")



    /* Fetch Transactions */
    useEffect(() => {
        const getTransactions = async () => {
            try {
                // const response = await axios.get(API_URL + "api/transactions")
                const response = await axios.get(API_URL + "api/transactions?user_id=" + user.id)
                // setRecentTransactions(response.data.slice(0, 5))
                setRecentTransactions(response.data.data)
            }
            catch (err) {
                console.log("Error in fetching transactions")
            }

        }
        getTransactions()
    }, [API_URL])


    /* Fetching borrower details */
    useEffect(() => {
        const getBorrowerDetails = async () => {
            try {
                if (borrowerId !== "") {
                    const borrower = allMembers.find(member => member.value === borrowerId);
                    if (borrower) {
                        setBorrowerDetails(borrower.value_detail);
                    } else {
                        console.log("Borrower not found");
                    }
                }
            }
            catch (err) {
                console.log("Error in getting borrower details")
            }
        }
        getBorrowerDetails()
    }, [API_URL, borrowerId])


    /* Fetching members */
    useEffect(() => {
        const getMembers = async () => {
            try {
                const response = await axios.get(API_URL + "api/get_all_member?type=all", {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': user.token
                    }
                });

                const all_members = response.data.users.map(member => ({
                    value: `${member?.id}`,
                    text: `${member?.name}`,
                    value_detail: member
                }));

                setAllMembers(all_members);
            } catch (err) {
                console.log(err);
            }
        };

        getMembers();
    }, [API_URL]);



    /* Fetching books */
    useEffect(() => {
        const getallBooks = async () => {
            const response = await axios.get(API_URL + "api/books")
            const allbooks = await response.data.book_detail.map(book => (
                { value: `${book.id}`, text: `${book.bookName}`, value_detail: book }
            ))
            setAllBooks(allbooks)
        }
        getallBooks()
    }, [API_URL])


    return (
        <div>
            <p className="dashboard-option-title">Recent Transactions</p>
            <div className="dashboard-title-line"></div>
            <table className="admindashboard-table">
                <tr>
                    <th>S.No</th>
                    <th>Book Name</th>
                    <th>Borrower Name</th>
                    <th>Borrow Date</th>
                    <th>Due Date</th>
                    <th>Transaction Type</th>
                    <th>Status Book</th>
                </tr>
                {
                    recentTransactions.map((transaction, index) => {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{transaction.book_name}</td>
                                <td>{transaction.borrower_name}</td>
                                <td>{transaction.from_date.slice(0, 10)}</td>
                                <td>{transaction.to_date.slice(0, 10)}</td>
                                <td>{transaction.transaction_type}</td>
                                <td>{transaction.status}</td>
                            </tr>
                        )
                    })
                }
            </table>
        </div>
    )
}

export default MemberTransaction