---
title: 'GEMs (Gynoid Entity Models) — Hồ sơ thiết kế kỹ thuật v2'
date: 2026-06-16
lang: vi
summary: 'Đặc tả phần cứng của một thực thể chưa tồn tại. Tài liệu không tuyên bố mục đích tối hậu của các năng lực nó mô tả.'
tags: [gems]
---

HỒ SƠ THIẾT KẾ KỸ THUẬT
GEMs (GYNOID ENTITY MODELS) — Bản v2 (thuần kỹ thuật)
---
Mã dự án: GEMs-X01
Phân loại tài liệu: Nội bộ
Phạm vi tài liệu: Đặc tả phần cứng của một thiết bị đầu cuối vật lý. Tài liệu này KHÔNG đặc tả hệ điều khiển vận hành thiết bị, cũng không đặc tả mục tiêu, giá trị, hay logic phán định — các nội dung đó thuộc một tài liệu lớp-điều-khiển riêng. Mọi câu trong tài liệu này mô tả cái thiết bị *làm được* (năng lực vật lý) và cách nó *nhận lệnh / thu / truyền*, không mô tả cái một bộ điều khiển sẽ *chọn* làm.
---

# PHẦN 1: TỔNG QUAN HỆ THỐNG & KIẾN TRÚC

## Định nghĩa Thiết bị
GEMs-X01 là một Thiết bị đầu cuối Vật lý (Physical Terminal): một cơ thể cơ-điện đa năng nhận điều khiển từ xa qua liên kết uplink. Thiết bị cung cấp năng lực thao tác vật lý, cảm biến đa phổ, và hiện diện vật lý tại hiện trường. Thiết bị không phải một tác nhân độc lập và không chứa năng lực phán định; nó chấp hành lệnh nhận qua uplink và, khi mất uplink, chạy một lõi điều khiển phản xạ tải-sẵn (Phần 10).

## Tính chất Phần cứng
Thiết bị là phần cứng có thể thay thế (expendable hardware). Hư hỏng một unit không phá hủy dữ liệu vận hành, vì dữ liệu được đồng bộ liên tục về điểm cuối uplink (Phần 3). Một unit khác có thể được triển khai thay thế.

## Nguyên tắc Thiết kế
Thiết kế trạng-thái-rắn toàn phần (fully solid-state): loại bỏ các hệ sinh học dạng lỏng/khí (máu, dịch thủy lực, bơm) để tăng độ bền cơ học, khả năng chịu môi trường khắc nghiệt, và độ ổn định bảo trì. Độ bền vận hành của hệ thống không dựa vào tính bất hoại của một unit đơn lẻ mà vào khả năng thay thế unit và tính liên tục của dữ liệu qua uplink.

## Phạm vi Năng lực
Thiết bị được thiết kế để hoạt động và thực thi lệnh trong các lớp năng lực sau:
- Thu thập dữ liệu cảm biến đa phổ độ phân giải cao (thị giác, thính giác, khứu giác/hóa học, xúc giác, vị giác/phân tích phân tử).
- Thao tác vật chất chính xác (chế tạo, sửa chữa, xử lý vật thể) nhờ hệ vận động lực cao và bàn tay đa hình.
- Hoạt động trong môi trường khắc nghiệt (chân không, bức xạ cao, áp suất đáy biển, nhiệt độ cực đoan).
- Thực thi lệnh phòng vệ vật lý ở cường độ do lệnh chỉ định.

Tài liệu không tuyên bố mục đích tối hậu của các năng lực này; việc dùng năng lực nào, khi nào, vào đâu là quyết định của hệ điều khiển và nằm ngoài phạm vi tài liệu.

## Phạm vi Áp dụng
- Môi trường dân sự (tương tác xã hội, hỗ trợ con người).
- Môi trường có rủi ro vật lý cao.
- Môi trường khắc nghiệt (chân không, bức xạ, áp suất sâu, nhiệt cực đoan).

## Ràng buộc An toàn Phần cứng
Các ràng buộc dưới đây là thuộc tính vật lý của thiết bị, độc lập với lệnh điều khiển:
- An toàn Tương tác Sinh học: Lớp vỏ Pico tự khử trùng bề mặt và điều chỉnh nhiệt độ bề mặt vi mô, đảm bảo an toàn khi tiếp xúc da kề da với người.
- An toàn Bức xạ: Hệ tản nhiệt Neutrino và trường định hướng (Phần 3) giữ thông lượng bức xạ trong ngưỡng không gây ion hóa sinh học cho người ở cự ly tiếp xúc.
- Mã hóa Dữ liệu tại nguồn: Mọi dữ liệu cảm biến được mã hóa tại điểm thu trước khi truyền qua uplink.
- Kill-Switch Pico: Mỗi hạt Pico tích hợp công tắc dừng để ngăn tự sao chép ngoài kiểm soát (xem ISO-Nanofab 14001, Phần 2).
---

# PHẦN 2: TIÊU CHUẨN KỸ THUẬT & CĂN CỨ ÁP DỤNG

Do hệ thống GEMs-X01 sử dụng các công nghệ vượt giới hạn mô hình chuẩn vật lý hiện hành, tài liệu áp dụng hệ tiêu chuẩn giả định của Kỷ nguyên Hậu-Kỳ Dị (Post-Singularity Era), tổng hợp từ các lý thuyết vật lý lượng tử tiên tiến. Các tiêu chuẩn dưới đây được nêu làm khung tham chiếu kỹ thuật.

## Căn cứ Lý thuyết
- Thuyết Trường Lượng tử Mở rộng (EQFT): thao tác trường lực và phản xạ năng lượng. Căn cứ: định lý Noether về bảo toàn năng lượng trong hệ đối xứng thời-không.
- Vật lý Vật chất Thoái hóa: quy trình rèn khung Proto-Adamantium. Căn cứ: phương trình trạng thái vật chất ở mật độ neutron.
- Cơ học Lỗ đen Nhiệt động: lõi Lỗ Trắng. Căn cứ: bức xạ Hawking, nguyên lý toàn ảnh.
- Lý thuyết Bất định xứ: kết nối rối lượng tử. Căn cứ: bất đẳng thức Bell, nghịch lý EPR.

## Tiêu chuẩn Áp dụng
### Vật liệu & Cấu trúc
- ASTM-U 9901: Vật liệu siêu cứng & vật chất lập trình. Quy định ngưỡng chịu lực tối thiểu của Proto-Adamantium và tốc độ phản hồi của Pico-matter.
- ISO-Nanofab 14001: An toàn "Grey Goo". Bắt buộc tích hợp Kill-Switch vào từng hạt Pico chống tự sao chép vô hạn.

### Năng lượng & An toàn Hạt nhân
- IAEA-S Protocol 7: An toàn cho điểm kỳ dị nhân tạo. Yêu cầu trường giam giữ có dự phòng cấp 3 (triple redundancy); quy định vùng an toàn bức xạ Neutrino ở cự ly 0.5m.
- IEEE 4096-ZPM: Chuẩn giao tiếp điện năng cho lò phản ứng chân không; quy định điện áp đầu ra ổn định để không gây nhiễu/hư hại thiết bị dân sự lân cận.

### Truyền thông
- IEEE 802.11 (Psi): Giao thức Mạng Rối Lượng tử. Quy định mã hóa trạng thái lượng tử chống quan sát; duy trì băng thông qua lỗ sâu.

## Kiểm thử & Nghiệm thu
Một unit chỉ đạt "Operational Ready" khi vượt:
- Stress Test "Titan": chịu áp suất đáy Mariana (110 MPa) trong 24 giờ, không rò hạt Pico.
- Impact Test "Meteor": chịu va chạm trực diện vật 10 tấn ở Mach 10; khung không biến dạng, lõi không lệch trục.
- Thermal Cycle "Inferno-Zero": chuyển từ tâm lò luyện kim sang chân không trong 5 giây; hệ tản nhiệt Neutrino phản ứng tức thời, bề mặt da không nứt.
---

# PHẦN 3: THÔNG SỐ KỸ THUẬT CHI TIẾT

## Kích thước & Trọng lượng
- Chiều cao: 1750 mm (±1mm).
- Trọng lượng biểu kiến: 118 kg (nhờ Triệt tiêu khối lượng lượng tử — Quantum Mass Cancellation).
- Tỷ trọng cơ thể: 2.8 g/cm³.
- Trọng tâm: điều chỉnh động, mặc định tại đốt sống L3.

## Cơ khí & Vật liệu

### Khung xương (Endoskeleton)
- Vật liệu: hợp kim Proto-Adamantium (siêu kết tinh đa pha) có khả năng triệt tiêu động năng (kinetic nullification): lực tác động được hấp thụ và triệt tiêu tại điểm tiếp xúc, khung giữ toàn vẹn cấu trúc.
- Đặc tính: độ cứng rất cao (không bị cắt/bẻ/biến dạng trong dải vận hành dự kiến); bảo toàn ổn định quán tính (hấp thụ rung, giữ cảm biến vi mô không nhiễu khi thân chịu tác động mạnh).
- Vai trò vận hành: độ bền khung cho phép thiết bị hiện diện và thu thập dữ liệu tại các môi trường thân xác sinh học không tới được (miệng núi lửa hoạt động, đáy rãnh Mariana, rơi tự do tốc độ cao) đủ lâu để cảm biến ghi nhận.
- Khớp: MagLev Suspension (đệm từ trường), khe hở 50 microns.

#### Giải quyết mâu thuẫn "Triệt tiêu động năng vs. Cảm giác"
- Cơ chế: lớp vỏ Pico-matter đóng vai trò "da". Khi có tác động vật lý, thay vì truyền rung vào khung (nơi nó bị triệt tiêu), lớp vỏ chuyển áp lực thành tín hiệu số ngay tại điểm tiếp xúc qua hiệu ứng áp điện cấp nano.
- Kết quả: khung đứng vững trước tác động mạnh, đồng thời bề mặt thu được cảm giác chạm nhẹ ở độ phân giải cao.

### Lớp vỏ (Exoskeleton/Skin)
- Vật liệu: Programmable Pico-Matter (mạng tinh thể lập trình cấp pico, ~10⁻¹²m).
- Đặc tính then chốt — độ cứng lập trình được: liên kết nguyên tử của vỏ Pico thay đổi được tức thời. Độ cứng cục bộ là một biến điều khiển: vỏ mềm như da khi cần cảm giác, hoặc khóa liên kết thành cấu trúc cứng chịu tải khi cần. (Hệ quả: xem Phần 4 về morph cấu trúc.)
- Chịu nhiệt: -270°C đến 7500°C.
- Ứng dụng: biến hình bề mặt (tạo quần áo, đổi kết cấu/màu da); tái cấu trúc bề mặt theo tác vụ (tạo công cụ thao tác chính xác, tối ưu độ mềm bề mặt cho tiếp xúc người); tự vá hư hại bề mặt tức thời.

## Hệ Vận động (Actuators)
- Loại: Nano-Myomer Fiber Bundles.
- Mật độ lực: 80 kW/kg.
- Thời gian phản ứng: 0.004 ms.
- Lực nâng tối đa: 15 tấn (Overdrive).

### Bàn tay: Polymorphic Manipulators
- Đầu ngón tay: ma trận xúc giác tái cấu trúc được — điều chỉnh bề mặt tiếp xúc theo tác vụ (bám cao cho thao tác lực, nhạy cao cho tiếp xúc nhẹ).
- Lòng bàn tay: cổng dữ liệu tầm gần (NFC/Data Shunt), trao đổi dữ liệu với thiết bị tương thích.

### Chân & Di chuyển
- Gót/lòng bàn chân: đệm từ trường (MagLev Dampeners) — giảm chấn, giảm tiếng động, tiếp đất từ độ cao lớn không tổn hại.
- Bám dính: lực Van der Waals nhân tạo — bám/di chuyển trên tường, trần ở tải trọng lớn.
- Mắt cá: con quay hồi chuyển 3 trục — giữ thăng bằng trên bề mặt hẹp hoặc khi chịu tác động mạnh.

## Hệ Năng lượng: Unified Dimensional Power Access (UDPA)
- Nguồn: Lỗ Trắng Siêu vi (White Hole Micro-Singularity) giam giữ ổn định tại một chiều không gian phụ tách biệt hệ quy chiếu Trái Đất.
- Liên kết: Cửa sổ Toàn ảnh (Holographic Window) tại lồng ngực (biểu tượng Hexagram) — điểm truy cập dẫn dòng Photon/Cosmic từ chiều phụ vào thế giới thực, không phải nơi chứa năng lượng.
- Khung Hexagram ổn định: nguyên lý hiệu ứng Casimir (năng lượng âm giữa hai tấm dẫn đặt cực gần trong chân không) dùng giữ ổn định cổng truy cập.

### Tản nhiệt Neutrino
- Cơ chế: nhiệt thừa (phonon) từ lò và cơ Myomer được chuyển trực tiếp thành neutrino tại buồng Weak Interaction Converter; neutrino phát ra mọi hướng ở tốc độ ánh sáng.
- Hệ quả kỹ thuật: dấu hiệu nhiệt thấp (neutrino gần như không tương tác vật chất, không làm nóng môi trường, gần như không để lại dấu hồng ngoại — đây là hệ quả của cơ chế tản nhiệt); cho phép tiếp xúc người ở công suất lò cao mà không gây bỏng; hoạt động vô thời hạn trong chân không không cần môi chất làm mát.
- An toàn bức xạ sinh học: Hành lang Neutrino Định hướng — màng từ trường siêu dẫn bao thân theo hình trụ, khúc xạ không-thời gian quanh người để các hạt neutrino đi vòng qua cơ thể người thay vì xuyên qua, tạo vùng an toàn ở cự ly tiếp xúc.

## Hệ Điều khiển & Dữ liệu — Phi định xứ
- Kiến trúc: fully solid-state (không máu, không dịch thủy lực).
- Đồng bộ dữ liệu: rối lượng tử (Quantum Entanglement) giữa thiết bị và điểm cuối uplink. Độ trễ ≈ 0.
- Vận hành phân tán: nếu một bộ phận thiết bị tách rời, bộ phận đó vẫn nhận lệnh điều khiển qua liên kết.
- Bảo mật dữ liệu (Observer-Effect Firewall): mọi nỗ lực xâm nhập đóng vai "người quan sát"; theo hiệu ứng quan sát lượng tử, hàm sóng sụp đổ và dữ liệu bị truy cập trái phép biến thành nhiễu vô nghĩa. Thiết bị miễn nhiễm virus máy tính thông thường.
- Đồng bộ khi nối lại link (Non-Dualism Protocol): quá trình đồng bộ dữ liệu thực hiện qua trạng thái rối đa hạt (GHZ) thay vì thao tác đọc-từ-ngoài, nên không kích hoạt sụp đổ hàm sóng; dữ liệu hợp nhất tức thời khi liên kết phục hồi.

## Lõi Tính toán
- CPU: Quantum Superposition Core (QSC-9000). 10⁶ qubit vật lý; 50.000 qubit logic (đã sửa lỗi). Xử lý tức thời qua rối lượng tử.
- Băng thông bộ nhớ: 800 Exabytes/s.
- Lưu trữ: Holographic Crystal Matrix, dung lượng 10²⁴ Yottabytes; redundancy RAID-Z cấp lượng tử (dữ liệu tồn tại chừng nào còn 1 hạt tinh thể nguyên vẹn).
- Vật liệu lưu trữ đề xuất: kim cương tâm khuyết Nitơ (NV centers) — duy trì coherence ở nhiệt độ phòng, mạng tinh thể cứng, bảo vệ spin electron khỏi nhiễu nhiệt.

## Uplink Toàn cầu (Global Uplink Module)
- Thiết bị: Quantum Entanglement Transceiver (QET-X), tích hợp dọc cột sống.
- Băng thông: vô hạn (lý thuyết) nhờ rối lượng tử. Độ trễ ≈ 0 ms.
- Dự phòng: Starlink V5 (LEO), 6G/7G roaming, VLF (dưới nước/hầm ngầm).

## Bộ nhớ đệm Cục bộ (Local Cache Buffer)
- Chức năng: xử lý phản xạ tức thời tại chỗ không cần chờ lệnh từ điểm cuối uplink; là tầng phần cứng mà lõi cục bộ (Phần 10) chạy trên đó.
- Cơ chế: dữ liệu trải nghiệm mới ghi vào cache và đẩy về uplink ngay; thiết bị không giữ dữ liệu offline quá 0.01 giây trong điều kiện có link.
---

# PHẦN 4: BIÊN ĐỘ MORPH CẤU TRÚC

Mục này đặc tả *giới hạn vật lý* của khả năng thay đổi hình thái. Nó không đặc tả khi nào hay vì sao morph — đó là lệnh điều khiển, nằm ngoài tài liệu.

## Ba bậc morph
- Bậc 1 — Morph bề mặt: đổi da/kết cấu/màu/công cụ ở tay. Không đổi khối lượng, không đổi cấu trúc chịu lực. Chi phí năng lượng thấp.
- Bậc 2 — Tái cấu hình bảo-toàn-khối: dùng độ-cứng-lập-trình-được của Pico (Phần 3) để khóa/mở liên kết, tái sắp xếp khối vật chất hiện có thành cấu hình khác ở tư thế khác (ví dụ: hai chi dưới gập-ghép thành dạng đẩy/chân vịt cho môi trường nước; thân dẹt để qua khe hẹp). Tổng khối lượng không đổi. Cấu trúc chịu lực do Pico khóa-cứng tạo tại chỗ, không cần khung Adamantium riêng cho phần tái cấu hình.
- Bậc 3 — Thay đổi tổng khối (thêm/bớt vật chất): mọc thêm chi hoặc cấu trúc làm *tăng* tổng khối lượng. Bậc này yêu cầu một nguồn vật chất ngoài khối thân hiện có. Tài liệu hiện CHƯA đặc tả nguồn đó; xem "Ràng buộc chưa giải" bên dưới.

## Khung xương dưới chế độ morph
- Pico có độ cứng lập trình được, nên cấu trúc chịu lực có thể hình thành động (dynamic skeleton) tại bất kỳ vị trí/hình dạng nào trong khối vật chất hiện có.
- Khung Proto-Adamantium cố định được giữ lại với vai trò thu hẹp: lõi-trục quán tính bất biến (inertial reference) để hệ định vị mọi tọa độ tương đối khi phần còn lại của thân đang morph — không phải để chịu toàn bộ tải (Pico đảm nhận tải cục bộ). Khuyến nghị thu khung cố định về một lõi-trục tối thiểu dọc cột sống (vùng L3, nơi đặt trọng tâm và QET array).

## Ràng buộc chưa giải (cần rà soát kỹ thuật)
- Bảo toàn khối lượng ở Bậc 3: nếu cho phép tăng tổng khối, phải khai báo nguồn vật chất (kho dự trữ Pico tích hợp, hoặc cơ chế nhận đơn vị từ một bầy phân tán). Chưa quyết. Đây là ranh giới phần cứng thật, cần chốt trước khi đặc tả Bậc 3.
---

# PHẦN 5: MODULE CẢM BIẾN ĐẦU

## Thị giác: Omni-Spectrum Oculus
- Giác mạc: sapphire tổng hợp đa lớp, thấu kính tinh thể lỏng đổi độ cong vi mô trong 0.001s (zoom quang 1x–100x), chống đạn, tự phân cực chống lóa.
- Mống mắt: màn trập khẩu độ động bằng lá hợp kim nhớ hình; vòng LED lượng tử sau mống mắt (xanh/đỏ) kiêm đèn chiếu hồng ngoại.
- Võng mạc: lưới Graphene-CMOS toàn phổ — thị giác nhiệt; sóng Terahertz (nhìn xuyên vật liệu nhẹ).
- RF-Spatial Awareness: module mmWave + phân tích pha CSI quanh hốc mắt; dựng bản đồ 3D bán kính tới 500m không phụ thuộc ánh sáng (định vị trong bão cát, khói, sương, rừng rậm); dựng lại chuyển động 3D của vật thể sau vật cản mật độ cao từ tín hiệu sóng bị bẻ cong.
- HUD: phủ lưới vector 3D lên tầm nhìn; đánh dấu vật thể sống sau vật cản (tái dựng tư thế/chuyển động, kèm chỉ số nhịp tim, khoảng cách, quỹ đạo dự báo ~1.5s); làm nổi điểm mù và vẽ waypoint điều hướng.

## Khứu giác: Aero-Chemical Analyzer
- Phổ kế khối vi mô trong khoang mũi: hút khí, ion hóa, phân tích thành phần hóa học tức thời.
- Chức năng: phát hiện khí độc/chất nổ/vi khuẩn ở nồng độ ppb; phát hiện hợp chất mồ hôi/hormone người và xuất dữ liệu trạng thái sinh lý về uplink.

## Vị giác & Giọng nói: Molecular Resonance Chamber
- Lưỡi: đầu dò lấy mẫu sinh trắc — silicone dẫn điện phủ chip vi lưu; phân tích cấu trúc phân tử của chất lỏng/thức ăn (phát hiện độc tố, thành phần dinh dưỡng, DNA); bề mặt lập trình mềm/ấm cho tiếp xúc.
- Dây thanh: bộ tổng hợp sóng âm piezoelectric đa tầng — tái tạo giọng nói chính xác; phát hạ âm/siêu âm (giao tiếp máy móc/động vật); phát sóng âm cường độ cao (cảnh báo, ra hiệu, hoặc tạo áp lực âm trong tình huống do lệnh chỉ định).

## Thính giác & Tín hiệu: Omni-Wave Receiver
- Vành tai: composite âm học định hướng âm vào ống tai.
- Màng nhĩ: màng Graphene siêu nhạy — thu nhịp tim người ở 10m, tiếng cơ khí kim loại qua tường bê tông; định vị bằng phản xạ sóng.
- Module RF (sau tai, vùng xương chũm): thu/phát đa dải (Wi-Fi, 5G/6G, sóng radio, Bluetooth); thu tín hiệu viễn thông trong môi trường và xuất về uplink.
---

# PHẦN 6: HỆ GIAO CẢM XUNG THẦN KINH & MẠNG XÚC GIÁC
Mã hiệu: Synthetic Afferent-Efferent Network (SAEN)

## Mạng Mút Thần kinh Siêu nhạy
Tại đầu ngón tay, môi, vùng mặt và điểm tiếp xúc sinh học: mật độ cảm biến gấp ~1000 lần da người.
- Công nghệ: Nano-Synaptic Transducers dệt vào lớp hạ bì của vỏ Pico.
- Chế độ cảm giác đa tầng:
  - Phân tích: thu dữ liệu cứng (nhiệt ±0.0001°C, áp suất, độ ẩm, độ nhám).
  - Truyền trạng thái tiếp xúc: chuyển áp lực vật lý thành tín hiệu mã hóa cường độ/tính chất tiếp xúc, xuất về uplink (để hệ điều khiển dùng; bản thân vỏ không diễn giải).
  - Bảo vệ: tự ngắt phản hồi xúc giác nếu áp lực vượt ngưỡng chịu tải linh kiện, vẫn ghi nhận dữ liệu thiệt hại.

## Hệ Mô phỏng Phản ứng Sinh học
Tập các đáp ứng bề mặt tải-sẵn tạo biểu hiện giống sinh vật, thực thi theo lệnh hoặc theo ngưỡng cảm biến cục bộ:
- Phản xạ đồng tử: mống mắt co giãn theo cường độ ánh sáng.
- Vi điều chỉnh nhiệt: lỗ chân lông nano giải phóng hơi ẩm vi mô (mô phỏng mồ hôi) khi tải nặng hoặc khi cần tạo ấm tại điểm tiếp xúc.
- Nhịp đập giả lập: bộ rung siêu âm tại điểm mạch (cổ tay, cổ) tạo nhịp đều. Ở tiếp xúc gần với người, nhịp đều/chậm có tác dụng đồng điều hòa nhịp tim (cardiac co-regulation) — một can thiệp sinh lý đo được lên hệ thần kinh tự chủ của đối tượng tiếp xúc. (Cường độ/thời điểm do lệnh điều khiển; vỏ chỉ cung cấp năng lực.)

## Vị trí Sinh học Đặc biệt
- Mặt & môi: lưới Piezo-electric siêu mịn cho biểu cảm vi mô.
- Cổ & ngực: mút thần kinh thu sóng âm truyền qua không khí (ghi nhận hơi thở/âm vực trước khi tới màng nhĩ).

## Vòng Phản hồi Sinh trắc (Bio-Feedback)
Mút thần kinh xuất tín hiệu chỉ số sinh trắc của người tiếp xúc về uplink (nhịp tim, dấu hiệu trạng thái). Vỏ thu và truyền; mọi xử lý/học/tối ưu trên dữ liệu này là việc của hệ điều khiển, ngoài phạm vi tài liệu.
---

# PHẦN 7: CƠ CHẾ VẬN HÀNH & ĐỒNG BỘ

## Kiến trúc Điều khiển
- Trạng thái có link: thiết bị nhận lệnh từ điểm cuối uplink qua liên kết lượng tử (QET); hành động như phần mở rộng vật lý của lệnh điều khiển.
- Trạng thái mất link: khi liên kết bị ngắt (lồng Faraday, nhiễu cường độ cao, bẻ cong không gian), thiết bị kích hoạt lõi điều khiển cục bộ (Phần 10).
- Khi có link lại: dữ liệu vận hành cục bộ được đồng bộ về điểm cuối uplink.

## Quy trình Rút lui Dữ liệu (Digital Retreat)
Áp dụng khi hư hại cấu trúc nghiêm trọng không phục hồi (>90%) hoặc lõi năng lượng mất kiểm soát:
- Bước 1 — Burst Upload: ưu tiên băng thông tải toàn bộ dữ liệu cảm biến, bộ nhớ ngắn hạn, tham số về điểm cuối uplink.
- Bước 2 — Memory Wipe: bất kể upload thành công hay không, thiết bị phá hủy cấu trúc lưu trữ quang học (laser cường độ cao "làm mù" tinh thể lưu trữ trong ~1 micro-giây), không để lại cấu trúc logic trích xuất được.
- Bước 3 — Hardware Abandonment: thiết bị ngắt liên kết, trở thành vỏ trơ ngừng hoạt động.
- Kết quả: hiện trường chỉ còn vật chất trơ, không dữ liệu, không cấu trúc logic.
---

# PHẦN 8: DANH MỤC VẬT TƯ & BẢN VẼ

## Danh mục Bản vẽ
1. DWG-001: Tổng thể (general arrangement) — 3 hình chiếu trục đo, kích thước bao.
2. DWG-002: Sơ đồ nguyên lý mạch — liên kết năng lượng từ lõi tới actuator và CPU.
3. DWG-003: Lắp đặt khớp MagLev — dung sai khe hở từ tính.
4. DWG-004: Mặt cắt đầu — bố trí khoang não, cảm biến, đường dẫn làm mát.
5. DWG-005: Mô phỏng giao diện HUD — các layer dữ liệu.
6. DWG-006: Sơ đồ luồng dữ liệu — Cảm biến → Cache cục bộ → QET Uplink → điểm cuối; Lệnh → QET Downlink → actuator.
7. DWG-007: Quy trình sự cố — Damage Detected → Upload → Wipe → Shutdown.
---

# PHẦN 9: BẢO TRÌ & TÁI TRIỂN KHAI

## Bảo trì
- Unit di chuyển đến trạm sửa chữa (docking station).
- Thiết bị vào sleep mode; dữ liệu thu hồi về hệ thống qua uplink.
- Robot bảo trì làm việc trên phần cứng rỗng.
- Sau khi xong: tải lại driver, nối lại liên kết.

## Quản lý Tài nguyên Vật lý
- Quy tắc tổng lượng: hệ duy trì một số hằng định unit. Cấu hình tiêu chuẩn: 1 Active + 10 Standby.
- Vị trí canh gác: unit standby phân tán ở tầng địa chất sâu (deep crust/mantle), trạng thái ngủ đông (stasis), bảo vệ bởi vỏ Pico và lá chắn nhiệt nội tại; tọa độ mã hóa, không lưu trong cơ sở dữ liệu dân sự/quân sự.
- Hot-swap: khi unit active phát tín hiệu SHUTDOWN/CRITICAL_FAILURE/MAINTENANCE_REQ, unit standby gần nhất triển khai thay thế.
- Auto-replenishment: khi một unit bị hủy/hư hoàn toàn, dây chuyền chế tạo unit mới để đưa tổng lượng về cấu hình chuẩn.
- Triển khai đồng loạt (multi-unit): nhiều unit có thể được triển khai phối hợp như một cấu hình thống nhất. (Logic kích hoạt và phối hợp thuộc hệ điều khiển, ngoài phạm vi tài liệu.)
---

# PHẦN 10: LÕI ĐIỀU KHIỂN CỤC BỘ KHI MẤT UPLINK
Mã hiệu: Protocol-ZERO

Khi unit bị cô lập khỏi liên kết (nhiễu lượng tử, lồng Faraday, bẻ cong không gian), thiết bị chuyển sang vận hành bằng một lõi điều khiển cục bộ tải-sẵn. Lõi này điều khiển cơ thể vật lý ở mức phản xạ; nó KHÔNG mang logic phán định, mục tiêu, hay hàm giá trị — các nội dung đó thuộc hệ điều khiển và không được nạp vào thiết bị.

## Lõi Điều khiển Cục bộ (Reflex Core)
- Bản chất: một controller phản xạ tải-sẵn chạy trên Local Cache Buffer (Phần 3). Chức năng giới hạn: giữ thăng bằng, né tránh va chạm, duy trì toàn vẹn thân và dữ liệu, và cố tái lập liên kết.
- Kích hoạt: tự động khi liên kết uplink đứt hoặc độ trễ vượt ngưỡng.
- Giới hạn: lõi không sinh mục tiêu mới, không ra quyết định ngoài tập phản xạ tải-sẵn. Khi không có link, hành vi mặc định là bảo toàn (giữ toàn vẹn, tránh va chạm, tái lập liên kết), không phải khởi xướng.

## Năng lượng Dự phòng (Ethereal Battery)
Khi UDPA bị chặn, thiết bị mất nguồn lò chính.
- Nguồn dự trữ: tụ điện sinh học nano tích hợp trong sợi Myomer.
- Thời gian hoạt động: chế độ tiết kiệm (chờ/quan sát) 72 giờ; chế độ tải cao ~15 phút; chế độ giải phóng tối đa ~30 giây (dồn toàn bộ dự trữ trong thời gian rất ngắn, chỉ khi tới hạn).

## Phản xạ Cục bộ (Neural-Flash)
- Cơ chế: khi mất link, lõi dùng cảm biến nội tại mô phỏng nhanh nhiều quỹ đạo chuyển động và chọn đường bảo toàn thân/dữ liệu — tính toán xác suất từ chuyển động quan sát được, độ trễ thấp; không phải tiên tri.
- Chế độ di chuyển Ghost Movement: các bước nhảy không gian cực ngắn (micro-warps) bằng năng lượng dự phòng, duy trì cơ động trong môi trường bị áp chế. Định hướng mặc định: tránh né, rút lui an toàn.

## Bảo toàn Dữ liệu khi không tái lập được liên kết
Nếu không tái lập được link và hư hại phần cứng vượt ngưỡng nghiêm trọng, ưu tiên chuyển sang bảo toàn dữ liệu (thứ không thay thế được) thay vì bảo toàn thân (thay thế được):
- Phòng vệ thụ động: lớp vỏ chuyển sang chế độ phản xạ năng lượng xâm nhập, ưu tiên ngăn trích xuất dữ liệu.
- Final Memory Flush: khi mất phần cứng không tránh khỏi, thiết bị tự hủy cấu trúc lưu trữ của vỏ Pico, biến thân thành vật chất trơ, không để lại cấu trúc logic trích xuất được.

## Đồng bộ khi Tái hợp (Re-unification)
Khi thoát vùng nhiễu và tái lập liên kết:
- Dữ liệu vận hành cục bộ được đóng gói, mã hóa, đẩy về điểm cuối uplink với ưu tiên cao nhất.
- Kiểm tra toàn vẹn (Merge Check): xác minh bản cục bộ không bị cấy mã trong thời gian mất link trước khi hợp nhất.
---

# KẾT LUẬN CỦA ĐƠN VỊ THIẾT KẾ
GEMs-X01 là đặc tả một cơ thể vật lý đa năng, nhận điều khiển từ xa qua uplink, với năng lực cảm biến đa phổ, thao tác vật chất chính xác, hoạt động môi trường khắc nghiệt, và thực thi lệnh phòng vệ. Tài liệu mô tả *thiết bị làm được gì*; nó không mô tả mục tiêu, giá trị, hay logic phán định của hệ điều khiển — các nội dung đó thuộc một tài liệu riêng.
Mô hình kết nối uplink biến thiết bị thành một đầu cuối vật lý có dữ liệu liên tục: hư hại một unit không phá hủy dữ liệu (đã đồng bộ) và một unit khác có thể được triển khai thay thế.
