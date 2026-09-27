import AppShell from "@/components/app-shell";
import { Card, PageTitle } from "@/components/ui";

export default function TermsPage() {
  return (
    <AppShell>
      <PageTitle
        title="Điều khoản sử dụng"
        subtitle="Các điều khoản áp dụng cho prototype LabGate."
      />

      <Card className="terms-card">
        <p className="terms-updated">
          Cập nhật lần cuối: 27/09/2026
        </p>

        <section>
          <h2>1. Giới thiệu</h2>

          <p>
            LabGate là nền tảng số do đội <strong>Global Girls</strong> phát
            triển trong khuôn khổ dự án dự thi{" "}
            <strong>
              Cuộc thi Tài năng trẻ Logistics Việt Nam – Học viện Ngân hàng
            </strong>
            , nhằm minh họa giải pháp hỗ trợ điều phối kiểm nghiệm và logistics
            chuỗi lạnh cho sầu riêng xuất khẩu sang Trung Quốc.
          </p>

          <p>
            Phiên bản hiện tại là{" "}
            <strong>
              prototype phục vụ nghiên cứu, trình bày và đánh giá học thuật
            </strong>
            , chưa phải hệ thống thương mại đang vận hành thực tế.
          </p>
        </section>

        <section>
          <h2>2. Dữ liệu trên nền tảng</h2>

          <p>
            LabGate sử dụng cả{" "}
            <strong>dữ liệu tham chiếu từ nguồn công khai</strong> và{" "}
            <strong>dữ liệu mô phỏng</strong>.
          </p>

          <p>
            Theo dữ liệu được nhóm sử dụng trong báo cáo và cập nhật đến ngày{" "}
            <strong>05/08/2026</strong>, có 50 cơ sở kiểm nghiệm tại 13 tỉnh,
            thành phố được GACC chấp nhận thực hiện các chỉ tiêu Cadimi và/hoặc
            Vàng O đối với quả tươi xuất khẩu sang Trung Quốc.
          </p>

          <p>
            Các dữ liệu như trạng thái tiếp nhận, công suất, thời gian chờ, chi
            phí, lịch hẹn, thông tin lô hàng, tuyến vận chuyển, chỉ số rủi ro và
            khuyến nghị trên prototype chủ yếu là{" "}
            <strong>dữ liệu mô phỏng</strong>, không phản ánh tình trạng vận hành
            thực tế tại thời điểm truy cập.
          </p>

          <p>
            Người dùng cần kiểm tra lại thông tin tại nguồn chính thức trước khi
            sử dụng cho hoạt động thực tế.
          </p>
        </section>

        <section>
          <h2>3. Phạm vi sử dụng</h2>

          <p>
            LabGate là công cụ <strong>hỗ trợ ra quyết định</strong>. Các kết
            quả xếp hạng, điểm số, cảnh báo hoặc phương án được đề xuất chỉ mang
            tính tham khảo và không thay thế đánh giá chuyên môn của doanh
            nghiệp hoặc các đơn vị có thẩm quyền.
          </p>

          <p>
            Các thao tác như tạo lô hàng, chọn phòng kiểm nghiệm, đặt lịch hoặc
            lựa chọn phương án vận chuyển trên bản demo{" "}
            <strong>không tạo thành giao dịch hoặc hợp đồng thực tế</strong>.
          </p>
        </section>

        <section>
          <h2>4. Giới hạn trách nhiệm</h2>

          <p>
            Nhóm phát triển không bảo đảm rằng dữ liệu luôn đầy đủ, cập nhật theo
            thời gian thực hoặc không có sai sót, và không chịu trách nhiệm đối
            với các thiệt hại phát sinh từ việc sử dụng dữ liệu mô phỏng hoặc
            thông tin chưa được xác minh cho hoạt động thực tế, trong phạm vi
            pháp luật cho phép.
          </p>
        </section>

        <section>
          <h2>5. Nội dung và dịch vụ của bên thứ ba</h2>

          <p>
            LabGate có thể hiển thị tên, dữ liệu hoặc thông tin liên quan đến cơ
            quan nhà nước, cơ sở kiểm nghiệm, doanh nghiệp hoặc đơn vị
            logistics.
          </p>

          <p>
            Việc xuất hiện trên LabGate{" "}
            <strong>
              không đồng nghĩa với việc các đơn vị đó tài trợ, chứng nhận, ủy
              quyền hoặc hợp tác với LabGate
            </strong>
            , trừ khi có thông báo chính thức.
          </p>
        </section>

        <section>
          <h2>6. Quyền sở hữu trí tuệ</h2>

          <p>
            Mã nguồn, thiết kế giao diện, nội dung, hình ảnh, đồ họa và các
            thành phần do nhóm LabGate tự xây dựng thuộc quyền của nhóm tác giả
            hoặc chủ thể có quyền tương ứng.
          </p>

          <p>
            Tên, nhãn hiệu, dữ liệu hoặc nội dung của bên thứ ba thuộc quyền của
            chủ thể tương ứng.
          </p>
        </section>

        <section>
          <h2>7. Quyền riêng tư</h2>

          <p>
            Nếu LabGate thu thập thông tin người dùng thông qua tài khoản, biểu
            mẫu hoặc các chức năng khác, việc xử lý dữ liệu sẽ được thực hiện
            theo <strong>Chính sách quyền riêng tư</strong> được công bố riêng
            trên nền tảng.
          </p>

          <p>
            Người dùng không nên nhập dữ liệu cá nhân nhạy cảm, bí mật kinh
            doanh hoặc thông tin lô hàng thực tế vào các chức năng mô phỏng của
            prototype.
          </p>
        </section>

        <section>
          <h2>8. Thay đổi nền tảng và điều khoản</h2>

          <p>
            LabGate đang trong quá trình thử nghiệm và có thể thay đổi chức
            năng, dữ liệu, giao diện hoặc nội dung mà không cần thông báo trước.
          </p>

          <p>
            Điều khoản sử dụng này cũng có thể được cập nhật khi phạm vi hoạt
            động của LabGate thay đổi.
          </p>
        </section>

        <section>
          <h2>9. Liên hệ</h2>

          <p>
            <strong>Nhóm dự án LabGate – Global Girls</strong>
            <br />
            Học viện Ngân hàng
          </p>
        </section>
      </Card>
    </AppShell>
  );
}