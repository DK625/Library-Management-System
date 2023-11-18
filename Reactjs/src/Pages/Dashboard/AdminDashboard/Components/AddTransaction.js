import React, { useContext, useEffect, useState } from 'react'
import "../AdminDashboard.css"
import axios from "axios"
import { AuthContext } from '../../../../Context/AuthContext'
import { Dropdown } from 'semantic-ui-react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment"

function AddTransaction() {

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

    /* Adding a Transaction */
    const addTransaction = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        if (bookId !== "" && borrowerId !== "" && transactionType !== "" && fromDate !== null && toDate !== null) {
            const borrower_details = allMembers.find(member => member.value === borrowerId);
            const book_details = allBooks.filter(book => book.value === bookId)

            /* Checking weather the book is available or not */
            if (book_details.remaining_copies == 0 && (transactionType === "Issued")) {
                alert("The book is not available")``
            }
            else if (borrower_details.value_detail.points <= 0) {
                alert("Points are too low, add more points or money to borrow books")
            }
            else {
                const transactionData = {
                    bookId: bookId,
                    borrowerId: borrowerId,
                    // borrowerName: borrower_details.value_detail.name, // object
                    // bookName: book_details[0].value_detail.bookName, // array
                    transactionType: transactionType,
                    fromDate: fromDateString,
                    toDate: toDateString,
                    isAdmin: user.isAdmin
                }
                try {
                    const response = await axios.post(
                        API_URL + "api/transactions",
                        transactionData,
                        {
                            headers: {
                                'Authorization': user.token,
                                'Content-Type': 'application/json'
                            }
                        }
                    );

                    // const response = await axios.post(API_URL + "api/transactions", transactionData)
                    let remaining_copies;
                    if (transactionType === "Issued") {
                        remaining_copies = book_details[0].value_detail.remaining_copies - 1;
                    } else {
                        remaining_copies = book_details[0].value_detail.remaining_copies + 1;
                    }

                    try {
                        const response = await axios.put(
                            API_URL + "api/books",
                            {
                                book_id: bookId,
                                remaining_copies: remaining_copies
                            },
                            {
                                headers: {
                                    'Authorization': user.token,
                                    'Content-Type': 'application/json'
                                }
                            }
                        );


                        console.log(response.data);
                    } catch (error) {
                        console.error("Error updating book:", error);
                    }

                    const book_detail_data = await axios.get(API_URL + "api/books")
                    const allbooks = await book_detail_data.data.book_detail.map(book => (
                        { value: `${book.id}`, text: `${book.bookName}`, value_detail: book }
                    ))
                    setAllBooks(allbooks)

                    setRecentTransactions([response.data.data, ...recentTransactions])
                    setBorrowerId("")
                    setBookId("")
                    setTransactionType("")
                    setFromDate(null)
                    setToDate(null)
                    setFromDateString(null)
                    setToDateString(null)
                    alert("Transaction was Successfull 🎉")
                }
                catch (err) {
                    console.log(err)
                }
            }
        }
        else {
            alert("Fields must not be empty")
        }
        setIsLoading(false)
    }


    /* Fetch Transactions */
    useEffect(() => {
        const getTransactions = async () => {
            try {
                const response = await axios.get(API_URL + "api/transactions")
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
            <p className="dashboard-option-title">Add a Transaction</p>
            <div className="dashboard-title-line"></div>
            <form className='transaction-form' onSubmit={addTransaction}>
                <label className="transaction-form-label" htmlFor="borrowerId">Borrower<span className="required-field">*</span></label><br />
                <div className='semanticdropdown'>
                    <Dropdown
                        placeholder='Select Member'
                        fluid
                        search
                        selection
                        value={borrowerId}
                        options={allMembers}
                        onChange={(event, data) => setBorrowerId(data.value)}
                    />
                </div>
                <table className="admindashboard-table shortinfo-table" style={borrowerId === "" ? { display: "none" } : {}}>
                    <tr>
                        <th>Name</th>
                        <th>Issued</th>
                        <th>Reserved</th>
                        <th>Points</th>
                    </tr>
                    <tr>
                        <td>{borrowerDetails.name}</td>
                        <td>{borrowerDetails.transactions?.filter((data) => {
                            return data.transactionType === "Issued"
                        }).length
                        }
                        </td>
                        <td>{borrowerDetails.transactions?.filter((data) => {
                            return data.transactionType === "Reserved"
                        }).length
                        }
                        </td>
                        <td>{borrowerDetails.points}</td>
                    </tr>
                </table>
                <table className="admindashboard-table shortinfo-table" style={borrowerId === "" ? { display: "none" } : {}}>
                    <tr>
                        <th>Book-Name</th>
                        <th>Transaction</th>
                        <th>From Date<br /><span style={{ fontSize: "10px" }}>[MM/DD/YYYY]</span></th>
                        <th>To Date<br /><span style={{ fontSize: "10px" }}>[MM/DD/YYYY]</span></th>
                    </tr>
                    {
                        // borrowerDetails.transactionType?.filter((data) => { return data.transactionStatus === "Active" }).map((data, index) => {
                        borrowerDetails.transactions?.map((data, index) => {
                            return (
                                <tr key={index}>
                                    <td>{data.book_name}</td>
                                    <td>{data.transaction_type}</td>
                                    <td>{data.from_date}</td>
                                    <td>{data.to_date}</td>
                                </tr>
                            )
                        })
                    }
                </table>

                <label className="transaction-form-label" htmlFor="bookName">Book Name<span className="required-field">*</span></label><br />
                <div className='semanticdropdown'>
                    <Dropdown
                        placeholder='Select a Book'
                        fluid
                        search
                        selection
                        options={allBooks}
                        value={bookId}
                        onChange={(event, data) => setBookId(data.value)}
                    />
                </div>
                <table className="admindashboard-table shortinfo-table" style={bookId === "" ? { display: "none" } : {}}>
                    <tr>
                        <th>Available Coipes</th>
                        <th>Remaining</th>
                    </tr>
                    {
                        allBooks.filter(book => book.value === bookId).map((data, index) => (
                            <tr key={index}>
                                <td>{data.value_detail.available_copies}</td>
                                <td>{data.value_detail.remaining_copies}</td>
                            </tr>
                        ))
                    }
                </table>

                <label className="transaction-form-label" htmlFor="transactionType">Transaction Type<span className="required-field">*</span></label><br />
                <div className='semanticdropdown'>
                    <Dropdown
                        placeholder='Select Transaction'
                        fluid
                        selection
                        value={transactionType}
                        options={transactionTypes}
                        onChange={(event, data) => setTransactionType(data.value)}
                    />
                </div>
                <br />

                <label className="transaction-form-label" htmlFor="from-date">From Date<span className="required-field">*</span></label><br />
                <DatePicker
                    className="date-picker"
                    placeholderText="MM/DD/YYYY"
                    selected={fromDate}
                    onChange={(date) => { setFromDate(date); setFromDateString(moment(date).format("MM/DD/YYYY")) }}
                    minDate={new Date()}
                    dateFormat="MM/dd/yyyy"
                />

                <label className="transaction-form-label" htmlFor="to-date">To Date<span className="required-field">*</span></label><br />
                <DatePicker
                    className="date-picker"
                    placeholderText="MM/DD/YYYY"
                    selected={toDate}
                    onChange={(date) => { setToDate(date); setToDateString(moment(date).format("MM/DD/YYYY")) }}
                    minDate={new Date()}
                    dateFormat="MM/dd/yyyy"
                />

                <input className="transaction-form-submit" type="submit" value="SUBMIT" disabled={isLoading}></input>
            </form>
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

export default AddTransaction