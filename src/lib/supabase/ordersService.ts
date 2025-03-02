
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { OrderItem } from "@/lib/types";
import { Json } from "@/integrations/supabase/types";

export interface Order {
  id: string;
  client_name: string;
  client_id?: string;
  total_amount: number;
  items: OrderItem[];
  status: 'pending' | 'in-progress' | 'completed' | 'canceled';
  payment_method: string;
  payment_status: 'pending' | 'completed';
  due_date?: string;
  installments?: number;
  notes?: string;
  created_at: string;
  source_id?: string;
  source_type?: 'lead' | 'contact' | 'manual';
}

// Create a new order
export const createOrder = async (orderData: Omit<Order, 'id' | 'created_at'>): Promise<string | null> => {
  try {
    const id = uuidv4();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return null;
    }
    
    const { error } = await supabase
      .from('orders')
      .insert({
        id,
        client_name: orderData.client_name,
        client_id: orderData.client_id,
        total_amount: orderData.total_amount,
        items: orderData.items as unknown as Json,
        status: orderData.status,
        payment_method: orderData.payment_method,
        payment_status: orderData.payment_status,
        due_date: orderData.due_date,
        installments: orderData.installments,
        notes: orderData.notes,
        source_id: orderData.source_id,
        source_type: orderData.source_type,
        user_id: user.id
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return [];
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }

    // Convert items from JSON to array of OrderItem
    return data.map(order => ({
      ...order,
      items: order.items as unknown as OrderItem[]
    })) as Order[];
  } catch (error) {
    console.error("Error in getOrders:", error);
    return [];
  }
};

// Get order by ID
export const getOrderById = async (id: string): Promise<Order | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return null;
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error("Error fetching order:", error);
      throw error;
    }

    // Convert items from JSON to array of OrderItem
    return {
      ...data,
      items: data.items as unknown as OrderItem[]
    } as Order;
  } catch (error) {
    console.error("Error in getOrderById:", error);
    return null;
  }
};

// Update an order
export const updateOrder = async (order: Partial<Order> & { id: string }): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return false;
    }

    // Prepare data for update
    const updateData: any = { ...order };
    if (order.items) {
      updateData.items = order.items as unknown as Json;
    }

    const { error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', order.id)
      .eq('user_id', user.id);

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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return false;
    }

    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

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

// Get orders by status
export const getOrdersByStatus = async (status: Order['status']): Promise<Order[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return [];
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('status', status)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching orders by status:", error);
      throw error;
    }

    // Convert items from JSON to array of OrderItem
    return data.map(order => ({
      ...order,
      items: order.items as unknown as OrderItem[]
    })) as Order[];
  } catch (error) {
    console.error("Error in getOrdersByStatus:", error);
    return [];
  }
};

// rest of file...
