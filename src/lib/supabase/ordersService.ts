
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { Json } from "@/integrations/supabase/types";

// Order types
export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  client_name: string;
  client_id?: string;
  total_amount: number;
  items: OrderItem[];
  status: 'pending' | 'in-progress' | 'completed' | 'canceled';
  payment_method: string;
  payment_status: 'pending' | 'completed';
  installments: number;
  due_date?: string;
  notes?: string;
  created_at: string;
  source_id?: string;
  source_type?: 'lead' | 'contact' | 'manual';
}

// Create a new order
export const createOrder = async (orderData: Omit<Order, 'id' | 'created_at'>): Promise<string | null> => {
  try {
    const id = uuidv4();
    
    // Convert orderData.items to JSON-compatible format
    const dbOrder = {
      id,
      client_name: orderData.client_name,
      client_id: orderData.client_id,
      total_amount: orderData.total_amount,
      items: orderData.items as unknown as Json,
      status: orderData.status,
      payment_method: orderData.payment_method,
      payment_status: orderData.payment_status,
      installments: orderData.installments,
      due_date: orderData.due_date,
      notes: orderData.notes,
      source_id: orderData.source_id,
      source_type: orderData.source_type
    };
    
    const { error } = await supabase
      .from('orders')
      .insert(dbOrder);

    if (error) {
      console.error("Error creating order:", error);
      throw error;
    }

    return id;
  } catch (error) {
    console.error("Error in createOrder:", error);
    return null;
  }
};

// Get all orders
export const getOrders = async (): Promise<Order[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }

    // Convert the data from JSON to our Order type
    const orders = data.map(item => ({
      ...item,
      items: item.items as unknown as OrderItem[]
    }));

    return orders as Order[];
  } catch (error) {
    console.error("Error in getOrders:", error);
    return [];
  }
};

// Get order by ID
export const getOrderById = async (id: string): Promise<Order | null> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching order:", error);
      throw error;
    }

    if (!data) return null;

    // Convert the data from JSON to our Order type
    const order = {
      ...data,
      items: data.items as unknown as OrderItem[]
    };

    return order as Order;
  } catch (error) {
    console.error("Error in getOrderById:", error);
    return null;
  }
};

// Update an order
export const updateOrder = async (order: Partial<Order> & { id: string }): Promise<boolean> => {
  try {
    // Prepare DB-compatible object
    const dbOrder: any = { ...order };
    if (order.items) {
      dbOrder.items = order.items as unknown as Json;
    }

    const { error } = await supabase
      .from('orders')
      .update(dbOrder)
      .eq('id', order.id);

    if (error) {
      console.error("Error updating order:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error in updateOrder:", error);
    return false;
  }
};

// Delete an order
export const deleteOrder = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting order:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteOrder:", error);
    return false;
  }
};

// Get orders by filter
export const getOrdersByFilter = async (
  filter: {
    status?: string;
    client_name?: string;
    dateFrom?: string;
    dateTo?: string;
    paymentStatus?: string;
  }
): Promise<Order[]> => {
  try {
    let query = supabase
      .from('orders')
      .select('*');

    if (filter.status && filter.status !== 'all') {
      query = query.eq('status', filter.status);
    }

    if (filter.paymentStatus && filter.paymentStatus !== 'all') {
      query = query.eq('payment_status', filter.paymentStatus);
    }

    if (filter.client_name) {
      query = query.ilike('client_name', `%${filter.client_name}%`);
    }

    if (filter.dateFrom) {
      query = query.gte('created_at', filter.dateFrom);
    }

    if (filter.dateTo) {
      query = query.lte('created_at', filter.dateTo);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching filtered orders:", error);
      throw error;
    }

    // Convert the data from JSON to our Order type
    const orders = data.map(item => ({
      ...item,
      items: item.items as unknown as OrderItem[]
    }));

    return orders as Order[];
  } catch (error) {
    console.error("Error in getOrdersByFilter:", error);
    return [];
  }
};
