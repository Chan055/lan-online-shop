import path from "path";
import { unlink } from "node:fs/promises";
import { unlink as fsUnlink } from "fs/promises";

// async function safeUnlink(
//   filePath: string,
//   retries = 3,
//   delayMs = 100
// ): Promise<void> {
//   for (let attempt = 1; attempt <= retries; attempt++) {
//     try {
//       await fsUnlink(filePath);
//       return;
//     } catch (err: any) {
//       // Only retry on EPERM or EBUSY (Windows file-lock errors)
//       if ((err.code === "EPERM" || err.code === "EBUSY") && attempt < retries) {
//         // wait a bit, then retry
//         await new Promise((res) => setTimeout(res, delayMs));
//         continue;
//       }
//       // rethrow for any other error, or if out of retries
//       throw err;
//     }
//   }
// }

export const removeFiles = async (
  originalFile: string,
  optimizedFile: string | null
) => {
  try {
    const originalFilePath = path.join(
      __dirname,
      "../../..",
      "uploads/images",
      originalFile
    );

    // await safeUnlink(originalFilePath); // Use this For windows error - 'EPERM' or 'EBUSY'
    await unlink(originalFilePath);

    if (optimizedFile) {
      const optimizedFilePath = path.join(
        __dirname,
        "../../..",
        "uploads/optimize",
        optimizedFile
      );

      //   await safeUnlink(optimizedFilePath); // Use this For windows error - 'EPERM' or 'EBUSY'
      await unlink(optimizedFilePath);
    }
  } catch (error) {
    console.log(error);
  }
};
