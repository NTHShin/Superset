import polib
import json
import os

# ĐƯỜNG DẪN (Kiểm tra kỹ đường dẫn trên máy bạn)
po_file_path = r'superset/translations/vi/LC_MESSAGES/messages.po'

# Đường dẫn đích cho Frontend (Quan trọng)
# Superset thường tìm file json ở đây
json_output_path = r'superset-frontend/src/translations/vi.json'

def convert_po_to_json():
    if not os.path.exists(po_file_path):
        print(f"Lỗi: Không tìm thấy file PO tại {po_file_path}")
        return

    print("Đang đọc file PO...")
    po = polib.pofile(po_file_path)
    
    # Tạo dictionary key-value
    translations = {}
    for entry in po:
        if entry.msgstr and entry.msgstr.strip():
            # Key là tiếng Anh, Value là tiếng Việt
            translations[entry.msgid] = entry.msgstr

    # Tạo thư mục nếu chưa có
    os.makedirs(os.path.dirname(json_output_path), exist_ok=True)

    # Ghi ra file JSON
    print(f"Đang ghi {len(translations)} từ sang JSON...")
    with open(json_output_path, 'w', encoding='utf-8') as f:
        json.dump(translations, f, ensure_ascii=False, indent=2)

    print(f"XONG! File JSON đã được tạo tại: {json_output_path}")

if __name__ == "__main__":
    convert_po_to_json()