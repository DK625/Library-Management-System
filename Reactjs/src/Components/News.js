import React from 'react'
import './News.css'

function News() {
    return (
        <div className='news-container'>
            <h className='news-title'>Updates for You</h>
            <div className='news-data'>
                <div className='news-empty'></div>
                <div>
                    <h1 className='news-subtitle'>Cuộc thi</h1>
                    <div>
                        <div className='news-competition-event'>
                            <p>1</p>
                            <p>Thiết kế banner cho sách mới</p>
                        </div>
                        <div className='news-competition-event'>
                            <p>2</p>
                            <p>Viết đánh giá sách</p>
                        </div>
                        <div className='news-competition-event'>
                            <p>3</p>
                            <p>Xếp sách</p>
                        </div>
                    </div>
                </div>
                <div className='news-empty'></div>
                <div>
                    <h1 className='news-subtitle'>Câu đố online</h1>
                    <div>
                        <div className='news-quiz-event'>
                            <p>Quiz-1</p>
                            <p>Ai là tác giả của bộ truyện tranh Doraemon?</p>
                        </div>
                        <div className='news-quiz-event'>
                            <p>Quiz-2</p>
                            <p>Conan tại sao bị teo nhỏ?</p>
                        </div>
                        <div className='news-quiz-event'>
                            <p>Quiz-3</p>
                            <p>Doraemon màu gì?</p>
                        </div>
                    </div>
                </div>
                <div className='news-empty'></div>
            </div>
        </div>
    )
}

export default News
