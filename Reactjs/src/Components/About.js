import React from 'react'
import './About.css'

function About() {
    return (
        <div className='about-box'>
            <h2 className="about-title">About the Library</h2>
            <div className="about-data">
                <div className="about-img">
                    <img src="https://static-images.vnncdn.net/files/publish/2023/8/6/ban-doc-1-444.jpg" alt="" />
                </div>
                <div>
                    <p className="about-text">
                        Được xây dựng theo chuẩn quốc tế, Thư viện Ước mơ có đầy đủ đầu sách và 
                        tài liệu tham khảo cho mọi chuyên ngành. Điều thú vị là, 90% dữ liệu 
                        trong thư viện đến từ hệ thống dữ liệu trực tuyến từ cơ sở Melbourne, 
                        và luôn được cập nhật liên tục, từ nhiều nguồn trên toàn cầu. Đây là 
                        nguồn tài liệu dồi dào và quý giá cho sinh viên, không chỉ trong suốt 
                        thời gian theo học tại trường, mà còn về lâu dài sau khi đã tốt nghiệp 
                        và trở thành cựu sinh viên. RMIT tự hào là một trong những thư viện Anh 
                        ngữ lớn nhất Việt Nam với nguồn tài nguyên dồi dào và nhiều hoạt động 
                        lưu trữ và triển lãm kỹ thuật số.<br/>
                        <br/>
                        Để đáp ứng nhu cầu thông tin của bạn đọc Thủ đô, Thư viện đã không ngừng 
                        đổi mới phương thức, nâng cao chất lượng phục vụ: đơn giản thủ tục làm thẻ; 
                        mở rộng hệ thống các phòng phục vụ: phòng thiếu nhi, phòng đọc báo tạp chí, 
                        phòng mượn, phòng đọc tự chọn, phòng đọc theo yêu cầu, phòng đọc sách ngoại                             
                        văn, phòng đọc dành cho người khiếm thị, phòng đọc tài liệu về Hà Nội, phòng                             
                        đọc đa phương tiện… <br/>
                        <br/>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default About
