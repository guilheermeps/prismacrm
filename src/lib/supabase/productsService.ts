
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

// Product types
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  is_active: boolean;
  created_at: string;
}

// Create a new product
export const createProduct = async (productData: Omit<Product, 'id' | 'created_at'>): Promise<string | null> => {
  try {
    const id = uuidv4();
    
    const { error } = await supabase
      .from('products')
      .insert({
        id,
        ...productData
      });

    if (error) {
      console.error("Error creating product:", error);
      throw error;
    }

    return id;
  } catch (error) {
    console.error("Error in createProduct:", error);
    return null;
  }
};

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error("Error fetching products:", error);
      throw error;
    }

    return data as Product[];
  } catch (error) {
    console.error("Error in getProducts:", error);
    return [];
  }
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching product:", error);
      throw error;
    }

    return data as Product;
  } catch (error) {
    console.error("Error in getProductById:", error);
    return null;
  }
};

// Update a product
export const updateProduct = async (product: Partial<Product> & { id: string }): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .update(product)
      .eq('id', product.id);

    if (error) {
      console.error("Error updating product:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error in updateProduct:", error);
    return false;
  }
};

// Delete a product
export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting product:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    return false;
  }
};

// Get products by category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('name', { ascending: true });

    if (error) {
      console.error("Error fetching products by category:", error);
      throw error;
    }

    return data as Product[];
  } catch (error) {
    console.error("Error in getProductsByCategory:", error);
    return [];
  }
};

// Get active products
export const getActiveProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) {
      console.error("Error fetching active products:", error);
      throw error;
    }

    return data as Product[];
  } catch (error) {
    console.error("Error in getActiveProducts:", error);
    return [];
  }
};
