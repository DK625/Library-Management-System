import React from 'react'
import './ImageSlider.css'
import { Carousel } from 'react-bootstrap'

function ImageSlider() {
    return (
        <div className='slider'>
            <Carousel>
                <Carousel.Item interval={1000}>
                    <img
                        className="d-block w-100"
                        src="https://www.vietnambooking.com/wp-content/uploads/2017/03/tin-tuc-thu-vien-lon-nhat-the-gioi-10-3-2017.jpg"
                        alt="First slide"
                    />
                    <Carousel.Caption>
                        <h3>Đa dạng</h3>
                        <p>Thư viện có hàng trăm đầu sách.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item interval={500}>
                    <img
                        className="d-block w-100"
                        src="https://dlcorp.com.vn/wp-content/uploads/2020/12/book-library-1509787712731_2.jpg"
                        alt="Second slide"
                    />
                    <Carousel.Caption>
                        <h3>Phong phú</h3>
                        <p>Rất nhiều thể loại khác nhau</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://statics.cdn.200lab.io/2021/07/1_igvVvVLNlguJW-009OEvuw-1-1.jpeg"
                        alt="Third slide"
                    />
                    <Carousel.Caption>
                        <h3>Cập nhật nhanh chóng</h3>
                        <p>Những đầu sách mới được cập nhật một cách nhanh nhất phục vụ bạn đọc</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </div>
    )
}

export default ImageSlider
