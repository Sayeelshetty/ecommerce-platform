from datetime import datetime, timezone
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.database.mongodb import db


CATEGORIES = {
    "Audio": "Immersive headphones, earbuds, and speakers for every space.",
    "Smartphones": "Current mobile technology for work, communication, and life.",
    "Laptops": "Portable performance for work, study, creation, and play.",
    "Cameras": "Capture sharper memories with capable digital cameras.",
    "Gaming": "Hardware and accessories for a more responsive gaming setup.",
    "Monitors": "Clear, comfortable displays for work and entertainment.",
    "Computer Accessories": "Reliable tools that complete a modern workstation.",
    "Wearables": "Smart companions for activity, time, and everyday routines.",
    "Accessories": "Practical technology accessories for daily convenience.",
}

PRODUCTS = [
    ("Apple AirPods", "Compact true wireless earbuds with balanced sound and an all-day charging case.", 14999, 12999, 34, 4.7, 286, "Audio", "/assets/products/apple_earphone_image.png"),
    ("Sony Wireless Earbuds", "Comfortable noise-isolating earbuds with rich bass and dependable battery life.", 8999, 7499, 42, 4.5, 193, "Audio", "/assets/products/sony_airbuds_image.png"),
    ("Bose QuietComfort Headphones", "Premium over-ear headphones with calm, detailed sound and active noise cancellation.", 29999, 24999, 18, 4.8, 412, "Audio", "/assets/products/bose_headphone_image.png"),
    ("JBL Bluetooth Soundbox", "Room-filling portable audio with punchy bass, wireless control, and a durable shell.", 11999, 9999, 27, 4.6, 174, "Audio", "/assets/products/jbl_soundbox_image.png"),
    ("Sony Bluetooth Speaker", "A compact wireless speaker tuned for clear vocals and easy outdoor listening.", 6999, 5999, 31, 4.3, 88, "Audio", "/assets/products/bluetooth_speaker.jpg"),
    ("Samsung Galaxy S23", "A bright, fast smartphone with a versatile camera system and premium compact design.", 74999, 64999, 12, 4.7, 351, "Smartphones", "/assets/products/samsung_s23phone_image.png"),
    ("Google Pixel", "A clean Android experience with computational photography and a smooth OLED display.", 59999, 52999, 16, 4.6, 228, "Smartphones", "/assets/products/google_pixel.jpg"),
    ("ASUS Creator Laptop", "A capable everyday laptop with a crisp display, fast storage, and comfortable keyboard.", 68999, 59999, 9, 4.4, 117, "Laptops", "/assets/products/asus_laptop_image.png"),
    ("Apple MacBook Pro", "Powerful creative performance in a refined laptop built for long focused sessions.", 129999, 119999, 7, 4.9, 506, "Laptops", "/assets/products/macbook_image.png"),
    ("HP Pavilion Laptop", "A dependable laptop for study, office work, and everyday multitasking.", 54999, 47999, 14, 4.2, 146, "Laptops", "/assets/products/hp_laptop.jpg"),
    ("TechNova Gaming Laptop", "High-refresh gaming performance with dedicated graphics and a responsive keyboard.", 99999, 89999, 6, 4.6, 204, "Laptops", "/assets/products/gaming_laptop.jpg"),
    ("Canon Mirrorless Camera", "A versatile camera for sharp travel, family, and creator photography.", 64999, 57999, 8, 4.5, 164, "Cameras", "/assets/products/cannon_camera_image.png"),
    ("Sony Alpha Camera", "A compact interchangeable-lens camera with detailed stills and confident autofocus.", 89999, 79999, 5, 4.8, 241, "Cameras", "/assets/products/sony_camera.jpg"),
    ("PlayStation 5", "Fast-loading next-generation console gaming with immersive graphics and haptics.", 54999, 49999, 11, 4.8, 683, "Gaming", "/assets/products/playstation_image.png"),
    ("Xbox Series Console", "A powerful console with quick resume, broad game access, and smooth performance.", 49999, 44999, 10, 4.6, 329, "Gaming", "/assets/products/xbox_console.jpg"),
    ("DualSense Gaming Controller", "A precise wireless controller with adaptive triggers and tactile feedback.", 6999, 5999, 25, 4.7, 274, "Gaming", "/assets/products/md_controller_image.png"),
    ("Compact Gaming Controller", "A comfortable, responsive controller for console and PC gaming sessions.", 3999, 3499, 37, 4.2, 91, "Gaming", "/assets/products/sm_controller_image.png"),
    ("Mechanical Gaming Keyboard", "Tactile mechanical switches, RGB accents, and a focused layout for fast input.", 7999, 6499, 22, 4.5, 187, "Gaming", "/assets/products/mechanical_keyboard.jpg"),
    ("24-inch Full HD Monitor", "A crisp everyday monitor with comfortable viewing for work, study, and play.", 15999, 12999, 20, 4.3, 132, "Monitors", "/assets/products/monitor.jpg"),
    ("Ultrawide Productivity Monitor", "An expansive ultrawide canvas for multi-window workflows and cinematic play.", 39999, 34999, 8, 4.6, 119, "Monitors", "/assets/products/ultrawide_monitor.jpg"),
    ("Full HD Projector", "Bring films, presentations, and big-screen gaming into flexible spaces.", 24999, 21999, 13, 4.1, 76, "Monitors", "/assets/products/projector_image.png"),
    ("Ergonomic Wireless Mouse", "Quiet wireless control with a comfortable shape for everyday productivity.", 2499, 1999, 46, 4.2, 208, "Computer Accessories", "/assets/products/wireless_mouse.jpg"),
    ("1080p Streaming Webcam", "A clear, easy-to-position webcam for calls, classes, and live streams.", 4999, 3999, 24, 4.3, 97, "Computer Accessories", "/assets/products/webcam.jpg"),
    ("Portable External SSD", "Fast, compact storage for creative projects, backups, and travel.", 8999, 7499, 19, 4.7, 182, "Computer Accessories", "/assets/products/external_ssd.jpg"),
    ("Venu Smartwatch", "A polished smartwatch for notifications, workouts, and everyday activity tracking.", 27999, 23999, 15, 4.5, 219, "Wearables", "/assets/products/venu_watch_image.png"),
    ("Fitness Smartwatch", "A lightweight activity companion with a bright display and practical health tracking.", 9999, 8499, 29, 4.1, 103, "Wearables", "/assets/products/fitness_watch.jpg"),
]


def seed() -> None:
    category_ids = {}
    for name, description in CATEGORIES.items():
        db.categories.update_one(
            {"name": name},
            {"$set": {"description": description}},
            upsert=True,
        )
        category_ids[name] = str(db.categories.find_one({"name": name})["_id"])
    db.categories.delete_many({"name": {"$nin": list(CATEGORIES)}})

    existing = list(db.products.find({}, {"_id": 1}).sort("_id", 1))
    for index, (name, description, price, offer_price, stock, rating, review_count, category, image_url) in enumerate(PRODUCTS):
        payload = {
            "name": name,
            "description": description,
            "price": price,
            "offer_price": offer_price,
            "category_id": category_ids[category],
            "stock": stock,
            "rating": rating,
            "review_count": review_count,
            "image_url": image_url,
            "created_at": datetime.now(timezone.utc),
        }
        if index < len(existing):
            db.products.update_one({"_id": existing[index]["_id"]}, {"$set": payload})
        else:
            db.products.insert_one(payload)

    if len(existing) > len(PRODUCTS):
        db.products.delete_many({"_id": {"$in": [item["_id"] for item in existing[len(PRODUCTS):]]}})

    print(f"Seeded {len(PRODUCTS)} products and {len(CATEGORIES)} categories")


if __name__ == "__main__":
    seed()
