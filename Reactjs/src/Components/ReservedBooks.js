import React from 'react'
import './ReservedBooks.css'

function ReservedBooks() {
    return (
        <div className='reservedbooks-container'>
            <h className='reservedbooks-title'>Books On Hold</h>
            <table className='reservedbooks-table'>
                <tr>
                    <th>Name</th>
                    <th>Book</th>
                    <th>Date</th>
                </tr>
                <tr>
                    <td>Fujiki.F.Fujio</td>
                    <td>Doraemon</td>
                    <td>12/7/2021</td>
                </tr>
                <tr>
                    <td>Gosho Aoyama</td>
                    <td>Thám tử lừng danh Conan</td>
                    <td>10/7/2021</td>
                </tr>
                <tr>
                    <td>Dale Carnegie</td>
                    <td>Đắc nhân tâm</td>
                    <td>15/9/2021</td>
                </tr>
                <tr>
                    <td>Thảo Trang</td>
                    <td>Tết Ở Làng Địa Ngục</td>
                    <td>02/9/2021</td>
                </tr>
                <tr>
                    <td>Lâu Vũ Tình</td>
                    <td>Thất Tịch Không Mưa</td>
                    <td>21/7/2021</td>
                </tr>
                <tr>
                    <td>John Green</td>
                    <td>Khi Lỗi Thuộc Về Những Vì Sao</td>
                    <td>02/7/2021</td>
                </tr>
            </table>
        </div>
    )
}

export default ReservedBooks
