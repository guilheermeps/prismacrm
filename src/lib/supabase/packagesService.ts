
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { Product } from "./productsService";
import { Json } from "@/integrations/supabase/types";

// Package types
export interface PackageProduct {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Package {
  id: string;
  name: string;
  description?: string;
  price: number;
  products: PackageProduct[];
  is_active: boolean;
  created_at: string;
}

// Create a new package
export const createPackage = async (packageData: Omit<Package, 'id' | 'created_at'>): Promise<string | null> => {
  try {
    const id = uuidv4();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return null;
    }
    
    // Convert packageData.products to JSON-compatible format
    const dbPackage = {
      id,
      name: packageData.name,
      description: packageData.description,
      price: packageData.price,
      products: packageData.products as unknown as Json,
      is_active: packageData.is_active,
      user_id: user.id
    };
    
    const { error } = await supabase
      .from('packages')
      .insert(dbPackage);

    if (error) {
      console.error("Error creating package:", error);
      throw error;
    }

    return id;
  } catch (error) {
    console.error("Error in createPackage:", error);
    return null;
  }
};

// Get all packages
export const getPackages = async (): Promise<Package[]> => {
  try {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error("Error fetching packages:", error);
      throw error;
    }

    // Convert the data from JSON to our Package type
    const packages = data.map(item => ({
      ...item,
      products: item.products as unknown as PackageProduct[]
    })) as Package[];

    return packages;
  } catch (error) {
    console.error("Error in getPackages:", error);
    return [];
  }
};

// Get package by ID
export const getPackageById = async (id: string): Promise<Package | null> => {
  try {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching package:", error);
      throw error;
    }

    if (!data) return null;

    // Convert the data from JSON to our Package type
    const packageItem = {
      ...data,
      products: data.products as unknown as PackageProduct[]
    } as Package;

    return packageItem;
  } catch (error) {
    console.error("Error in getPackageById:", error);
    return null;
  }
};

// Update a package
export const updatePackage = async (packageData: Partial<Package> & { id: string }): Promise<boolean> => {
  try {
    // Prepare DB-compatible object
    const dbPackage: any = { ...packageData };
    if (packageData.products) {
      dbPackage.products = packageData.products as unknown as Json;
    }

    const { error } = await supabase
      .from('packages')
      .update(dbPackage)
      .eq('id', packageData.id);

    if (error) {
      console.error("Error updating package:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error in updatePackage:", error);
    return false;
  }
};

// Delete a package
export const deletePackage = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('packages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting package:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error in deletePackage:", error);
    return false;
  }
};

// Get active packages
export const getActivePackages = async (): Promise<Package[]> => {
  try {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) {
      console.error("Error fetching active packages:", error);
      throw error;
    }

    // Convert the data from JSON to our Package type
    const packages = data.map(item => ({
      ...item,
      products: item.products as unknown as PackageProduct[]
    })) as Package[];

    return packages;
  } catch (error) {
    console.error("Error in getActivePackages:", error);
    return [];
  }
};
