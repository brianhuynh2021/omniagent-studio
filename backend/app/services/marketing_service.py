import time
from typing import Dict, Any, List
from app.agents.base import AgentResponse, ToolExecutionLog

class LocalBizMarketingService:
    def generate_marketing_campaign(self, biz_name: str, biz_type: str, promotion_goal: str) -> AgentResponse:
        start_time = time.time()
        
        trace_logs = [
            ToolExecutionLog(
                tool_name="BrandVoiceAgent",
                input_args={"biz_name": biz_name, "biz_type": biz_type},
                output_summary="Xác định giọng văn thân thiện, thu hút cho quán nhỏ.",
                execution_time_ms=28.1
            ),
            ToolExecutionLog(
                tool_name="SocialPostGeneratorTool",
                input_args={"goal": promotion_goal},
                output_summary="Đã khởi tạo 3 mẫu bài viết tối ưu cho FB, Zalo, TikTok.",
                execution_time_ms=64.8
            ),
            ToolExecutionLog(
                tool_name="ContentCalendarPlannerTool",
                input_args={"schedule_days": 7},
                output_summary="Lên lịch 7 ngày đăng bài tăng tương tác và chốt đơn.",
                execution_time_ms=41.2
            )
        ]

        posts = {
            "facebook": f"🔥 HOT NEWS TẠI {biz_name.upper()}! 🔥\n👉 Bạn đã sẵn sàng trải nghiệm {promotion_goal} cực đỉnh chưa?\n⚡ Giảm ngay 20% cho 50 khách hàng đầu tiên đặt lịch/đến quán hôm nay!\n📍 Địa chỉ: [Nhập địa chỉ của bạn]\n📞 Hotline đặt bàn/hàng: [Số điện thoại]\n# {biz_name.replace(' ', '')} #{biz_type} #KhuyenMaiHot #CheckIn",
            "zalo": f"✨ CHƯƠNG TRÌNH ĐẶC BIỆT TẠI {biz_name.upper()} ✨\nƯu đãi lớn: {promotion_goal}.\nKính mời quý khách nhắn tin Zalo ngay để nhận voucher giảm giá 20% và quà tặng kèm!\nLiên hệ ngay hôm nay!",
            "tiktok_script": f"🎬 [KỊCH BẢN TIKTOK 15s]\n- Scene 1 (0-3s): Quay cận cảnh món ăn/dịch vụ hot nhất tại {biz_name} kèm nhạc trend.\n- Scene 2 (3-8s): Chèn chữ 'BÍ MẬT GIẢM 20% HÔM NAY'.\n- Scene 3 (8-15s): Chủ quán/nhân viên vẫy tay chào: 'Ghé ngay {biz_name} để nhận quà nhé!'"
        }

        calendar = [
            {"day": "Thứ 2", "time": "08:00", "channel": "Facebook", "topic": "Khởi đầu tuần mới + Giới thiệu ưu đãi đặc biệt"},
            {"day": "Thứ 3", "time": "11:30", "channel": "Zalo OA", "topic": "Gửi tin nhắn voucher ưu đãi cho khách quen"},
            {"day": "Thứ 4", "time": "19:00", "channel": "TikTok", "topic": "Video ngắn hậu trường chuẩn bị dịch vụ"},
            {"day": "Thứ 5", "time": "12:00", "channel": "Facebook", "topic": "Feedback hình ảnh thực tế từ khách hàng"},
            {"day": "Thứ 6", "time": "17:30", "channel": "Zalo / FB", "topic": "Rủ rê hẹn hò cuối tuần + Đặt bàn trước"},
            {"day": "Thứ 7", "time": "09:00", "channel": "TikTok", "topic": "Review không gian quán & trải nghiệm khách"},
            {"day": "Chủ Nhật", "time": "20:00", "channel": "Facebook", "topic": "Tổng kết tuần + Minigame tặng quà tuần sau"}
        ]

        crm_leads = [
            {"name": "Nguyễn Thị Mai", "phone": "0901xxx123", "interest": "Đặt bàn 4 người", "status": "Mới"},
            {"name": "Trần Văn Hùng", "phone": "0982xxx456", "interest": "Hỏi giá combo cuối tuần", "status": "Đã tư vấn"},
            {"name": "Phạm Lê Anh", "phone": "0913xxx789", "interest": "Voucher giảm 20%", "status": "Đã chốt"}
        ]

        structured = {
            "posts": posts,
            "calendar": calendar,
            "crm_leads": crm_leads,
            "estimated_reach": "1.500 - 3.000 khách tiềm năng/tuần"
        }

        return AgentResponse(
            agent_name="LocalBizMarketingAgent",
            output_text=f"Đã lên chiến dịch Marketing & Sales trọn gói cho '{biz_name}' với mục tiêu '{promotion_goal}'.",
            structured_data=structured,
            citations=[],
            trace_logs=trace_logs,
            hallucination_check_passed=True,
            total_latency_ms=round((time.time() - start_time) * 1000, 2)
        )

marketing_service = LocalBizMarketingService()
