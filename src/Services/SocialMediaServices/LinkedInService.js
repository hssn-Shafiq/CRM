import api from './ApiConfiguration';

class LinkedInService {
  static async post(content, media, accessToken) {
    try {
      // Check if we have a valid token
      if (!accessToken) {
        throw new Error(
          "No LinkedIn access token found. Please reconnect your account."
        );
      }

      console.log(
        "Posting to LinkedIn with token:",
        accessToken.substring(0, 10) + "..."
      );

      const response = await api.post("/api/linkedin/post", {
        accessToken,
        content,
        media_urls: media,
      });

      return {
        success: true,
        data: response.data,
        platform: "linkedin",
      };
    } catch (error) {
      console.error("LinkedIn posting error:", error);

      // Improve error message based on status code
      let errorMessage = "Failed to post to LinkedIn";
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage =
            "LinkedIn authentication expired. Please reconnect your account.";
        } else if (error.response.status === 403) {
          errorMessage =
            "You don't have permission to post to LinkedIn. Please check your account settings.";
        } else if (error.response.status === 404) {
          errorMessage =
            "LinkedIn API endpoint not found. Server configuration issue.";
        }
      }

      throw {
        success: false,
        error: errorMessage,
        platform: "linkedin",
        originalError: error,
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
        // Convert blob URL to actual file
        try {
          const response = await fetch(mediaFiles[i]);
          const blob = await response.blob();
          const filename = `image-${i}.jpg`;
          const file = new File([blob], filename, {
            type: blob.type || "image/jpeg",
          });
          formData.append("media", file);
        } catch (error) {
          console.error("Error processing media file:", error);
        }
      }

      // Send the post with media
      const response = await api.post(
        "/api/linkedin/post-with-media",
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
        platform: "linkedin",
      };
    } catch (error) {
      console.error("LinkedIn posting error:", error);
      throw {
        success: false,
        error: error.response?.data?.message || "Failed to post to LinkedIn",
        platform: "linkedin",
      };
    }
  }
}

export default LinkedInService;