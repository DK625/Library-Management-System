import React, { useContext, useEffect, useState } from 'react'
import "../AdminDashboard.css"
import axios from "axios"
import { AuthContext } from '../../../../Context/AuthContext'
import { Dropdown } from 'semantic-ui-react'

function AddBook() {

    const API_URL = process.env.REACT_APP_API_URL
    const [isLoading, setIsLoading] = useState(false)
    const { user } = useContext(AuthContext)

    const [bookName, setBookName] = useState("")
    const [alternateTitle, setAlternateTitle] = useState("")
    const [author, setAuthor] = useState("")
    const [available_copies, setavailable_copies] = useState(null)
    const [language, setLanguage] = useState("")
    const [publisher, setPublisher] = useState("")
    const [allCategories, setAllCategories] = useState([])
    const [selectedCategories, setSelectedCategories] = useState([])
    const [recentAddedBooks, setRecentAddedBooks] = useState([])


    /* Fetch all the Categories */
    useEffect(() => {
        const getAllCategories = async () => {
            try {
                const response = await axios.get(API_URL + "api/allcategories")
                const all_categories = await response.data.category_detail.map(category => (
                    { value: `${category.id}`, text: `${category.name}` }
                ))
                console.log('all_categories: ', all_categories)
                setAllCategories(all_categories)
            }
            catch (err) {
                console.log(err)
            }
        }
        getAllCategories()
    }, [API_URL])

    /* Adding book function */
    const addBook = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        const BookData = {
            bookName: bookName,
            alternateTitle: alternateTitle,
            author: author,
            available_copies: available_copies,
            language: language,
            publisher: publisher,
            categories: selectedCategories,
            isAdmin: user.isAdmin
        }
        try {
            const response = await axios.post(API_URL + "api/books", BookData)
            // if (recentAddedBooks.length >= 5) {
            //     recentAddedBooks.splice(-1)
            // }
            setRecentAddedBooks([response.data.data, ...recentAddedBooks])
            setBookName("")
            setAlternateTitle("")
            setAuthor("")
            setavailable_copies(null)
            setLanguage("")
            setPublisher("")
            setSelectedCategories([])
            alert("Book Added Successfully 🎉")
        }
        catch (err) {
            console.log(err)
        }
        setIsLoading(false)
    }


    useEffect(() => {
        const getallBooks = async () => {
            const response = await axios.get(API_URL + "api/books")
            // setRecentAddedBooks(response.data.book_detail.slice(0, 5))
            setRecentAddedBooks(response.data.book_detail)
        }
        getallBooks()
    }, [API_URL])


    return (
        <div>
            <p className="dashboard-option-title">Add a Book</p>
            <div className="dashboard-title-line"></div>
            <form className='addbook-form' onSubmit={addBook}>

                <label className="addbook-form-label" htmlFor="bookName">Book Name<span className="required-field">*</span></label><br />
                <input className="addbook-form-input" type="text" name="bookName" value={bookName} onChange={(e) => { setBookName(e.target.value) }} required></input><br />

                <label className="addbook-form-label" htmlFor="alternateTitle">AlternateTitle</label><br />
                <input className="addbook-form-input" type="text" name="alternateTitle" value={alternateTitle} onChange={(e) => { setAlternateTitle(e.target.value) }}></input><br />

                <label className="addbook-form-label" htmlFor="author">Author Name<span className="required-field">*</span></label><br />
                <input className="addbook-form-input" type="text" name="author" value={author} onChange={(e) => { setAuthor(e.target.value) }} required></input><br />

                <label className="addbook-form-label" htmlFor="language">Language</label><br />
                <input className="addbook-form-input" type="text" name="language" value={language} onChange={(e) => { setLanguage(e.target.value) }}></input><br />

                <label className="addbook-form-label" htmlFor="publisher">Publisher</label><br />
                <input className="addbook-form-input" type="text" name="publisher" value={publisher} onChange={(e) => { setPublisher(e.target.value) }}></input><br />

                <label className="addbook-form-label" htmlFor="copies">No.of Copies Available<span className="required-field">*</span></label><br />
                <input className="addbook-form-input" type="text" name="copies" value={available_copies} onChange={(e) => { setavailable_copies(e.target.value) }} required></input><br />

                <label className="addbook-form-label" htmlFor="categories">Categories<span className="required-field">*</span></label><br />
                <div className="semanticdropdown">
                    <Dropdown
                        placeholder='Category'
                        fluid
                        multiple
                        search
                        selection
                        options={allCategories}
                        value={selectedCategories}
                        onChange={(event, value) => setSelectedCategories(value.value)}
                    />
                </div>

                <input className="addbook-submit" type="submit" value="SUBMIT" disabled={isLoading}></input>
            </form>
            <div>
                <p className="dashboard-option-title">Recently Added Books</p>
                <div className="dashboard-title-line"></div>
                <table className='admindashboard-table'>
                    <tr>
                        <th>S.No</th>
                        <th>Book Name</th>
                        <th>Alternate Title</th>
                        <th>Author Name</th>
                        <th>Language</th>
                        <th>Publisher</th>
                        <th>No.of Copies Available</th>
                        <th>Categories</th>
                        <th>Added Date</th>
                    </tr>
                    {
                        recentAddedBooks.map((book, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{book.bookName}</td>
                                    <td>{book.alternateTitle}</td>
                                    <td>{book.author}</td>
                                    <td>{book.language}</td>
                                    <td>{book.publisher}</td>
                                    <td>{book.available_copies}</td>
                                    <td>{book.category_name ? book.category_name.join(', ') : ''}</td>
                                    <td>{book.added_date}</td>
                                </tr>
                            )
                        })
                    }
                </table>
            </div>
        </div>
    )
}

export default AddBook