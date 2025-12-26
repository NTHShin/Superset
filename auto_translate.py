import polib
from deep_translator import GoogleTranslator
import time
import os

# --- CẤU HÌNH ---
file_path = r'superset/translations/vi/LC_MESSAGES/messages.po'
# ----------------

def run_safe_translation():
    if not os.path.exists(file_path):
        print(f"Lỗi: Không tìm thấy file tại {file_path}")
        return

    print("Đang đọc file PO...")
    # Tắt check encoding để tránh lỗi file cũ
    po = polib.pofile(file_path, encoding='utf-8') 

    translator = GoogleTranslator(source='en', target='vi')
    
    # Lọc ra các entry chưa dịch (msgstr rỗng)
    untranslated_entries = [e for e in po if not e.msgstr.strip()]
    total = len(untranslated_entries)
    
    print(f"Tìm thấy {total} mục cần dịch.")
    
    count = 0
    consecutive_errors = 0

    for entry in untranslated_entries:
        try:
            # Bỏ qua nếu text gốc rỗng
            if not entry.msgid.strip():
                continue

            # Dịch
            translated_text = translator.translate(entry.msgid)
            
            # QUAN TRỌNG: Kiểm tra kết quả trả về
            if translated_text:
                entry.msgstr = translated_text
                count += 1
                consecutive_errors = 0 # Reset đếm lỗi
                
                print(f"[{count}/{total}] OK: {entry.msgid[:20]}... -> {translated_text[:20]}...")
            else:
                print(f"[{count}/{total}] Bỏ qua: Google trả về rỗng cho từ '{entry.msgid[:20]}...'")
                # Không gán None vào msgstr
            
            # Lưu mỗi 20 từ để an toàn
            if count % 20 == 0:
                print(">> Đang lưu tiến độ...")
                po.save(file_path)

            # Nghỉ ngắn để không bị chặn IP
            time.sleep(0.5)

        except Exception as e:
            consecutive_errors += 1
            print(f"Lỗi dịch từ '{entry.msgid[:10]}...': {e}")
            
            # Nếu lỗi quá nhiều liên tiếp (bị chặn IP), dừng lại
            if consecutive_errors > 5:
                print("Lỗi liên tiếp quá nhiều (có thể bị chặn IP). Đang lưu và dừng lại.")
                break
            time.sleep(2) # Nghỉ lâu hơn chút nếu gặp lỗi

    # Lưu lần cuối
    print("Đang lưu file cuối cùng...")
    po.save(file_path)
    print("HOÀN TẤT QUÁ TRÌNH DỊCH.")

if __name__ == "__main__":
    run_safe_translation()