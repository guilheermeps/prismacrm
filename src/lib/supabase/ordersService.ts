
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

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
    
    const { error } = await supabase
      .from('orders')
      .insert({
        id,
        ...orderData
      });

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

    return data as Order[];
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

    return data as Order;
  } catch (error) {
    console.error("Error in getOrderById:", error);
    return null;
  }
};

// Update an order
export const updateOrder = async (order: Partial<Order> & { id: string }): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('orders')
      .update(order)
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

    return data as Order[];
  } catch (error) {
    console.error("Error in getOrdersByFilter:", error);
    return [];
  }
};
