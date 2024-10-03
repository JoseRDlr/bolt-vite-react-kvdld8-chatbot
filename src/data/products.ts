export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  url: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Smartphone XYZ",
    description: "Último modelo de smartphone con cámara de alta resolución y batería de larga duración.",
    price: 699.99,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    url: "/productos/smartphone-xyz"
  },
  {
    id: "2",
    name: "Laptop UltraBook",
    description: "Laptop ligera y potente, perfecta para trabajo y entretenimiento.",
    price: 1299.99,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    url: "/productos/laptop-ultrabook"
  },
  {
    id: "3",
    name: "Auriculares Inalámbricos",
    description: "Auriculares con cancelación de ruido y sonido de alta calidad.",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    url: "/productos/auriculares-inalambricos"
  }
];

export function findProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) || 
    product.description.toLowerCase().includes(lowercaseQuery)
  );
}