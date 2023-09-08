const productsData = [
  {
    id: 1,
    name: "Orlando, Florida",
    price: 540223,
    category: "destinos-top",
    cardImg: "./assets/img/pexels-rick-han-3428289.jpg",
  },
  {
    id: 2,
    name: "Madrid",
    price: 673140,
    category: "destinos-top",
    cardImg: "./assets/img/pexels-alex-azabache-3722818.jpg",
  },
  {
    id: 3,
    name: "Miami",
    price: 535080,
    category: "destinos-top",
    cardImg: "./assets/img/dondealojarseenmiami.jpg",
  },
  {
    id: 4,
    name: "Cancún",
    price: 628900,
    category: "destinos-top",
    cardImg: "./assets/img/cancun-mexico-nota.jpg",
  },
  {
    id: 5,
    name: "Aéreo a Bariloche",
    price: 43600,
    category: "vuelos",
    cardImg: "./assets/img/foto2.jpg",
  },
  {
    id: 6,
    name: "Aéreo a Río de Janiero",
    price: 57120,
    category: "vuelos",
    cardImg: "./assets/img/panoramica-rio-janeiro-brasil.webp",
  },
  {
    id: 7,
    name: "Aéreo a Santiago de Chile",
    price: 45760,
    category: "vuelos",
    cardImg: "./assets/img/Vitrina_Centro_santiago-1.jpg",
  },
  {
    id: 8,
    name: "Aéreo a Puerto Iguazú",
    price: 38250,
    category: "vuelos",
    cardImg: "./assets/img/Iguazu-scaled.webp",
  },
  {
    id: 9,
    name: "Aéreo a São Paulo",
    price: 50800,
    category: "vuelos",
    cardImg: "./assets/img/L_5c1a3eae0668b_sao_paulo.jpg",
  },
  {
    id: 10,
    name: "Paquete a Costa Rica",
    price: 799000,
    category: "paquetes",
    cardImg: "./assets/img/pexels-jake-marsee-11181988.jpg",
  },
  {
    id: 11,
    name: "Paquete a Mendoza",
    price: 420000,
    category: "paquetes",
    cardImg: "./assets/img/mendoza-jumbotron.jpg",
  },
  {
    id: 12,
    name: "Paquete a El Calafate",
    price: 389000,
    category: "paquetes",
    cardImg: "./assets/img/emRt5Blhj_2000x1500__1.webp",
  },
  {
    id: 13,
    name: "Hotel en Mar del Plata",
    price: 43200,
    category: "hoteles",
    cardImg: "./assets/img/lugares-visitar-mar-del-plata.webp",
  },
  {
    id: 14,
    name: "Cabaña en San Pedro",
    price: 34000,
    category: "hoteles",
    cardImg: "./assets/img/a1b497b4-b915-4723-976a-1fdcf8358fd5.webp",
  },
  {
    id: 15,
    name: "Alojamiento en Tucumán",
    price: 40000,
    category: "hoteles",
    cardImg: "./assets/img/Tucumanverano2022.jpg",
  },
];

const divideProducts = (size) => {
    let listaProductos = [];
    for(let i = 0; i < productsData.length; i += size)
    listaProductos.push(productsData.slice(i, i + size));
return listaProductos;
};

const appState = {
    products: divideProducts(4), 
    currentProductsIndex: 0, 
    productsLimit: divideProducts(4).length,
    activeFilter: null 
};