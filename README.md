# OneReadAPI
# CHỨC NĂNG
## Chế độ online và offline
## Download chapter
## Tìm kiếm sách
-	Lưu text tìm kiếm của user vào local
-	Search_number của sách khi thực hiện click ở giao diện tìm kiếm
## Đọc sách
-	Tăng view của sách từ book_endpoint trong bảng chapter
-	Tăng view trong bảng ViewStatistic dựa theo ngày tháng năm và endpoint của sách
## Đánh dấu chapter
-	Lưu chapter_endpoint cùng book_endpoint vào local
## Follow sách
-	Cập nhật bảng BookFollow
## Gợi ý sách
-	Viết câu truy vấn từ 4 bảng BookFollows, Book, BookGenres để lấy danh sách các thể loại và tổng số lần xuất hiện của chúng để biết người dùng thường yêu thích thể loại nào.
-	Dựa vào top 5 kết quả ở trên truy vấn đến bảng sách và lấy ra top 10 sách có chứa thể loại đấy với nhiều lượt xem nhất. (bài toán đặt ra: Cho trước mảng a, và dãy các mảng xi, hãy xắp sếp dãy các mảng sau theo điều kiện các phần tử trong mảng thứ I trùng với các phần tử ở mảng a từ nhiều nhất đến thấp nhất)(bonus: cho thêm số y ở mỗi mảng xi nếu số phẩn tử trùng bằng nhau khi xắp sếp thì xắp sếp theo y giảm dần)(xi đại diện cho sách thứ i trong bảng sách, các phần tử trong mảng xi đại diện cho genre của 1 cuốn sách, y đại diện cho số lượt xem của sách)
## Top view
-	Truy vấn từ Book và ViewStatistic
## Top rating
-	Truy vấn từ Book
## Last update
-	Truy vấn từ Book và Chapter và xắp sếp theo ngày cập nhật của chapter
## Thông báo sách đã hoàn thành
-	Thông báo tới các user đang follow sách 
## Thông báo chapter mới
-	Thông báo tới các user đang follow sách 
## Lịch sử xem
-	Cập nhật chapter_endpoint trong bảng history khi người dùng đọc (bắt sự kiện từ click ở danh sách chapter và cả click ở button next)
## Report user
-	User report user khác với lí do và chờ admin xem xét
-	Nếu user đã bị report và chưa được xem xét thì cập nhật num, time và nối thêm text “reason \n” và giới hạn số lượng kí tự của cả text
-	Sau khi xem xét xong admin xoá report hoặc đánh dấu đã đọc và nhấn nút xoá tất cả các report đã đọc
## Ban/unban user
-	Admin set trạng thái ban/unban cho user và thông báo cho user qua mail
-	User sau khi bị ban không thể thực hiện comment hoặc report
## Comment
-	Comment được hiển thị theo chapter và book từ mới nhất
-	User có thể comment emotion, image, gif
## Reply comment
## Report comment
## Tag user/ thông báo tag
-	Khi insert comment tìm trong content các nơi có @username thực hiện thông báo tới user
## Hash password trong đăng kí, đăng nhập (email của từng account là duy nhất)
## Lấy lại mật khẩu
-	Gửi token đã mã hoá từ email mà user nhập vào và thời gian mã hết hạn qua email

	
