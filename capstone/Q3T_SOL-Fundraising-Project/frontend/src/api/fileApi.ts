import apiClient from './apiClient.ts';

// Function to upload the image file
export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file); // The key here should match the backend field ("file")

  try {
    const response = await apiClient.post('/file/uploads', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const getImage = async (filename: string) => {
    try {
      const response = await apiClient.get(`/files/image/${filename}`, {
        responseType: "blob", // Important: this tells axios to treat the response as a binary file (image)
      });
  
      // Create an object URL to display the image
      const imageUrl = URL.createObjectURL(response.data);
      return imageUrl;
    } catch (error) {
      console.error("Error fetching image:", error);
      throw error;
    }
  };
