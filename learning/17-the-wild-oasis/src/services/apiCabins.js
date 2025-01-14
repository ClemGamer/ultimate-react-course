import { supabase, supabaseUrl } from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.log(error);
    throw new Error("Load cabins error.");
  }

  return data;
}

export async function createEditCabin(newCabin, id) {
  // https://qzuqdykaubypdkpjcupk.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg

  const fileName = `${Math.random()}-${newCabin.image?.name}`.replaceAll(
    "/",
    ""
  );

  const hasImageUrl = newCabin.image?.startsWith?.(supabaseUrl);
  const imagePath = hasImageUrl
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${fileName}`;

  let query = supabase.from("cabins");

  // Create cabin
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

  // Update cabin
  if (id) query = query.update({ ...newCabin, image: imagePath }).eq("id", id);

  const { data, error } = await query.select();

  if (error) {
    console.log(error);
    throw new Error("Could not create cabin.");
  }

  console.log(hasImageUrl);
  if (hasImageUrl) return data;

  console.log("upload");
  console.log(newCabin.image);
  // Upload image
  const { error: uploadError } = await supabase.storage
    .from("cabin-images")
    .upload(fileName, newCabin.image);

  if (uploadError) {
    console.log(uploadError);
    await deleteCabin(data.id);
    throw new Error(
      "Cabin image could not be uploaded and the cabin was not created."
    );
  }

  return data;
}

export async function deleteCabin(id) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.log(error);
    throw new Error("Could not delete cabin.");
  }

  return data;
}
