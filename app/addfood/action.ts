"use server";

import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

// This file runs only on the server
export async function addFood(formData: FormData) {
  const foodName = formData.get('name') as string;
  const meal = formData.get('meal') as string;
  const date = formData.get('date') as string;
  const imageFile = formData.get('image') as File;

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to add food.' };
  }

  let imageUrl: string | null = null;
  let imagePath: string | null = null;

  // Handle image upload
  if (imageFile && imageFile.size > 0) {
    const fileExtension = imageFile.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('food-images') // Make sure this bucket exists and has correct policies
      .upload(filePath, imageFile);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return { error: 'Failed to upload image.' };
    }

    const { data: publicUrlData } = supabase.storage
      .from('food-images')
      .getPublicUrl(filePath);
    
    imageUrl = publicUrlData.publicUrl;
    imagePath = filePath;
  }

  // Insert food record
  const { error: insertError } = await supabase
    .from('foods')
    .insert([
      { 
        name: foodName, 
        meal: meal,
        date: date,
        image_url: imageUrl,
        image_path: imagePath,
        user_id: user.id,
      }
    ]);

  if (insertError) {
    console.error('Error inserting food:', insertError);
    // If insertion fails, try to delete the uploaded image
    if (imagePath) {
      await supabase.storage.from('food-images').remove([imagePath]);
    }
    return { error: 'Failed to save food data.' };
  }

  // Revalidate the dashboard path to show the new food item
  revalidatePath('/dashboard'); 

  return { error: null };
}
