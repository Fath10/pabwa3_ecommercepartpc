import fs from "fs/promises";
import path from "path";

export const deleteFile = async (
  filepath
) => {

  if (!filepath) return;

  try {
    await fs.unlink(filepath);
  } catch (error) {
    console.error(
      "Delete file error:",
      error.message
    );
  }

};

export const moveFile = async (
  oldPath,
  filename
) => {

  const newPath = path.join(
    "uploads",
    "products",
    filename
  );

  await fs.rename(
    oldPath,
    newPath
  );

  return `/uploads/products/${filename}`;
};