const photos = [
  "https://images.unsplash.com/photo-1656695537545-cfcb911d647a?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1737731662588-729f42147158?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1716105673219-cecd4085a219?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1785239232672-88ae9c285ce8?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1653376382671-7788e2c7b310?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1785139593478-81143726963b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1653548898892-2d98a193d25a?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1690729125175-fcda275386e4?auto=format&fit=crop&w=900&q=80",
];

const base = [
  ["AeroSound Pro", "Sonora", "Audio", 129.99, 4.8, "Noise-cancelling wireless headphones", { Battery: "40 hours", Weight: "254 g", Color: "Midnight" }],
  ["Pulse Watch S4", "Northstar", "Wearables", 189.0, 4.6, "A lightweight fitness watch built for everyday movement", { Battery: "7 days", Display: "1.6 inch OLED", GPS: "Built-in" }],
  ["Frame Mini Camera", "Kanso", "Cameras", 349.5, 4.7, "Compact mirrorless camera for crisp daily photography", { Sensor: "24 MP", Video: "4K", Weight: "340 g" }],
  ["Beam Portable Speaker", "Sonora", "Audio", 79.99, 4.4, "Room-filling sound in a durable travel-ready body", { Battery: "18 hours", Waterproof: "IP67", Weight: "620 g" }],
  ["Arc Everyday Pack", "Wayline", "Bags", 68.0, 4.5, "Organized commuter backpack with a padded laptop sleeve", { Capacity: "22 L", Laptop: "16 inch", Material: "Recycled nylon" }],
  ["Stride Knit Runner", "Velora", "Footwear", 94.0, 4.3, "Breathable everyday trainers with responsive cushioning", { Upper: "Knit", Sole: "Foam", Fit: "True to size" }],
  ["Brew One Coffee Maker", "Morrow", "Home", 119.0, 4.6, "Simple precision brewing for a consistently balanced cup", { Capacity: "1.2 L", Timer: "24 hour", Filter: "Reusable" }],
  ["Halo Desk Light", "Kanso", "Home", 59.5, 4.2, "Adjustable task light with soft, flicker-free illumination", { Brightness: "5 levels", Color: "3 modes", Power: "USB-C" }],
  ["Studio Buds 2", "Sonora", "Audio", 99.0, 4.1, "Pocket-sized earbuds with rich sound and clear calls", { Battery: "28 hours", Waterproof: "IPX5", Color: "Cloud" }],
  ["Orbit Watch Lite", "Northstar", "Wearables", 139.0, 4.4, "Essential health tracking in a clean, compact design", { Battery: "10 days", Display: "1.4 inch", GPS: "Connected" }],
  ["Field Camera X", "Kanso", "Cameras", 429.0, 4.9, "Weather-sealed camera for travel and outdoor creators", { Sensor: "26 MP", Video: "4K 60fps", Weight: "410 g" }],
  ["Metro Sling", "Wayline", "Bags", 45.0, 4.0, "Compact crossbody storage for everyday essentials", { Capacity: "6 L", Strap: "Adjustable", Material: "Canvas" }],
];

export const products = base.map((p, i) => ({
  id: i + 1, name: p[0], brand: p[1], category: p[2], price: p[3], rating: p[4],
  description: p[5], specs: p[6], image: photos[i % photos.length],
  reviews: [1248, 864, 527, 2190, 476, 1132, 789, 341, 905, 618, 283, 452][i],
  originalPrice: +(p[3] * (i % 3 === 0 ? 1.2 : i % 3 === 1 ? 1.12 : 1)).toFixed(2),
  availability: i === 10 ? "Only 4 left in stock" : "In stock",
}));

export const tasks = [
  { id: "TASK-01", title: "Headphone comparison checkout", instructions: "Find AeroSound Pro, compare it with Studio Buds 2, choose AeroSound Pro, add three to cart, apply SAVE10, and reach order review.", expectedProduct: 1, compareProduct: 9, quantity: 3, coupon: "SAVE10", finalState: "review" },
  { id: "TASK-02", title: "Fitness watch selection", instructions: "Compare Pulse Watch S4 and Orbit Watch Lite, add Pulse Watch S4 to cart, and reach delivery options.", expectedProduct: 2, compareProduct: 10, quantity: 1, coupon: "", finalState: "delivery" },
];

export const sessions = [
  ["P-1042", "SES-A81F", "Completed", "TASK-01", "May 18, 10:04", "04:32", "Success"],
  ["P-1041", "SES-C92B", "Abandoned", "TASK-01", "May 18, 09:42", "02:18", "Incomplete"],
  ["P-1040", "SES-K33D", "Completed", "TASK-02", "May 17, 16:20", "03:51", "Success"],
  ["P-1039", "SES-Q77M", "Completed", "TASK-01", "May 17, 14:11", "06:07", "Failed"],
  ["P-1038", "SES-T10L", "Active", "TASK-02", "May 17, 13:54", "08:12", "In progress"],
];

export const demoLogs = [
  ["10:04:02", "P-1042", "SES-A81F", "TASK-01", "/catalogue", "search", "Search input", "query=AeroSound"],
  ["10:04:18", "P-1042", "SES-A81F", "TASK-01", "/product/1", "view_product", "AeroSound Pro", "source=search"],
  ["10:04:31", "P-1042", "SES-A81F", "TASK-01", "/compare", "add_compare", "Studio Buds 2", "compare_count=2"],
  ["10:05:44", "P-1042", "SES-A81F", "TASK-01", "/cart", "quantity_change", "AeroSound Pro", "quantity=3"],
  ["10:06:01", "P-1042", "SES-A81F", "TASK-01", "/cart", "coupon_apply", "SAVE10", "valid=true"],
  ["10:08:34", "P-1042", "SES-A81F", "TASK-01", "/checkout", "task_complete", "Order review", "result=success"],
];

export const chartData = [
  { task: "Task 1", time: 272, rate: 78, errors: 1.8, dropoff: 14 },
  { task: "Task 2", time: 231, rate: 84, errors: 1.2, dropoff: 9 },
  { task: "Task 3", time: 318, rate: 66, errors: 2.6, dropoff: 21 },
  { task: "Task 4", time: 195, rate: 91, errors: 0.8, dropoff: 6 },
];
