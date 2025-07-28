import api from './ApiConfiguration';

class FacebookService {
  static async post(content, media, accessToken) {
    try {
      // Check if we have a valid token
      if (!accessToken) {
        throw new Error(
          "No Facebook access token found. Please reconnect your account."
        );
      }

      const response = await api.post("/facebook/post", {
        accessToken,
        content,
        media_urls: media,
      });

      return {
        success: true,
        data: response.data,
        platform: "facebook",
      };
    } catch (error) {
      console.error("Facebook posting error:", error);
      throw {
        success: false,
        error: error.response?.data?.message || "Failed to post to Facebook",
        platform: "facebook",
      };
    }
  }

  static async postWithMedia(content, mediaFiles, accessToken) {
    try {
      // Create FormData to send files
      const formData = new FormData();
      formData.append("content", content);
      formData.append("accessToken", accessToken);

      // Add media files
      for (let i = 0; i < mediaFiles.length; i++) {
        try {
          const response = await fetch(mediaFiles[i]);
          const blob = await response.blob();
          const filename = `image-${i}.jpg`;
          const file = new File([blob], filename, {
            type: blob.type || "image/jpeg",
          });
          formData.append("media[]", file);
        } catch (error) {
          console.error("Error processing media file:", error);
        }
      }

      // Send the post with media
      const response = await api.post(
        "/facebook/post-with-media",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return {
        success: true,
        data: response.data,
        platform: "facebook",
      };
    } catch (error) {
      console.error("Facebook posting error:", error);
      throw {
        success: false,
        error: error.response?.data?.message || "Failed to post to Facebook",
        platform: "facebook",
      };
    }
  }
}

export default FacebookService;