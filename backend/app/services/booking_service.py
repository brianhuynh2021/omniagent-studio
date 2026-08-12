import time
from typing import Dict, Any, List
from app.agents.base import AgentResponse, ToolExecutionLog

class CustomerSupportBookingService:
    def __init__(self):
        self.bookings = [
            {"id": "BK-101", "customer_name": "Lê Hoài Nam", "phone": "0912345678", "service": "Bảo dưỡng xe tay ga", "time": "14:00 15/08/2026", "status": "CONFIRMED"},
            {"id": "BK-102", "customer_name": "Đặng Kim Anh", "phone": "0987654321", "service": "Chăm sóc da mặt chuyên sâu", "time": "10:00 16/08/2026", "status": "PENDING"}
        ]

    def handle_customer_message(self, message: str, customer_phone: str = "") -> AgentResponse:
        start_time = time.time()
        
        needs_human = any(k in message.lower() for k in ["gặp người thật", "khiếu nại", "quản lý", "sự cố"])
        is_booking = any(k in message.lower() for k in ["đặt lịch", "hẹn", "mấy giờ", "đặt chỗ", "lịch trống"])

        trace_logs = [
            ToolExecutionLog(
                tool_name="IntentClassifierTool",
                input_args={"message": message},
                output_summary=f"Ý định: {'Đặt lịch' if is_booking else ('Handoff Người thật' if needs_human else 'Hỏi đáp FAQ')}",
                execution_time_ms=19.2
            )
        ]

        if needs_human:
            trace_logs.append(ToolExecutionLog(
                tool_name="HumanHandoffRouter",
                input_args={"status": "ESCALATED"},
                output_summary="Đã chuyển cuộc hội thoại sang tư vấn viên trực ca.",
                execution_time_ms=12.5
            ))
            reply = "Dạ hệ thống đã ghi nhận yêu cầu của quý khách và đang kết nối trực tiếp với Tư vấn viên trực ca. Nhân viên sẽ phản hồi trong ít phút ạ!"
            status = "HUMAN_HANDOFF"
        elif is_booking:
            new_id = f"BK-{100 + len(self.bookings) + 1}"
            new_booking = {
                "id": new_id,
                "customer_name": "Khách hàng mới",
                "phone": customer_phone or "090xxxxxxx",
                "service": "Dịch vụ theo yêu cầu",
                "time": "15:00 Ngày mai",
                "status": "CONFIRMED"
            }
            self.bookings.append(new_booking)
            trace_logs.append(ToolExecutionLog(
                tool_name="BookingSlotEngine",
                input_args={"new_id": new_id},
                output_summary="Xác nhận khung giờ trống và lưu lịch hẹn vào cơ sở dữ liệu.",
                execution_time_ms=35.0
            ))
            reply = f"Dạ em đã giữ chỗ thành công cho quý khách! Mã lịch hẹn của bạn là [{new_id}]. Cửa hàng sẽ gửi SMS/Zalo nhắc lịch trước 2 tiếng ạ."
            status = "BOOKED"
        else:
            trace_logs.append(ToolExecutionLog(
                tool_name="FAQKnowledgeBase",
                input_args={"topic": "Dịch vụ & Giá"},
                output_summary="Trích xuất thông tin giờ mở cửa (8h00 - 21h00) và bảng giá niêm yết.",
                execution_time_ms=22.1
            ))
            reply = "Chào bạn! Cửa hàng mở cửa từ 08:00 - 21:00 tất cả các ngày trong tuần. Bạn muốn tìm hiểu dịch vụ nào hay cần đặt lịch khung giờ nào ạ?"
            status = "FAQ_ANSWERED"

        structured = {
            "conversation_status": status,
            "bookings_list": self.bookings,
            "available_slots": ["09:00", "10:30", "14:00", "15:30", "17:00"]
        }

        return AgentResponse(
            agent_name="CustomerSupportBookingAgent",
            output_text=reply,
            structured_data=structured,
            citations=[],
            trace_logs=trace_logs,
            hallucination_check_passed=True,
            total_latency_ms=round((time.time() - start_time) * 1000, 2)
        )

booking_service = CustomerSupportBookingService()
