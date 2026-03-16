const simulateCombo = (req, res) => {
    try {
        const { teaName, herbName, ratio } = req.body;

        // Xử lý logic mô phỏng dựa vào dữ liệu truyền lên
        let flavor = `Vị thanh đặc trưng của ${teaName} quyện cùng hương thơm dịu của ${herbName}.`;
        let color = "Vàng nâu sóng sánh";
        let effect = "Giúp thư giãn tinh thần, thanh lọc cơ thể.";
        let note = "Ngon hơn khi thưởng thức nóng.";

        // Thay đổi kết quả nhẹ dựa trên tỷ lệ
        if (ratio === '70/30') {
            flavor = `Đậm vị ${teaName}, thoang thoảng hương ${herbName}.`;
            note = "Phù hợp uống vào buổi sáng để tỉnh táo.";
        } else if (ratio === '50/50') {
            flavor = `Sự cân bằng hoàn hảo giữa ${teaName} và ${herbName}.`;
            note = "Phù hợp uống vào buổi chiều trà.";
        }

        res.status(200).json({
            success: true,
            data: {
                comboName: `Combo ${teaName} & ${herbName}`,
                ratio: ratio,
                predictions: { flavor, color, effect, note }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi mô phỏng' });
    }
};

module.exports = { simulateCombo };