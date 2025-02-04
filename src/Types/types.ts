export interface Cost {
  id: number;
  user_cost: null;
  description: string;
  comment: null;
  amount: number;
  cost_category_id: number|null;
  created_at: string;
  updated_at: string;
  user: null;
  cost_category: CostCategory;
}
export interface Category {
  id: number;
  name: string;
  image:string;
  image_url:string;
  meals:Meal[];
}
export interface Service {
  id: number;
  name: string;
  inventory:number;
  price:number;
  sold:number;
  deposits:any[];
  deducts:any[];
}
export type AxiosResponseProps<T>  ={
  data : T;
  status:boolean
}
export type User = {
  id: number;
  username: string;
}


export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  area: string;
  state:string;
  is_store:boolean;
}
export interface Order {
  id: number;
  customer_id?: null;
  customer?:Customer;
  order_number: string;
  payment_type: string;
  order_confirmed:boolean;
  discount: number;
  amount_paid: number;
  user_id: number;
  notes: string;
  delivery_date: null;
  completed_at: null;
  delivery_address: string;
  special_instructions: string;
  status: string;
  payment_status: string;
  is_delivery: number;
  delivery_fee: number;
  address_id: null;
  created_at: string;
  updated_at: string;
  meal_orders: Mealorder[];
  cost : number;
  totalPrice:number;
  delivery_time:string;
  receiptLocation:string;
  whatsapp:boolean;
  deducts:Deduct[]
  outside:number;
  car_palette:string
  outside_confirmed:boolean;
  draft:string;
  complete:boolean;
}

export interface Deduct {
  id: number;
  child_meal_id:number;
  quantity:number;
}






export interface CostCategory {
  id: number;
  name: string;
  
}

export interface Mealorder {
  id: number;
  order_id: number;
  meal_id: number;
  status: string;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
  meal: Meal;
  requested_child_meals: Requestedchildmeal[];
  totalPrice: number;
  color:string;
}

export interface Requestedchildmeal {
  id: number;
  order_meal:Mealorder;
  order_meal_id: number;
  child_meal_id: number;
  quantity: number;
  price: number;
  child_meal: ChildMeal;
  count: number;
  available:number
}

export interface Meal {
  id: number;
  name: string;
  price: number;
  category_id: number;
  description: null;
  image: null;
  available: number;
  calories: null;
  prep_time: null;
  spice_level: null;
  is_vegan: number;
  is_gluten_free: number;
  created_at: null;
  updated_at: null;
  people_count: string;
  child_meals: ChildMeal[];
  image_url:string;
}




export interface ChildMeal {
  id: number;
  meal:Meal;
  service:Service
  quantity:number;
  people_count: string;
  price:number;
  weight:string;
  meal_id: number;
  name: string;
  created_at: string;
  updated_at: string;
}