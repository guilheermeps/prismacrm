
import { supabase } from "@/lib/supabase/client";

// This function creates a bucket if it doesn't exist yet
export const createBucketIfNotExists = async (bucketName: string) => {
  try {
    // Check if bucket exists
    const { data: buckets, error: getBucketsError } = await supabase.storage.listBuckets();
    
    if (getBucketsError) {
      console.error('Error checking buckets:', getBucketsError);
      return false;
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      // Create the bucket
      const { error: createBucketError } = await supabase.storage.createBucket(bucketName, {
        public: true,  // Make the bucket public so files are accessible
      });
      
      if (createBucketError) {
        console.error(`Error creating ${bucketName} bucket:`, createBucketError);
        return false;
      }
      
      console.log(`${bucketName} bucket created successfully`);
      return true;
    }
    
    console.log(`${bucketName} bucket already exists`);
    return true;
  } catch (error) {
    console.error(`Error in createBucketIfNotExists for ${bucketName}:`, error);
    return false;
  }
};

// Initialize buckets when the app starts
export const initializeStorageBuckets = async () => {
  await createBucketIfNotExists('avatars');
  // Add any other buckets here as needed
};
