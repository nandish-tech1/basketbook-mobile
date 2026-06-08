export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  category: string;
  image: string;
}

export const PRODUCT_CATALOG: Product[] = [
  {
    id: "1",
    name: "Organic Apples",
    price: 180,
    unit: "per kg",
    category: "Fruits",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80&auto=format",
  },
  {
    id: "2",
    name: "Bananas",
    price: 50,
    unit: "per dozen",
    category: "Fruits",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80&auto=format",
  },
  {
    id: "3",
    name: "Avocados",
    price: 120,
    unit: "per piece",
    category: "Fruits",
    image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&q=80&auto=format",
  },
  {
    id: "4",
    name: "Strawberries",
    price: 200,
    unit: "per 250g",
    category: "Fruits",
    image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80&auto=format",
  },
  {
    id: "5",
    name: "Cherry Tomatoes",
    price: 80,
    unit: "per 250g",
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=400&q=80&auto=format",
  },
  {
    id: "6",
    name: "Broccoli",
    price: 90,
    unit: "per head",
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&q=80&auto=format",
  },
  {
    id: "7",
    name: "Carrots",
    price: 40,
    unit: "per 500g",
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=400&q=80&auto=format",
  },
  {
    id: "8",
    name: "Whole Milk",
    price: 62,
    unit: "per litre",
    category: "Dairy",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80&auto=format",
  },
  {
    id: "9",
    name: "Free-Range Eggs",
    price: 110,
    unit: "per 6 pcs",
    category: "Dairy",
    image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=400&q=80&auto=format",
  },
  {
    id: "10",
    name: "Greek Yogurt",
    price: 125,
    unit: "per 400g",
    category: "Dairy",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80&auto=format",
  },
  {
    id: "11",
    name: "Chicken Breast",
    price: 280,
    unit: "per 500g",
    category: "Meat",
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&q=80&auto=format",
  },
  {
    id: "12",
    name: "Atlantic Salmon",
    price: 450,
    unit: "per 400g",
    category: "Meat",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80&auto=format",
  },
  {
    id: "13",
    name: "Orange Juice",
    price: 135,
    unit: "per litre",
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80&auto=format",
  },
  {
    id: "14",
    name: "Cold Brew Coffee",
    price: 199,
    unit: "per 250ml",
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80&auto=format",
  },
  {
    id: "15",
    name: "Sourdough Bread",
    price: 160,
    unit: "per loaf",
    category: "Bakery",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80&auto=format",
  },
  {
    id: "16",
    name: "Cheddar Cheese",
    price: 240,
    unit: "per 200g",
    category: "Dairy",
    image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&q=80&auto=format",
  },
];

export const CATEGORIES = [...new Set(PRODUCT_CATALOG.map((p) => p.category))];
